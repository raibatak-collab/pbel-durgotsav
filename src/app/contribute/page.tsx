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
  AlertCircle
} from "lucide-react";
import { supabase } from "@/utils/supabase/client";

// Official Society Bank Account UPI Configuration
const SOCIETY_UPI_ID = "pbelsanskritiksamiti@icici";
const SOCIETY_NAME = "PBEL Sanskritik Samiti";

interface SevaItem {
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
    id: "panchami-sweets",
    title: "Panchami Anandamela Sweets & Mishti",
    day: "Panchami",
    date: "15 Oct 2026",
    amount: 1501,
    category: "sweets",
    icon: "🍬",
    description: "Distribution of traditional Bengali sweets and prasad for evening gathering.",
    maxLimit: 15,
  },

  // Sashti
  {
    id: "sashti-flowers",
    title: "Sashti Pushpanjali Flowers & Bilva Patra",
    day: "Maha Sashti",
    date: "16 Oct 2026",
    amount: 501,
    category: "flowers",
    icon: "🌺",
    description: "Fresh fragrant marigolds, roses, and sacred bilva leaves for Bodhon & Pushpanjali.",
    badge: "Popular Seva",
    maxLimit: 25,
  },
  {
    id: "sashti-sweets",
    title: "Sashti Devi Bodhon Sweets & Prasad",
    day: "Maha Sashti",
    date: "16 Oct 2026",
    amount: 1501,
    category: "sweets",
    icon: "🥮",
    description: "Sponsor special sweet offerings for the sacred Bodhon and Adhibas rituals.",
    maxLimit: 15,
  },
  {
    id: "sashti-aarthi",
    title: "Sashti Sandhya Aarti & Deepam",
    day: "Maha Sashti",
    date: "16 Oct 2026",
    amount: 1001,
    category: "rituals",
    icon: "🪔",
    description: "Earthen lamps, pure ghee, and camphor for the grand evening Sandhya Aarti.",
    maxLimit: 10,
  },

  // Saptami
  {
    id: "saptami-nabapatrika",
    title: "Saptami Nabapatrika Pujo Samagri",
    day: "Maha Saptami",
    date: "17 Oct 2026",
    amount: 1100,
    category: "rituals",
    icon: "🌿",
    description: "Sacred plants, yellow cloth, and ceremonial items for Kola Bou Snan.",
    maxLimit: 5,
  },
  {
    id: "saptami-bhog",
    title: "Saptami Maha Bhog Seva",
    day: "Maha Saptami",
    date: "17 Oct 2026",
    amount: 2501,
    category: "bhog",
    icon: "🍚",
    description: "Khichuri, Labra, Beguni, Chutney & Payesh prepared for afternoon community bhog.",
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
    title: "Ashtami Grand Maha Bhog Family Seva",
    day: "Maha Ashtami",
    date: "18 Oct 2026",
    amount: 5001,
    category: "bhog",
    icon: "🍲",
    description: "Full family sponsorship for afternoon Maha Bhog feast for the entire township.",
    maxLimit: 10,
  },

  // Nabami
  {
    id: "nabami-yajna",
    title: "Nabami Maha Yajna & Havan Samagri",
    day: "Maha Nabami",
    date: "19 Oct 2026",
    amount: 2100,
    category: "rituals",
    icon: "🔥",
    description: "Ghee, dry fruits, sacred wood (Samidha), and bel fruit for the auspicious Havan.",
    maxLimit: 5,
  },
  {
    id: "nabami-bhog",
    title: "Nabami Maha Bhog Seva",
    day: "Maha Nabami",
    date: "19 Oct 2026",
    amount: 5001,
    category: "bhog",
    icon: "🍚",
    description: "Special Pulao, Paneer/Veg delicacies, and Sweets for Maha Navami prasad.",
    maxLimit: 10,
  },

  // Dashami
  {
    id: "dashami-sindoor",
    title: "Dashami Sindoor Khela & Mishti Box",
    day: "Vijaya Dashami",
    date: "20 Oct 2026",
    amount: 1800,
    category: "sweets",
    icon: "🔴",
    description: "Pure vermilion, betel leaves, and sweet boxes for the festive Sindoor Khela.",
    badge: "Sindoor Khela",
    maxLimit: 20,
  },
  {
    id: "dashami-visarjan",
    title: "Shanti Jal & Visarjan Dhaaki Seva",
    day: "Vijaya Dashami",
    date: "20 Oct 2026",
    amount: 3501,
    category: "rituals",
    icon: "🌊",
    description: "Dhunuchi Naach & Dhaaki accompaniment for the immersion procession.",
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

  // Modal State for Direct Card Seva Checkout
  const [modalSeva, setModalSeva] = useState<SevaItem | null>(null);
  const [modalTab, setModalTab] = useState<"qr_code" | "upi_app">("qr_code");
  const [modalFormData, setModalFormData] = useState({
    name: "",
    phone: "",
    email: "",
    flatNumber: "",
    upiRef: "",
    isNameVisible: true,
  });

  // State for General / Open-ended Donation Form
  const [customAmount, setCustomAmount] = useState<number | "">(1001);
  const [customPurpose, setCustomPurpose] = useState<string>("General Pujo Fund");
  const [customFormData, setCustomFormData] = useState({
    name: "",
    phone: "",
    email: "",
    flatNumber: "",
    upiRef: "",
    isNameVisible: true,
  });

  const [copiedUpi, setCopiedUpi] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [receiptData, setReceiptData] = useState<any>(null);

// Category metadata decoder
function decodeCategoryDescription(desc?: string) {
  const str = desc || '';
  const limitMatch = str.match(/\[limit:(\d+)\]/);
  const statusMatch = str.match(/\[status:(active|inactive)\]/);

  const cleanDescription = str
    .replace(/\[limit:\d+\]/g, '')
    .replace(/\[status:(active|inactive)\]/g, '')
    .trim();

  const parsedLimit = limitMatch ? Number(limitMatch[1]) : undefined;
  const parsedActive = statusMatch ? statusMatch[1] === 'active' : undefined;

  return { cleanDescription, parsedLimit, parsedActive };
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
            (def) => def.title.toLowerCase() === d.name.toLowerCase()
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

          return {
            id: d.id,
            title: d.name,
            day: matched?.day || "6-Day Pujo",
            date: matched?.date || "15 - 20 Oct 2026",
            amount: d.fixed_amount ? Number(d.fixed_amount) : (matched?.amount || 1001),
            category: (matched?.category || "rituals") as any,
            icon: matched?.icon || "🌺",
            description: decoded.cleanDescription || matched?.description || "Special seva offering for PBEL City Durgotsav.",
            badge: matched?.badge || (d.fixed_amount >= 10000 ? "Grand Seva" : undefined),
            maxLimit: max,
            bookedCount: booked,
            isActive: isActive,
          };
        });
        setSevaList(dbItems);
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

    // Deep link query check
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("category") || params.get("amount")) {
        setActiveMode("catalog");
      }
    }
  }, []);

  const filteredSevas = sevaList.filter((item) => {
    if (categoryFilter === "all") return true;
    if (categoryFilter === "flowers") return item.category === "flowers";
    if (categoryFilter === "bhog") return item.category === "bhog";
    if (categoryFilter === "sweets") return item.category === "sweets";
    if (categoryFilter === "rituals") return item.category === "rituals";
    if (categoryFilter === "grand") return item.category === "grand";
    return true;
  });

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(SOCIETY_UPI_ID);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const generateUpiString = (amt: number, note: string) => {
    return `upi://pay?pa=${SOCIETY_UPI_ID}&pn=${encodeURIComponent(SOCIETY_NAME)}&am=${amt}&cu=INR&tn=${encodeURIComponent(note)}`;
  };

  // Handle Direct Card Fixed-Seva Payment
  const handleModalCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalSeva) return;

    // Check if slot limit reached right before submission
    const max = modalSeva.maxLimit || 5;
    const booked = modalSeva.bookedCount || 0;
    if (modalSeva.isActive === false || (max - booked <= 0)) {
      alert("This Seva package has reached its maximum sponsorship limit. Please choose another seva or contact the committee.");
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
            max_limit: modalSeva.maxLimit || 5,
            is_active: true
          })
          .select("id")
          .single();
        catData = newCat;
      }

      const generatedPaymentId = modalFormData.upiRef.trim() 
        ? `UTR_${modalFormData.upiRef.trim()}` 
        : `WEB_${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

      // Insert with "Pending Verification"
      const { error } = await supabase.from("contributions").insert({
        contributor_name: modalFormData.name.trim(),
        email: modalFormData.email.trim(),
        phone: modalFormData.phone.trim(),
        flat_number: modalFormData.flatNumber.trim(),
        amount: Number(modalSeva.amount),
        category_id: catData?.id,
        status: "Pending Verification",
        is_name_visible: modalFormData.isNameVisible,
        payment_id: generatedPaymentId,
      });

      if (error) throw error;

      setReceiptData({
        name: modalFormData.name.trim(),
        flatNumber: modalFormData.flatNumber.trim(),
        phone: modalFormData.phone.trim(),
        amount: Number(modalSeva.amount),
        category: `${modalSeva.day} - ${modalSeva.title}`,
        paymentId: generatedPaymentId,
        upiId: SOCIETY_UPI_ID,
        date: new Date().toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      });

      setModalSeva(null);
      setIsSuccess(true);
      loadData(); // refresh remaining counters
    } catch (error) {
      console.error("Error processing fixed seva payment:", error);
      alert("Payment recording failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle General / Custom Contribution Submission
  const handleCustomDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customAmount || customAmount <= 0) return;

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
          .insert({ name: categoryName, is_active: true })
          .select("id")
          .single();
        catData = newCat;
      }

      const generatedPaymentId = customFormData.upiRef.trim() 
        ? `UTR_${customFormData.upiRef.trim()}` 
        : `WEB_${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

      // Insert with "Pending Verification"
      const { error } = await supabase.from("contributions").insert({
        contributor_name: customFormData.name.trim(),
        email: customFormData.email.trim(),
        phone: customFormData.phone.trim(),
        flat_number: customFormData.flatNumber.trim(),
        amount: Number(customAmount),
        category_id: catData?.id,
        status: "Pending Verification",
        is_name_visible: customFormData.isNameVisible,
        payment_id: generatedPaymentId,
      });

      if (error) throw error;

      setReceiptData({
        name: customFormData.name.trim(),
        flatNumber: customFormData.flatNumber.trim(),
        phone: customFormData.phone.trim(),
        amount: Number(customAmount),
        category: categoryName,
        paymentId: generatedPaymentId,
        upiId: SOCIETY_UPI_ID,
        date: new Date().toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
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
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-amber-900/15 shadow-2xl relative overflow-hidden">
          
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <CheckCircle2 size={48} />
          </div>

          <span className="text-xs uppercase font-bold text-amber-800 tracking-wider bg-amber-100/60 px-3 py-1 rounded-full">
            Offering Submitted • Receipt
          </span>
          <h1 className="font-heading text-3xl sm:text-4xl text-primary font-bold mt-2 mb-2">
            ধন্যবাদ! (Dhonnobad)
          </h1>
          <p className="text-gray-600 text-xs sm:text-sm max-w-md mx-auto mb-6">
            Your generous contribution to <strong>PBEL Sanskritik Samiti</strong> has been officially received. Maa Durga bless you and your family!
          </p>

          {/* Official Receipt Card */}
          <div className="bg-gradient-to-br from-[#FFFDF9] to-[#FDF8F0] rounded-2xl p-6 border border-amber-300/60 text-left text-xs sm:text-sm space-y-3 mb-6 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-amber-900/10">
              <div>
                <span className="font-heading text-lg font-bold text-primary block">PBEL Sanskritik Samiti</span>
                <span className="text-[11px] text-gray-500 font-mono">UPI: {receiptData.upiId}</span>
              </div>
              <span className="text-amber-800 font-semibold font-mono text-xs">{receiptData.paymentId}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-gray-500 text-[11px] block">Devotee Name</span>
                <span className="font-semibold text-gray-900">{receiptData.name} ({receiptData.flatNumber})</span>
              </div>
              <div>
                <span className="text-gray-500 text-[11px] block">Seva Purpose</span>
                <span className="font-semibold text-gray-900">{receiptData.category}</span>
              </div>
              <div>
                <span className="text-gray-500 text-[11px] block">Amount Contributed</span>
                <span className="font-bold text-green-700 text-base">₹{Number(receiptData.amount).toLocaleString("en-IN")}</span>
              </div>
              <div>
                <span className="text-gray-500 text-[11px] block">Verification Status</span>
                <span className="text-amber-900 font-bold bg-amber-100/90 px-2 py-0.5 rounded-md inline-block text-[11px]">
                  ⏳ Pending Society Bank Match
                </span>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-gray-500 border-t border-amber-900/10 flex items-center justify-between">
              <span>Date: {receiptData.date}</span>
              <span className="text-green-600 font-semibold flex items-center gap-1">
                <ShieldCheck size={13} /> Direct Society ICICI A/C
              </span>
            </div>
          </div>

          <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200/80 text-xs text-amber-900 mb-6 text-left flex items-start gap-2">
            <Info size={16} className="text-primary shrink-0 mt-0.5" />
            <span>
              Your contribution is being verified against our society bank account. Once approved by the committee, your name will appear on the public <strong>Wall of Contributors</strong>!
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => window.print()}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold px-6 py-2.5 rounded-full text-xs transition flex items-center justify-center gap-1.5"
            >
              <Download size={14} /> Print / Save Official Receipt
            </button>
            <button
              onClick={() => {
                setIsSuccess(false);
                setCustomAmount(1001);
                setCustomFormData({ name: "", phone: "", email: "", flatNumber: "", upiRef: "", isNameVisible: true });
              }}
              className="bg-primary hover:bg-primary-hover text-white font-semibold px-6 py-2.5 rounded-full text-xs transition shadow-sm"
            >
              Make Another Offering
            </button>
          </div>

        </div>
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
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 mb-16">
          <div className="bg-white rounded-3xl shadow-xl border border-amber-900/15 p-6 sm:p-10">
            
            <div className="pb-6 border-b border-gray-100 mb-6">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-100/60 px-3 py-1 rounded-full uppercase tracking-wider mb-2">
                <HeartHandshake size={14} /> Open Seva Fund
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl text-gray-900 font-bold">
                General Pujo Contribution
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Contribute any custom amount directly to the PBEL Sanskritik Samiti Bank Account via UPI or QR Code.
              </p>
            </div>

            <form onSubmit={handleCustomDonate} className="space-y-6">
              
              {/* Quick Amount Selection Chips */}
              <div>
                <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">
                  Select or Enter Contribution Amount (₹ INR) *
                </label>
                
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-3">
                  {[251, 501, 1001, 2001, 5001, 11000].map((amt) => (
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

              {/* Dynamic QR Scanner & 1-Click Mobile Widget */}
              {customAmount && Number(customAmount) > 0 && (
                <div className="bg-amber-50/70 p-5 rounded-2xl border border-amber-300 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="text-center md:text-left space-y-1">
                    <span className="text-xs font-bold text-amber-900 uppercase flex items-center gap-1.5 justify-center md:justify-start">
                      <QrCode size={16} className="text-primary" /> Dynamic Society Bank UPI QR Code
                    </span>
                    <p className="text-sm font-bold text-gray-900">
                      Scan with GPay, PhonePe, Paytm, or BHIM to pay ₹{Number(customAmount).toLocaleString("en-IN")}
                    </p>
                    <p className="text-xs text-gray-600">
                      Beneficiary: <strong className="font-mono text-primary">{SOCIETY_UPI_ID}</strong> (PBEL Sanskritik Samiti)
                    </p>
                    <div className="pt-2 flex flex-wrap gap-2 justify-center md:justify-start">
                      <a
                        href={generateUpiString(Number(customAmount), customPurpose || "Pujo Seva")}
                        className="bg-primary hover:bg-primary-hover text-white text-xs font-bold px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow-xs"
                      >
                        <Smartphone size={14} /> 1-Click Pay on Mobile (GPay / PhonePe)
                      </a>
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-2xl border border-amber-300 shadow-sm shrink-0 text-center">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
                        generateUpiString(Number(customAmount), customPurpose || "Pujo Seva")
                      )}`}
                      alt="PBEL Sanskritik Samiti UPI QR"
                      className="w-36 h-36 mx-auto rounded-lg"
                    />
                    <span className="text-[10px] text-gray-500 font-semibold block mt-1">Scan & Pay ₹{Number(customAmount).toLocaleString("en-IN")}</span>
                  </div>
                </div>
              )}

              {/* Devotee Personal Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Full Name *
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
                    Flat Number * (Required for PBEL Residents)
                  </label>
                  <input
                    type="text"
                    required
                    value={customFormData.flatNumber}
                    onChange={(e) => setCustomFormData({ ...customFormData, flatNumber: e.target.value })}
                    placeholder="e.g. Tower B - 1204 / Guest"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    WhatsApp Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={customFormData.phone}
                    onChange={(e) => setCustomFormData({ ...customFormData, phone: e.target.value })}
                    placeholder="10-digit mobile number"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    UPI UTR / Ref No. (From GPay / PhonePe)
                  </label>
                  <input
                    type="text"
                    value={customFormData.upiRef}
                    onChange={(e) => setCustomFormData({ ...customFormData, upiRef: e.target.value })}
                    placeholder="e.g. 12-digit UTR for instant verification"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none text-xs sm:text-sm font-mono"
                  />
                </div>
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
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 mb-16">
          
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            {[
              { id: "all", label: "🌟 All 6-Day Offerings" },
              { id: "flowers", label: "🌺 Flowers & Mala" },
              { id: "bhog", label: "🍚 Maha Bhog" },
              { id: "sweets", label: "🍬 Sweets & Prasad" },
              { id: "rituals", label: "🪔 Sandhi Pujo & Havan" },
              { id: "grand", label: "👑 Grand Patrons" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCategoryFilter(tab.id)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                  categoryFilter === tab.id
                    ? "bg-primary text-white shadow-md golden-glow"
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

                    {/* Action Button: Disabled if Sold Out, Active otherwise */}
                    {isSoldOut ? (
                      <button
                        type="button"
                        disabled
                        className="w-full bg-gray-200 text-gray-500 py-3 rounded-2xl font-bold text-xs cursor-not-allowed flex items-center justify-center gap-2 border border-gray-300"
                      >
                        <Lock size={14} />
                        <span>Seva Full • All Slots Sponsored</span>
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

        </div>
      )}

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

            {/* UPI & QR Scanner Section */}
            <div className="bg-gray-50 p-4 rounded-2xl border border-amber-300/80 mb-5 text-center">
              
              {/* Payment Mode Selector */}
              <div className="flex items-center justify-center gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => setModalTab("qr_code")}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 ${
                    modalTab === "qr_code"
                      ? "bg-primary text-white shadow-xs"
                      : "bg-white text-gray-700 border border-gray-200"
                  }`}
                >
                  <QrCode size={13} /> Scan QR Code
                </button>
                <button
                  type="button"
                  onClick={() => setModalTab("upi_app")}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 ${
                    modalTab === "upi_app"
                      ? "bg-primary text-white shadow-xs"
                      : "bg-white text-gray-700 border border-gray-200"
                  }`}
                >
                  <Smartphone size={13} /> 1-Click Pay on Mobile
                </button>
              </div>

              {/* TAB 1: QR CODE DISPLAY */}
              {modalTab === "qr_code" && (
                <div className="space-y-3">
                  <div className="bg-white p-3 rounded-2xl border border-amber-300 shadow-sm inline-block mx-auto">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                        generateUpiString(modalSeva.amount, `${modalSeva.day} - ${modalSeva.title}`)
                      )}`}
                      alt="PBEL Sanskritik Samiti UPI QR"
                      className="w-40 h-40 mx-auto rounded-lg"
                    />
                  </div>
                  <p className="text-xs font-bold text-gray-800">
                    Scan with any UPI App (GPay, PhonePe, Paytm, BHIM, Cred)
                  </p>
                  <div className="flex items-center justify-center gap-2 text-[11px] text-gray-600">
                    <span>UPI ID: <strong className="font-mono text-primary">{SOCIETY_UPI_ID}</strong></span>
                    <button
                      type="button"
                      onClick={handleCopyUpi}
                      className="text-amber-800 hover:text-black font-semibold flex items-center gap-1 bg-amber-100/70 px-2 py-0.5 rounded-md"
                    >
                      {copiedUpi ? <Check size={11} className="text-green-600" /> : <Copy size={11} />}
                      <span>{copiedUpi ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: 1-CLICK PAY ON MOBILE */}
              {modalTab === "upi_app" && (
                <div className="space-y-3 py-2">
                  <p className="text-xs text-gray-600">
                    Tap below to open your installed UPI app with ₹{modalSeva.amount} pre-filled for <strong>PBEL Sanskritik Samiti</strong>:
                  </p>
                  <a
                    href={generateUpiString(modalSeva.amount, `${modalSeva.day} - ${modalSeva.title}`)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-md"
                  >
                    <Smartphone size={16} />
                    <span>Open GPay / PhonePe / Paytm to Pay ₹{modalSeva.amount}</span>
                  </a>
                  <p className="text-[11px] text-gray-500">
                    (Works directly when browsing from an Android or iPhone device)
                  </p>
                </div>
              )}

            </div>

            {/* Direct Seva Devotee Details Form */}
            <form onSubmit={handleModalCheckout} className="space-y-4 text-xs sm:text-sm">
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Flat Number *</label>
                  <input
                    type="text"
                    required
                    value={modalFormData.flatNumber}
                    onChange={(e) => setModalFormData({ ...modalFormData, flatNumber: e.target.value })}
                    placeholder="Tower B - 1204"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">WhatsApp Phone *</label>
                  <input
                    type="tel"
                    required
                    value={modalFormData.phone}
                    onChange={(e) => setModalFormData({ ...modalFormData, phone: e.target.value })}
                    placeholder="10-digit number"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
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
