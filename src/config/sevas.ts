export interface PujoDayInfo {
  id: string; // e.g. "panchami", "shashthi", "saptami", "ashtami", "nabami", "dashami", "grand"
  label: string;
  dayName: string;
  dateStr: string;
  order: number;
}

export const PUJO_DAYS: Record<string, PujoDayInfo> = {
  panchami: {
    id: "panchami",
    label: "15 Oct • Panchami",
    dayName: "Maha Panchami",
    dateStr: "15 Oct 2026",
    order: 1,
  },
  shashthi: {
    id: "shashthi",
    label: "16 Oct • Maha Sashti",
    dayName: "Maha Shashthi",
    dateStr: "16 Oct 2026",
    order: 2,
  },
  saptami: {
    id: "saptami",
    label: "17 Oct • Maha Saptami",
    dayName: "Maha Saptami",
    dateStr: "17 Oct 2026",
    order: 3,
  },
  ashtami: {
    id: "ashtami",
    label: "18 Oct • Maha Ashtami",
    dayName: "Maha Ashtami",
    dateStr: "18 Oct 2026",
    order: 4,
  },
  nabami: {
    id: "nabami",
    label: "19 Oct • Maha Nabami",
    dayName: "Maha Nabami",
    dateStr: "19 Oct 2026",
    order: 5,
  },
  dashami: {
    id: "dashami",
    label: "20 Oct • Bijoya Dashami",
    dayName: "Bijoya Dashami",
    dateStr: "20 Oct 2026",
    order: 6,
  },
  grand: {
    id: "grand",
    label: "👑 All 6 Days (Grand Patrons)",
    dayName: "All 6 Days",
    dateStr: "15 - 20 Oct 2026",
    order: 7,
  },
};

export interface SevaItem {
  id: string;
  title: string;
  day: string;
  date: string;
  amount: number;
  category: "flowers" | "bhog" | "sweets" | "rituals" | "grand";
  icon: string;
  description: string;
  badge?: string;
  maxLimit?: number;
  bookedCount?: number;
  isActive?: boolean;
}

/**
 * Intelligently infers Pujo Day, Date, and Day ID from the category name, description, or explicit day tag.
 */
export function inferSevaDayAndDate(title: string, description?: string, tagDay?: string): { dayId: string; dayName: string; dateStr: string; order: number } {
  if (tagDay && PUJO_DAYS[tagDay.toLowerCase()]) {
    const day = PUJO_DAYS[tagDay.toLowerCase()];
    return { dayId: day.id, dayName: day.dayName, dateStr: day.dateStr, order: day.order };
  }

  const text = `${title} ${description || ""}`.toLowerCase();

  if (text.includes("panchami") || text.includes("15 oct") || text.includes("anandamela")) {
    const d = PUJO_DAYS.panchami;
    return { dayId: d.id, dayName: d.dayName, dateStr: d.dateStr, order: d.order };
  }
  if (text.includes("shashthi") || text.includes("shashti") || text.includes("sashti") || text.includes("bodhon") || text.includes("amontron") || text.includes("adhibas") || text.includes("16 oct")) {
    const d = PUJO_DAYS.shashthi;
    return { dayId: d.id, dayName: d.dayName, dateStr: d.dateStr, order: d.order };
  }
  if (text.includes("saptami") || text.includes("nabapatrika") || text.includes("kolabou") || text.includes("17 oct")) {
    const d = PUJO_DAYS.saptami;
    return { dayId: d.id, dayName: d.dayName, dateStr: d.dateStr, order: d.order };
  }
  if (text.includes("ashtami") || text.includes("sandhi") || text.includes("kumari") || text.includes("108 lotus") || text.includes("18 oct")) {
    const d = PUJO_DAYS.ashtami;
    return { dayId: d.id, dayName: text.includes("sandhi") ? "Maha Ashtami / Sandhi" : d.dayName, dateStr: d.dateStr, order: d.order };
  }
  if (text.includes("nabami") || text.includes("navami") || text.includes("dhunuchi") || text.includes("yajna") || text.includes("homa") || text.includes("19 oct")) {
    const d = PUJO_DAYS.nabami;
    return { dayId: d.id, dayName: d.dayName, dateStr: d.dateStr, order: d.order };
  }
  if (text.includes("dashami") || text.includes("bijoya") || text.includes("sindoor") || text.includes("bisorjon") || text.includes("immersion") || text.includes("shobhayatra") || text.includes("20 oct")) {
    const d = PUJO_DAYS.dashami;
    return { dayId: d.id, dayName: d.dayName, dateStr: d.dateStr, order: d.order };
  }

  const d = PUJO_DAYS.grand;
  return { dayId: d.id, dayName: d.dayName, dateStr: d.dateStr, order: d.order };
}

