"use client";

import { useState, useEffect } from "react";
import { 
  HeartHandshake, 
  CheckCircle2, 
  Sparkles, 
  Lock,
  ShieldCheck, 
  Calendar,
  Layers,
  ArrowRight,
  Receipt,
  Download,
  X,
  CreditCard,
  QrCode,
  Smartphone,
  Copy,
  Check,
  Info,
  AlertCircle,
  Building
} from "lucide-react";
import { supabase } from "@/utils/supabase/client";
import { DevotionalShareModal } from "@/components/DevotionalShareModal";
import { TowerParticipation } from "@/components/TowerParticipation";
import { getStoredTowers, fetchStoredTowers, TowerDefinition } from "@/config/towers";
import { buildUpiPayUri } from "@/utils/security";
import { saveQrCodeToGallery } from "@/utils/qrDownload";
import OfficialContributionReceipt, { ReceiptData } from "@/components/OfficialContributionReceipt";
import { getStoredBranding, fetchStoredBranding, SamitiBrandingConfig, DEFAULT_BRANDING } from "@/config/branding";
import { validateIndianPan } from "@/utils/panValidation";
import {
  inferSevaDayAndDate,
  inferSevaCategoryAndIcon,
  matchesDayFilter,
  PUJO_DAYS,
  SevaItem,
} from "@/config/sevas";

// Official Society Bank Account UPI Configuration
const SOCIETY_UPI_ID = "pbelsanskritiksamiti@icici";
const SOCIETY_NAME = "PBEL Sanskritik Samiti";

const defaultSevaCatalog: SevaItem[] = [
  // Panchami
  {
    id: "panchami-agomoni",
    title: "Panchami Agomoni & Dhaak Seva",
    day: "Panchami",
    date: "15 Oct 2026",
    amount: 2501,
    category: "rituals",
    icon: "🥁",
    description: "Welcome Maa Durga with the vibrant beats of traditional Dhaak and opening music.",
    badge: "Opening Day",
    maxLimit: 5,
  },
  {
    id: "panchami-bhog",
    title: "Anandamela Opening Maha Bhog",
    day: "Panchami",
    date: "15 Oct 2026",
    amount: 1501,
    category: "bhog",
    icon: "🍲",
    description: "Sponsor community prasad distribution during the grand Anandamela food festival.",
    maxLimit: 10,
  },

  // Shashthi
  {
    id: "shashthi-bodhon",
    title: "Devi Bodhon & Bel Baran Seva",
    day: "Maha Shashthi",
    date: "16 Oct 2026",
    amount: 2100,
    category: "rituals",
    icon: "🌿",
    description: "Awakening of the Goddess under the sacred Bel tree with sacred Vedic chants.",
    badge: "Pratima Bodhon",
    maxLimit: 5,
  },
  {
    id: "shashthi-amontron",
    title: "Amontron & Adhibas Samagri",
    day: "Maha Shashthi",
    date: "16 Oct 2026",
    amount: 1501,
    category: "rituals",
    icon: "🪔",
    description: "Sacred invitation rituals with 28 holy mangal items, sandalwood & brass deepam.",
    maxLimit: 8,
  },

  // Saptami
  {
    id: "saptami-nabapatrika",
    title: "Kolabou Snan & Nabapatrika Seva",
    day: "Maha Saptami",
    date: "17 Oct 2026",
    amount: 2501,
    category: "rituals",
    icon: "🌾",
    description: "Bathing of Nabapatrika with holy waters from 8 sacred rivers and forest essences.",
    badge: "Sacred Ritual",
    maxLimit: 5,
  },
  {
    id: "saptami-bhog",
    title: "Saptami Khichuri Bhog Sponsorship",
    day: "Maha Saptami",
    date: "17 Oct 2026",
    amount: 2501,
    category: "bhog",
    icon: "🍚",
    description: "Sponsor piping hot Gobindobhog rice, labra, chutney, and payesh for the pandal.",
    badge: "Community Bhog",
    maxLimit: 10,
  },
  {
    id: "saptami-sweets",
    title: "Saptami Evening Mishti Prasad",
    day: "Maha Saptami",
    date: "17 Oct 2026",
    amount: 1501,
    category: "sweets",
    icon: "🍬",
    description: "Evening prasad boxes for Pratibimb cultural stage attendees.",
    maxLimit: 15,
  },

  // Ashtami
  {
    id: "ashtami-lotus",
    title: "Ashtami 108 Lotuses (Pushpanjali & Sandhi)",
    day: "Maha Ashtami",
    date: "18 Oct 2026",
    amount: 3100,
    category: "flowers",
    icon: "🪷",
    description: "108 pristine red lotuses offered at the feet of Devi Durga during Sandhi Pujo.",
    badge: "Most Auspicious",
    maxLimit: 5,
  },
  {
    id: "ashtami-sandhi-deepam",
    title: "Sandhi Pujo 108 Earthen Lamps & Ghee",
    day: "Maha Ashtami",
    date: "18 Oct 2026",
    amount: 2501,
    category: "rituals",
    icon: "🪔",
    description: "108 sacred oil lamps lit during the divine conjunction of Ashtami and Navami.",
    badge: "Sandhi Pujo",
    maxLimit: 5,
  },
  {
    id: "ashtami-kumari",
    title: "Kumari Puja Seva & Gift Hampers",
    day: "Maha Ashtami",
    date: "18 Oct 2026",
    amount: 2100,
    category: "rituals",
    icon: "👧",
    description: "Sponsorship of gifts, new clothes, and prasad for the revered young girls.",
    maxLimit: 5,
  },
  {
    id: "ashtami-bhog",
    title: "Maha Ashtami Rajbhog Seva",
    day: "Maha Ashtami",
    date: "18 Oct 2026",
    amount: 3501,
    category: "bhog",
    icon: "👑",
    description: "Grand royal feast: Polao, Chhanar Dalna, Beguni, Chanar Payesh & Rosogolla.",
    badge: "Grand Feast",
    maxLimit: 10,
  },

  // Nabami
  {
    id: "nabami-homa",
    title: "Maha Nabami Homa & Yajna Ghee",
    day: "Maha Nabami",
    date: "19 Oct 2026",
    amount: 2501,
    category: "rituals",
    icon: "🔥",
    description: "Sacred sacrificial fire with pure cow ghee, 108 wood twigs, and bilva leaves.",
    badge: "Maha Yajna",
    maxLimit: 5,
  },
  {
    id: "nabami-dhunuchi",
    title: "Dhunuchi Naach & Dhaaki Honour",
    day: "Maha Nabami",
    date: "19 Oct 2026",
    amount: 1501,
    category: "rituals",
    icon: "🥥",
    description: "Coconut husk, camphor, frankincense (dhuna) and honorarium for traditional Dhaakis.",
    maxLimit: 10,
  },
  {
    id: "nabami-bhog",
    title: "Nabami Community Mahaprasad",
    day: "Maha Nabami",
    date: "19 Oct 2026",
    amount: 2501,
    category: "bhog",
    icon: "🍛",
    description: "Festive community lunch for PBEL residents, guests, and visiting devotees.",
    maxLimit: 10,
  },

  // Dashami
  {
    id: "dashami-sindoor",
    title: "Sindoor Khela & Baran Thali",
    day: "Bijoya Dashami",
    date: "20 Oct 2026",
    amount: 1501,
    category: "rituals",
    icon: "🔴",
    description: "Traditional vermilion, betel leaves, sweets & decorative plates for Baran.",
    badge: "Bijoya Tradition",
    maxLimit: 15,
  },
  {
    id: "dashami-mishti",
    title: "Subho Bijoya Mishti Distribution",
    day: "Bijoya Dashami",
    date: "20 Oct 2026",
    amount: 2100,
    category: "sweets",
    icon: "🥮",
    description: "Sandesh and Laddu boxes shared with all families after Maa's holy immersion.",
    badge: "Bijoya Milan",
    maxLimit: 10,
  },
  {
    id: "dashami-bisorjon",
    title: "Immersion & Shobhayatra Seva",
    day: "Bijoya Dashami",
    date: "20 Oct 2026",
    amount: 5001,
    category: "rituals",
    icon: "🌊",
    description: "Royal procession logistics, flowers, safe transport & eco-friendly immersion seva.",
    badge: "Grand Immersion",
    maxLimit: 5,
  },

  // Grand Patrons
  {
    id: "grand-silver",
    title: "Silver Patron - Sampoorna Pujo Seva",
    day: "All 6 Days",
    date: "15 - 20 Oct 2026",
    amount: 11000,
    category: "grand",
    icon: "🥈",
    description: "Includes special family sankalp during Sandhi Pujo, VIP front seating, & Wall honor.",
    badge: "Grand Patron",
    maxLimit: 3,
  },
  {
    id: "grand-gold",
    title: "Gold Patron - Maha Yajman Sponsorship",
    day: "All 6 Days",
    date: "15 - 20 Oct 2026",
    amount: 25000,
    category: "grand",
    icon: "👑",
    description: "Principal sankalp for daily puja, prime stage acknowledgment & special Bhog delivery.",
    badge: "Maha Yajman",
    maxLimit: 3,
  },
];

