import { supabase } from "@/utils/supabase/client";

/**
 * Universal Cloud Configuration Sync Engine for PBEL City Durgotsav
 * Ensures 100% cloud persistence across all modules with intelligent
 * in-memory TTL caching and request deduplication to prevent Supabase egress exhaustion.
 */

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

const configMemoryCache = new Map<string, CacheEntry<any>>();
const inFlightRequests = new Map<string, Promise<any>>();

// Server cache: 60s (paired with ISR). Browser cache: 5 minutes.
const DEFAULT_TTL_MS = typeof window === "undefined" ? 60 * 1000 : 5 * 60 * 1000;

export async function fetchCloudConfig<T>(
  key: string, 
  fallback: T, 
  options?: { ttlMs?: number; forceRefresh?: boolean }
): Promise<T> {
  const ttlMs = options?.ttlMs ?? DEFAULT_TTL_MS;
  const forceRefresh = options?.forceRefresh ?? false;
  const now = Date.now();

  // 1. Check in-memory TTL cache
  if (!forceRefresh) {
    const cached = configMemoryCache.get(key);
    if (cached && cached.expiresAt > now) {
      return cached.value as T;
    }
  }

  // 2. Request deduplication: return existing in-flight promise if available
  if (inFlightRequests.has(key)) {
    try {
      const res = await inFlightRequests.get(key);
      return res as T;
    } catch {
      return fallback;
    }
  }

  // 3. Initiate fetch from Supabase
  const fetchPromise = (async () => {
    try {
      const { data, error } = await supabase
        .from("campaigns")
        .select("redirect_link")
        .eq("title", `config_${key}`)
        .maybeSingle();

      if (error || !data || !data.redirect_link) {
        configMemoryCache.set(key, { value: fallback, expiresAt: now + ttlMs });
        return fallback;
      }

      const parsed = JSON.parse(data.redirect_link);
      configMemoryCache.set(key, { value: parsed, expiresAt: now + ttlMs });
      return parsed as T;
    } catch (err) {
      console.error(`Error fetching cloud config for ${key}:`, err);
      return fallback;
    } finally {
      inFlightRequests.delete(key);
    }
  })();

  inFlightRequests.set(key, fetchPromise);
  return fetchPromise;
}

export function invalidateCloudConfig(key?: string): void {
  if (key) {
    configMemoryCache.delete(key);
    inFlightRequests.delete(key);
  } else {
    configMemoryCache.clear();
    inFlightRequests.clear();
  }
}

export async function saveCloudConfig<T>(key: string, value: T): Promise<boolean> {
  try {
    const serialized = JSON.stringify(value);

    // Update in-memory cache immediately
    configMemoryCache.set(key, { value, expiresAt: Date.now() + DEFAULT_TTL_MS });

    // Check if row already exists
    const { data: existing } = await supabase
      .from("campaigns")
      .select("id")
      .eq("title", `config_${key}`)
      .maybeSingle();

    if (existing && existing.id) {
      const { error } = await supabase
        .from("campaigns")
        .update({ redirect_link: serialized, is_active: true })
        .eq("id", existing.id);
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from("campaigns")
        .insert({
          title: `config_${key}`,
          image_url: "config",
          redirect_link: serialized,
          is_active: true,
        });
      if (error) throw error;
    }

    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("pbel_config_updated", { detail: { key, value } }));
    }

    return true;
  } catch (err) {
    console.error(`Error saving cloud config for ${key}:`, err);
    return false;
  }
}