/**
 * Infers category and appropriate festive icon from title and description.
 */
export function inferSevaCategoryAndIcon(title: string, rawCategory?: string): { category: "flowers" | "bhog" | "sweets" | "rituals" | "grand"; icon: string } {
  if (rawCategory && ["flowers", "bhog", "sweets", "rituals", "grand"].includes(rawCategory)) {
    const icons: Record<string, string> = { flowers: "🌺", bhog: "🍚", sweets: "🍬", rituals: "🪔", grand: "👑" };
    return { category: rawCategory as any, icon: icons[rawCategory] || "🌺" };
  }

  const text = title.toLowerCase();
  if (text.includes("flower") || text.includes("mala") || text.includes("garland") || text.includes("lotus")) {
    return { category: "flowers", icon: text.includes("lotus") ? "🪷" : "🌺" };
  }
  if (text.includes("bhog") || text.includes("prasad") || text.includes("khichuri") || text.includes("rajbhog") || text.includes("food") || text.includes("lunch") || text.includes("feast")) {
    return { category: "bhog", icon: text.includes("rajbhog") ? "👑" : "🍚" };
  }
  if (text.includes("sweet") || text.includes("mishti") || text.includes("sandesh") || text.includes("laddu")) {
    return { category: "sweets", icon: "🍬" };
  }
  if (text.includes("patron") || text.includes("silver") || text.includes("gold") || text.includes("yajman") || text.includes("all 6 days")) {
    return { category: "grand", icon: "👑" };
  }
  if (text.includes("dhaak") || text.includes("dhunuchi")) {
    return { category: "rituals", icon: "🥁" };
  }
  if (text.includes("snan") || text.includes("immersion") || text.includes("bisorjon")) {
    return { category: "rituals", icon: "🌊" };
  }
  if (text.includes("homa") || text.includes("yajna")) {
    return { category: "rituals", icon: "🔥" };
  }
  if (text.includes("sindoor")) {
    return { category: "rituals", icon: "🔴" };
  }

  return { category: "rituals", icon: "🪔" };
}

/**
 * Checks if a seva item matches the active dayFilter chip.
 */
export function matchesDayFilter(item: { day: string; date: string; title: string }, dayFilter: string): boolean {
  if (dayFilter === "all") return true;

  const dayLower = (item.day || "").toLowerCase();
  const dateLower = (item.date || "").toLowerCase();
  const titleLower = (item.title || "").toLowerCase();
  const isMultiDay = dayLower.includes("all 6") || dateLower.includes("-") || titleLower.includes("all 6");

  if (dayFilter === "grand") {
    return isMultiDay || dayLower.includes("grand") || titleLower.includes("patron") || titleLower.includes("general");
  }

  // Single day filters should NOT match multi-day ranges like "15 - 20 Oct" unless the title specifically targets it
  if (isMultiDay && !titleLower.includes(dayFilter)) {
    return false;
  }

  const text = `${dayLower} ${dateLower} ${titleLower}`;

  switch (dayFilter) {
    case "panchami":
      return text.includes("panchami") || dateLower.startsWith("15 oct");
    case "shashthi":
      return text.includes("shashthi") || text.includes("shashti") || text.includes("sashti") || text.includes("bodhon") || dateLower.startsWith("16 oct");
    case "saptami":
      return text.includes("saptami") || text.includes("kolabou") || text.includes("nabapatrika") || dateLower.startsWith("17 oct");
    case "ashtami":
      return text.includes("ashtami") || text.includes("sandhi") || text.includes("kumari") || dateLower.startsWith("18 oct");
    case "nabami":
      return text.includes("nabami") || text.includes("navami") || text.includes("dhunuchi") || text.includes("yajna") || text.includes("homa") || dateLower.startsWith("19 oct");
    case "dashami":
      return text.includes("dashami") || text.includes("bijoya") || text.includes("sindoor") || text.includes("bisorjon") || text.includes("immersion") || dateLower.startsWith("20 oct");
    default:
      return true;
  }
}