export default function ContributePage() {
  // Mode switcher: "general" (open-ended) or "catalog" (specific items)
  const [activeMode, setActiveMode] = useState<"general" | "catalog">("general");

  const [sevaList, setSevaList] = useState<SevaItem[]>(defaultSevaCatalog);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [dayFilter, setDayFilter] = useState<string>("all");
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Towers Roster State for 1-Tap Dropdown
  const [towersList, setTowersList] = useState<TowerDefinition[]>([]);
  const [customTower, setCustomTower] = useState<string>("");
  const [customFlatUnit, setCustomFlatUnit] = useState<string>("");
  const [modalTower, setModalTower] = useState<string>("");
  const [modalFlatUnit, setModalFlatUnit] = useState<string>("");

  // Modal State for Direct Card Seva Checkout
  const [modalSeva, setModalSeva] = useState<SevaItem | null>(null);
  const [modalTab, setModalTab] = useState<"qr_code" | "upi_app">("qr_code");
  const [modalFormData, setModalFormData] = useState({
    name: "",
    phone: "",
    email: "",
    upiRef: "",
    isNameVisible: true,
    requiresTaxExemption: false,
    panNumber: "",
    wantsWhatsappUpdates: true,
  });
  const [modalFormError, setModalFormError] = useState<string | null>(null);

  // State for General / Open-ended Donation Form (starts empty so non-tech savvy users are not forced into ₹1001)
  const [customAmount, setCustomAmount] = useState<number | "">("");
  const [customPurpose, setCustomPurpose] = useState<string>("General Pujo Fund");
  const [customFormData, setCustomFormData] = useState({
    name: "",
    phone: "",
    email: "",
    upiRef: "",
    isNameVisible: true,
    requiresTaxExemption: false,
    panNumber: "",
    wantsWhatsappUpdates: true,
  });
  const [customFormError, setCustomFormError] = useState<string | null>(null);

  const [copiedUpi, setCopiedUpi] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
  const [branding, setBranding] = useState<SamitiBrandingConfig>(getStoredBranding());

// Category metadata decoder
function decodeCategoryDescription(desc?: string) {
  const str = desc || '';
  const limitMatch = str.match(/\[limit:(\d+)\]/);
  const statusMatch = str.match(/\[status:(active|inactive)\]/);
  const featuredMatch = str.match(/\[featured:(true|false)\]/);
  const dayMatch = str.match(/\[day:([a-z0-9_-]+)\]/);

  const cleanDescription = str
    .replace(/\[limit:\d+\]/g, '')
    .replace(/\[status:(active|inactive)\]/g, '')
    .replace(/\[featured:(true|false)\]/g, '')
    .replace(/\[day:[a-z0-9_-]+\]/g, '')
    .trim();

  const parsedLimit = limitMatch ? Number(limitMatch[1]) : undefined;
  const parsedActive = statusMatch ? statusMatch[1] === 'active' : undefined;
  const parsedFeatured = featuredMatch ? featuredMatch[1] === 'true' : undefined;
  const parsedDay = dayMatch ? dayMatch[1] : undefined;

  return { cleanDescription, parsedLimit, parsedActive, parsedFeatured, parsedDay };
}

  // Fetch dynamic categories and live contribution counts from Supabase
  const loadData = async () => {
    try {
      // 1. Fetch categories
      const { data: dbCategories } = await supabase.from("contribution_categories").select("*");
      
      // 2. Fetch non-rejected contributions to calculate booked counts
      const { data: dbContributions } = await supabase
        .from("contributions")
        .select("category_id, amount, status, contribution_categories(name)")
        .neq("status", "Rejected");

      const contributionsList = dbContributions || [];

      if (dbCategories && dbCategories.length > 0) {
        const dbItems: SevaItem[] = dbCategories.map((d: any) => {
          const decoded = decodeCategoryDescription(d.description);
          const matched = defaultSevaCatalog.find(
            (def) => def.title.toLowerCase() === d.name.toLowerCase() ||
                     d.name.toLowerCase().includes(def.title.toLowerCase()) ||
                     def.title.toLowerCase().includes(d.name.toLowerCase())
          );

          // Calculate booked count
          const booked = contributionsList.filter(
            (c: any) => c.category_id === d.id || c.contribution_categories?.name?.toLowerCase() === d.name.toLowerCase()
          ).length;

          const max = d.max_limit !== undefined && d.max_limit !== null 
            ? Number(d.max_limit) 
            : (decoded.parsedLimit !== undefined ? decoded.parsedLimit : (matched?.maxLimit || 5));

          const isActive = d.is_active !== undefined 
            ? (d.is_active !== false) 
            : (decoded.parsedActive !== undefined ? decoded.parsedActive : true);

          // Intelligently infer Pujo Day & Date
          const dayInfo = inferSevaDayAndDate(d.name, decoded.cleanDescription, decoded.parsedDay || matched?.day);
          // Intelligently infer Category & Festive Icon
          const catInfo = inferSevaCategoryAndIcon(d.name, matched?.category);

          return {
            id: d.id,
            title: d.name,
            day: dayInfo.dayName,
            date: dayInfo.dateStr,
            amount: d.fixed_amount ? Number(d.fixed_amount) : (matched?.amount || 1001),
            category: catInfo.category,
            icon: matched?.icon || catInfo.icon,
            description: decoded.cleanDescription || matched?.description || "Special seva offering for PBEL City Durgotsav.",
            badge: matched?.badge || (d.fixed_amount >= 10000 ? "Grand Seva" : undefined),
            maxLimit: max,
            bookedCount: booked,
            isActive: isActive,
          };
        });

        // Also merge any default offerings that aren't yet in DB (e.g. Panchami or Grand Patrons)
        const dbTitlesLower = new Set(dbItems.map((item) => item.title.toLowerCase()));
        const missingDefaults = defaultSevaCatalog
          .filter((item) => !dbTitlesLower.has(item.title.toLowerCase()))
          .map((item) => {
            const booked = contributionsList.filter(
              (c: any) => c.contribution_categories?.name?.toLowerCase() === item.title.toLowerCase()
            ).length;
            return {
              ...item,
              bookedCount: booked,
              isActive: true,
            };
          });

        setSevaList([...dbItems, ...missingDefaults]);
      } else {
        // Compute against default catalog if categories table is still using defaults
        const updatedDefaults = defaultSevaCatalog.map((item) => {
          const booked = contributionsList.filter(
            (c: any) => c.contribution_categories?.name?.toLowerCase() === item.title.toLowerCase()
          ).length;
          return {
            ...item,
            bookedCount: booked,
            isActive: true,
          };
        });
        setSevaList(updatedDefaults);
      }
    } catch (err) {
      console.error("Error loading categories & slot counters:", err);
    }
  };

  useEffect(() => {
    loadData();

    try {
      const stored = getStoredTowers();
      setTowersList(stored);

      let prefilledTower = stored.length > 0 ? (stored[0].fullName || `${stored[0].tower} (${stored[0].name})`) : "";

      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        const towerParam = params.get("tower") || params.get("towerName") || params.get("tower_name");
        if (towerParam) {
          const decodedTower = decodeURIComponent(towerParam).trim();
          const matched = stored.find(
            (t) =>
              t.fullName.toLowerCase() === decodedTower.toLowerCase() ||
              t.tower.toLowerCase() === decodedTower.toLowerCase() ||
              t.name.toLowerCase() === decodedTower.toLowerCase() ||
              decodedTower.toLowerCase().includes(t.tower.toLowerCase()) ||
              decodedTower.toLowerCase().includes(t.name.toLowerCase())
          );
          if (matched) {
            prefilledTower = matched.fullName || `${matched.tower} (${matched.name})`;
          } else {
            prefilledTower = decodedTower;
          }
        }
      }

      setCustomTower(prefilledTower);
      setModalTower(prefilledTower);

      fetchStoredTowers().then((cloudTowers) => {
        if (cloudTowers && cloudTowers.length > 0) {
          setTowersList(cloudTowers);
        }
      });
    } catch (_) {}

    fetchStoredBranding().then((b) => {
      if (b) setBranding(b);
    });

    const handleTowerUpdate = () => {
      const stored = getStoredTowers();
      setTowersList(stored);
    };

    const handleBrandingUpdate = () => {
      setBranding(getStoredBranding());
    };

    const handleSelectTower = (e: Event) => {
      const customEvt = e as CustomEvent;
      if (customEvt.detail?.tower) {
        setCustomTower(customEvt.detail.tower);
        setModalTower(customEvt.detail.tower);
      }
    };

    window.addEventListener("pbel_towers_updated", handleTowerUpdate);
    window.addEventListener("pbel_branding_updated", handleBrandingUpdate);
    window.addEventListener("pbel_select_tower", handleSelectTower);

    // Deep link query check
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tabParam = (params.get("tab") || params.get("mode") || "").toLowerCase();
      const dayParam = params.get("day");
      if (dayParam) {
        setDayFilter(dayParam.toLowerCase());
        setActiveMode("catalog");
      }
      if (tabParam === "catalog" || tabParam === "sponsor" || tabParam === "sevas" || params.get("category") || (params.get("amount") && tabParam !== "general")) {
        setActiveMode("catalog");
      } else if (tabParam === "general" || tabParam === "any" || tabParam === "open") {
        setActiveMode("general");
      }
    }

    return () => {
      window.removeEventListener("pbel_towers_updated", handleTowerUpdate);
      window.removeEventListener("pbel_select_tower", handleSelectTower);
    };
  }, []);

  const DAY_CHRONO_ORDER: Record<string, number> = {
    "panchami": 1,
    "maha shashthi": 2,
    "shashthi": 2,
    "sashti": 2,
    "maha saptami": 3,
    "saptami": 3,
    "maha ashtami": 4,
    "ashtami": 4,
    "maha nabami": 5,
    "nabami": 5,
    "navami": 5,
    "bijoya dashami": 6,
    "dashami": 6,
    "all 6 days": 7,
    "grand": 7,
  };

  const getDayOrder = (dayStr: string) => {
    const lower = (dayStr || "").toLowerCase();
    for (const [k, v] of Object.entries(DAY_CHRONO_ORDER)) {
      if (lower.includes(k)) return v;
    }
    return 99;
  };

  const filteredSevas = sevaList
    .filter((item) => {
      if (categoryFilter !== "all" && item.category !== categoryFilter) return false;
      return matchesDayFilter(item, dayFilter);
    })
    .sort((a, b) => getDayOrder(a.day) - getDayOrder(b.day) || a.amount - b.amount);

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(SOCIETY_UPI_ID);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const generateUpiString = (
    amt: number,
    note: string,
    appScheme?: "generic" | "gpay" | "phonepe" | "paytm"
  ) => {
    return buildUpiPayUri({
      am: amt,
      tn: note,
      appScheme: appScheme || "generic",
    });
  };

  // Handle Direct Card Fixed-Seva Payment
  const handleModalCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalSeva) return;

    setModalFormError(null);
    const formattedFlat = modalTower === "Other"
      ? modalFlatUnit.trim() || "Guest Devotee"
      : `${modalTower} - ${modalFlatUnit.trim()}`;

    if (!modalFormData.name.trim() || !modalFlatUnit.trim() || !modalFormData.phone.trim()) {
      setModalFormError("Please fill in your Name, Flat Number, and 10-digit Phone Number.");
      return;
    }

    if (modalFormData.phone.replace(/\D/g, "").length !== 10) {
      setModalFormError("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (modalFormData.requiresTaxExemption) {
      const panRes = validateIndianPan(modalFormData.panNumber);
      if (!panRes.isValid) {
        setModalFormError(panRes.errorMessage || "Please provide a valid Indian PAN number for 80G Tax Exemption.");
        return;
      }
    }

    // Check if slot limit reached right before submission
    const max = modalSeva.maxLimit || 5;
    const booked = modalSeva.bookedCount || 0;
    if (modalSeva.isActive === false || (max - booked <= 0)) {
      setModalFormError("This Seva package has reached its maximum sponsorship limit. Please choose another seva or sponsor the General Pujo Fund.");
      return;
    }

    setIsSubmitting(true);
    try {
      let { data: catData } = await supabase
        .from("contribution_categories")
        .select("id")
        .eq("name", modalSeva.title)
        .single();

      if (!catData) {
        const { data: newCat } = await supabase
          .from("contribution_categories")
          .insert({ 
            name: modalSeva.title, 
            fixed_amount: Number(modalSeva.amount),
            description: `${modalSeva.description || ''} [limit:${modalSeva.maxLimit || 5}] [status:active]`.trim()
          })
          .select("id")
          .single();
        catData = newCat;
      }

      const generatedPaymentId = modalFormData.upiRef.trim() 
        ? `UTR_${modalFormData.upiRef.trim()}` 
        : `WEB_${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

      // Insert with "Pending" (complying with PostgreSQL check constraint)
      const { error } = await supabase.from("contributions").insert({
        contributor_name: modalFormData.name.trim(),
        email: modalFormData.email.trim(),
        phone: modalFormData.phone.trim(),
        flat_number: formattedFlat,
        amount: Number(modalSeva.amount),
        category_id: catData?.id,
        status: "Pending",
        is_name_visible: modalFormData.isNameVisible,
        payment_id: generatedPaymentId,
      });

      if (error) throw error;

      setReceiptData({
        name: modalFormData.name.trim(),
        flatNumber: formattedFlat,
        phone: modalFormData.phone.trim(),
        email: modalFormData.email.trim(),
        amount: Number(modalSeva.amount),
        category: `${modalSeva.day} - ${modalSeva.title}`,
        paymentId: generatedPaymentId,
        upiId: SOCIETY_UPI_ID,
        upiRef: modalFormData.upiRef.trim() || undefined,
        date: new Date().toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        requiresTaxExemption: modalFormData.requiresTaxExemption,
        panNumber: modalFormData.panNumber.trim().toUpperCase(),
        wantsWhatsappUpdates: modalFormData.wantsWhatsappUpdates,
      });

      setModalSeva(null);
      setIsSuccess(true);
      loadData(); // refresh remaining counters
    } catch (error: any) {
      console.error("Error processing fixed seva payment:", error);
      alert(`Payment recording failed: ${error?.message || "Please check your network."}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle General / Custom Contribution Submission
  const handleCustomDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCustomFormError(null);
    if (!customAmount || customAmount <= 0) {
      setCustomFormError("Please select or enter an offering amount.");
      return;
    }

    const formattedFlat = customTower === "Other"
      ? customFlatUnit.trim() || "Guest Devotee"
      : `${customTower} - ${customFlatUnit.trim()}`;

    if (!customFormData.name.trim() || !customFlatUnit.trim() || !customFormData.phone.trim()) {
      setCustomFormError("Please fill in your Name, Flat Number, and 10-digit Phone Number.");
      return;
    }

    if (customFormData.phone.replace(/\D/g, "").length !== 10) {
      setCustomFormError("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (customFormData.requiresTaxExemption) {
      const panRes = validateIndianPan(customFormData.panNumber);
      if (!panRes.isValid) {
        setCustomFormError(panRes.errorMessage || "Please provide a valid Indian PAN number for 80G Tax Exemption.");
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const categoryName = customPurpose || "General Pujo Fund";

      let { data: catData } = await supabase
        .from("contribution_categories")
        .select("id")
        .eq("name", categoryName)
        .single();

      if (!catData) {
        const { data: newCat } = await supabase
          .from("contribution_categories")
          .insert({ name: categoryName })
          .select("id")
          .single();
        catData = newCat;
      }

      const generatedPaymentId = customFormData.upiRef.trim() 
        ? `UTR_${customFormData.upiRef.trim()}` 
        : `WEB_${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

      // Insert with "Pending"
      const { error } = await supabase.from("contributions").insert({
        contributor_name: customFormData.name.trim(),
        email: customFormData.email.trim(),
        phone: customFormData.phone.trim(),
        flat_number: formattedFlat,
        amount: Number(customAmount),
        category_id: catData?.id,
        status: "Pending",
        is_name_visible: customFormData.isNameVisible,
        payment_id: generatedPaymentId,
      });

      if (error) throw error;

      setReceiptData({
        name: customFormData.name.trim(),
        flatNumber: formattedFlat,
        phone: customFormData.phone.trim(),
        email: customFormData.email.trim(),
        amount: Number(customAmount),
        category: categoryName,
        paymentId: generatedPaymentId,
        upiId: SOCIETY_UPI_ID,
        upiRef: customFormData.upiRef.trim() || undefined,
        date: new Date().toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        requiresTaxExemption: customFormData.requiresTaxExemption,
        panNumber: customFormData.panNumber.trim().toUpperCase(),
        wantsWhatsappUpdates: customFormData.wantsWhatsappUpdates,
      });

      setIsSuccess(true);
      loadData();
    } catch (error) {
      console.error("Error making custom contribution:", error);
      alert("Something went wrong. Please check database connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // RECEIPT VIEW
  if (isSuccess && receiptData) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <OfficialContributionReceipt
          receiptData={receiptData}
          branding={branding}
          onMakeAnother={() => {
            setIsSuccess(false);
            setCustomAmount("");
            setCustomFormData({
              name: "",
              phone: "",
              email: "",
              upiRef: "",
              isNameVisible: true,
              requiresTaxExemption: false,
              panNumber: "",
              wantsWhatsappUpdates: true,
            });
            setCustomFlatUnit("");
          }}
          onOpenShareModal={() => setIsShareModalOpen(true)}
        />

        <DevotionalShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          contributorName={receiptData.name}
          categoryName={receiptData.category}
          flatNumber={receiptData.flatNumber}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full min-h-screen">
      
      {/* 1. ROYAL FESTIVE HERO BANNER */}
      <section className="w-full bg-festive-hero text-white relative overflow-hidden py-12 md:py-16 px-4 sm:px-6 lg:px-8 border-b border-amber-500/20 text-center">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-3 backdrop-blur-md">
            <HeartHandshake size={14} className="text-amber-400" />
            <span>PBEL City Durgotsav 2026 E-Seva Portal</span>
          </div>

          <h1 className="font-heading text-3xl sm:text-5xl font-bold tracking-tight text-white mb-3 leading-tight">
            Pujo Seva & <span className="text-gold-gradient">Devotee Contributions</span>
          </h1>

          <p className="text-xs sm:text-sm text-amber-100/90 max-w-2xl mx-auto font-normal leading-relaxed mb-4">
            Every offering, big or small, sustains the sanctity of our 6-day community celebration. Direct 0% fee bank transfer to <strong>PBEL Sanskritik Samiti</strong>.
          </p>

          {/* Official Bank UPI Badge */}
          <div className="inline-flex flex-wrap items-center justify-center gap-2 bg-black/40 border border-amber-400/30 px-4 py-1.5 rounded-full text-xs text-amber-200 backdrop-blur-md">
            <ShieldCheck size={14} className="text-green-400" />
            <span>Official Society UPI: <strong className="text-white font-mono">{SOCIETY_UPI_ID}</strong></span>
            <button
              type="button"
              onClick={handleCopyUpi}
              className="ml-1 text-amber-300 hover:text-white transition flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-full"
            >
              {copiedUpi ? <Check size={11} className="text-green-400" /> : <Copy size={11} />}
              <span className="text-[10px]">{copiedUpi ? "Copied!" : "Copy"}</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. TOP DUAL-MODE SWITCHER (ZERO SCROLLING BARRIER) */}
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 pt-8 pb-4">
        <div className="bg-white p-2 rounded-2xl border border-amber-300/80 shadow-md flex flex-col sm:flex-row gap-2">
          
          <button
            type="button"
            onClick={() => setActiveMode("general")}
            className={`flex-1 py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 ${
              activeMode === "general"
                ? "bg-primary text-white shadow-md golden-glow"
                : "bg-gray-50 text-gray-700 hover:bg-amber-50/60"
            }`}
          >
            <HeartHandshake size={17} />
            <span>1. General Open Contribution (Any Amount)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode("catalog")}
            className={`flex-1 py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 ${
              activeMode === "catalog"
                ? "bg-primary text-white shadow-md golden-glow"
                : "bg-gray-50 text-gray-700 hover:bg-amber-50/60"
            }`}
          >
            <Sparkles size={17} />
            <span>2. Sponsor Specific Seva Packages ({sevaList.length} Offerings)</span>
          </button>

        </div>
      </div>

      {/* 3. MODE 1: GENERAL OPEN-ENDED CONTRIBUTION (ZERO FRICTION FRONT & CENTER) */}
      {activeMode === "general" && (
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 mb-12">
          <div className="bg-white rounded-3xl shadow-xl border border-amber-900/15 p-6 sm:p-10">
            
            <div className="pb-6 border-b border-gray-100 mb-6">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-100/60 px-3 py-1 rounded-full uppercase tracking-wider mb-2">
                <HeartHandshake size={14} /> Open Seva Fund
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl text-gray-900 font-bold">
                General Pujo Contribution
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                Choose a suggested amount or enter any amount of your choice. Direct 0% fee bank transfer to PBEL Sanskritik Samiti.
              </p>
            </div>

            <form onSubmit={handleCustomDonate} className="space-y-6">
              {customFormError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-xs sm:text-sm font-medium flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{customFormError}</span>
                </div>
              )}
              
              {/* Presets & Amount Input */}
              <div className="bg-amber-50/50 p-4 sm:p-6 rounded-2xl border border-amber-200/80">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                    Contribution Amount (₹ INR) *
                  </label>
                  <span className="text-[11px] text-amber-900 font-bold">
                    {customPurpose}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  {[501, 1001, 2000, 5001, 10001].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setCustomAmount(amt)}
                      className={`py-2.5 px-3 rounded-xl border text-xs sm:text-sm font-bold transition-all ${
                        customAmount === amt
                          ? "bg-primary text-white border-primary shadow-sm scale-102"
                          : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-amber-50 hover:border-amber-300"
                      }`}
                    >
                      ₹{amt.toLocaleString("en-IN")}
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-gray-500 font-bold text-base">₹</span>
                  <input
                    type="number"
                    min="1"
                    required
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value ? Number(e.target.value) : "")}
                    placeholder="Or enter any custom amount..."
                    className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none text-base font-semibold text-gray-900"
                  />
                </div>
              </div>

              {/* Dynamic QR Scanner & 1-Tap Mobile Payment Widget */}
              {customAmount && Number(customAmount) > 0 ? (
                <div className="bg-gradient-to-br from-amber-50/95 via-orange-50/80 to-amber-100/50 p-5 sm:p-6 rounded-3xl border border-amber-300/90 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="text-center md:text-left space-y-3 flex-1">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-200/80 text-amber-950 text-xs font-bold">
                      <Sparkles size={13} className="text-primary" />
                      <span>Official Society ICICI Bank Account</span>
                    </div>

                    <p className="text-base font-bold text-gray-900 leading-snug">
                      Offering Amount: <span className="text-primary font-mono text-xl">₹{Number(customAmount).toLocaleString("en-IN")}</span>
                    </p>

                    <div className="space-y-2">
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        <button
                          type="button"
                          onClick={handleCopyUpi}
                          className="bg-primary hover:bg-primary-hover text-white text-xs sm:text-sm font-bold px-5 py-3 rounded-2xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 active:scale-98 golden-glow"
                        >
                          {copiedUpi ? <Check size={16} className="text-white" /> : <Copy size={16} />}
                          <span>{copiedUpi ? "✓ UPI ID Copied to Clipboard!" : "📋 1-Tap Copy UPI ID"}</span>
                        </button>
                      </div>

                      <div className="bg-white/80 border border-amber-200/80 rounded-xl p-2.5 text-left text-[11px] text-gray-700 space-y-1">
                        <span className="font-bold text-gray-900 block">📱 How to Pay via Google Pay / PhonePe / Paytm:</span>
                        <ol className="list-decimal list-inside space-y-0.5 text-gray-600">
                          <li>Tap <strong className="text-amber-900">"1-Tap Copy UPI ID"</strong> above</li>
                          <li>Open <strong>GPay / PhonePe / Paytm</strong> ➔ Tap <strong>"Pay UPI ID / To UPI ID"</strong></li>
                          <li>Paste <strong className="font-mono text-primary">{SOCIETY_UPI_ID}</strong> &amp; Pay ₹{Number(customAmount).toLocaleString("en-IN")}</li>
                        </ol>
                      </div>

                      {Number(customAmount) > 2000 && (
                        <div className="bg-amber-100/90 border border-amber-300 p-3 rounded-2xl text-[11.5px] text-amber-950 flex items-start gap-2 shadow-2xs">
                          <span className="text-base shrink-0">💡</span>
                          <div className="leading-snug">
                            <strong>Note for Google Pay (&gt; ₹2,000):</strong> Google Pay restricts remote gallery photo uploads to ₹2,000. For your contribution of <strong className="text-primary font-bold">₹{Number(customAmount).toLocaleString("en-IN")}</strong>, please use <strong className="text-amber-900">"📋 1-Tap Copy UPI ID"</strong> and pay via <em>"Pay to UPI ID"</em> in GPay for instant approval without limits, or scan this QR directly with another device.
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* QR Code */}
                  <div className="bg-white p-3.5 rounded-3xl border border-amber-300/90 shadow-md shrink-0 text-center">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
                        generateUpiString(Number(customAmount), customPurpose || "Pujo Seva")
                      )}`}
                      alt="PBEL Sanskritik Samiti UPI QR"
                      className="w-36 h-36 mx-auto rounded-xl"
                    />
                    <span className="text-[11px] text-gray-800 font-bold block mt-1.5 font-mono">Scan with Any UPI App</span>
                    <button
                      type="button"
                      onClick={() => saveQrCodeToGallery(generateUpiString(Number(customAmount), customPurpose || "Pujo Seva"), customAmount, customPurpose || "Pujo-Offering")}
                      className="mt-2 text-[10px] font-bold text-amber-950 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-lg transition flex items-center justify-center gap-1 w-full shadow-2xs"
                    >
                      <Download size={12} />
                      <span>{Number(customAmount) > 2000 ? "Save QR (PhonePe / Paytm / <₹2k)" : "Save QR to Gallery / Photos"}</span>
                    </button>
                  </div>
                </div>
              ) : null}

              {/* Devotee Personal Details (FOLLOWING QR CODE) */}
              <div className="space-y-4 pt-2 border-t border-gray-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                      Devotee Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={customFormData.name}
                      onChange={(e) => setCustomFormData({ ...customFormData, name: e.target.value })}
                      placeholder="Your Full Name"
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none text-xs sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                      WhatsApp Phone Number (10 Digits) *
                    </label>
                    <input
                      type="tel"
                      required
                      inputMode="numeric"
                      maxLength={10}
                      pattern="[0-9]{10}"
                      value={customFormData.phone}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                        setCustomFormData({ ...customFormData, phone: val });
                      }}
                      placeholder="10-digit mobile number"
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none text-xs sm:text-sm font-mono"
                    />
                  </div>
                </div>

                {/* 1-TAP TOWER SELECTOR + FLAT UNIT */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-amber-50/60 p-3.5 rounded-2xl border border-amber-200">
                  <div>
                    <label className="block text-xs font-bold text-amber-950 uppercase mb-1 flex items-center gap-1">
                      <Building size={13} className="text-primary" /> Select PBEL Tower *
                    </label>
                    <select
                      value={customTower}
                      onChange={(e) => setCustomTower(e.target.value)}
                      className="w-full p-2.5 border border-amber-300/80 rounded-xl bg-white focus:ring-2 focus:ring-primary outline-none text-xs sm:text-sm font-semibold text-gray-900"
                    >
                      {towersList.map((t) => (
                        <option key={t.id} value={t.fullName || `${t.tower} (${t.name})`}>
                          {t.fullName || `${t.tower} (${t.name})`}
                        </option>
                      ))}
                      <option value="Other">Other / Non-Resident Guest</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-amber-950 uppercase mb-1">
                      Flat / Unit Number (e.g. 402, 1204, or G01) *
                    </label>
                    <input
                      type="text"
                      required
                      autoCapitalize="characters"
                      maxLength={8}
                      value={customFlatUnit}
                      onChange={(e) => {
                        const val = e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, "").slice(0, 8);
                        setCustomFlatUnit(val);
                      }}
                      placeholder="e.g. 402, 1204, or G01"
                      className="w-full p-2.5 border border-amber-300/80 rounded-xl bg-white focus:ring-2 focus:ring-primary outline-none text-xs sm:text-sm font-bold font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    UPI UTR / Transaction Ref No. (Optional from GPay/PhonePe)
                  </label>
                  <input
                    type="text"
                    value={customFormData.upiRef}
                    onChange={(e) => setCustomFormData({ ...customFormData, upiRef: e.target.value })}
                    placeholder="e.g. 12-digit UTR for instant verification"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none text-xs sm:text-sm font-mono"
                  />
                </div>

                {/* WhatsApp Broadcast Alerts Checkbox */}
                <div className="flex items-center gap-2.5 p-3 bg-green-50/70 border border-green-200/90 rounded-xl text-xs text-green-950">
                  <input
                    type="checkbox"
                    id="custom-whatsapp-alerts"
                    checked={customFormData.wantsWhatsappUpdates}
                    onChange={(e) => setCustomFormData({ ...customFormData, wantsWhatsappUpdates: e.target.checked })}
                    className="w-4 h-4 text-green-700 rounded border-gray-300 focus:ring-green-600 cursor-pointer"
                  />
                  <label htmlFor="custom-whatsapp-alerts" className="font-semibold cursor-pointer select-none">
                    📲 Receive official Pujo WhatsApp schedule, aarti timings &amp; broadcast updates
                  </label>
                </div>

                {/* Optional 80G Tax Exemption Toggle & PAN */}
                <div className="bg-amber-50/80 border border-amber-300/90 rounded-2xl p-3.5 space-y-2.5">
                  <div className="flex items-start gap-2.5">
                    <input
                      type="checkbox"
                      id="custom-tax-exemption"
                      checked={customFormData.requiresTaxExemption}
                      onChange={(e) => setCustomFormData({ ...customFormData, requiresTaxExemption: e.target.checked })}
                      className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary mt-0.5 cursor-pointer"
                    />
                    <label htmlFor="custom-tax-exemption" className="text-xs font-bold text-amber-950 cursor-pointer select-none">
                      📜 I require an 80G Tax Exemption Certificate (Requires PAN)
                      <span className="block font-normal text-[11px] text-gray-600 mt-0.5">
                        Optional: Check this if you wish to claim tax deduction under Section 80G of the Income Tax Act.
                      </span>
                    </label>
                  </div>

                  {customFormData.requiresTaxExemption && (
                    <div className="pt-2 border-t border-amber-200/80">
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                        Contributor PAN Number (10 alphanumeric digits) *
                      </label>
                      <input
                        type="text"
                        required={customFormData.requiresTaxExemption}
                        maxLength={10}
                        value={customFormData.panNumber}
                        onChange={(e) => {
                          const val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10);
                          setCustomFormData({ ...customFormData, panNumber: val });
                        }}
                        placeholder="e.g. ABCDE1234F"
                        className="w-full p-2.5 border border-amber-300 rounded-xl bg-white focus:ring-2 focus:ring-primary outline-none font-mono font-bold text-xs uppercase tracking-wider"
                      />
                      {customFormData.panNumber && (() => {
                        const res = validateIndianPan(customFormData.panNumber);
                        if (!res.isValid) {
                          return (
                            <p className="text-[10.5px] text-red-600 mt-1 font-medium">
                              {res.errorMessage}
                            </p>
                          );
                        }
                        return (
                          <p className="text-[10.5px] text-green-700 mt-1 font-semibold flex items-center gap-1">
                            ✓ Verified PAN format ({res.entityType})
                          </p>
                        );
                      })()}
                    </div>
                  )}
                </div>

                {/* Privacy Wall Checkbox */}
                <div className="bg-amber-50/70 p-3.5 rounded-xl border border-amber-200/60 flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="wall-custom-visibility"
                    checked={customFormData.isNameVisible}
                    onChange={(e) => setCustomFormData({ ...customFormData, isNameVisible: e.target.checked })}
                    className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary mt-0.5"
                  />
                  <label htmlFor="wall-custom-visibility" className="text-xs text-gray-800 leading-normal cursor-pointer">
                    <strong>Display my name on the public "Wall of Contributors"</strong>
                    <span className="block text-gray-500 text-[11px] mt-0.5">
                      Uncheck if you prefer your contribution to remain Anonymous.
                    </span>
                  </label>
                </div>
              </div>

              {/* Submit Action */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || !customAmount || customAmount <= 0}
                  className="w-full bg-gradient-to-r from-[#D99B26] via-[#B8801C] to-[#966714] hover:from-[#B8801C] hover:to-[#78520D] text-white font-bold text-base py-3.5 rounded-2xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 golden-glow flex items-center justify-center gap-2"
                >
                  <HeartHandshake size={20} />
                  <span>
                    {isSubmitting
                      ? "Recording Offering..."
                      : `Confirm & Record ₹${customAmount ? Number(customAmount).toLocaleString("en-IN") : "0"} Offering`}
                  </span>
                </button>
                <p className="text-[11px] text-gray-400 text-center mt-2.5 flex items-center justify-center gap-1">
                  <ShieldCheck size={13} className="text-green-600" /> Direct 100% Zero-Fee Transfer to PBEL Sanskritik Samiti Bank Account
                </p>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* 4. MODE 2: DAY-WISE SPECIFIC SEVA CATALOG (WITH LIVE CAPACITY LIMITS & SOLD OUT CHECKS) */}
      {activeMode === "catalog" && (
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 mb-16 space-y-6">
          
          {/* Quick Day Selector Tabs */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-3xl p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 uppercase tracking-wider">
                <Calendar size={15} className="text-primary" />
                <span>Filter Offerings by Pujo Day (Sorted Chronologically)</span>
              </div>
              {dayFilter !== "all" && (
                <button
                  type="button"
                  onClick={() => setDayFilter("all")}
                  className="text-[11px] text-primary font-bold hover:underline"
                >
                  Clear Day Filter
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 sm:gap-2">
              {[
                { id: "all", label: "🌟 All Days" },
                { id: "panchami", label: "15 Oct • Panchami" },
                { id: "shashthi", label: "16 Oct • Maha Sashti" },
                { id: "saptami", label: "17 Oct • Maha Saptami" },
                { id: "ashtami", label: "18 Oct • Maha Ashtami" },
                { id: "nabami", label: "19 Oct • Maha Nabami" },
                { id: "dashami", label: "20 Oct • Bijoya Dashami" },
                { id: "grand", label: "👑 All 6 Days (Grand Patrons)" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setDayFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                    dayFilter === tab.id
                      ? "bg-primary text-white shadow-md golden-glow"
                      : "bg-white text-gray-700 border border-gray-200 hover:border-amber-400 hover:bg-amber-100/50"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              { id: "all", label: "All Seva Categories" },
              { id: "flowers", label: "🌺 Flowers & Mala" },
              { id: "bhog", label: "🍚 Maha Bhog" },
              { id: "sweets", label: "🍬 Sweets & Prasad" },
              { id: "rituals", label: "🪔 Sandhi Pujo & Havan" },
              { id: "grand", label: "👑 Grand Patrons" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCategoryFilter(tab.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                  categoryFilter === tab.id
                    ? "bg-amber-900 text-white shadow-xs"
                    : "bg-white text-gray-700 border border-gray-200 hover:border-amber-400 hover:bg-amber-50/50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Storefront Grid with Direct Capacity Counters & Sold-Out Dimming */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredSevas.map((item) => {
              const max = item.maxLimit !== undefined && item.maxLimit !== null ? Number(item.maxLimit) : 5;
              const booked = item.bookedCount || 0;
              const remaining = Math.max(0, max - booked);
              const isSoldOut = item.isActive === false || remaining <= 0;

              return (
                <div
                  key={item.id}
                  className={`rounded-3xl p-6 border transition-all flex flex-col justify-between relative group ${
                    isSoldOut
                      ? "bg-gray-100/90 border-gray-300 opacity-75 shadow-none"
                      : "bg-white border-amber-900/15 shadow-sm hover:shadow-xl hover:border-amber-400"
                  }`}
                >
                  {/* Top Badges */}
                  <div className="absolute top-4 right-4 flex flex-col items-end gap-1">
                    {isSoldOut ? (
                      <span className="text-[10px] font-bold bg-red-100 text-red-800 border border-red-300 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        🔒 Seva Full / Booked
                      </span>
                    ) : item.badge ? (
                      <span className="text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-0.5 rounded-full uppercase">
                        {item.badge}
                      </span>
                    ) : null}
                  </div>

                  <div>
                    <div className="text-3xl mb-2">{item.icon}</div>
                    <div className="text-xs font-bold text-amber-700 flex items-center gap-1 mb-1">
                      <Calendar size={13} /> {item.day} ({item.date})
                    </div>
                    <h3 className={`font-heading text-xl font-bold mb-2 transition-colors ${
                      isSoldOut ? "text-gray-600 line-through" : "text-gray-900 group-hover:text-primary"
                    }`}>
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed mb-4">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    
                    {/* Price and Available Slots Counter */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] text-gray-500 uppercase font-bold flex items-center gap-1">
                        <Lock size={12} className="text-amber-600" /> Fixed Amount
                      </span>
                      <span className={`text-2xl font-bold font-mono ${isSoldOut ? "text-gray-500" : "text-primary"}`}>
                        ₹{item.amount.toLocaleString("en-IN")}
                      </span>
                    </div>

                    {/* Capacity Indicator Pill */}
                    <div className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-between mb-3 ${
                      isSoldOut
                        ? "bg-red-50/90 border-red-200 text-red-700"
                        : remaining <= 2
                        ? "bg-orange-50 border-orange-300 text-orange-900 animate-pulse"
                        : "bg-amber-50 border-amber-200/80 text-amber-950"
                    }`}>
                      <span className="flex items-center gap-1 text-[11px]">
                        {isSoldOut ? <AlertCircle size={13} /> : <Sparkles size={13} className="text-primary" />}
                        {isSoldOut ? "All Slots Sponsored" : "Available Sponsorships:"}
                      </span>
                      <span className="font-mono text-xs">
                        {isSoldOut ? "0 Left" : `${remaining} of ${max} Available`}
                      </span>
                    </div>

                    {/* Action Button: Offer to General Fund if Sold Out, Sponsor Seva otherwise */}
                    {isSoldOut ? (
                      <button
                        type="button"
                        onClick={() => {
                          setActiveMode("general");
                          setCustomAmount(item.amount);
                          setCustomPurpose(`General Fund (In honor of ${item.title})`);
                          window.scrollTo({ top: 300, behavior: "smooth" });
                        }}
                        className="w-full bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 py-3 rounded-2xl font-bold text-xs transition flex items-center justify-center gap-1.5"
                      >
                        <HeartHandshake size={14} className="text-primary" />
                        <span>Seva Full • Offer ₹{item.amount.toLocaleString("en-IN")} to General Fund →</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setModalSeva(item)}
                        className="w-full bg-gradient-to-r from-[#D99B26] to-[#B8801C] hover:from-[#B8801C] hover:to-[#966714] text-white py-3 rounded-2xl font-bold text-xs transition shadow-md golden-glow flex items-center justify-center gap-2"
                      >
                        <QrCode size={16} />
                        <span>Sponsor Seva • Pay ₹{item.amount.toLocaleString("en-IN")} (UPI / QR)</span>
                      </button>
                    )}

                  </div>
                </div>
              );
            })}
          </div>

          {filteredSevas.length === 0 && (
            <div className="text-center py-12 bg-white rounded-3xl border border-gray-100 p-8 shadow-xs">
              <span className="text-3xl mb-2 block">🌺</span>
              <p className="text-gray-700 font-bold text-sm">No seva offerings found for this filter.</p>
              <p className="text-gray-500 text-xs mt-1">Please select another day or view all offerings.</p>
              <button
                type="button"
                onClick={() => {
                  setCategoryFilter("all");
                  setDayFilter("all");
                }}
                className="mt-4 bg-primary text-white text-xs font-bold px-5 py-2 rounded-full hover:bg-primary-hover transition cursor-pointer"
              >
                Show All Seva Offerings
              </button>
            </div>
          )}

        </div>
      )}

      {/* TOWER SOLIDARITY & PARTICIPATION SUMMARY (AT BOTTOM OF PAGE) */}
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 mb-16">
        <TowerParticipation />
      </div>

      {/* 5. DIRECT FIXED-SEVA QUICK CHECKOUT MODAL (WITH DYNAMIC UPI QR SCANNER) */}
      {modalSeva && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-amber-400/40 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setModalSeva(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
              aria-label="Close Modal"
            >
              <X size={18} />
            </button>

            {/* Modal Header */}
            <div className="text-center pb-4 border-b border-gray-100 mb-6">
              <span className="text-4xl mb-2 block">{modalSeva.icon}</span>
              <span className="text-xs uppercase font-bold text-amber-800 bg-amber-100/60 px-3 py-0.5 rounded-full inline-block mb-1">
                {modalSeva.day} ({modalSeva.date})
              </span>
              <h3 className="font-heading text-2xl font-bold text-gray-900">{modalSeva.title}</h3>
              <p className="text-xs text-gray-500 mt-1">{modalSeva.description}</p>
              
              {/* Locked Fixed Price Badge */}
              <div className="mt-4 bg-gradient-to-r from-amber-50 to-orange-50 p-3 rounded-2xl border border-amber-200/80 flex items-center justify-between px-6">
                <span className="text-xs font-bold text-gray-700 uppercase flex items-center gap-1">
                  <Lock size={13} className="text-amber-700" /> Locked Seva Amount
                </span>
                <span className="text-2xl font-bold text-primary font-mono">
                  ₹{modalSeva.amount.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* UPI & QR Scanner Section (Zero Friction: 1-Tap Copy UPI + QR Scanner) */}
            <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-300/90 mb-5 text-center space-y-3">
              
              {/* QR Code & Scanner */}
              <div className="bg-white p-3 rounded-2xl border border-amber-300 shadow-sm inline-block">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
                    generateUpiString(modalSeva.amount, `${modalSeva.day} - ${modalSeva.title}`)
                  )}`}
                  alt="PBEL Sanskritik Samiti UPI QR"
                  className="w-32 h-32 sm:w-36 sm:h-36 mx-auto rounded-lg"
                />
                <span className="text-[11px] text-gray-800 font-bold block mt-1">Scan with Any UPI App • ₹{modalSeva.amount.toLocaleString("en-IN")}</span>
                <button
                  type="button"
                  onClick={() => saveQrCodeToGallery(generateUpiString(modalSeva.amount, `${modalSeva.day} - ${modalSeva.title}`), modalSeva.amount, modalSeva.title)}
                  className="mt-1.5 text-[10px] font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 px-3 py-1 rounded-md transition flex items-center justify-center gap-1 w-full shadow-2xs"
                >
                  <Download size={11} /> Save QR to Gallery / Photos
                </button>
              </div>

              {/* 1-Tap Copy UPI ID */}
              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyUpi}
                    className="w-full sm:w-auto bg-primary hover:bg-primary-hover text-white text-xs font-bold px-6 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    {copiedUpi ? <Check size={14} className="text-white" /> : <Copy size={14} />}
                    <span>{copiedUpi ? "✓ UPI ID Copied!" : "📋 1-Tap Copy UPI ID"}</span>
                  </button>
                </div>

                <div className="bg-white/80 border border-amber-200/80 rounded-xl p-2 text-left text-[10px] text-gray-600 space-y-0.5">
                  <span className="font-bold text-gray-900 block">📱 To pay via Google Pay / PhonePe / Paytm:</span>
                  <span>1. Tap <strong>"1-Tap Copy UPI ID"</strong> ➔ 2. Open GPay/PhonePe ➔ 3. Select <strong>"Pay UPI ID"</strong> &amp; paste <strong className="font-mono text-primary">{SOCIETY_UPI_ID}</strong></span>
                </div>

                {/* Adaptive Pro-Tip for Google Pay / UPI amounts above Rs 2,000 */}
                {Number(modalSeva.amount) > 2000 && (
                  <div className="bg-amber-100/90 border border-amber-300 p-2.5 rounded-xl text-[11px] text-amber-950 text-left flex items-start gap-1.5 shadow-2xs">
                    <span className="text-sm shrink-0">💡</span>
                    <div className="leading-tight">
                      <strong>Google Pay Note (&gt; ₹2,000):</strong> GPay limits gallery photo uploads to ₹2,000. For ₹{Number(modalSeva.amount).toLocaleString("en-IN")}, please use <strong>"📋 1-Tap Copy UPI ID"</strong> and pay via <em>"Pay to UPI ID"</em> in GPay for instant approval without limits.
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Direct Seva Devotee Details Form */}
            <form onSubmit={handleModalCheckout} className="space-y-4 text-xs sm:text-sm">
              {modalFormError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 rounded-2xl text-xs font-medium flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{modalFormError}</span>
                </div>
              )}
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  value={modalFormData.name}
                  onChange={(e) => setModalFormData({ ...modalFormData, name: e.target.value })}
                  placeholder="e.g. Suman Banerjee"
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">WhatsApp Phone (10 Digits) *</label>
                <input
                  type="tel"
                  required
                  inputMode="numeric"
                  maxLength={10}
                  pattern="[0-9]{10}"
                  value={modalFormData.phone}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                    setModalFormData({ ...modalFormData, phone: val });
                  }}
                  placeholder="10-digit mobile number"
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none font-mono"
                />
              </div>

              {/* 1-TAP TOWER SELECTOR + FLAT UNIT */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-amber-50/60 p-3 rounded-2xl border border-amber-200">
                <div>
                  <label className="block text-xs font-bold text-amber-950 uppercase mb-1 flex items-center gap-1">
                    <Building size={12} className="text-primary" /> Select Tower *
                  </label>
                  <select
                    value={modalTower}
                    onChange={(e) => setModalTower(e.target.value)}
                    className="w-full p-2.5 border border-amber-300/80 rounded-xl bg-white focus:ring-2 focus:ring-primary outline-none text-xs font-semibold text-gray-900"
                  >
                    {towersList.map((t) => (
                      <option key={t.id} value={t.fullName || `${t.tower} (${t.name})`}>
                        {t.fullName || `${t.tower} (${t.name})`}
                      </option>
                    ))}
                    <option value="Other">Other / Non-Resident Guest</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-amber-950 uppercase mb-1">
                    Flat / Unit (e.g. 402, 1204, or G01) *
                  </label>
                  <input
                    type="text"
                    required
                    autoCapitalize="characters"
                    maxLength={8}
                    value={modalFlatUnit}
                    onChange={(e) => {
                      const val = e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, "").slice(0, 8);
                      setModalFlatUnit(val);
                    }}
                    placeholder="e.g. 402, 1204, or G01"
                    className="w-full p-2.5 border border-amber-300/80 rounded-xl bg-white focus:ring-2 focus:ring-primary outline-none text-xs sm:text-sm font-bold font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Email (Optional)</label>
                  <input
                    type="email"
                    value={modalFormData.email}
                    onChange={(e) => setModalFormData({ ...modalFormData, email: e.target.value })}
                    placeholder="name@example.com"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">UPI UTR / Ref No. (Optional)</label>
                  <input
                    type="text"
                    value={modalFormData.upiRef}
                    onChange={(e) => setModalFormData({ ...modalFormData, upiRef: e.target.value })}
                    placeholder="12-digit UTR from GPay"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none font-mono"
                  />
                </div>
              </div>

              {/* WhatsApp Broadcast Alerts Checkbox */}
              <div className="flex items-center gap-2.5 p-2.5 bg-green-50/70 border border-green-200/90 rounded-xl text-xs text-green-950">
                <input
                  type="checkbox"
                  id="modal-whatsapp-alerts"
                  checked={modalFormData.wantsWhatsappUpdates}
                  onChange={(e) => setModalFormData({ ...modalFormData, wantsWhatsappUpdates: e.target.checked })}
                  className="w-4 h-4 text-green-700 rounded border-gray-300 focus:ring-green-600 cursor-pointer"
                />
                <label htmlFor="modal-whatsapp-alerts" className="font-semibold cursor-pointer select-none">
                  📲 Receive official Pujo WhatsApp schedule &amp; broadcast updates
                </label>
              </div>

              {/* Optional 80G Tax Exemption Toggle & PAN */}
              <div className="bg-amber-50/80 border border-amber-300/90 rounded-2xl p-3 space-y-2">
                <div className="flex items-start gap-2.5">
                  <input
                    type="checkbox"
                    id="modal-tax-exemption"
                    checked={modalFormData.requiresTaxExemption}
                    onChange={(e) => setModalFormData({ ...modalFormData, requiresTaxExemption: e.target.checked })}
                    className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary mt-0.5 cursor-pointer"
                  />
                  <label htmlFor="modal-tax-exemption" className="text-xs font-bold text-amber-950 cursor-pointer select-none">
                    📜 I require an 80G Tax Exemption Certificate (Requires PAN)
                    <span className="block font-normal text-[11px] text-gray-600 mt-0.5">
                      Optional: Check this if you wish to claim tax deduction under Section 80G of the Income Tax Act.
                    </span>
                  </label>
                </div>

                {modalFormData.requiresTaxExemption && (
                  <div className="pt-2 border-t border-amber-200/80">
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Contributor PAN Number (10 alphanumeric digits) *
                    </label>
                    <input
                      type="text"
                      required={modalFormData.requiresTaxExemption}
                      maxLength={10}
                      value={modalFormData.panNumber}
                      onChange={(e) => {
                        const val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10);
                        setModalFormData({ ...modalFormData, panNumber: val });
                      }}
                      placeholder="e.g. ABCDE1234F"
                      className="w-full p-2.5 border border-amber-300 rounded-xl bg-white focus:ring-2 focus:ring-primary outline-none font-mono font-bold text-xs uppercase tracking-wider"
                    />
                    {modalFormData.panNumber && (() => {
                      const res = validateIndianPan(modalFormData.panNumber);
                      if (!res.isValid) {
                        return (
                          <p className="text-[10.5px] text-red-600 mt-1 font-medium">
                            {res.errorMessage}
                          </p>
                        );
                      }
                      return (
                        <p className="text-[10.5px] text-green-700 mt-1 font-semibold flex items-center gap-1">
                          ✓ Verified PAN format ({res.entityType})
                        </p>
                      );
                    })()}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="modal-visibility"
                  checked={modalFormData.isNameVisible}
                  onChange={(e) => setModalFormData({ ...modalFormData, isNameVisible: e.target.checked })}
                  className="w-4 h-4 text-primary rounded border-gray-300"
                />
                <label htmlFor="modal-visibility" className="text-xs text-gray-700">
                  Display my name on the Wall of Contributors
                </label>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-[#D99B26] via-[#B8801C] to-[#966714] text-white font-bold py-3.5 rounded-xl transition shadow-lg golden-glow flex items-center justify-center gap-2 text-sm"
                >
                  <CheckCircle2 size={17} />
                  <span>
                    {isSubmitting
                      ? "Recording Offering..."
                      : `I Have Paid ₹${modalSeva.amount.toLocaleString("en-IN")} • Confirm & Get Receipt`}
                  </span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
