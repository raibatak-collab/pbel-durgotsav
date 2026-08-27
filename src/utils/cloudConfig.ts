import { supabase } from "@/utils/supabase/client";

/**
 * Universal Cloud Configuration Sync Engine for PBEL City Durgotsav
 * Automatically syncs dynamic admin changes (Towers, Committee Roster, Branding) across all devices and browsers.
 */

export async function fetchCloudConfig<T>(key: string, fallback: T): Promise<T> {
  try {
    const { data, error } = await supabase
      .from("campaigns")
      .select("redirect_link")
      .eq("title", `config_${key}`)
      .single();

    if (error || !data || !data.redirect_link) {
      return fallback;
    }

    const parsed = JSON.parse(data.redirect_link);
    return parsed as T;
  } catch (err) {
    console.error(`Error fetching cloud config for ${key}:`, err);
    return fallback;
  }
}

export async function saveCloudConfig<T>(key: string, value: T): Promise<boolean> {
  try {
    const serialized = JSON.stringify(value);

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
    return true;
  } catch (err) {
    console.error(`Error saving cloud config for ${key}:`, err);
    return false;
  }
}
