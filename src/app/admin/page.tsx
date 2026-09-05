"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ShieldCheck, 
  HeartHandshake, 
  Users, 
  Music, 
  Calendar, 
  PlusCircle, 
  Award, 
  CheckCircle2,
  Trash2,
  Edit2,
  Eye,
  EyeOff,
  Download,
  Search,
  Filter,
  Flame,
  Clock,
  Image as ImageIcon,
  Sparkles,
  Layers,
  Save,
  X,
  Star,
  Settings,
  Lock,
  Unlock,
  UserCheck,
  UserX,
  LogOut,
  KeyRound,
  Utensils,
  Palette,
  FileText,
  DollarSign,
  ClipboardList,
  Printer,
  Copy,
  TrendingUp,
  AlertCircle,
  Building,
  Upload,
  Mail,
  Edit3,
  Video,
  Play,
  ExternalLink
} from "lucide-react";
import { supabase } from "@/utils/supabase/client";
import { GalleryVideo, extractYouTubeVideoId, getStoredGalleryVideos, saveStoredGalleryVideos, fetchStoredGalleryVideos } from "@/config/gallery";
import { PBEL_TOWERS, PBEL_TOWER_NAMES, matchTower, getStoredTowers, saveStoredTowers, fetchStoredTowers, TowerDefinition } from "@/config/towers";
import { getStoredCommittee, saveStoredCommittee, fetchStoredCommittee, DEFAULT_COMMITTEE_WINGS, CommitteeWing, CommitteeMember } from "@/config/committee";
import { getStoredSchedule, saveStoredSchedule, fetchStoredSchedule, DaySchedule, DEFAULT_PUJO_SCHEDULE, sortRitualsByTime, RitualEvent, getStoredHeroChips, saveStoredHeroChips, fetchStoredHeroChips, HeroHighlightChip, DEFAULT_HERO_HIGHLIGHT_CHIPS } from "@/config/schedule";
import { getStoredSponsorshipTiers, saveStoredSponsorshipTiers, fetchStoredSponsorshipTiers, SponsorshipTier, DEFAULT_SPONSORSHIP_TIERS } from "@/config/sponsors";
import { inferSevaDayAndDate, PUJO_DAYS } from "@/config/sevas";
import { 
  AESTHETIC_WALLPAPERS, 
  DEFAULT_BRANDING, 
  getStoredBranding, 
  saveStoredBranding, 
  fetchStoredBranding,
  SamitiBrandingConfig,
  AestheticWallpaper
} from "@/config/branding";
import { saveCloudConfig, fetchCloudConfig } from "@/utils/cloudConfig";
import { sanitizeText, validateDonationAmount, validatePhoneNumber } from "@/utils/security";
import { SitePopupHighlight, DEFAULT_POPUP_HIGHLIGHT } from "@/components/SiteHighlightModal";
import { OfficialContributionReceipt, ReceiptData } from "@/components/OfficialContributionReceipt";

export interface AdminUser {
  id: string;
  name: string;
  username: string;
  role: "Super Admin" | "Finance & Fund Verification" | "Cultural & Pratibimb Lead" | "Volunteer Lead";
  passwordHash: string;
  status: "Active" | "Suspended";
  created_at: string;
}

const defaultAdminUsers: AdminUser[] = [
  {
    id: "usr-master",
    name: "Executive Committee (Master Admin)",
    username: "admin",
    role: "Super Admin",
    passwordHash: "PBEL@2026",
    status: "Active",
    created_at: "2026-08-01",
  },
  {
    id: "usr-finance",
    name: "Finance & Accounts Lead",
    username: "finance",
    role: "Finance & Fund Verification",
    passwordHash: "PBEL@2026",
    status: "Active",
    created_at: "2026-08-15",
  },
];

// Default pre-populated Nirghanto rituals
const initialDefaultEvents = [
  { id: "e1", title: "Pandal Inauguration & Diya Lighting Ceremony", date: "2026-10-15", time: "05:30 PM", event_type: "Nirghanto", description: "Grand opening of PBEL City Durgotsav 2026 with lighting of ceremonial lamps." },
  { id: "e2", title: "Anandamela Food Stalls (Resident Home Chefs)", date: "2026-10-15", time: "06:00 PM", event_type: "Nirghanto", description: "Food fiesta prepared by PBEL City resident home chefs." },
  { id: "e3", title: "Pratima Sthapana & Kalparambho", date: "2026-10-16", time: "08:30 AM", event_type: "Nirghanto", description: "Maha Sashti morning idol placement and beginning of pujo rites." },
  { id: "e4", title: "Devi Bodhon, Amantran & Adhibas Rituals", date: "2026-10-16", time: "06:30 PM", event_type: "Nirghanto", description: "Awakening of the Goddess with sacred Vedic chanting." },
  { id: "e5", title: "Grand Sandhya Aarti with Dhaak Beats", date: "2026-10-16", time: "07:45 PM", event_type: "Nirghanto", description: "Evening Arati and Dhaak rhythm." },
  { id: "e6", title: "Nabapatrika (Kola Bou) Snan & Pravesh", date: "2026-10-17", time: "07:30 AM", event_type: "Nirghanto", description: "Sacred bathing and welcoming of Kola Bou." },
  { id: "e7", title: "Maha Saptami Pushpanjali (Batch 1 & 2)", date: "2026-10-17", time: "10:30 AM", event_type: "Nirghanto", description: "Saptami morning Pushpanjali for all residents." },
  { id: "e8", title: "Maha Bhog Distribution (Khichuri, Labra, Payesh)", date: "2026-10-17", time: "01:00 PM", event_type: "Nirghanto", description: "Community afternoon bhog feast." },
  { id: "e9", title: "Maha Ashtami Pujo & Special Pushpanjali", date: "2026-10-18", time: "09:30 AM", event_type: "Nirghanto", description: "Most auspicious Pushpanjali batches on Ashtami." },
  { id: "e10", title: "Sacred Kumari Puja", date: "2026-10-18", time: "11:30 AM", event_type: "Nirghanto", description: "Worship of young girls embodying Goddess Durga." },
  { id: "e11", title: "Sandhi Pujo (108 Lotuses & 108 Deepam)", date: "2026-10-18", time: "04:15 PM", event_type: "Nirghanto", description: "Sacred conjunction of Ashtami and Navami with 108 lotuses." },
  { id: "e12", title: "Maha Navami Havan & Yajna", date: "2026-10-19", time: "11:00 AM", event_type: "Nirghanto", description: "Sacred fire offering and concluding Vedic yajna." },
  { id: "e13", title: "Darpan Visarjan (Mirror Immersion)", date: "2026-10-20", time: "09:00 AM", event_type: "Nirghanto", description: "Symbolic mirror immersion ceremony." },
  { id: "e14", title: "Devi Baran & Sindoor Khela", date: "2026-10-20", time: "10:30 AM", event_type: "Nirghanto", description: "Traditional farewell to Maa Durga with vermilion." },
  { id: "e15", title: "Maa Durga Visarjan Shobha Yatra & Shanti Jal", date: "2026-10-20", time: "04:30 PM", event_type: "Nirghanto", description: "Procession and sprinkling of sanctified peace water." },
];

// Map dynamic 6-day DaySchedule structures into Admin Evenings CMS state
const mapScheduleToEveningsConfig = (schedList: DaySchedule[]) => {
  return schedList.map((day) => {
    const times = (day.culturalEvening?.time || "06:30 PM - 10:30 PM").split(" - ");
    const headliner = day.culturalEvening?.pssHeadliner;
    return {
      id: `ev-${day.id}`,
      dayId: day.id,
      day: day.dayName,
      date: day.date,
      isoDate: day.isoDate,
      theme: day.culturalEvening?.title || day.theme,
      description: day.culturalEvening?.description || "",
      startTime: times[0] || "06:30 PM",
      endTime: times[1] || "10:30 PM",
      maxResidentSlots: day.culturalEvening?.residentSlotsAvailable || 8,
      hasPssFlagship: Boolean(headliner),
      pssEventTitle: headliner?.title || "",
      pssEventTime: headliner?.time || "",
      pssDuration: headliner?.duration || "",
      pssGenre: headliner?.genre || "PBEL Sanskritik Samiti Flagship Show",
      acts: day.culturalEvening?.acts || [],
      actsText: (day.culturalEvening?.acts || []).join("\n"),
    };
  });
};

const initialEveningsConfig = mapScheduleToEveningsConfig(DEFAULT_PUJO_SCHEDULE);

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "contributions" | "pss_members" | "categories" | "schedule" | "volunteers" | "anandamela" | "sponsors" | "budget" | "committee" | "towers" | "branding" | "gallery" | "users"
  >("overview");
  const [membersSubView, setMembersSubView] = useState<"roster" | "kitchen">("roster");
  const [scheduleSubView, setScheduleSubView] = useState<"schedule" | "pratibimb">("schedule");

  // Authentication & Session State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(defaultAdminUsers);

  // New User Form State
  const [newUser, setNewUser] = useState({
    name: "",
    username: "",
    role: "Finance & Fund Verification" as AdminUser["role"],
    password: "",
  });
  const [isAddingUser, setIsAddingUser] = useState(false);

  // Live Data States
  const [contributions, setContributions] = useState<any[]>([]);
  const [categoriesList, setCategoriesList] = useState<any[]>([]);
  // Contribution Filters & Admin Receipt Modal State
  const [contributionSevaFilter, setContributionSevaFilter] = useState<string>("all");
  const [contributionStatusFilter, setContributionStatusFilter] = useState<string>("all");
  const [contributionSearch, setContributionSearch] = useState<string>("");
  const [selectedReceiptContribution, setSelectedReceiptContribution] = useState<any | null>(null);
  const [editingContribution, setEditingContribution] = useState<any | null>(null);
  const [isUpdatingContribution, setIsUpdatingContribution] = useState<boolean>(false);
  const [showSponsorCopyModal, setShowSponsorCopyModal] = useState<boolean>(false);
  const [sponsorCopyCategory, setSponsorCopyCategory] = useState<string>("all");
  const [sponsorCopied, setSponsorCopied] = useState<boolean>(false);
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [performances, setPerformances] = useState<any[]>([]);
  const [scheduleDays, setScheduleDays] = useState<DaySchedule[]>(getStoredSchedule());
  const [selectedNirghantoDayId, setSelectedNirghantoDayId] = useState<string>("sashti");
  const [heroChips, setHeroChips] = useState<HeroHighlightChip[]>(getStoredHeroChips());
  const [isSavingHeroChips, setIsSavingHeroChips] = useState(false);
  const [includeMemberContributions, setIncludeMemberContributions] = useState<boolean>(true);
  const [isUpdatingMemberToggle, setIsUpdatingMemberToggle] = useState<boolean>(false);
  const [eveningsConfig, setEveningsConfig] = useState<any[]>(initialEveningsConfig);
  const [sponsorsList, setSponsorsList] = useState<any[]>([]);
  const [galleryList, setGalleryList] = useState<any[]>([
    { id: "1", title: "Maa Durga Pratima Darshan", year: "2025", category: "Traditional Ekchala Idol", emoji: "🌺" },
    { id: "2", title: "Sandhi Pujo 108 Deepam & Dhaak", year: "2025", category: "Maha Ashtami Aarti", emoji: "🪔" },
    { id: "3", title: "Pratibimb Cultural Stage Gala", year: "2025", category: "Dance & Drama Natok", emoji: "🎭" },
    { id: "4", title: "Sindoor Khela & Dhunuchi Naach", year: "2025", category: "Vijaya Dashami Farewell", emoji: "🔴" },
    { id: "5", title: "Anandamela Food Fiesta", year: "2024", category: "Home Chef Delicacies", emoji: "🍲" },
    { id: "6", title: "Maha Bhog Community Feast", year: "2024", category: "1,500+ Resident Seva", emoji: "🍚" },
  ]);
  const [galleryVideos, setGalleryVideos] = useState<GalleryVideo[]>(getStoredGalleryVideos());
  const [newVideo, setNewVideo] = useState({
    title: "",
    youtubeUrl: "",
    category: "Pratibimb Stage",
    year: "2025",
    description: "",
  });
  const [loading, setLoading] = useState(true);

  // Form State: Add / Edit Seva Category
  const [newCategory, setNewCategory] = useState({ 
    id: "", 
    name: "", 
    fixed_amount: 1001, 
    description: "", 
    max_limit: 5, 
    is_active: true,
    is_featured: false,
    pujo_day: "",
    pujo_date: "",
  });
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [isSubmittingCategory, setIsSubmittingCategory] = useState(false);

  // Form State: Add / Edit Schedule Ritual Event
  const [newEvent, setNewEvent] = useState({ id: "", title: "", event_type: "Nirghanto", date: "2026-10-16", time: "08:30 AM", description: "" });
  const [isEditingEvent, setIsEditingEvent] = useState(false);
  const [isSubmittingEvent, setIsSubmittingEvent] = useState(false);

  // Form State: Edit Evening Config
  const [editingEvening, setEditingEvening] = useState<any | null>(null);

  // Form State: Sponsor
  const [newSponsor, setNewSponsor] = useState({ name: "", tier: "Gold", logo_url: "" });
  const [isSubmittingSponsor, setIsSubmittingSponsor] = useState(false);
  const [sponsorLeads, setSponsorLeads] = useState<any[]>([]);

  // Sponsorship Tier Packages CMS State
  const [sponsorshipTiers, setSponsorshipTiers] = useState<SponsorshipTier[]>(getStoredSponsorshipTiers());
  const [sponsorsSubView, setSponsorsSubView] = useState<"tiers" | "confirmed" | "leads">("tiers");
  const [tierForm, setTierForm] = useState<{
    id: string;
    title: string;
    amount: string;
    tag: string;
    isHighlight: boolean;
    deliverablesText: string;
  }>({
    id: "",
    title: "",
    amount: "₹50,000",
    tag: "High Visibility",
    isHighlight: false,
    deliverablesText: "Stage Side Panels & Pandal Entry Branding\nDedicated Food / Promotional Stall Space\nDaily Emcee Verbal Brand Mention\nLogo on Official Website & Carousel\nHalf Page Color Ad in Pujo Souvenir Brochure",
  });
  const [isEditingTier, setIsEditingTier] = useState(false);
  const [isSubmittingTier, setIsSubmittingTier] = useState(false);

  const [bhogPasses, setBhogPasses] = useState<any[]>([]);
  const [anandamelaStalls, setAnandamelaStalls] = useState<any[]>([]);

  // PSS Members Roster State - Initialized empty until Admin uploads CSV or adds members
  const [pssMembers, setPssMembers] = useState<any[]>([]);
  const [csvText, setCsvText] = useState("");
  const [memberSearchQuery, setMemberSearchQuery] = useState("");
  const [newMemberForm, setNewMemberForm] = useState({
    name: "",
    tower: PBEL_TOWER_NAMES[0] || "Tower A (Emerald)",
    flatNumber: "",
    phone: "",
    headcount: 4,
    status: "Active",
  });
  const [editingMember, setEditingMember] = useState<any | null>(null);
  const [adminPassModal, setAdminPassModal] = useState<any | null>(null);

  // Self-Service Branding, Logo & Wallpaper State
  const [branding, setBranding] = useState<SamitiBrandingConfig>(DEFAULT_BRANDING);
  const [isUploadingPdf, setIsUploadingPdf] = useState(false);
  const [pdfUploadSuccess, setPdfUploadSuccess] = useState(false);

  // Committee Budget & Expenses State
  const [budgetExpenses, setBudgetExpenses] = useState<any[]>([
    { id: "exp-1", category: "Pratima & Purohit", title: "Ekchala Pratima & Purohit Dakshina", planned: 150000, actual: 145000, paidTo: "Kumartuli Artisan & Head Purohit", status: "Partially Paid" },
    { id: "exp-2", category: "Pandal & Lighting", title: "Pandal Structure, Chandernagore Lights & Arch", planned: 250000, actual: 240000, paidTo: "Royal Pandal Infrastructure", status: "Advance Paid" },
    { id: "exp-3", category: "Dhaaki & Traditional Samagri", title: "Kolkata Dhaaki Troupe (4 Artists) & 108 Lotuses", planned: 60000, actual: 55000, paidTo: "Bikash Dhaaki & Samagri Suppliers", status: "Confirmed" },
    { id: "exp-4", category: "Maha Bhog & Kitchen", title: "Groceries (Basmati, Gobindobhog, Ghee, Spices, Sal Leaf)", planned: 180000, actual: 175000, paidTo: "Wholesale Grocery Distributors", status: "Procured" },
    { id: "exp-5", category: "Sound & Cultural Stage", title: "LED Wall, Line-Array Acoustics & Green Rooms", planned: 120000, actual: 110000, paidTo: "Sonic Stage Productions", status: "Advance Paid" },
    { id: "exp-6", category: "Sanitation & Green Pujo", title: "Waste Management, Sal Plate Disposal & Cleaners", planned: 30000, actual: 25000, paidTo: "CleanCity Environmental Ops", status: "Allocated" },
  ]);
  const [newExpense, setNewExpense] = useState<{
    category: string;
    title: string;
    planned: number;
    actual: number;
    paidTo: string;
    status: string;
    bill_url?: string;
    bill_name?: string;
  }>({
    category: "Pratima & Purohit",
    title: "",
    planned: 50000,
    actual: 50000,
    paidTo: "",
    status: "Allocated",
    bill_url: "",
    bill_name: "",
  });
  const [editingExpense, setEditingExpense] = useState<any | null>(null);
  const [viewingBillExpense, setViewingBillExpense] = useState<any | null>(null);

  // Pop-up Highlight CMS State
  const [popupHighlight, setPopupHighlight] = useState<SitePopupHighlight>(DEFAULT_POPUP_HIGHLIGHT);
  const [isPreviewingPopup, setIsPreviewingPopup] = useState(false);

  // Organizing Committee CMS State
  const [committeeWings, setCommitteeWings] = useState<CommitteeWing[]>(DEFAULT_COMMITTEE_WINGS);
  const [editingWing, setEditingWing] = useState<CommitteeWing | null>(null);
  const [editingWingLead, setEditingWingLead] = useState<{ wingId: string; member: CommitteeMember } | null>(null);
  const [newWingForm, setNewWingForm] = useState({ category: "", icon: "🌺", tagline: "" });
  const [newWingMember, setNewWingMember] = useState({ name: "", role: "", tower: "PBEL Sanskritik Samiti", phone: "" });

  // Custom Towers CMS State
  const [towerList, setTowerList] = useState<TowerDefinition[]>(PBEL_TOWERS);
  const [editingTower, setEditingTower] = useState<TowerDefinition | null>(null);
  const [newTowerForm, setNewTowerForm] = useState({ id: "", tower: "", name: "", fullName: "" });

  // Gallery Edit State
  const [editingPhoto, setEditingPhoto] = useState<any | null>(null);

  // Emcee Run-Sheet Modal State
  const [isEmceeModalOpen, setIsEmceeModalOpen] = useState(false);
  const [emceeFilterDay, setEmceeFilterDay] = useState("all");

  // Volunteer WhatsApp Dispatcher State
  const [volunteerDispatchShift, setVolunteerDispatchShift] = useState<string | null>(null);

  // Live Announcement State
  const [announcementText, setAnnouncementText] = useState(
    "PBEL City Durgotsav 2026 • 15th to 20th October (Panchami to Dashami)"
  );

  // Form State: Gallery
  const [newPhoto, setNewPhoto] = useState({ title: "", year: "2025", category: "Pujo Rituals", emoji: "🌺", image_url: "" });

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Contributions
      const { data: contribs } = await supabase
        .from("contributions")
        .select("*, contribution_categories(name)")
        .order("created_at", { ascending: false });
      if (contribs) setContributions(contribs);

      // 2. Fetch Categories
      const { data: cats } = await supabase
        .from("contribution_categories")
        .select("*")
        .order("created_at", { ascending: true });
      if (cats && cats.length > 0) setCategoriesList(cats);

      // 3. Fetch Volunteers
      const { data: vols } = await supabase
        .from("volunteer_registrations")
        .select("*, volunteer_slots(slot_date, volunteer_categories(name))")
        .order("created_at", { ascending: false });
      if (vols) setVolunteers(vols);

      // 4. Fetch Pratibimb Submissions
      const { data: perfs } = await supabase
        .from("cultural_performances")
        .select("*, cultural_evenings(evening_date)")
        .order("created_at", { ascending: false });
      if (perfs) setPerformances(perfs);

      // 5. Fetch Full 6-Day Schedule from Cloud
      const cloudSched = await fetchStoredSchedule();
      if (cloudSched && cloudSched.length > 0) {
        setScheduleDays(cloudSched);
        setEveningsConfig(mapScheduleToEveningsConfig(cloudSched));
      }

      // 5b. Fetch Hero Highlight Chips from Cloud
      const cloudChips = await fetchStoredHeroChips();
      if (cloudChips && cloudChips.length > 0) {
        setHeroChips(cloudChips);
      }

      // 5c. Fetch Member Contribution Public Toggle from Cloud
      const incMem = await fetchCloudConfig<boolean>("include_member_contributions", true);
      setIncludeMemberContributions(incMem !== false);

      // 5d. Fetch Sponsorship Tier Packages from Cloud
      const cloudTiers = await fetchStoredSponsorshipTiers();
      if (cloudTiers && cloudTiers.length > 0) {
        setSponsorshipTiers(cloudTiers);
      }

      // 6. Fetch Sponsors
      const { data: sps } = await supabase
        .from("sponsors")
        .select("*")
        .order("created_at", { ascending: false });
      if (sps) setSponsorsList(sps);

    } catch (err) {
      console.error("Error fetching admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  // 1. Session & Auth Loading
  useEffect(() => {
    try {
      const savedUsers = localStorage.getItem("pbel_admin_users");
      if (savedUsers) {
        setAdminUsers(JSON.parse(savedUsers));
      }
      const savedSession = localStorage.getItem("pbel_admin_session") || sessionStorage.getItem("pbel_admin_session");
      if (savedSession) {
        const parsed = JSON.parse(savedSession);
        setIsAuthenticated(true);
        setCurrentUser(parsed);
      }
      const savedAnnounce = localStorage.getItem("pbel_pujo_announcement");
      if (savedAnnounce) setAnnouncementText(savedAnnounce);

      const savedLeads = localStorage.getItem("pbel_sponsor_leads");
      if (savedLeads) setSponsorLeads(JSON.parse(savedLeads));

      const savedPasses = localStorage.getItem("pbel_bhog_passes");
      if (savedPasses) setBhogPasses(JSON.parse(savedPasses));

      const savedMembers = localStorage.getItem("pbel_pss_members");
      if (savedMembers) {
        const parsed = JSON.parse(savedMembers);
        if (Array.isArray(parsed) && parsed.length > 0) setPssMembers(parsed);
      }

      const savedIncMem = localStorage.getItem("pbel_include_member_contributions");
      if (savedIncMem !== null) {
        setIncludeMemberContributions(JSON.parse(savedIncMem) !== false);
      }
      fetchCloudConfig<boolean>("include_member_contributions", true).then((inc) => {
        setIncludeMemberContributions(inc !== false);
      });

      setBranding(getStoredBranding());
      fetchStoredBranding().then((cloudBranding) => {
        if (cloudBranding) {
          setBranding(cloudBranding);
          saveStoredBranding(cloudBranding);
        }
      });

      setCommitteeWings(getStoredCommittee());
      fetchStoredCommittee().then((cloudCommittee) => {
        if (cloudCommittee && Array.isArray(cloudCommittee) && cloudCommittee.length > 0) {
          setCommitteeWings(cloudCommittee);
          saveStoredCommittee(cloudCommittee);
        }
      });

      setTowerList(getStoredTowers());
      fetchStoredTowers().then((cloudTowers) => {
        if (cloudTowers && Array.isArray(cloudTowers) && cloudTowers.length > 0) {
          setTowerList(cloudTowers);
          saveStoredTowers(cloudTowers);
        }
      });
      const localSched = getStoredSchedule();
      setScheduleDays(localSched);
      setEveningsConfig(mapScheduleToEveningsConfig(localSched));

      fetchStoredSchedule().then((cloudSched) => {
        if (cloudSched && cloudSched.length > 0) {
          setScheduleDays(cloudSched);
          setEveningsConfig(mapScheduleToEveningsConfig(cloudSched));
        }
      });

      setHeroChips(getStoredHeroChips());
      fetchStoredHeroChips().then((cloudChips) => {
        if (cloudChips && cloudChips.length > 0) {
          setHeroChips(cloudChips);
        }
      });

      setSponsorshipTiers(getStoredSponsorshipTiers());
      fetchStoredSponsorshipTiers().then((cloudTiers) => {
        if (cloudTiers && cloudTiers.length > 0) {
          setSponsorshipTiers(cloudTiers);
        }
      });

      const savedExpenses = localStorage.getItem("pbel_budget_expenses");
      if (savedExpenses) {
        const parsed = JSON.parse(savedExpenses);
        if (Array.isArray(parsed) && parsed.length > 0) setBudgetExpenses(parsed);
      }

      // Fetch all dynamic collections from Supabase Cloud
      fetchCloudConfig<string>("announcement", "").then((cloudAnnounce) => {
        if (cloudAnnounce) {
          setAnnouncementText(cloudAnnounce);
          localStorage.setItem("pbel_pujo_announcement", cloudAnnounce);
        }
      });
      fetchCloudConfig<any[]>("sponsor_leads", []).then((cloudLeads) => {
        if (cloudLeads && cloudLeads.length > 0) {
          setSponsorLeads(cloudLeads);
          localStorage.setItem("pbel_sponsor_leads", JSON.stringify(cloudLeads));
        }
      });
      fetchCloudConfig<any[]>("bhog_passes", []).then((cloudPasses) => {
        if (cloudPasses && cloudPasses.length > 0) {
          setBhogPasses(cloudPasses);
          localStorage.setItem("pbel_bhog_passes", JSON.stringify(cloudPasses));
        }
      });
      fetchCloudConfig<any[]>("pss_members", []).then((cloudMembers) => {
        if (cloudMembers && cloudMembers.length > 0) {
          setPssMembers(cloudMembers);
          localStorage.setItem("pbel_pss_members", JSON.stringify(cloudMembers));
        }
      });
      fetchCloudConfig<any[]>("budget_expenses", []).then((cloudExpenses) => {
        if (cloudExpenses && cloudExpenses.length > 0) {
          setBudgetExpenses(cloudExpenses);
          localStorage.setItem("pbel_budget_expenses", JSON.stringify(cloudExpenses));
        }
      });
      fetchCloudConfig<any[]>("gallery", []).then((cloudGallery) => {
        if (cloudGallery && cloudGallery.length > 0) {
          setGalleryList(cloudGallery);
          localStorage.setItem("pbel_custom_gallery", JSON.stringify(cloudGallery));
        }
      });
      fetchStoredGalleryVideos().then((cloudVideos) => {
        if (cloudVideos && Array.isArray(cloudVideos) && cloudVideos.length > 0) {
          setGalleryVideos(cloudVideos);
        }
      });
      fetchCloudConfig<any[]>("anandamela_stalls", []).then((cloudStalls) => {
        if (cloudStalls && cloudStalls.length > 0) {
          setAnandamelaStalls(cloudStalls);
        }
      });
      fetchCloudConfig<AdminUser[]>("admin_users", []).then((cloudUsers) => {
        if (cloudUsers && cloudUsers.length > 0) {
          setAdminUsers(cloudUsers);
          localStorage.setItem("pbel_admin_users", JSON.stringify(cloudUsers));
        }
      });
      fetchCloudConfig<SitePopupHighlight>("site_popup_highlight", DEFAULT_POPUP_HIGHLIGHT).then((cloudPopup) => {
        if (cloudPopup && typeof cloudPopup.enabled === "boolean") {
          setPopupHighlight(cloudPopup);
          localStorage.setItem("pbel_site_popup_highlight", JSON.stringify(cloudPopup));
        }
      });
    } catch (e) {
      console.error("Failed loading session:", e);
    }
  }, []);

  const [isSyncingCloud, setIsSyncingCloud] = useState(false);

  const handleSyncAllToCloud = async () => {
    setIsSyncingCloud(true);
    try {
      const currentTowers = getStoredTowers().map((t) => ({
        id: t.id,
        tower: t.tower,
        name: t.name,
        fullName: t.fullName || `${t.tower} (${t.name})`,
        regex: typeof t.regex === "string" ? t.regex : (t.regex?.source || ""),
      }));
      const currentCommittee = committeeWings && committeeWings.length > 0 ? committeeWings : getStoredCommittee();
      const currentBranding = branding && branding.samitiName ? branding : getStoredBranding();
      const currentSchedule = scheduleDays && scheduleDays.length > 0 ? scheduleDays : getStoredSchedule();

      saveStoredCommittee(currentCommittee);
      saveStoredBranding(currentBranding);

      await Promise.all([
        saveCloudConfig("towers", currentTowers),
        saveCloudConfig("committee", currentCommittee),
        saveCloudConfig("branding", currentBranding),
        saveCloudConfig("schedule_days", currentSchedule),
        saveCloudConfig("announcement", announcementText.trim()),
        saveCloudConfig("sponsor_leads", sponsorLeads),
        saveCloudConfig("bhog_passes", bhogPasses),
        saveCloudConfig("pss_members", pssMembers),
        saveCloudConfig("budget_expenses", budgetExpenses),
        saveCloudConfig("gallery", galleryList),
        saveCloudConfig("gallery_videos", galleryVideos),
        saveCloudConfig("site_popup_highlight", popupHighlight),
      ]);

      alert("🎉 Successfully synced ALL portal settings, Towers, Committee Wings, Member Passes, Budget, Schedule, and Announcements to Supabase Cloud!\n\nAll data is now live immediately across every mobile device and browser.");
    } catch (err: any) {
      console.error("Cloud sync error:", err);
      alert(`Cloud sync failed: ${err.message || err}`);
    } finally {
      setIsSyncingCloud(false);
    }
  };

  const handleSaveAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    const text = announcementText.trim();
    localStorage.setItem("pbel_pujo_announcement", text);
    saveCloudConfig("announcement", text);
    alert("Live announcement updated and broadcast to all devices across the platform header!");
  };

  const handleClearSponsorLead = (index: number) => {
    const updated = sponsorLeads.filter((_, idx) => idx !== index);
    setSponsorLeads(updated);
    localStorage.setItem("pbel_sponsor_leads", JSON.stringify(updated));
    saveCloudConfig("sponsor_leads", updated);
  };

  const handleClearBhogPass = (passId: string) => {
    const updated = bhogPasses.filter((p) => p.passId !== passId);
    setBhogPasses(updated);
    localStorage.setItem("pbel_bhog_passes", JSON.stringify(updated));
    saveCloudConfig("bhog_passes", updated);
  };

  // Branding & Local Asset Handlers
  const handleSaveBranding = (updated: SamitiBrandingConfig) => {
    setBranding(updated);
    saveStoredBranding(updated);
    alert("Branding, Logos & Hero Wallpaper updated live across the portal!");
  };

  // Local File Upload for Hero Wallpaper from Computer
  const handleUploadWallpaperFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const updated = {
        ...branding,
        customWallpaperUrl: dataUrl,
      };
      setBranding(updated);
      saveStoredBranding(updated);
      alert("Custom Maa Durga Wallpaper uploaded & activated across the portal!");
    };
    if (file.size > 2 * 1024 * 1024) {
      alert("File size must be under 2MB. Please compress or resize the image before uploading.");
      return;
    }
    reader.readAsDataURL(file);
  };

  // Local File Upload for PSS Logo from Computer
  const handleUploadPssLogoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const updated = {
        ...branding,
        pssLogoUrl: dataUrl,
      };
      setBranding(updated);
      saveStoredBranding(updated);
      alert("PBEL Sanskritik Samiti Logo uploaded & updated across Header & Hero!");
    };
    if (file.size > 2 * 1024 * 1024) {
      alert("File size must be under 2MB. Please compress or resize the image before uploading.");
      return;
    }
    reader.readAsDataURL(file);
  };

  // Local File Upload for Festival Logo from Computer
  const handleUploadDurgotsavLogoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const updated = {
        ...branding,
        durgotsavLogoUrl: dataUrl,
      };
      setBranding(updated);
      saveStoredBranding(updated);
      alert("PBEL Durgotsav Festival Logo uploaded & updated!");
    };
    if (file.size > 2 * 1024 * 1024) {
      alert("File size must be under 2MB. Please compress or resize the image before uploading.");
      return;
    }
    reader.readAsDataURL(file);
  };

  // Local File Upload for President / Signatory Signature
  const handleUploadPresidentSignatureFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const updated = {
        ...branding,
        presidentSignatureUrl: dataUrl,
      };
      setBranding(updated);
      saveStoredBranding(updated);
      alert("President / Signatory Signature uploaded & updated on all Official Receipts!");
    };
    if (file.size > 2 * 1024 * 1024) {
      alert("File size must be under 2MB. Please compress or resize the image before uploading.");
      return;
    }
    reader.readAsDataURL(file);
  };

  const handleUploadPdfFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 35 * 1024 * 1024) {
      alert("File size exceeds 35MB. Please upload a PDF under 35MB or provide an external URL.");
      return;
    }

    setIsUploadingPdf(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const updated = {
        ...branding,
        sponsorshipDeckPdfUrl: dataUrl,
        sponsorshipDeckFileName: file.name,
      };
      setBranding(updated);
      saveStoredBranding(updated);
      setIsUploadingPdf(false);
      setPdfUploadSuccess(true);
      setTimeout(() => setPdfUploadSuccess(false), 3000);
      alert(`Sponsorship Deck "${file.name}" uploaded successfully! Available instantly for sponsors to download.`);
    };
    reader.readAsDataURL(file);
  };

  // Budget & Ledger Handlers
  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpense.title.trim()) {
      alert("Please enter Expense Title.");
      return;
    }
    const item = {
      id: `exp-${Date.now()}`,
      category: newExpense.category,
      title: sanitizeText(newExpense.title),
      planned: Number(newExpense.planned) || 0,
      actual: Number(newExpense.actual) || 0,
      paidTo: sanitizeText(newExpense.paidTo) || "Vendor",
      status: newExpense.status,
      bill_url: newExpense.bill_url || "",
      bill_name: newExpense.bill_name || "",
    };
    const updated = [item, ...budgetExpenses];
    setBudgetExpenses(updated);
    localStorage.setItem("pbel_budget_expenses", JSON.stringify(updated));
    saveCloudConfig("budget_expenses", updated);
    setNewExpense({
      category: "Pratima & Purohit",
      title: "",
      planned: 50000,
      actual: 50000,
      paidTo: "",
      status: "Allocated",
      bill_url: "",
      bill_name: "",
    });
    alert("Expense recorded in Committee Budget Ledger and synced to Cloud!");
  };

  const handleSaveEditedExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExpense) return;
    const updated = budgetExpenses.map((exp) =>
      exp.id === editingExpense.id
        ? {
            ...exp,
            title: sanitizeText(editingExpense.title),
            category: editingExpense.category,
            planned: Number(editingExpense.planned) || 0,
            actual: Number(editingExpense.actual) || 0,
            paidTo: sanitizeText(editingExpense.paidTo) || "Vendor",
            status: editingExpense.status,
            bill_url: editingExpense.bill_url || "",
            bill_name: editingExpense.bill_name || "",
          }
        : exp
    );
    setBudgetExpenses(updated);
    localStorage.setItem("pbel_budget_expenses", JSON.stringify(updated));
    saveCloudConfig("budget_expenses", updated);
    setEditingExpense(null);
    alert("Expense updated and synced to Cloud successfully!");
  };

  // Pop-up Announcement CMS Save Handler
  const handleSavePopupHighlight = (updatedHighlight: SitePopupHighlight) => {
    setPopupHighlight(updatedHighlight);
    localStorage.setItem("pbel_site_popup_highlight", JSON.stringify(updatedHighlight));
    saveCloudConfig("site_popup_highlight", updatedHighlight);
    window.dispatchEvent(new Event("pbel_popup_highlight_updated"));
    alert("📢 Site Pop-up Highlight updated and synced to Cloud successfully!");
  };

  const handleDeleteExpense = (id: string) => {
    const updated = budgetExpenses.filter((e) => e.id !== id);
    setBudgetExpenses(updated);
    localStorage.setItem("pbel_budget_expenses", JSON.stringify(updated));
    saveCloudConfig("budget_expenses", updated);
  };

  // Organizing Committee Handlers
  const handleSaveCommittee = (wings: CommitteeWing[]) => {
    setCommitteeWings(wings);
    saveStoredCommittee(wings);
    alert("Organizing Committee structure & wings updated live across the portal!");
  };

  const handleAddWing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWingForm.category.trim()) {
      alert("Please provide Wing Category Title.");
      return;
    }
    const newWing: CommitteeWing = {
      id: `wing-${Date.now()}`,
      category: sanitizeText(newWingForm.category),
      icon: newWingForm.icon || "🌺",
      tagline: sanitizeText(newWingForm.tagline) || "Festival execution wing",
      members: [],
    };
    const updated = [...committeeWings, newWing];
    handleSaveCommittee(updated);
    setNewWingForm({ category: "", icon: "🌺", tagline: "" });
  };

  const handleDeleteWing = (wingId: string) => {
    if (!confirm("Are you sure you want to remove this committee wing?")) return;
    const updated = committeeWings.filter((w) => w.id !== wingId);
    handleSaveCommittee(updated);
  };

  const handleAddMemberToWing = (wingId: string) => {
    if (!newWingMember.name.trim() || !newWingMember.role.trim()) {
      alert("Please provide Member Name and Role.");
      return;
    }
    const member: CommitteeMember = {
      id: `m-${Date.now()}`,
      name: sanitizeText(newWingMember.name),
      role: sanitizeText(newWingMember.role),
      tower: sanitizeText(newWingMember.tower) || "PBEL Sanskritik Samiti",
      phone: sanitizeText(newWingMember.phone),
    };
    const updated = committeeWings.map((w) =>
      w.id === wingId ? { ...w, members: [...w.members, member] } : w
    );
    handleSaveCommittee(updated);
    setNewWingMember({ name: "", role: "", tower: "PBEL Sanskritik Samiti", phone: "" });
  };

  const handleDeleteMemberFromWing = (wingId: string, memberId: string) => {
    const updated = committeeWings.map((w) =>
      w.id === wingId
        ? { ...w, members: w.members.filter((m) => m.id !== memberId) }
        : w
    );
    handleSaveCommittee(updated);
  };

  // Towers CMS Handlers
  const handleSaveTowers = (towers: TowerDefinition[]) => {
    setTowerList(towers);
    saveStoredTowers(towers);
    alert("PBEL Towers updated live across registration & participation forms!");
  };

  const handleAddTower = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTowerForm.id.trim() || !newTowerForm.tower.trim() || !newTowerForm.name.trim()) {
      alert("Please provide Tower Code (e.g. L), Tower Name (e.g. Tower L), and Wing (e.g. Amber).");
      return;
    }
    const id = newTowerForm.id.toUpperCase().trim();
    const fullName = `${newTowerForm.tower.trim()} (${newTowerForm.name.trim()})`;
    const regex = new RegExp(`tower\\s*${id}|${newTowerForm.name.trim()}|\\b${id}[\\s-]*\\d`, "i");
    const tower: TowerDefinition = {
      id,
      tower: newTowerForm.tower.trim(),
      name: newTowerForm.name.trim(),
      fullName,
      regex,
    };
    const updated = [...towerList, tower];
    handleSaveTowers(updated);
    setNewTowerForm({ id: "", tower: "", name: "", fullName: "" });
  };

  const handleDeleteTower = (towerId: string) => {
    if (!confirm(`Are you sure you want to remove Tower ${towerId}?`)) return;
    const updated = towerList.filter((t) => t.id !== towerId);
    handleSaveTowers(updated);
  };

  // WhatsApp Volunteer Dispatcher Handler
  const handleCopyWhatsAppRoster = (deptName: string, shiftDate: string) => {
    const deptVols = volunteers.filter((v) => {
      const cat = v.volunteer_slots?.volunteer_categories?.name || "";
      return cat.toLowerCase().includes(deptName.toLowerCase()) || !deptName;
    });

    const lines = [
      `🌺 *PBEL CITY DURGOTSAV 2026 - VOLUNTEER SEVA ROSTER* 🌺`,
      `📍 *Department:* ${deptName || "All Departments"}`,
      `📅 *Shift / Date:* ${shiftDate || "All Pujo Days"}`,
      `─────────────────────────`,
      deptVols.length > 0
        ? deptVols
            .map(
              (v, idx) =>
                `${idx + 1}. *${v.full_name || v.volunteer_name || "Sevak"}* (${v.flat_number || "PBEL"}) - 📱 ${v.phone}`
            )
            .join("\n")
        : "No volunteers registered yet for this slot.",
      `─────────────────────────`,
      `🙏 _Thank you for your dedicated community seva! Subho Sharodotsav!_`,
    ].join("\n");

    navigator.clipboard.writeText(lines);
    alert(`Copied ${deptName || "Volunteer"} WhatsApp Roster to clipboard! Ready to paste into WhatsApp group.`);
  };

  // MEMBER CONTRIBUTION PUBLIC VISIBILITY TOGGLE HANDLER
  const handleToggleMemberContributions = async () => {
    setIsUpdatingMemberToggle(true);
    const nextVal = !includeMemberContributions;
    setIncludeMemberContributions(nextVal);
    try {
      await saveCloudConfig("include_member_contributions", nextVal);
      if (typeof window !== "undefined") {
        localStorage.setItem("pbel_include_member_contributions", JSON.stringify(nextVal));
        window.dispatchEvent(new Event("pbel_member_toggle_updated"));
      }
      alert(
        nextVal
          ? `✓ Member Subscriptions (₹${(pssMembers.length * 7500).toLocaleString("en-IN")} from ${pssMembers.length} families) are now INCLUDED in the overall public collection counter, tower totals, and displayed on the Devotee Wall of Honor / Donation page with offering 'Member Contribution'.`
          : `✓ Member Subscriptions are now EXCLUDED from the public collection counter and Wall of Honor. Only direct online e-Seva donations are displayed and counted.`
      );
    } catch (err) {
      console.error("Error updating member contribution toggle:", err);
      alert("Failed to update toggle. Please check your connection.");
    } finally {
      setIsUpdatingMemberToggle(false);
    }
  };

  // PSS Members Handlers
  const handleBulkImportCsv = () => {
    if (!csvText.trim()) {
      alert("Please paste comma-separated member rows or choose a CSV file.");
      return;
    }

    const lines = csvText.split(/\r?\n/).map((l) => l.trim()).filter((l) => l.length > 0);
    const parsedNewMembers: any[] = [];

    lines.forEach((line, idx) => {
      // Skip header line if present
      if (idx === 0 && (line.toLowerCase().includes("name") || line.toLowerCase().includes("flat"))) {
        return;
      }

      // Split by comma, tab, or semicolon
      const parts = line.split(/[,;\t]/).map((p) => p.trim());
      if (parts.length >= 2) {
        const name = parts[0];
        const flatNumber = parts[1];
        const phone = parts[2] || "9845000000";
        const rawHeadcount = parts[3] ? Number(parts[3]) : 4;
        const headcount = Math.min(Math.max(isNaN(rawHeadcount) ? 4 : rawHeadcount, 1), 6);

        // Auto-detect tower from flat using centralized config
        const matched = matchTower(flatNumber) || matchTower(line);
        const matchedTower = matched ? matched.fullName : (PBEL_TOWER_NAMES[2] || "Tower C (Coral)");

        parsedNewMembers.push({
          id: `M-${Date.now()}-${idx}`,
          name,
          tower: matchedTower,
          flatNumber,
          phone,
          headcount,
          status: "Active",
          joinedYear: "2026",
        });
      }
    });

    if (parsedNewMembers.length === 0) {
      alert("No valid rows could be parsed. Expected format: Name, Flat, Phone, Headcount");
      return;
    }

    const updated = [...parsedNewMembers, ...pssMembers];
    setPssMembers(updated);
    localStorage.setItem("pbel_pss_members", JSON.stringify(updated));
    saveCloudConfig("pss_members", updated);
    setCsvText("");
    alert(`Successfully imported ${parsedNewMembers.length} PSS Member families and synced to Cloud!`);
  };

  const handleAddSingleMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberForm.name.trim() || !newMemberForm.flatNumber.trim()) {
      alert("Please fill in Member Name and Flat Number.");
      return;
    }

    const newMember = {
      id: `M-${Date.now()}`,
      name: newMemberForm.name.trim(),
      tower: newMemberForm.tower,
      flatNumber: newMemberForm.flatNumber.trim(),
      phone: newMemberForm.phone.trim() || "9845000000",
      headcount: Math.min(Math.max(Number(newMemberForm.headcount) || 4, 1), 6),
      status: newMemberForm.status as any,
      joinedYear: "2026",
    };

    const updated = [newMember, ...pssMembers];
    setPssMembers(updated);
    localStorage.setItem("pbel_pss_members", JSON.stringify(updated));
    saveCloudConfig("pss_members", updated);
    setNewMemberForm({
      name: "",
      tower: PBEL_TOWER_NAMES[0] || "Tower A (Emerald)",
      flatNumber: "",
      phone: "",
      headcount: 4,
      status: "Active",
    });
    alert(`Added ${newMember.name} to PSS Annual Members roster and synced to Cloud!`);
  };

  const handleDeleteMember = (id: string) => {
    if (confirm("Are you sure you want to remove this member family from the roster?")) {
      const updated = pssMembers.filter((m) => m.id !== id);
      setPssMembers(updated);
      localStorage.setItem("pbel_pss_members", JSON.stringify(updated));
      saveCloudConfig("pss_members", updated);
    }
  };

  // MEMBER EDITING HANDLER
  const handleSaveEditedMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;
    const updated = pssMembers.map((m) =>
      m.id === editingMember.id ? { ...editingMember, headcount: Math.min(Math.max(Number(editingMember.headcount) || 4, 1), 6) } : m
    );
    setPssMembers(updated);
    localStorage.setItem("pbel_pss_members", JSON.stringify(updated));
    saveCloudConfig("pss_members", updated);
    setEditingMember(null);
    alert("Member details updated and synced to Cloud successfully!");
  };

  // COMMITTEE WING EDITING HANDLER
  const handleSaveEditedWing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingWing) return;
    const updated = committeeWings.map((w) =>
      w.id === editingWing.id ? { ...w, category: editingWing.category, icon: editingWing.icon, tagline: editingWing.tagline } : w
    );
    handleSaveCommittee(updated);
    setEditingWing(null);
    alert("Committee Wing updated successfully!");
  };

  // COMMITTEE WING LEAD EDITING HANDLER
  const handleSaveEditedWingLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingWingLead) return;
    const { wingId, member } = editingWingLead;
    const updated = committeeWings.map((w) =>
      w.id === wingId
        ? {
            ...w,
            members: w.members.map((m) => (m.id === member.id ? { ...member } : m)),
          }
        : w
    );
    handleSaveCommittee(updated);
    setEditingWingLead(null);
    alert("Wing Lead details updated successfully!");
  };

  // TOWER EDITING HANDLER
  const handleSaveEditedTower = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTower) return;
    const updated = towerList.map((t) =>
      t.id === editingTower.id ? { ...editingTower } : t
    );
    handleSaveTowers(updated);
    setEditingTower(null);
    alert("Tower details updated successfully!");
  };

  // GALLERY EDITING HANDLER
  const handleSaveEditedPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPhoto) return;
    const updated = galleryList.map((p) =>
      p.id === editingPhoto.id ? { ...editingPhoto } : p
    );
    setGalleryList(updated);
    localStorage.setItem("pbel_custom_gallery", JSON.stringify(updated));
    saveCloudConfig("gallery", updated);
    window.dispatchEvent(new Event("pbel_gallery_updated"));
    setEditingPhoto(null);
    alert("Gallery photo updated and synced to Cloud successfully!");
  };

  const handleGenerateMemberPass = (member: any, dayName: string = "All 4 Pujo Days") => {
    const cappedHeadcount = Math.min(Math.max(Number(member.headcount) || 4, 1), 6);
    const cleanFlat = member.flatNumber.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
    const towerLetter = member.tower.split(" ")[1] || "C";
    const passId = `PSS-BHOG-2026-T${towerLetter}-${cleanFlat}`;

    const pass = {
      passId,
      name: member.name,
      tower: member.tower,
      flatNumber: member.flatNumber,
      phone: member.phone || "PBEL Resident",
      passCount: cappedHeadcount,
      days: dayName === "All 4 Pujo Days" ? ["saptami", "ashtami", "nabami", "dashami"] : [dayName.toLowerCase().replace(/[^a-z]/g, "")],
      dayLabel: dayName,
      issuedAt: new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    // Save into local and cloud bhog passes registry
    const existing = JSON.parse(localStorage.getItem("pbel_bhog_passes") || "[]");
    const filtered = existing.filter((p: any) => p.passId !== passId);
    filtered.unshift(pass);
    localStorage.setItem("pbel_bhog_passes", JSON.stringify(filtered));
    saveCloudConfig("bhog_passes", filtered);
    setBhogPasses(filtered);

    setAdminPassModal(pass);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setIsLoggingIn(true);

    const enteredUser = loginForm.username.trim().toLowerCase();
    const enteredPass = loginForm.password.trim();

    // Check user from registered admin users list
    const matched = adminUsers.find(
      (u) =>
        (u.username.toLowerCase() === enteredUser || u.name.toLowerCase() === enteredUser) &&
        u.passwordHash === enteredPass
    );

    if (matched) {
      if (matched.status === "Suspended") {
        setLoginError("This user account has been suspended by the Committee.");
        setIsLoggingIn(false);
        return;
      }

      setIsAuthenticated(true);
      setCurrentUser(matched);
      if (rememberMe) {
        localStorage.setItem("pbel_admin_session", JSON.stringify(matched));
      } else {
        sessionStorage.setItem("pbel_admin_session", JSON.stringify(matched));
      }
      setLoginForm({ username: "", password: "" });
    } else if (
      enteredUser === "admin" &&
      enteredPass === "PBEL@2026"
    ) {
      const masterUser: AdminUser = {
        id: "usr-master",
        name: "Executive Committee (Master Admin)",
        username: "admin",
        role: "Super Admin",
        passwordHash: "PBEL@2026",
        status: "Active",
        created_at: "2026-08-01",
      };
      setIsAuthenticated(true);
      setCurrentUser(masterUser);
      if (rememberMe) {
        localStorage.setItem("pbel_admin_session", JSON.stringify(masterUser));
      } else {
        sessionStorage.setItem("pbel_admin_session", JSON.stringify(masterUser));
      }
      setLoginForm({ username: "", password: "" });
    } else {
      setLoginError("Invalid Username or Passcode. Please verify and try again.");
    }
    setIsLoggingIn(false);
  };

  const handleLogout = () => {
    if (confirm("Are you sure you want to log out of the Admin Control Center?")) {
      localStorage.removeItem("pbel_admin_session");
      sessionStorage.removeItem("pbel_admin_session");
      setIsAuthenticated(false);
      setCurrentUser(null);
    }
  };

  // USER MANAGEMENT HANDLERS
  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.username.trim() || !newUser.password.trim()) {
      alert("Username and Password/Passcode are required.");
      return;
    }

    if (adminUsers.some((u) => u.username.toLowerCase() === newUser.username.trim().toLowerCase())) {
      alert("A user with this username already exists.");
      return;
    }

    const created: AdminUser = {
      id: `usr-${Date.now()}`,
      name: newUser.name.trim() || newUser.username.trim(),
      username: newUser.username.trim(),
      role: newUser.role,
      passwordHash: newUser.password.trim(),
      status: "Active",
      created_at: new Date().toISOString().split("T")[0],
    };

    const updatedList = [...adminUsers, created];
    setAdminUsers(updatedList);
    localStorage.setItem("pbel_admin_users", JSON.stringify(updatedList));
    const cloudSyncList = updatedList.map(u => ({ ...u, passwordHash: "" }));
    saveCloudConfig("admin_users", cloudSyncList);
    setNewUser({ name: "", username: "", role: "Finance & Fund Verification", password: "" });
    alert(`Admin User "${created.name}" created and synced to Cloud!`);
  };

  const handleToggleUserStatus = (id: string) => {
    if (id === "usr-master") {
      alert("The Master Admin account cannot be suspended.");
      return;
    }
    const updated = adminUsers.map((u) => {
      if (u.id === id) {
        const nextStatus = u.status === "Active" ? "Suspended" : "Active";
        return { ...u, status: nextStatus as any };
      }
      return u;
    });
    setAdminUsers(updated);
    localStorage.setItem("pbel_admin_users", JSON.stringify(updated));
    const cloudSyncList = updated.map(u => ({ ...u, passwordHash: "" }));
    saveCloudConfig("admin_users", cloudSyncList);
  };

  const handleDeleteUser = (id: string) => {
    if (id === "usr-master") {
      alert("The Master Admin account cannot be deleted.");
      return;
    }
    if (!confirm("Are you sure you want to remove this user from the Admin roster?")) return;
    const updated = adminUsers.filter((u) => u.id !== id);
    setAdminUsers(updated);
    localStorage.setItem("pbel_admin_users", JSON.stringify(updated));
    const cloudSyncList = updated.map(u => ({ ...u, passwordHash: "" }));
    saveCloudConfig("admin_users", cloudSyncList);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handler to update contribution verification status
  const handleUpdateContributionStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("contributions")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;

      setContributions((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
      );
    } catch (err) {
      console.error("Error updating contribution status:", err);
      alert("Failed to update status.");
    }
  };

  // Handler to toggle Wall of Honor public visibility
  const handleToggleWallVisibility = async (c: any) => {
    const newVisibility = !c.is_name_visible;
    try {
      const { error } = await supabase
        .from("contributions")
        .update({ is_name_visible: newVisibility })
        .eq("id", c.id);

      if (error) throw error;

      setContributions((prev) =>
        prev.map((item) => (item.id === c.id ? { ...item, is_name_visible: newVisibility } : item))
      );
    } catch (err: any) {
      console.error("Error toggling Wall visibility:", err);
      alert(`Failed to update Wall visibility: ${err.message || err}`);
    }
  };

  // Handler to edit contributor details (fix typos in name, flat, or toggle visibility)
  const handleSaveContributorEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingContribution) return;
    setIsUpdatingContribution(true);
    try {
      const updatedName = editingContribution.contributor_name.trim();
      const updatedFlat = editingContribution.flat_number?.trim() || "";
      const updatedVisibility = Boolean(editingContribution.is_name_visible);

      const { error } = await supabase
        .from("contributions")
        .update({
          contributor_name: updatedName,
          flat_number: updatedFlat,
          is_name_visible: updatedVisibility,
        })
        .eq("id", editingContribution.id);

      if (error) throw error;

      setContributions((prev) =>
        prev.map((item) =>
          item.id === editingContribution.id
            ? {
                ...item,
                contributor_name: updatedName,
                flat_number: updatedFlat,
                is_name_visible: updatedVisibility,
              }
            : item
        )
      );
      alert("✓ Contributor name and Wall visibility updated successfully in database!");
      setEditingContribution(null);
    } catch (err: any) {
      console.error("Error updating contributor details:", err);
      alert(`Failed to update contributor: ${err.message || err}`);
    } finally {
      setIsUpdatingContribution(false);
    }
  };

// Category limit, status, featured, pujo day & exact date metadata helpers for reliable backwards compatibility
function encodeCategoryDescription(desc: string, maxLimit?: number, isActive?: boolean, isFeatured?: boolean, pujoDay?: string, pujoDate?: string) {
  const clean = (desc || '')
    .replace(/\[limit:\d+\]/g, '')
    .replace(/\[status:(active|inactive)\]/g, '')
    .replace(/\[featured:(true|false)\]/g, '')
    .replace(/\[day:[a-z0-9_-]+\]/g, '')
    .replace(/\[date:[^\]]+\]/g, '')
    .trim();
  const limitTag = maxLimit !== undefined && maxLimit !== null ? `[limit:${maxLimit}]` : '';
  const statusTag = isActive !== undefined ? `[status:${isActive ? 'active' : 'inactive'}]` : '';
  const featuredTag = isFeatured !== undefined ? `[featured:${isFeatured ? 'true' : 'false'}]` : '';
  const dayTag = pujoDay ? `[day:${pujoDay}]` : '';
  const dateTag = pujoDate ? `[date:${pujoDate.trim()}]` : '';
  return `${clean} ${limitTag} ${statusTag} ${featuredTag} ${dayTag} ${dateTag}`.trim();
}

function decodeCategoryDescription(desc?: string) {
  const str = desc || '';
  const limitMatch = str.match(/\[limit:(\d+)\]/);
  const statusMatch = str.match(/\[status:(active|inactive)\]/);
  const featuredMatch = str.match(/\[featured:(true|false)\]/);
  const dayMatch = str.match(/\[day:([a-z0-9_-]+)\]/);
  const dateMatch = str.match(/\[date:([^\]]+)\]/);

  const cleanDescription = str
    .replace(/\[limit:\d+\]/g, '')
    .replace(/\[status:(active|inactive)\]/g, '')
    .replace(/\[featured:(true|false)\]/g, '')
    .replace(/\[day:[a-z0-9_-]+\]/g, '')
    .replace(/\[date:[^\]]+\]/g, '')
    .trim();

  const parsedLimit = limitMatch ? Number(limitMatch[1]) : undefined;
  const parsedActive = statusMatch ? statusMatch[1] === 'active' : undefined;
  const parsedFeatured = featuredMatch ? featuredMatch[1] === 'true' : undefined;
  const parsedDay = dayMatch ? dayMatch[1] : undefined;
  const parsedDate = dateMatch ? dateMatch[1].trim() : undefined;

  return { cleanDescription, parsedLimit, parsedActive, parsedFeatured, parsedDay, parsedDate };
}

  // 1. Overview Calculations
  const verifiedContributions = contributions.filter((c) => c.status === "Success");
  const pendingContributions = contributions.filter((c) => c.status === "Pending Verification" || c.status === "Pending");
  const totalFunds = verifiedContributions.reduce((acc, c) => acc + (Number(c.amount) || 0), 0);
  const pendingFunds = pendingContributions.reduce((acc, c) => acc + (Number(c.amount) || 0), 0);

  const getContributionCategoryName = (c: any) => {
    if (c.contribution_categories && c.contribution_categories.name) {
      return c.contribution_categories.name;
    }
    if (c.category_id) {
      const matched = categoriesList.find((cat: any) => cat.id === c.category_id);
      if (matched && matched.name) return matched.name;
    }
    return "General Pujo Fund";
  };

  const getSevaBadge = (categoryName: string) => {
    const lower = (categoryName || "").toLowerCase();
    if (lower.includes("general")) {
      return { icon: "👑", badge: "bg-amber-50 text-amber-900 border-amber-300" };
    }
    if (lower.includes("bhog") || lower.includes("prasad")) {
      return { icon: "🍚", badge: "bg-orange-50 text-orange-900 border-orange-300" };
    }
    if (lower.includes("sweet") || lower.includes("mishti")) {
      return { icon: "🍬", badge: "bg-pink-50 text-pink-900 border-pink-300" };
    }
    if (lower.includes("flower") || lower.includes("pushpa") || lower.includes("samagri")) {
      return { icon: "🌺", badge: "bg-emerald-50 text-emerald-900 border-emerald-300" };
    }
    return { icon: "🪔", badge: "bg-red-50 text-red-900 border-red-300" };
  };

  const formatContributionToReceipt = (contrib: any): ReceiptData => {
    const panMatch = contrib.email ? contrib.email.match(/\[PAN:([A-Z0-9]+)\]/i) : null;
    const panNumber = panMatch ? panMatch[1].toUpperCase() : undefined;
    const cleanEmail = contrib.email ? contrib.email.replace(/\[PAN:[^\]]+\]/i, '').trim() : '';
    const catName = getContributionCategoryName(contrib);
    const paymentId = contrib.payment_id || contrib.id;

    return {
      name: contrib.contributor_name,
      flatNumber: contrib.flat_number || "PBEL City",
      phone: contrib.phone || undefined,
      email: cleanEmail || undefined,
      amount: Number(contrib.amount) || 0,
      category: catName,
      paymentId: paymentId,
      upiRef: contrib.payment_id?.startsWith("UTR_") ? contrib.payment_id.replace("UTR_", "") : contrib.payment_id,
      date: new Date(contrib.created_at || Date.now()).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      requiresTaxExemption: Boolean(panNumber),
      panNumber: panNumber,
      wantsWhatsappUpdates: true,
    };
  };

  const handleSendResidentWhatsapp = (contrib: any) => {
    const r = formatContributionToReceipt(contrib);
    const phone = contrib.phone?.replace(/[^0-9]/g, "") || "";
    const receiptRef = contrib.payment_id?.replace(/^UTR_/i, '').slice(-8).toUpperCase() || "ONLINE";
    
    const message = `🌺 *শুভ শারদীয়া • PBEL City Durgotsav 2026* 🌺\nJoy Maa Durga!\n\nDear ${r.name},\nThank you for your pious devotional offering for PBEL City Durgotsav.\n\nContributor: *${r.name}* (${r.flatNumber})\nSeva Offering: *${r.category}*\nAmount Received: *₹${Number(r.amount).toLocaleString("en-IN")}*\nOfficial Receipt No: *PSS-2026-${receiptRef}*\nPayment Ref / UTR: *${contrib.payment_id || "Verified"}*\n\nMay Maa Durga shower divine health, happiness, and prosperity upon you and your family! 🙏\n_PBEL Sanskritik Samiti (PSS)_`;

    const waUrl = phone.length >= 10
      ? `https://api.whatsapp.com/send?phone=91${phone.slice(-10)}&text=${encodeURIComponent(message)}`
      : `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;

    window.open(waUrl, "_blank");
  };

  const handleCopySponsorsList = () => {
    let filtered = contributions.filter((c) => c.status === "Success");
    let categoryLabel = "All Seva Offerings";

    if (sponsorCopyCategory !== "all") {
      filtered = filtered.filter((c) => {
        const catName = getContributionCategoryName(c);
        if (sponsorCopyCategory === "bhog") return catName.toLowerCase().includes("bhog");
        if (sponsorCopyCategory === "sweets") return catName.toLowerCase().includes("sweet") || catName.toLowerCase().includes("prasad") || catName.toLowerCase().includes("mishti");
        if (sponsorCopyCategory === "general") return catName === "General Pujo Fund";
        return catName === sponsorCopyCategory;
      });
      categoryLabel = sponsorCopyCategory === "bhog" ? "Maha Bhog Sponsors" : sponsorCopyCategory === "sweets" ? "Sweets & Prasad Sponsors" : sponsorCopyCategory;
    }

    if (filtered.length === 0) {
      alert("No verified contributions found for this category.");
      return;
    }

    const totalSponsored = filtered.reduce((sum, c) => sum + Number(c.amount || 0), 0);

    const listLines = filtered.map((c, i) => {
      const flat = c.flat_number ? ` (${c.flat_number})` : "";
      const cat = sponsorCopyCategory === "all" ? ` — ${getContributionCategoryName(c)}` : "";
      return `${i + 1}. ${c.contributor_name}${flat}${cat}`;
    }).join("\n");

    const textToCopy = `🌸 *PBEL CITY DURGOTSAV 2026 — SEVA SPONSORS* 🌸\n\n*Offering:* ${categoryLabel}\n*Total Devotees:* ${filtered.length} | *Total Seva:* ₹${totalSponsored.toLocaleString("en-IN")}\n\n${listLines}\n\nMay Maa Durga bless all our generous devotees and their families! 🙏\n_PBEL Sanskritik Samiti (PSS)_`;

    navigator.clipboard.writeText(textToCopy);
    setSponsorCopied(true);
    setTimeout(() => setSponsorCopied(false), 3000);
  };

  const displayedContributions = contributions.filter((c) => {
    if (contributionStatusFilter === "verified" && c.status !== "Success") return false;
    if (contributionStatusFilter === "pending" && c.status !== "Pending" && c.status !== "Pending Verification") return false;
    if (contributionStatusFilter === "rejected" && c.status !== "Failed" && c.status !== "Rejected") return false;

    const catName = getContributionCategoryName(c);
    if (contributionSevaFilter !== "all") {
      if (contributionSevaFilter === "general" && catName !== "General Pujo Fund") return false;
      if (contributionSevaFilter === "bhog" && !catName.toLowerCase().includes("bhog")) return false;
      if (contributionSevaFilter === "sweets" && !catName.toLowerCase().includes("sweet") && !catName.toLowerCase().includes("prasad") && !catName.toLowerCase().includes("mishti")) return false;
      if (contributionSevaFilter === "flowers" && !catName.toLowerCase().includes("flower") && !catName.toLowerCase().includes("pushpa") && !catName.toLowerCase().includes("samagri")) return false;
      if (contributionSevaFilter !== "general" && contributionSevaFilter !== "bhog" && contributionSevaFilter !== "sweets" && contributionSevaFilter !== "flowers") {
        if (catName !== contributionSevaFilter) return false;
      }
    }

    if (contributionSearch.trim()) {
      const q = contributionSearch.toLowerCase().trim();
      const matchesName = (c.contributor_name || "").toLowerCase().includes(q);
      const matchesFlat = (c.flat_number || "").toLowerCase().includes(q);
      const matchesPhone = (c.phone || "").toLowerCase().includes(q);
      const matchesPayment = (c.payment_id || "").toLowerCase().includes(q);
      const matchesCat = catName.toLowerCase().includes(q);
      if (!matchesName && !matchesFlat && !matchesPhone && !matchesPayment && !matchesCat) return false;
    }

    return true;
  });

  // CATEGORIES CMS
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingCategory(true);
    try {
      const encodedDesc = encodeCategoryDescription(
        newCategory.description, 
        newCategory.max_limit, 
        newCategory.is_active,
        newCategory.is_featured,
        newCategory.pujo_day,
        newCategory.pujo_date
      );

      const payload: any = {
        name: newCategory.name.trim(),
        fixed_amount: Number(newCategory.fixed_amount),
        description: encodedDesc,
      };

      if (isEditingCategory && newCategory.id) {
        const { error } = await supabase
          .from("contribution_categories")
          .update(payload)
          .eq("id", newCategory.id);
        
        if (error) {
          console.error("Error updating category:", error);
          alert(`Error updating category: ${error.message}`);
          return;
        }
        alert("Seva Category, Date & Limits updated successfully!");
      } else {
        const { error } = await supabase
          .from("contribution_categories")
          .insert(payload);
        
        if (error) {
          console.error("Error creating category:", error);
          alert(`Error adding category: ${error.message}`);
          return;
        }
        alert("New Seva Category added successfully!");
      }
      setNewCategory({ id: "", name: "", fixed_amount: 1001, description: "", max_limit: 5, is_active: true, is_featured: false, pujo_day: "", pujo_date: "" });
      setIsEditingCategory(false);
      window.dispatchEvent(new Event("pbel_categories_updated"));
      await fetchData();
    } catch (err: any) {
      console.error("Error saving category:", err);
      alert(`Unexpected error: ${err.message || err}`);
    } finally {
      setIsSubmittingCategory(false);
    }
  };

  const handleToggleFeaturedCategory = async (cat: any) => {
    const decoded = decodeCategoryDescription(cat.description);
    const currentFeatured = decoded.parsedFeatured ?? false;
    const nextFeatured = !currentFeatured;
    const newDesc = encodeCategoryDescription(decoded.cleanDescription, decoded.parsedLimit, decoded.parsedActive, nextFeatured, decoded.parsedDay, decoded.parsedDate);
    try {
      await supabase.from("contribution_categories").update({ description: newDesc }).eq("id", cat.id);
      window.dispatchEvent(new Event("pbel_categories_updated"));
      await fetchData();
      alert(`"${cat.name}" is now ${nextFeatured ? "⭐ Featured on Homepage" : "Standard catalog item"}.`);
    } catch (err) {
      console.error("Error toggling featured status:", err);
    }
  };

  const handleDeleteCategory = async (id: string, name?: string) => {
    const displayName = name || "this Seva Category";
    if (!confirm(`Are you sure you want to permanently delete "${displayName}"?\n\nThis will remove it from the website immediately.`)) return;
    try {
      // 1. Safely unbind foreign key constraints in contributions if any records reference this category
      const { data: contribs } = await supabase.from("contributions").select("id").eq("category_id", id);
      if (contribs && contribs.length > 0) {
        await supabase.from("contributions").update({ category_id: null }).eq("category_id", id);
      }

      // 2. Delete the category from Supabase
      const { error } = await supabase.from("contribution_categories").delete().eq("id", id);
      if (error) {
        console.error("Error deleting category:", error);
        alert(`Failed to delete category: ${error.message}`);
        return;
      }

      setCategoriesList((prev) => prev.filter((c) => c.id !== id));
      if (isEditingCategory && newCategory.id === id) {
        setIsEditingCategory(false);
        setNewCategory({ id: "", name: "", fixed_amount: 1001, description: "", max_limit: 5, is_active: true, is_featured: false, pujo_day: "", pujo_date: "" });
      }
      window.dispatchEvent(new Event("pbel_categories_updated"));
      alert(`"${displayName}" was permanently deleted and removed from the website.`);
    } catch (err: any) {
      console.error("Delete error:", err);
      alert(`Unexpected error deleting category: ${err.message || err}`);
    }
  };

  // SCHEDULE (Pujo Nirghanto) CMS
  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title.trim() || !newEvent.time.trim()) {
      alert("Please provide Ritual Title and Time.");
      return;
    }
    setIsSubmittingEvent(true);
    try {
      const targetDayId = selectedNirghantoDayId;
      const ritualType = (newEvent.event_type?.toLowerCase().includes("bhog")
        ? "bhog"
        : newEvent.event_type?.toLowerCase().includes("aarti")
        ? "aarti"
        : newEvent.event_type?.toLowerCase().includes("pratibimb") || newEvent.event_type?.toLowerCase().includes("cultural")
        ? "cultural"
        : "ritual") as "ritual" | "bhog" | "aarti" | "cultural";

      const ritualItem: RitualEvent = {
        time: newEvent.time.trim(),
        event: sanitizeText(newEvent.title.trim()),
        type: ritualType,
        description: newEvent.description ? sanitizeText(newEvent.description.trim()) : undefined,
      };

      const updatedSchedule = scheduleDays.map((d) => {
        if (d.id === targetDayId) {
          let updatedRituals = [...d.rituals];
          if (isEditingEvent && newEvent.id) {
            // Find existing ritual by matching id or event name
            const editIdx = updatedRituals.findIndex(
              (r) => r.event === newEvent.id || r.event === newEvent.title
            );
            if (editIdx !== -1) {
              updatedRituals[editIdx] = ritualItem;
            } else {
              updatedRituals.push(ritualItem);
            }
          } else {
            // Add or replace identical ritual time
            const existingIdx = updatedRituals.findIndex(
              (r) => r.event.toLowerCase() === ritualItem.event.toLowerCase() && r.time === ritualItem.time
            );
            if (existingIdx !== -1) {
              updatedRituals[existingIdx] = ritualItem;
            } else {
              updatedRituals.push(ritualItem);
            }
          }
          return {
            ...d,
            rituals: sortRitualsByTime(updatedRituals),
          };
        }
        return d;
      });

      setScheduleDays(updatedSchedule);
      await saveStoredSchedule(updatedSchedule);

      const activeDay = updatedSchedule.find((d) => d.id === targetDayId);
      alert(`✓ "${newEvent.title}" (${newEvent.time}) saved to ${activeDay?.dayName} (${activeDay?.date}) and synced live to Cloud!`);

      setNewEvent({ id: "", title: "", event_type: "Nirghanto", date: activeDay?.isoDate || "2026-10-16", time: "08:30 AM", description: "" });
      setIsEditingEvent(false);
    } catch (err) {
      console.error("Error saving schedule ritual:", err);
      alert("Failed to save ritual. Please check your connection and try again.");
    } finally {
      setIsSubmittingEvent(false);
    }
  };

  const handleEditEvent = (ritual: RitualEvent, dayIsoDate: string) => {
    setNewEvent({
      id: ritual.event,
      title: ritual.event,
      event_type: ritual.type === "bhog" ? "Bhog" : ritual.type === "aarti" ? "Aarti" : ritual.type === "cultural" ? "Pratibimb" : "Nirghanto",
      date: dayIsoDate,
      time: ritual.time,
      description: ritual.description || "",
    });
    setIsEditingEvent(true);
  };

  const handleDeleteEvent = async (ritualEventName: string) => {
    const activeDay = scheduleDays.find((d) => d.id === selectedNirghantoDayId);
    if (!confirm(`Are you sure you want to delete "${ritualEventName}" from ${activeDay?.dayName}?`)) return;

    const updatedSchedule = scheduleDays.map((d) => {
      if (d.id === selectedNirghantoDayId) {
        return {
          ...d,
          rituals: d.rituals.filter((r) => r.event !== ritualEventName),
        };
      }
      return d;
    });

    setScheduleDays(updatedSchedule);
    await saveStoredSchedule(updatedSchedule);

    try {
      await supabase.from("events").delete().eq("title", ritualEventName);
    } catch (_) {}

    alert(`✓ Deleted "${ritualEventName}" from ${activeDay?.dayName}`);
  };

  const handleRestoreDefaultSchedule = async () => {
    if (!confirm("Are you sure you want to restore the entire 6-Day Pujo Nirghanto & Schedule to baseline defaults? This will reset all 6 days to the standard schedule.")) return;
    setScheduleDays(DEFAULT_PUJO_SCHEDULE);
    await saveStoredSchedule(DEFAULT_PUJO_SCHEDULE);
    setEveningsConfig(mapScheduleToEveningsConfig(DEFAULT_PUJO_SCHEDULE));
    alert("Full 6-Day Pujo Nirghanto restored to baseline defaults and synced to Cloud!");
  };

  // HERO HIGHLIGHT CHIPS CMS
  const handleSaveHeroChips = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSavingHeroChips(true);
    try {
      const sanitized = heroChips.map((c) => ({
        ...c,
        text: sanitizeText(c.text.trim()),
      }));
      setHeroChips(sanitized);
      await saveStoredHeroChips(sanitized);
      alert("✓ Pujo Nirghanto Hero Banner Highlights saved and synced live to Cloud!");
    } catch (err) {
      console.error("Error saving hero chips:", err);
      alert("Failed to save highlight chips. Please try again.");
    } finally {
      setIsSavingHeroChips(false);
    }
  };

  const handleResetHeroChips = async () => {
    if (!confirm("Reset Hero Banner Highlights to default chips?")) return;
    setHeroChips(DEFAULT_HERO_HIGHLIGHT_CHIPS);
    await saveStoredHeroChips(DEFAULT_HERO_HIGHLIGHT_CHIPS);
    alert("Hero Highlights reset to defaults.");
  };

  // PRATIBIMB EVENINGS & CAPACITY CONFIGURATION CMS
  const handleSaveEveningConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvening) return;

    // Parse acts from actsText
    const parsedActs = (editingEvening.actsText !== undefined ? editingEvening.actsText : (editingEvening.acts || []).join("\n"))
      .split("\n")
      .map((s: string) => sanitizeText(s.trim()))
      .filter((s: string) => s.length > 0);

    const updatedItem = {
      ...editingEvening,
      theme: sanitizeText(editingEvening.theme),
      description: sanitizeText(editingEvening.description || ""),
      acts: parsedActs,
      actsText: parsedActs.join("\n"),
    };

    const updatedEvenings = eveningsConfig.map((ev) => (ev.id === editingEvening.id ? updatedItem : ev));
    setEveningsConfig(updatedEvenings);

    // Update dynamic 6-day DaySchedule in schedule.ts
    const currentSched = scheduleDays && scheduleDays.length > 0 ? scheduleDays : getStoredSchedule();
    const dayMap: Record<string, string> = {
      "ev-panchami": "panchami",
      "ev-sashti": "sashti",
      "ev-saptami": "saptami",
      "ev-ashtami": "ashtami",
      "ev-nabami": "nabami",
      "ev-dashami": "dashami",
    };
    const targetDayId = editingEvening.dayId || dayMap[editingEvening.id] || editingEvening.id.replace("ev-", "");
    const updatedSched = currentSched.map((d) => {
      if (d.id === targetDayId) {
        return {
          ...d,
          theme: updatedItem.theme || d.theme,
          culturalEvening: {
            ...d.culturalEvening,
            title: updatedItem.theme || d.culturalEvening.title,
            time: `${updatedItem.startTime} - ${updatedItem.endTime}`,
            description: updatedItem.description || d.culturalEvening.description,
            residentSlotsAvailable: Number(updatedItem.maxResidentSlots) || d.culturalEvening.residentSlotsAvailable,
            acts: parsedActs.length > 0 ? parsedActs : d.culturalEvening.acts,
            pssHeadliner: updatedItem.hasPssFlagship && updatedItem.pssEventTitle?.trim() ? {
              title: updatedItem.pssEventTitle,
              time: updatedItem.pssEventTime || "08:00 PM Start",
              duration: updatedItem.pssDuration || "90 mins",
              genre: updatedItem.pssGenre || "PBEL Sanskritik Samiti Flagship Show",
            } : undefined,
          },
        };
      }
      return d;
    });
    setScheduleDays(updatedSched);
    await saveStoredSchedule(updatedSched);

    alert(`Stage line-up & Featured Acts updated for ${editingEvening.day} and synced to Cloud!`);
    setEditingEvening(null);
  };

  // SPONSORS CMS
  const handleAddSponsor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSponsor.name.trim()) {
      alert("Please provide Sponsor / Company Name.");
      return;
    }
    setIsSubmittingSponsor(true);
    try {
      const sponsorItem = {
        id: `sp-${Date.now()}`,
        name: sanitizeText(newSponsor.name),
        tier: sanitizeText(newSponsor.tier),
        logo_url: newSponsor.logo_url || null,
        website: (newSponsor as any).website ? sanitizeText((newSponsor as any).website) : null,
        is_active: true,
      };

      // 1. Insert to Supabase DB
      await supabase.from("sponsors").insert({
        name: sponsorItem.name,
        tier: sponsorItem.tier,
        logo_url: sponsorItem.logo_url,
        is_active: true,
      });

      // 2. Sync to Cloud Config & Local Storage
      const updatedSponsors = [sponsorItem, ...sponsorsList];
      setSponsorsList(updatedSponsors);
      localStorage.setItem("pbel_sponsors_list", JSON.stringify(updatedSponsors));
      saveCloudConfig("sponsors", updatedSponsors);
      window.dispatchEvent(new Event("pbel_sponsors_updated"));

      alert("New corporate sponsor with brand logo published to homepage!");
      setNewSponsor({ name: "", tier: "Gold", logo_url: "", website: "" } as any);
      fetchData();
    } catch (err) {
      console.error("Error adding sponsor:", err);
    } finally {
      setIsSubmittingSponsor(false);
    }
  };

  const handleDeleteSponsor = async (id: string) => {
    if (!confirm("Are you sure you want to remove this sponsor?")) return;
    await supabase.from("sponsors").delete().eq("id", id);
    const updatedSponsors = sponsorsList.filter((s) => s.id !== id);
    setSponsorsList(updatedSponsors);
    localStorage.setItem("pbel_sponsors_list", JSON.stringify(updatedSponsors));
    saveCloudConfig("sponsors", updatedSponsors);
    window.dispatchEvent(new Event("pbel_sponsors_updated"));
    fetchData();
  };

  // SPONSORSHIP TIER / PACKAGE CMS HANDLERS
  const handleSaveTier = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tierForm.title.trim()) {
      alert("Please enter a Package Title (e.g. Gold Partner).");
      return;
    }
    setIsSubmittingTier(true);

    try {
      const parsedDeliverables = tierForm.deliverablesText
        .split(/\r?\n/)
        .map((d) => d.trim())
        .filter((d) => d.length > 0);

      if (parsedDeliverables.length === 0) {
        alert("Please add at least one deliverable benefit bullet point.");
        setIsSubmittingTier(false);
        return;
      }

      let updatedTiers: SponsorshipTier[];

      if (isEditingTier && tierForm.id) {
        updatedTiers = sponsorshipTiers.map((t) => {
          if (t.id === tierForm.id) {
            return {
              ...t,
              title: tierForm.title.trim(),
              amount: tierForm.amount.trim(),
              tag: tierForm.tag.trim() || "Partner Package",
              isHighlight: tierForm.isHighlight,
              deliverables: parsedDeliverables,
            };
          }
          return t;
        });
        alert(`✓ Updated "${tierForm.title}" package deliverables & pricing!`);
      } else {
        const newTierItem: SponsorshipTier = {
          id: "tier-" + Date.now(),
          title: tierForm.title.trim(),
          amount: tierForm.amount.trim(),
          tag: tierForm.tag.trim() || "Brand Package",
          isHighlight: tierForm.isHighlight,
          deliverables: parsedDeliverables,
        };
        updatedTiers = [...sponsorshipTiers, newTierItem];
        alert(`✓ Published new "${tierForm.title}" sponsorship package to /sponsors page!`);
      }

      setSponsorshipTiers(updatedTiers);
      await saveStoredSponsorshipTiers(updatedTiers);

      // Reset form
      setIsEditingTier(false);
      setTierForm({
        id: "",
        title: "",
        amount: "₹50,000",
        tag: "High Visibility",
        isHighlight: false,
        deliverablesText: "Stage Side Panels & Pandal Entry Branding\nDedicated Food / Promotional Stall Space\nDaily Emcee Verbal Brand Mention\nLogo on Official Website & Carousel",
      });
    } catch (err) {
      console.error("Error saving sponsorship tier:", err);
      alert("Failed to save sponsorship package. Please try again.");
    } finally {
      setIsSubmittingTier(false);
    }
  };

  const handleEditTier = (tier: SponsorshipTier) => {
    setIsEditingTier(true);
    setTierForm({
      id: tier.id,
      title: tier.title,
      amount: tier.amount,
      tag: tier.tag,
      isHighlight: tier.isHighlight,
      deliverablesText: (tier.deliverables || []).join("\n"),
    });
    setSponsorsSubView("tiers");
  };

  const handleDeleteTier = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to remove the "${title}" sponsorship package from the public website?`)) return;
    const updated = sponsorshipTiers.filter((t) => t.id !== id);
    setSponsorshipTiers(updated);
    await saveStoredSponsorshipTiers(updated);
    if (isEditingTier && tierForm.id === id) {
      setIsEditingTier(false);
      setTierForm({
        id: "",
        title: "",
        amount: "₹50,000",
        tag: "High Visibility",
        isHighlight: false,
        deliverablesText: "",
      });
    }
    alert(`✓ Deleted "${title}" sponsorship tier.`);
  };

  const handleRestoreDefaultTiers = async () => {
    if (!confirm("Restore all sponsorship packages & tier cards to standard baseline defaults?")) return;
    setSponsorshipTiers(DEFAULT_SPONSORSHIP_TIERS);
    await saveStoredSponsorshipTiers(DEFAULT_SPONSORSHIP_TIERS);
    setIsEditingTier(false);
    alert("✓ Restored sponsorship tier packages to baseline defaults and synced to Cloud!");
  };

  // Date formatting helper for Pratibimb Stage Performances
  const formatPerformanceDate = (p: any) => {
    const rawDate = p.cultural_evenings?.evening_date || p.evening_date || p.scheduled_date || (p.created_at ? p.created_at.split("T")[0] : "");
    const dateMap: Record<string, string> = {
      "2026-10-15": "Panchami (15 Oct)",
      "2026-10-16": "Maha Sashti (16 Oct)",
      "2026-10-17": "Maha Saptami (17 Oct)",
      "2026-10-18": "Maha Ashtami (18 Oct)",
      "2026-10-19": "Maha Nabami (19 Oct)",
      "2026-10-20": "Vijaya Dashami (20 Oct)",
    };
    return dateMap[rawDate] || (rawDate ? new Date(rawDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "Scheduled Pujo Evening");
  };

  // GALLERY CMS
  const handleAddPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhoto.title.trim()) {
      alert("Please enter Photo Title.");
      return;
    }
    const newEntry = {
      id: Date.now().toString(),
      title: sanitizeText(newPhoto.title),
      year: newPhoto.year || "2026",
      category: sanitizeText(newPhoto.category) || "Pujo Celebrations",
      emoji: newPhoto.emoji || "🌺",
      imageUrl: newPhoto.image_url || undefined,
      image_url: newPhoto.image_url || undefined,
      bgGradient: "from-[#850E1F]/85 via-[#610815]/90 to-[#2A0208]/95",
    };
    const updated = [newEntry, ...galleryList];
    setGalleryList(updated);
    localStorage.setItem("pbel_custom_gallery", JSON.stringify(updated));
    saveCloudConfig("gallery", updated);
    window.dispatchEvent(new Event("pbel_gallery_updated"));
    alert("New photo added to the Homepage Gallery Carousel and synced to Cloud!");
    setNewPhoto({ title: "", year: "2026", category: "Pujo Rituals", emoji: "🌺", image_url: "" });
  };

  const handleDeletePhoto = (id: string) => {
    const updated = galleryList.filter((p) => p.id !== id);
    setGalleryList(updated);
    localStorage.setItem("pbel_custom_gallery", JSON.stringify(updated));
    saveCloudConfig("gallery", updated);
    window.dispatchEvent(new Event("pbel_gallery_updated"));
  };

  // YOUTUBE VIDEO CMS
  const handleAddVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVideo.title.trim() || !newVideo.youtubeUrl.trim()) {
      alert("Please enter Video Title and YouTube Link / URL.");
      return;
    }
    const videoId = extractYouTubeVideoId(newVideo.youtubeUrl);
    if (!videoId) {
      alert("Invalid YouTube URL or Video ID. Please provide a link like https://www.youtube.com/watch?v=... or https://youtu.be/...");
      return;
    }
    const videoEntry: GalleryVideo = {
      id: Date.now().toString(),
      title: sanitizeText(newVideo.title),
      youtubeUrl: newVideo.youtubeUrl.trim(),
      youtubeVideoId: videoId,
      category: sanitizeText(newVideo.category) || "Pratibimb Stage",
      year: newVideo.year || "2025",
      description: sanitizeText(newVideo.description),
      dateAdded: new Date().toISOString(),
    };
    const updated = [videoEntry, ...galleryVideos];
    setGalleryVideos(updated);
    saveStoredGalleryVideos(updated);
    saveCloudConfig("gallery_videos", updated);
    alert("🎉 YouTube video successfully added to the Gallery Page and synced to Cloud!");
    setNewVideo({ title: "", youtubeUrl: "", category: "Pratibimb Stage", year: "2025", description: "" });
  };

  const handleDeleteVideo = (id: string) => {
    if (!confirm("Are you sure you want to remove this video from the Gallery Showcase?")) return;
    const updated = galleryVideos.filter((v) => v.id !== id);
    setGalleryVideos(updated);
    saveStoredGalleryVideos(updated);
    saveCloudConfig("gallery_videos", updated);
  };

  const handleSaveSocialChannels = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedBranding = {
      ...branding,
      youtubeChannelUrl: branding.youtubeChannelUrl || "https://www.youtube.com/@pbelsanskritiksamiti-offic3003",
      instagramUrl: branding.instagramUrl || "https://www.instagram.com/pbelsanskritiksamiti",
      facebookUrl: branding.facebookUrl || "https://www.facebook.com/pbelsanskritiksamiti",
    };
    setBranding(updatedBranding);
    saveStoredBranding(updatedBranding);
    saveCloudConfig("branding", updatedBranding);
    alert("🎉 Social channels (YouTube, Instagram, Facebook) updated and broadcast across all devices!");
  };

  return (
    <>
      {/* 1. AUTHENTICATION GATE (When not logged in) */}
      {!isAuthenticated ? (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-amber-400/40 shadow-2xl relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-36 h-36 bg-amber-200/40 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-primary/10 rounded-full blur-2xl pointer-events-none" />

            <div className="text-center mb-8 relative">
              <div className="w-16 h-16 bg-gradient-to-tr from-[#9E122C] to-[#5C0512] text-amber-300 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg border border-amber-400/40">
                <Lock size={28} />
              </div>
              <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
                <ShieldCheck size={13} className="text-primary" />
                <span>Core Committee Only</span>
              </div>
              <h1 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900">
                Executive Admin Gate
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                Sign in to manage contributions, seva limits, rituals & committee users.
              </p>
            </div>

            {loginError && (
              <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                <Lock size={15} className="shrink-0 text-red-600" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Admin Username or Email
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={loginForm.username}
                    onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                    placeholder="e.g. admin"
                    className="w-full p-3 pl-10 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm font-medium"
                  />
                  <Users size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Security Passcode / Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    placeholder="Enter committee PIN or password"
                    className="w-full p-3 pl-10 pr-10 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm font-medium"
                  />
                  <KeyRound size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600 transition"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-gray-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                  />
                  <span>Remember on this device</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full bg-gradient-to-r from-[#9E122C] to-[#7B0D21] hover:from-[#7B0D21] hover:to-[#5C0512] text-white py-3.5 rounded-xl font-bold text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <Unlock size={16} />
                <span>{isLoggingIn ? "Verifying..." : "Sign In to Control Center"}</span>
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-gray-100 text-center">
              <p className="text-[11px] text-gray-400">
                Authorized PBEL Sanskritik Samiti Executive Committee Members Only.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* 2. AUTHENTICATED ADMIN DASHBOARD */
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          
          {/* Top Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-gray-200 mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-900 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                <ShieldCheck size={14} className="text-primary" />
                <span>PBEL Sanskritik Samiti Core Committee Portal</span>
              </div>
              <h1 className="font-heading text-3xl sm:text-4xl text-primary font-bold">
                Executive Admin Control Center
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <p className="text-xs text-gray-600 font-medium">
                  Logged in as: <strong className="text-gray-900">{currentUser?.name || "Admin"}</strong> ({currentUser?.role || "Super Admin"})
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
              <button
                type="button"
                onClick={handleSyncAllToCloud}
                disabled={isSyncingCloud}
                className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-4 py-2.5 rounded-full transition flex items-center gap-1.5 shadow-md golden-glow active:scale-98"
                title="Save and broadcast all Towers, Committee Wings, and Branding to Supabase Cloud so all mobile users see the updates immediately"
              >
                <span>{isSyncingCloud ? "Syncing..." : "☁️ Push All Settings to Cloud (Sync Mobiles)"}</span>
              </button>
              <button
                onClick={fetchData}
                className="bg-primary hover:bg-primary-hover text-white text-xs font-semibold px-4 py-2.5 rounded-full transition flex items-center gap-1.5 shadow-sm"
              >
                <span>Refresh Data</span>
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-semibold px-4 py-2.5 rounded-full transition flex items-center gap-1.5"
                title="Log out of session"
              >
                <LogOut size={13} />
                <span>Log Out</span>
              </button>
            </div>
          </div>

          {/* Analytics KPI Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-5 rounded-2xl border border-amber-900/10 shadow-xs">
              <div className="text-xs font-bold text-amber-800 uppercase mb-1">Total Pujo Fund Raised</div>
              <div className="text-2xl sm:text-3xl font-bold text-green-700 font-heading">
                ₹{totalFunds.toLocaleString("en-IN")}
              </div>
              <div className="text-[11px] text-gray-500 mt-1">{contributions.length} total transactions</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-amber-900/10 shadow-xs">
              <div className="text-xs font-bold text-amber-800 uppercase mb-1">Volunteers Registered</div>
              <div className="text-2xl sm:text-3xl font-bold text-gray-900 font-heading">
                {volunteers.length}
              </div>
              <div className="text-[11px] text-gray-500 mt-1">Across all 6 Pujo days</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-amber-900/10 shadow-xs">
              <div className="text-xs font-bold text-amber-800 uppercase mb-1">Pratibimb Stage Acts</div>
              <div className="text-2xl sm:text-3xl font-bold text-gray-900 font-heading">
                {performances.length}
              </div>
              <div className="text-[11px] text-gray-500 mt-1">Dance, Drama, Songs</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-amber-900/10 shadow-xs">
              <div className="text-xs font-bold text-amber-800 uppercase mb-1">PSS Flagship Headliners</div>
              <div className="text-2xl sm:text-3xl font-bold text-primary font-heading">
                3 Major Acts
              </div>
              <div className="text-[11px] text-gray-500 mt-1">Fushmontor, Dance Drama, Natok</div>
            </div>
          </div>

          {/* Admin Module Tabs: Clean Categorized Navigation */}
          <div className="bg-gray-100/80 p-2 rounded-3xl border border-gray-200 mb-8 space-y-2">
            
            {/* Domain Groups */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              
              {/* Group 1: Finance & CRM */}
              <div className="bg-white p-2 rounded-2xl border border-gray-200/80 shadow-xs space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-green-800 px-2 flex items-center gap-1">
                  💰 Finance, CRM &amp; Pass Desk
                </span>
                <div className="flex flex-wrap gap-1">
                  {[
                    { id: "overview", label: "📊 Overview" },
                    { id: "contributions", label: "💰 Contributions" },
                    { id: "pss_members", label: "👥 Member Passes" },
                    { id: "sponsors", label: "🏢 Sponsors" },
                    { id: "budget", label: "📊 Budget Ledger" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                        activeTab === tab.id
                          ? "bg-primary text-white shadow-xs font-bold"
                          : "bg-gray-50 text-gray-700 hover:bg-amber-50 hover:text-amber-900"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Group 2: Festival Ops */}
              <div className="bg-white p-2 rounded-2xl border border-gray-200/80 shadow-xs space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 px-2 flex items-center gap-1">
                  🌺 Pujo Rituals &amp; Stage Ops
                </span>
                <div className="flex flex-wrap gap-1">
                  {[
                    { id: "categories", label: "🌺 Seva Catalog" },
                    { id: "schedule", label: "📅 Pujo Nirghanto" },
                    { id: "volunteers", label: "🤝 Volunteer Roster" },
                    { id: "anandamela", label: "🍲 Food Stalls" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                        activeTab === tab.id
                          ? "bg-primary text-white shadow-xs font-bold"
                          : "bg-gray-50 text-gray-700 hover:bg-amber-50 hover:text-amber-900"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Group 3: Governance & CMS */}
              <div className="bg-white p-2 rounded-2xl border border-gray-200/80 shadow-xs space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary px-2 flex items-center gap-1">
                  👥 Governance, CMS &amp; Security
                </span>
                <div className="flex flex-wrap gap-1">
                  {[
                    { id: "committee", label: "👥 Committee Wings" },
                    { id: "towers", label: "🏢 Towers" },
                    { id: "branding", label: "🎨 Branding & Theme" },
                    { id: "gallery", label: "🖼️ Gallery" },
                    { id: "users", label: "🔒 Users" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                        activeTab === tab.id
                          ? "bg-primary text-white shadow-xs font-bold"
                          : "bg-gray-50 text-gray-700 hover:bg-amber-50 hover:text-amber-900"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

            </div>

          </div>

      {/* TAB CONTENT: 1. OVERVIEW */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Executive Member Contribution Visibility Switcher */}
          <div className="lg:col-span-2 bg-gradient-to-r from-amber-50 via-white to-amber-50/80 p-5 rounded-2xl border border-amber-300 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className={`p-3 rounded-xl text-white shrink-0 ${includeMemberContributions ? "bg-green-600 shadow-sm" : "bg-gray-400"}`}>
                <Users size={22} />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="font-heading text-base font-bold text-gray-900">
                    Include Member Subscriptions in Public Fund Counter &amp; Tower Totals
                  </h4>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                    includeMemberContributions ? "bg-green-100 text-green-800 border border-green-300" : "bg-gray-100 text-gray-700 border border-gray-300"
                  }`}>
                    {includeMemberContributions ? "● Live: Included in Public Counter" : "○ Live: Excluded (Online Only)"}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-1 max-w-2xl leading-relaxed">
                  Controls whether the <strong>₹7,500 annual subscription per member family</strong> ({pssMembers.length} registered families = <strong>₹{(pssMembers.length * 7500).toLocaleString("en-IN")}</strong>) is added to the collection counter, tower breakdown, and displayed on the Devotee Wall of Honor / Donation page with the offering label <strong>&quot;Member Contribution&quot;</strong>.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end md:self-center shrink-0 bg-white/80 p-2 rounded-xl border border-amber-200">
              <span className="text-xs font-bold text-gray-700">
                {includeMemberContributions ? "Include in Public Total" : "Online Only"}
              </span>
              <button
                type="button"
                onClick={handleToggleMemberContributions}
                disabled={isUpdatingMemberToggle}
                className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  includeMemberContributions ? "bg-green-600" : "bg-gray-300"
                }`}
                title="Toggle member subscription inclusion in public totals"
              >
                <span
                  aria-hidden="true"
                  className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    includeMemberContributions ? "translate-x-7" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
            <h3 className="font-heading text-lg font-bold text-gray-900 mb-4">Recent E-Seva Contributions</h3>
            <div className="divide-y divide-gray-100">
              {contributions.slice(0, 5).map((c) => (
                <div key={c.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-gray-900 block">{c.contributor_name}</span>
                    <span className="text-gray-500">{c.flat_number || "PBEL Resident"} • {c.phone}</span>
                  </div>
                  <span className="font-bold text-green-700 text-sm">₹{c.amount}</span>
                </div>
              ))}
              {contributions.length === 0 && <p className="text-xs text-gray-500 py-4">No contributions recorded yet.</p>}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
            <h3 className="font-heading text-lg font-bold text-gray-900 mb-4">PSS Flagship Headliner Highlights</h3>
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-start justify-between">
                <div>
                  <span className="font-bold text-gray-900 block">🎸 Retro Rock by Fushmontor</span>
                  <span className="text-amber-800 font-semibold">Maha Sashti (16 Oct) • 08:15 PM Start (1.5 Hours)</span>
                </div>
                <span className="bg-amber-200 text-amber-900 px-2 py-0.5 rounded-md font-bold text-[10px]">Headliner 1</span>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-start justify-between">
                <div>
                  <span className="font-bold text-gray-900 block">💃 Dance Drama Production</span>
                  <span className="text-amber-800 font-semibold">Maha Saptami (17 Oct) • 07:45 PM Start (1.0 Hour)</span>
                </div>
                <span className="bg-amber-200 text-amber-900 px-2 py-0.5 rounded-md font-bold text-[10px]">Headliner 2</span>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-start justify-between">
                <div>
                  <span className="font-bold text-gray-900 block">🎭 Grand Bangla Theatrical Drama (Natok)</span>
                  <span className="text-amber-800 font-semibold">Maha Ashtami (18 Oct) • 07:45 PM Start (1.0 Hour)</span>
                </div>
                <span className="bg-amber-200 text-amber-900 px-2 py-0.5 rounded-md font-bold text-[10px]">Headliner 3</span>
              </div>
            </div>
          </div>

          {/* LIVE ANNOUNCEMENT & PUJO BULLETIN CMS */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-amber-300/80 p-6 shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2 text-primary font-bold text-base">
                <Sparkles size={18} className="text-amber-500" />
                <span>📢 Live Township Announcement & Top Marquee Alert CMS</span>
              </div>
              <span className="text-[11px] text-gray-500">Live synced to top header bar across all pages</span>
            </div>

            <form onSubmit={handleSaveAnnouncement} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Active Announcement Text (Displayed on website top announcement bar)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={announcementText}
                    onChange={(e) => setAnnouncementText(e.target.value)}
                    placeholder="e.g. ✨ Anandamela stall registrations now open for resident home chefs!"
                    className="flex-1 p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm font-medium"
                  />
                  <button
                    type="submit"
                    className="bg-primary hover:bg-primary-hover text-white font-bold px-5 py-2.5 rounded-xl transition shadow-xs shrink-0 flex items-center gap-1.5"
                  >
                    <Save size={14} />
                    <span>Publish Live Alert</span>
                  </button>
                </div>
              </div>

              {/* Quick Presets */}
              <div className="pt-2">
                <span className="text-[11px] text-gray-500 font-semibold block mb-1.5">1-Click Quick Presets:</span>
                <div className="flex flex-wrap gap-2">
                  {[
                    "PBEL City Durgotsav 2026 • 15th to 20th October (Panchami to Dashami)",
                    "✨ Anandamela food stall registrations are now open for resident home chefs!",
                    "🌺 Maha Saptami Pushpanjali Batch 1 starting at 10:30 AM at Main Pandal",
                    "🍛 Afternoon Maha Bhog distribution is now open at Community Dining Hall",
                    "🎭 Pratibimb Evening Stage Gala starting at 06:30 PM with Fushmontor!",
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setAnnouncementText(preset)}
                      className="text-[11px] bg-gray-100 hover:bg-amber-100 hover:text-amber-900 text-gray-700 px-2.5 py-1 rounded-lg transition border border-gray-200 truncate max-w-xs"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>
            </form>
          </div>

          {/* 🎨 BREAKING NEWS / MAJOR HIGHLIGHT POP-UP CMS */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-amber-300/80 p-6 shadow-xs relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-gray-100">
              <div>
                <div className="flex items-center gap-2 text-primary font-bold text-base">
                  <Palette size={18} className="text-amber-500" />
                  <span>🎨 Breaking News / Major Highlight Pop-up CMS (e.g. Grand Path Alpona)</span>
                </div>
                <span className="text-[11px] text-gray-500">
                  Flashes as a high-impact announcement on site load (session-dismissible).
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsPreviewingPopup(true)}
                  className="bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold px-3 py-1.5 rounded-xl transition flex items-center gap-1"
                >
                  <Eye size={13} />
                  <span>Preview Pop-up</span>
                </button>
                <label className="flex items-center gap-2 cursor-pointer bg-gray-100 px-3 py-1.5 rounded-xl text-xs font-bold text-gray-800">
                  <input
                    type="checkbox"
                    checked={popupHighlight.enabled}
                    onChange={(e) => {
                      const next = { ...popupHighlight, enabled: e.target.checked };
                      handleSavePopupHighlight(next);
                    }}
                    className="accent-primary"
                  />
                  <span>{popupHighlight.enabled ? "Active (Enabled)" : "Disabled"}</span>
                </label>
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSavePopupHighlight(popupHighlight);
              }}
              className="space-y-4 text-xs"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Highlight Title *</label>
                  <input
                    type="text"
                    required
                    value={popupHighlight.title}
                    onChange={(e) => setPopupHighlight({ ...popupHighlight, title: e.target.value })}
                    placeholder="e.g. Grand 500m Sacred Path Alpona by Bengal Folk Artists"
                    className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Badge Tag / Highlight Label</label>
                  <input
                    type="text"
                    value={popupHighlight.badge || ""}
                    onChange={(e) => setPopupHighlight({ ...popupHighlight, badge: e.target.value })}
                    placeholder="e.g. 🎨 Major Festival Attraction"
                    className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Timing / Subtitle</label>
                  <input
                    type="text"
                    value={popupHighlight.subtitle || ""}
                    onChange={(e) => setPopupHighlight({ ...popupHighlight, subtitle: e.target.value })}
                    placeholder="e.g. Complete by Panchami Morning • Major Attraction Throughout Pujo"
                    className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Action Button Text &amp; URL</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={popupHighlight.actionText || ""}
                      onChange={(e) => setPopupHighlight({ ...popupHighlight, actionText: e.target.value })}
                      placeholder="Explore Schedule →"
                      className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                    />
                    <input
                      type="text"
                      value={popupHighlight.actionUrl || ""}
                      onChange={(e) => setPopupHighlight({ ...popupHighlight, actionUrl: e.target.value })}
                      placeholder="/programs"
                      className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Highlight Description Snippet *</label>
                <textarea
                  rows={3}
                  required
                  value={popupHighlight.snippet}
                  onChange={(e) => setPopupHighlight({ ...popupHighlight, snippet: e.target.value })}
                  placeholder="Explain what the highlight means, artist details, timings, and invitation..."
                  className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              {/* Artwork / Image Upload for Pop-up */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Highlight Artwork / Photo (Image upload &lt; 2MB or URL)
                </label>
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 px-4 py-2 rounded-xl font-semibold text-xs transition flex items-center gap-1.5 shrink-0">
                    <Upload size={14} />
                    <span>Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 2 * 1024 * 1024) {
                            alert("Image must be under 2MB. Please compress before uploading.");
                            return;
                          }
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setPopupHighlight((prev) => ({
                              ...prev,
                              imageUrl: reader.result as string,
                            }));
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                  <input
                    type="text"
                    value={popupHighlight.imageUrl || ""}
                    onChange={(e) => setPopupHighlight({ ...popupHighlight, imageUrl: e.target.value })}
                    placeholder="Or paste image path / URL (e.g. /images/wallpapers/durga_festive_mandala.svg)"
                    className="flex-1 p-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none text-xs"
                  />
                  {popupHighlight.imageUrl && (
                    <div className="w-10 h-10 rounded-lg overflow-hidden border border-amber-300 shrink-0">
                      <img src={popupHighlight.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsPreviewingPopup(true)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-xl font-bold transition flex items-center gap-1"
                >
                  <Eye size={14} />
                  <span>Preview Pop-up</span>
                </button>
                <button
                  type="submit"
                  className="bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-xl font-bold transition shadow-sm flex items-center gap-1.5 golden-glow"
                >
                  <Save size={14} />
                  <span>Save &amp; Publish Pop-up Highlight</span>
                </button>
              </div>
            </form>
          </div>

        </div>
      )}

      {/* TAB CONTENT: 2. CONTRIBUTIONS CRM */}
      {activeTab === "contributions" && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
            
            {/* Header & Action Controls */}
            <div className="p-4 sm:p-6 border-b border-gray-200 bg-gray-50/50 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-heading text-lg font-bold text-gray-900 flex items-center gap-2">
                    <HeartHandshake size={20} className="text-primary" />
                    <span>Devotee Contributions &amp; Seva CRM</span>
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Track offerings by Seva category, verify bank UTR references, generate printable official A4 receipts, and publish sponsor lists.
                  </p>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
                  <button
                    onClick={() => setShowSponsorCopyModal(true)}
                    className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
                    title="Generate and copy sponsor announcement for WhatsApp / Notice Board"
                  >
                    <ClipboardList size={14} />
                    <span>Publish Sponsors (WhatsApp)</span>
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
                  >
                    <Download size={14} />
                    <span>Print Registry</span>
                  </button>
                </div>
              </div>

              {/* Quick Metrics Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-green-50/80 border border-green-200 p-3 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-green-800 uppercase block">Verified Pujo Fund</span>
                    <span className="text-xl font-bold text-green-700 font-mono">₹{totalFunds.toLocaleString("en-IN")}</span>
                  </div>
                  <span className="text-xs bg-green-200 text-green-900 px-2 py-0.5 rounded-full font-bold">
                    {verifiedContributions.length} Verified
                  </span>
                </div>

                <div className="bg-amber-50/80 border border-amber-200 p-3 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-amber-800 uppercase block">Under Verification</span>
                    <span className="text-xl font-bold text-amber-700 font-mono">₹{pendingFunds.toLocaleString("en-IN")}</span>
                  </div>
                  <span className="text-xs bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full font-bold">
                    {pendingContributions.length} Pending
                  </span>
                </div>

                <div className="bg-gray-100/80 border border-gray-200 p-3 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-gray-700 uppercase block">Total Devotee Submissions</span>
                    <span className="text-xl font-bold text-gray-900 font-mono">{contributions.length}</span>
                  </div>
                  <span className="text-xs bg-gray-200 text-gray-800 px-2 py-0.5 rounded-full font-bold">
                    All Records
                  </span>
                </div>
              </div>

              {/* Filter & Search Bar */}
              <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
                <div className="relative w-full md:w-80">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={contributionSearch}
                    onChange={(e) => setContributionSearch(e.target.value)}
                    placeholder="Search Name, Flat, Phone, UTR, Seva..."
                    className="w-full pl-9 pr-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium focus:ring-1 focus:ring-primary outline-none"
                  />
                  {contributionSearch && (
                    <button
                      onClick={() => setContributionSearch("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto flex-wrap justify-end">
                  {/* Status Filter */}
                  <div className="flex items-center gap-1 text-xs">
                    <Filter size={13} className="text-gray-400" />
                    <select
                      value={contributionStatusFilter}
                      onChange={(e) => setContributionStatusFilter(e.target.value)}
                      className="border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-gray-700 bg-white outline-none cursor-pointer"
                    >
                      <option value="all">All Status</option>
                      <option value="verified">✓ Verified Only</option>
                      <option value="pending">⏳ Pending Review</option>
                      <option value="rejected">✕ Rejected</option>
                    </select>
                  </div>

                  {/* Seva Offering Filter */}
                  <div className="flex items-center gap-1 text-xs">
                    <span className="text-gray-400">🌺</span>
                    <select
                      value={contributionSevaFilter}
                      onChange={(e) => setContributionSevaFilter(e.target.value)}
                      className="border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-gray-700 bg-white outline-none cursor-pointer max-w-[200px]"
                    >
                      <option value="all">All Sevas &amp; Offerings</option>
                      <option value="general">👑 General Pujo Fund</option>
                      <option value="bhog">🍚 Maha Bhog Offerings</option>
                      <option value="sweets">🍬 Sweets &amp; Prasad</option>
                      <option value="flowers">🌺 Flowers &amp; Samagri</option>
                      {categoriesList
                        .filter((cat) => cat.name !== "General Pujo Fund")
                        .map((cat) => (
                          <option key={cat.id} value={cat.name}>
                            {cat.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  {(contributionSearch || contributionStatusFilter !== "all" || contributionSevaFilter !== "all") && (
                    <button
                      onClick={() => {
                        setContributionSearch("");
                        setContributionStatusFilter("all");
                        setContributionSevaFilter("all");
                      }}
                      className="text-[11px] text-primary hover:underline font-bold px-1.5 py-1"
                    >
                      Reset
                    </button>
                  )}

                  <span className="text-[11px] text-gray-400 ml-1 font-mono">
                    Showing {displayedContributions.length} of {contributions.length}
                  </span>
                </div>
              </div>

            </div>

            {/* Submissions Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-100 text-gray-600 font-semibold border-b border-gray-200">
                    <th className="p-3.5">Contributor Name</th>
                    <th className="p-3.5">Flat Number</th>
                    <th className="p-3.5">Phone</th>
                    <th className="p-3.5">Seva / Offering</th>
                    <th className="p-3.5">Amount</th>
                    <th className="p-3.5">UTR / Payment ID</th>
                    <th className="p-3.5">Wall Visibility</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {displayedContributions.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="p-8 text-center text-gray-400">
                        No contributions match the selected filters.
                      </td>
                    </tr>
                  ) : (
                    displayedContributions.map((c) => {
                      const isVerified = c.status === "Success";
                      const isPending = c.status === "Pending" || c.status === "Pending Verification";
                      const isRejected = c.status === "Failed" || c.status === "Rejected";
                      const catName = getContributionCategoryName(c);
                      const sevaBadge = getSevaBadge(catName);

                      return (
                        <tr key={c.id} className={`hover:bg-gray-50/60 ${isPending ? "bg-amber-50/30" : ""}`}>
                          <td className="p-3.5 font-bold text-gray-900">{c.contributor_name}</td>
                          <td className="p-3.5 text-gray-700 font-medium">{c.flat_number || "N/A"}</td>
                          <td className="p-3.5 text-gray-600 font-mono">{c.phone || "N/A"}</td>
                          <td className="p-3.5">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${sevaBadge.badge}`}>
                              <span>{sevaBadge.icon}</span>
                              <span className="truncate max-w-[150px]">{catName}</span>
                            </span>
                          </td>
                          <td className="p-3.5 font-bold text-green-700 text-sm font-mono">₹{Number(c.amount).toLocaleString("en-IN")}</td>
                          <td className="p-3.5 font-mono text-[11px] text-gray-700 font-semibold">{c.payment_id}</td>
                          <td className="p-3.5">
                            <button
                              onClick={() => handleToggleWallVisibility(c)}
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition cursor-pointer flex items-center gap-1 ${
                                c.is_name_visible
                                  ? "bg-green-50 text-green-800 border-green-300 hover:bg-green-100"
                                  : "bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200"
                              }`}
                              title="Click to toggle Wall of Honor public visibility"
                            >
                              {c.is_name_visible ? <Eye size={11} /> : <EyeOff size={11} />}
                              <span>{c.is_name_visible ? "Public" : "Anonymous"}</span>
                            </button>
                          </td>
                          <td className="p-3.5">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              isVerified 
                                ? "bg-green-100 text-green-800" 
                                : isPending 
                                ? "bg-amber-100 text-amber-900 border border-amber-300 animate-pulse" 
                                : "bg-red-100 text-red-800"
                            }`}>
                              {isVerified ? "✓ Verified" : isPending ? "⏳ Pending Review" : "✕ Rejected"}
                            </span>
                          </td>
                          <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                            {/* EDIT CONTRIBUTOR BUTTON */}
                            <button
                              onClick={() => setEditingContribution({ ...c })}
                              className="bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-[11px] px-2.5 py-1 rounded-lg transition inline-flex items-center gap-1 shadow-2xs cursor-pointer"
                              title="Edit contributor name or fix typos"
                            >
                              <Edit2 size={12} />
                              <span>Edit</span>
                            </button>

                            {/* RECEIPT BUTTON */}
                            <button
                              onClick={() => setSelectedReceiptContribution(c)}
                              className="bg-red-50 hover:bg-red-100 text-primary border border-red-200 hover:border-red-300 font-bold text-[11px] px-2.5 py-1 rounded-lg transition inline-flex items-center gap-1 shadow-2xs cursor-pointer"
                              title="Generate and print official devotional receipt"
                            >
                              <Printer size={12} />
                              <span>Receipt</span>
                            </button>

                            {!isVerified && (
                              <button
                                onClick={() => handleUpdateContributionStatus(c.id, "Success")}
                                className="bg-green-600 hover:bg-green-700 text-white font-bold text-[11px] px-2.5 py-1 rounded-lg transition shadow-2xs cursor-pointer"
                                title="Approve and add to public fund ticker & Wall"
                              >
                                Approve (✓)
                              </button>
                            )}
                            {!isRejected && (
                              <button
                                onClick={() => handleUpdateContributionStatus(c.id, "Failed")}
                                className="bg-red-600 hover:bg-red-700 text-white font-bold text-[11px] px-2.5 py-1 rounded-lg transition shadow-2xs cursor-pointer"
                                title="Reject fake/unverified submission"
                              >
                                Reject (✕)
                              </button>
                            )}
                            {isVerified && (
                              <button
                                onClick={() => handleUpdateContributionStatus(c.id, "Pending")}
                                className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-[10px] px-2 py-1 rounded-lg transition cursor-pointer"
                                title="Mark back to Pending"
                              >
                                Revert
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* ADMIN OFFICIAL RECEIPT MODAL */}
          {selectedReceiptContribution && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto">
              <div className="bg-white rounded-3xl max-w-4xl w-full p-4 sm:p-6 shadow-2xl border border-amber-300 my-auto max-h-[95vh] overflow-y-auto relative">
                
                {/* Modal Top Bar */}
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-200 print:hidden">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-red-100 text-primary flex items-center justify-center font-bold">
                      🧾
                    </div>
                    <div>
                      <h4 className="font-heading text-base font-bold text-gray-900">
                        Official Contribution Receipt
                      </h4>
                      <p className="text-[11px] text-gray-500">
                        {selectedReceiptContribution.contributor_name} ({selectedReceiptContribution.flat_number || "PBEL City"}) • ₹{Number(selectedReceiptContribution.amount).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Send WhatsApp to Resident */}
                    <button
                      onClick={() => handleSendResidentWhatsapp(selectedReceiptContribution)}
                      className="bg-[#25D366] hover:bg-[#20BD5A] text-white text-xs font-bold px-3.5 py-1.5 rounded-xl transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
                      title="Open WhatsApp chat with resident to send their official receipt"
                    >
                      <span>📲 Send to Resident</span>
                    </button>

                    {/* Close Modal */}
                    <button
                      onClick={() => setSelectedReceiptContribution(null)}
                      className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition cursor-pointer"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>

                {/* Printable Receipt Component */}
                <OfficialContributionReceipt
                  receiptData={formatContributionToReceipt(selectedReceiptContribution)}
                  branding={branding}
                  onOpenShareModal={() => handleSendResidentWhatsapp(selectedReceiptContribution)}
                />
              </div>
            </div>
          )}

          {/* EDIT CONTRIBUTOR & WALL OF HONOR MODAL */}
          {editingContribution && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
              <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-amber-400 relative my-auto">
                <button
                  onClick={() => setEditingContribution(null)}
                  disabled={isUpdatingContribution}
                  className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition cursor-pointer disabled:opacity-50"
                >
                  <X size={20} />
                </button>

                <div className="flex items-center gap-3 pb-4 mb-4 border-b border-gray-100">
                  <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
                    <Edit2 size={20} />
                  </div>
                  <div>
                    <h4 className="font-heading text-lg font-bold text-gray-900">
                      Edit Contributor & Wall of Honor
                    </h4>
                    <p className="text-xs text-gray-500">
                      Rectify resident spelling typos, flat number, or adjust Wall of Honor visibility.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSaveContributorEdit} className="space-y-4">
                  {/* Reference Meta Info */}
                  <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-gray-500 block">Amount:</span>
                      <span className="font-bold text-green-700 font-mono text-sm">
                        ₹{Number(editingContribution.amount || 0).toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Payment Ref:</span>
                      <span className="font-mono text-gray-700 font-medium">
                        {editingContribution.payment_id || "N/A"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Status:</span>
                      <span className="font-bold text-emerald-700">
                        {editingContribution.status || "Completed"}
                      </span>
                    </div>
                  </div>

                  {/* Contributor Name */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Contributor Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={editingContribution.contributor_name || ""}
                      onChange={(e) =>
                        setEditingContribution({
                          ...editingContribution,
                          contributor_name: e.target.value,
                        })
                      }
                      placeholder="e.g. Anirban Mukherjee"
                      className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-hidden transition"
                    />
                    <span className="text-[11px] text-gray-500 mt-1 block">
                      Displayed on the Wall of Honor and Official Contribution Receipt.
                    </span>
                  </div>

                  {/* Flat Number */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Flat Number / PBEL Tower
                    </label>
                    <input
                      type="text"
                      value={editingContribution.flat_number || ""}
                      onChange={(e) =>
                        setEditingContribution({
                          ...editingContribution,
                          flat_number: e.target.value,
                        })
                      }
                      placeholder="e.g. Tower G - 1402 or Flat 504"
                      className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-hidden transition"
                    />
                  </div>

                  {/* Wall of Honor Visibility Checkbox */}
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-3.5 flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="edit_is_name_visible"
                      checked={Boolean(editingContribution.is_name_visible)}
                      onChange={(e) =>
                        setEditingContribution({
                          ...editingContribution,
                          is_name_visible: e.target.checked,
                        })
                      }
                      className="mt-0.5 h-4 w-4 text-amber-600 focus:ring-amber-400 border-gray-300 rounded cursor-pointer"
                    />
                    <label htmlFor="edit_is_name_visible" className="text-xs text-gray-700 cursor-pointer">
                      <span className="font-bold text-gray-900 block">
                        Show Name on Public Devotee Wall of Honor
                      </span>
                      If unchecked, the devotee will appear as{" "}
                      <span className="font-semibold italic text-gray-800">&quot;Devout Well Wisher&quot;</span> on the website to preserve their privacy.
                    </label>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => setEditingContribution(null)}
                      disabled={isUpdatingContribution}
                      className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition cursor-pointer disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isUpdatingContribution}
                      className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-5 py-2 rounded-xl transition flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
                    >
                      {isUpdatingContribution ? (
                        <span>Saving...</span>
                      ) : (
                        <>
                          <Save size={13} />
                          <span>Save Changes</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          {showSponsorCopyModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
              <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-amber-400 relative">
                <button
                  onClick={() => {
                    setShowSponsorCopyModal(false);
                    setSponsorCopied(false);
                  }}
                  className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-700 rounded-full cursor-pointer"
                >
                  <X size={18} />
                </button>

                <div className="flex items-center gap-2 mb-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
                    📢
                  </div>
                  <div>
                    <h4 className="font-heading text-base font-bold text-gray-900">
                      Publish Seva Sponsors
                    </h4>
                    <p className="text-[11px] text-gray-500">
                      Generate ready-to-share announcement for WhatsApp tower groups &amp; notice boards.
                    </p>
                  </div>
                </div>

                <div className="space-y-4 my-4">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Select Offering to Publish:</label>
                    <select
                      value={sponsorCopyCategory}
                      onChange={(e) => setSponsorCopyCategory(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl p-2.5 text-xs font-semibold text-gray-800 bg-white outline-none cursor-pointer"
                    >
                      <option value="all">🌟 All Seva Offerings</option>
                      <option value="bhog">🍚 Maha Bhog Sponsors</option>
                      <option value="sweets">🍬 Sweets &amp; Prasad Sponsors</option>
                      <option value="general">👑 General Pujo Fund</option>
                      {categoriesList
                        .filter((c) => c.name !== "General Pujo Fund")
                        .map((c) => (
                          <option key={c.id} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 text-xs text-gray-600">
                    <span className="font-bold text-gray-800 block mb-0.5">Note:</span>
                    Only <strong>Verified (Success)</strong> devotee contributions will be included in the broadcast list.
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={handleCopySponsorsList}
                    className="flex-1 bg-primary hover:bg-primary-hover text-white py-2.5 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                  >
                    {sponsorCopied ? <CheckCircle2 size={15} className="text-amber-300" /> : <Copy size={15} />}
                    <span>{sponsorCopied ? "Announcement Copied to Clipboard!" : "Copy WhatsApp Announcement"}</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowSponsorCopyModal(false);
                      setSponsorCopied(false);
                    }}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold px-4 py-2.5 rounded-xl transition cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* TAB CONTENT: 3. SEVA CATEGORIES CMS */}
      {activeTab === "categories" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs h-fit">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <HeartHandshake size={18} className="text-primary" />
                <h3 className="font-heading text-lg font-bold text-gray-900">
                  {isEditingCategory ? "Edit Seva Category & Limits" : "Add New Seva Category"}
                </h3>
              </div>
              {isEditingCategory && (
                <button
                  onClick={() => {
                    setIsEditingCategory(false);
                    setNewCategory({ id: "", name: "", fixed_amount: 1001, description: "", max_limit: 5, is_active: true, is_featured: false, pujo_day: "", pujo_date: "" });
                  }}
                  className="text-xs text-gray-500 hover:text-gray-800 flex items-center gap-1"
                >
                  <X size={14} /> Cancel
                </button>
              )}
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Seva Offering Title *</label>
                <input
                  type="text"
                  required
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  placeholder="e.g. Saptami Maha Bhog Seva"
                  className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Pujo Phase / Day</label>
                  <select
                    value={newCategory.pujo_day || ""}
                    onChange={(e) => {
                      const selectedDay = e.target.value;
                      const dayPreset = PUJO_DAYS[selectedDay];
                      setNewCategory({ 
                        ...newCategory, 
                        pujo_day: selectedDay,
                        pujo_date: dayPreset ? dayPreset.dateStr : (newCategory.pujo_date || "")
                      });
                    }}
                    className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none font-medium text-amber-950 bg-amber-50/50"
                  >
                    <option value="">Auto-detect from Title</option>
                    <option value="panchami">15 Oct • Maha Panchami</option>
                    <option value="shashthi">16 Oct • Maha Sashti</option>
                    <option value="saptami">17 Oct • Maha Saptami</option>
                    <option value="ashtami">18 Oct • Maha Ashtami</option>
                    <option value="nabami">19 Oct • Maha Nabami</option>
                    <option value="dashami">20 Oct • Bijoya Dashami</option>
                    <option value="grand">👑 All 6 Days (Grand Patrons / General)</option>
                    <option value="custom">Special / Custom Day</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Calendar Date (Editable)
                  </label>
                  <input
                    type="text"
                    value={newCategory.pujo_date || ""}
                    onChange={(e) => setNewCategory({ ...newCategory, pujo_date: e.target.value })}
                    placeholder="e.g. 17 Oct 2026"
                    className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none font-medium text-gray-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Fixed Amount (₹ INR) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newCategory.fixed_amount}
                    onChange={(e) => setNewCategory({ ...newCategory, fixed_amount: Number(e.target.value) })}
                    placeholder="2501"
                    className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none font-semibold text-primary"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Max Contributions Allowed *</label>
                  <input
                    type="number"
                    min="1"
                    value={newCategory.max_limit || 5}
                    onChange={(e) => setNewCategory({ ...newCategory, max_limit: Number(e.target.value) })}
                    placeholder="e.g. 5 or 10"
                    className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none font-semibold text-amber-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Public Availability Status</label>
                <select
                  value={newCategory.is_active ? "true" : "false"}
                  onChange={(e) => setNewCategory({ ...newCategory, is_active: e.target.value === "true" })}
                  className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                >
                  <option value="true">Active (Open for Public Contributions)</option>
                  <option value="false">Disabled / Hidden from Public</option>
                </select>
              </div>

              {/* Homepage Feature Toggle */}
              <div className="flex items-center gap-2.5 p-3 bg-amber-50/80 rounded-xl border border-amber-300/80">
                <input
                  type="checkbox"
                  id="cat_featured_cb"
                  checked={newCategory.is_featured}
                  onChange={(e) => setNewCategory({ ...newCategory, is_featured: e.target.checked })}
                  className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary cursor-pointer"
                />
                <label htmlFor="cat_featured_cb" className="font-bold text-gray-800 cursor-pointer select-none text-xs">
                  ⭐ Feature in Homepage Quick Contribute Showcase
                </label>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Description / Details</label>
                <textarea
                  rows={3}
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                  placeholder="Items included in this seva..."
                  className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              <div className="space-y-2 pt-1">
                <button
                  type="submit"
                  disabled={isSubmittingCategory}
                  className="w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-xl font-bold transition shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Save size={15} />
                  <span>{isSubmittingCategory ? "Saving..." : isEditingCategory ? "Update Seva Limits & Info" : "Publish Seva Category"}</span>
                </button>

                {isEditingCategory && (
                  <button
                    type="button"
                    onClick={() => handleDeleteCategory(newCategory.id, newCategory.name)}
                    className="w-full bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 py-2.5 rounded-xl font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 size={14} />
                    <span>Delete This Seva Category Permanently</span>
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50/50 flex items-center justify-between">
              <div>
                <h3 className="font-heading text-lg font-bold text-gray-900">Live Seva Packages & Slot Counters</h3>
                <span className="text-xs text-gray-500">Categories auto-greyout on `/contribute` when limit is reached.</span>
              </div>
              <span className="text-xs bg-amber-100 text-amber-900 font-bold px-3 py-1 rounded-full">
                {categoriesList.length} Packages
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-100 text-gray-600 font-semibold border-b border-gray-200">
                    <th className="p-3.5">Seva Title</th>
                    <th className="p-3.5">Pujo Day</th>
                    <th className="p-3.5">Price</th>
                    <th className="p-3.5">Max Limit</th>
                    <th className="p-3.5">Booked</th>
                    <th className="p-3.5">Remaining</th>
                    <th className="p-3.5">Homepage</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {categoriesList.map((cat) => {
                    const decoded = decodeCategoryDescription(cat.description);
                    const dayInfo = inferSevaDayAndDate(cat.name, decoded.cleanDescription, decoded.parsedDay, decoded.parsedDate);
                    const booked = contributions.filter(
                      (c) => (c.category_id === cat.id || c.contribution_categories?.name?.toLowerCase() === cat.name?.toLowerCase()) && c.status !== "Rejected"
                    ).length;
                    
                    const max = cat.max_limit !== undefined && cat.max_limit !== null 
                      ? Number(cat.max_limit) 
                      : (decoded.parsedLimit !== undefined ? decoded.parsedLimit : 5);
                      
                    const isActive = cat.is_active !== undefined 
                      ? (cat.is_active !== false) 
                      : (decoded.parsedActive !== undefined ? decoded.parsedActive : true);

                    const isFeatured = decoded.parsedFeatured ?? false;

                    const remaining = Math.max(0, max - booked);
                    const isFull = remaining <= 0;

                    return (
                      <tr key={cat.id} className={`hover:bg-gray-50/60 ${isFull || !isActive ? "bg-gray-50/70" : ""}`}>
                        <td className="p-3.5 font-bold text-gray-900">{cat.name}</td>
                        <td className="p-3.5 whitespace-nowrap">
                          <span className="px-2.5 py-1 rounded-full text-[10.5px] font-bold bg-amber-50 text-amber-900 border border-amber-300">
                            {dayInfo.dateStr.split(" ")[0]} {dayInfo.dateStr.split(" ")[1]} • {dayInfo.dayName}
                          </span>
                        </td>
                        <td className="p-3.5 font-bold text-primary font-mono">₹{cat.fixed_amount ? Number(cat.fixed_amount).toLocaleString("en-IN") : "Custom"}</td>
                        <td className="p-3.5 font-semibold text-gray-800">{max} slots</td>
                        <td className="p-3.5 font-bold text-amber-900">{booked}</td>
                        <td className="p-3.5">
                          <span className={`font-bold font-mono ${remaining > 0 ? "text-green-700" : "text-red-600"}`}>
                            {remaining} left
                          </span>
                        </td>
                        <td className="p-3.5">
                          <button
                            onClick={() => handleToggleFeaturedCategory(cat)}
                            className={`px-2.5 py-1 rounded-xl text-[10px] font-bold transition flex items-center gap-1 ${
                              isFeatured
                                ? "bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs hover:bg-amber-200"
                                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                            }`}
                            title="Click to toggle Homepage feature status"
                          >
                            {isFeatured ? "⭐ Featured" : "☆ Standard"}
                          </button>
                        </td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            !isActive 
                              ? "bg-gray-200 text-gray-700" 
                              : isFull 
                              ? "bg-red-100 text-red-800" 
                              : "bg-green-100 text-green-800"
                          }`}>
                            {!isActive ? "Inactive" : isFull ? "🔒 Full" : "✓ Active"}
                          </span>
                        </td>
                        <td className="p-3.5 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                const currentDayInfo = inferSevaDayAndDate(cat.name, decoded.cleanDescription, decoded.parsedDay, decoded.parsedDate);
                                setNewCategory({
                                  id: cat.id,
                                  name: cat.name,
                                  fixed_amount: cat.fixed_amount ? Number(cat.fixed_amount) : 1001,
                                  description: decoded.cleanDescription,
                                  max_limit: max,
                                  is_active: isActive,
                                  is_featured: isFeatured,
                                  pujo_day: decoded.parsedDay || currentDayInfo.dayId || "",
                                  pujo_date: decoded.parsedDate || currentDayInfo.dateStr || "",
                                });
                                setIsEditingCategory(true);
                                window.scrollTo({ top: 380, behavior: "smooth" });
                              }}
                              className="px-2.5 py-1 text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-lg transition flex items-center gap-1 cursor-pointer"
                              title="Edit category, limits & dates"
                            >
                              <Edit2 size={12} />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(cat.id, cat.name)}
                              className="px-2.5 py-1 text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition flex items-center gap-1 cursor-pointer"
                              title="Delete this Seva category from website"
                            >
                              <Trash2 size={12} />
                              <span>Delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB CONTENT: 4. SCHEDULE & PRATIBIMB STAGE CMS */}
      {activeTab === "schedule" && (
        <div className="space-y-6">
          
          {/* Sub Switcher */}
          <div className="flex items-center gap-2 bg-gray-100 p-1.5 rounded-2xl w-fit border border-gray-200">
            <button
              onClick={() => setScheduleSubView("schedule")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                scheduleSubView === "schedule"
                  ? "bg-white text-primary shadow-xs"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Calendar size={14} />
              <span>1. Pujo Nirghanto Schedule CMS</span>
            </button>
            <button
              onClick={() => setScheduleSubView("pratibimb")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                scheduleSubView === "pratibimb"
                  ? "bg-white text-primary shadow-xs"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Music size={14} />
              <span>2. Pratibimb Stage Slots & Registered Acts ({performances.length})</span>
            </button>
          </div>

          {scheduleSubView === "schedule" && (() => {
            const activeDay = scheduleDays.find((d) => d.id === selectedNirghantoDayId) || scheduleDays[1] || scheduleDays[0];
            const activeRituals = activeDay?.rituals || [];

            return (
              <div className="space-y-6">
                {/* 0. Hero Banner Highlight Chips CMS */}
                <div className="bg-gradient-to-r from-amber-900/10 via-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-300 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="font-heading text-base font-bold text-amber-950 flex items-center gap-2">
                        <Sparkles size={18} className="text-primary" />
                        <span>Pujo Nirghanto Hero Banner Highlights (3 Dynamic Chips)</span>
                      </h4>
                      <p className="text-xs text-amber-900/80 mt-0.5">
                        Customize the 3 headline highlights shown on top of the Schedule page (/programs) in real-time.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleResetHeroChips}
                        className="text-xs text-gray-600 hover:text-gray-900 bg-white border border-gray-200 px-3 py-1.5 rounded-xl font-semibold transition cursor-pointer"
                      >
                        Reset Defaults
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveHeroChips}
                        disabled={isSavingHeroChips}
                        className="text-xs bg-primary hover:bg-primary-hover text-white px-4 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 shadow-xs disabled:opacity-50 cursor-pointer"
                      >
                        <Save size={13} />
                        <span>{isSavingHeroChips ? "Saving..." : "Save Highlights Live"}</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {heroChips.map((chip, idx) => (
                      <div key={chip.id || idx} className="bg-white p-3.5 rounded-xl border border-amber-200 shadow-2xs space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wide">
                            Highlight Chip #{idx + 1}
                          </span>
                          <select
                            value={chip.icon}
                            onChange={(e) => {
                              const updated = [...heroChips];
                              updated[idx] = { ...updated[idx], icon: e.target.value as any };
                              setHeroChips(updated);
                            }}
                            className="text-xs p-1 border border-gray-200 rounded-lg bg-gray-50 font-semibold text-gray-700 outline-none"
                          >
                            <option value="sparkles">✨ Sparkles</option>
                            <option value="flame">🔥 Flame / Aarti</option>
                            <option value="music">🎵 Music / Cultural</option>
                            <option value="calendar">📅 Calendar</option>
                            <option value="heart">❤️ Heart</option>
                            <option value="star">⭐ Star / Flagship</option>
                          </select>
                        </div>

                        <input
                          type="text"
                          value={chip.text}
                          onChange={(e) => {
                            const updated = [...heroChips];
                            updated[idx] = { ...updated[idx], text: e.target.value };
                            setHeroChips(updated);
                          }}
                          placeholder="e.g. Kumari Puja: 18 Oct 11:30 AM"
                          className="w-full p-2 border border-gray-200 rounded-lg text-xs font-semibold text-gray-900 outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* 1. Day Selector Tab Bar */}
                <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-xs space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                    <div>
                      <h4 className="font-heading text-base font-bold text-gray-900 flex items-center gap-2">
                        <Calendar size={18} className="text-primary" />
                        <span>Select Pujo Day to Manage Nirghanto</span>
                      </h4>
                      <p className="text-xs text-gray-500">
                        Choose a day to view, add, edit, or delete rituals. All changes save live to Cloud Config and sync with the Schedule page.
                      </p>
                    </div>
                    <button
                      onClick={handleRestoreDefaultSchedule}
                      className="text-xs font-semibold text-gray-500 hover:text-red-700 hover:bg-red-50 border border-gray-200 px-3 py-1.5 rounded-xl transition w-fit"
                      title="Reset all 6 days to default schedule"
                    >
                      🔄 Restore Baseline Defaults
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                    {scheduleDays.map((d) => {
                      const isSelected = selectedNirghantoDayId === d.id;
                      return (
                        <button
                          key={d.id}
                          onClick={() => {
                            setSelectedNirghantoDayId(d.id);
                            setIsEditingEvent(false);
                            setNewEvent({
                              id: "",
                              title: "",
                              event_type: "Nirghanto",
                              date: d.isoDate,
                              time: "08:30 AM",
                              description: "",
                            });
                          }}
                          className={`p-3 rounded-2xl text-xs font-bold transition flex flex-col items-center justify-center gap-1 border text-center ${
                            isSelected
                              ? "bg-primary text-white border-primary shadow-md ring-2 ring-primary/20 scale-[1.02]"
                              : "bg-gray-50/80 hover:bg-amber-50 text-gray-700 border-gray-200"
                          }`}
                        >
                          <span className="text-[11px] font-normal opacity-90">{d.date}</span>
                          <span className="font-heading text-xs truncate max-w-full">{d.dayName}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold mt-0.5 ${
                            isSelected ? "bg-white/25 text-white" : "bg-amber-100 text-amber-900"
                          }`}>
                            {d.rituals.length} rituals
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Active Day Editor & Rituals Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Left Column: Add / Edit Ritual Form */}
                  <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs h-fit space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                      <div className="flex items-center gap-2">
                        <PlusCircle size={18} className="text-primary" />
                        <div>
                          <h3 className="font-heading text-base font-bold text-gray-900">
                            {isEditingEvent ? "Edit Ritual" : `Add Ritual to ${activeDay.dayName}`}
                          </h3>
                          <span className="text-[11px] text-amber-800 font-semibold">{activeDay.date} ({activeDay.dayName})</span>
                        </div>
                      </div>
                      {isEditingEvent && (
                        <button
                          onClick={() => {
                            setIsEditingEvent(false);
                            setNewEvent({ id: "", title: "", event_type: "Nirghanto", date: activeDay.isoDate, time: "08:30 AM", description: "" });
                          }}
                          className="text-xs text-gray-500 hover:text-gray-800 flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-lg"
                        >
                          <X size={13} /> Cancel
                        </button>
                      )}
                    </div>

                    <form onSubmit={handleSaveEvent} className="space-y-4 text-xs">
                      <div>
                        <label className="block font-semibold text-gray-700 mb-1">Ritual / Event Title *</label>
                        <input
                          type="text"
                          required
                          value={newEvent.title}
                          onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                          placeholder="e.g. Maha Sashti Pushpanjali / Sandhi Pujo"
                          className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none font-semibold text-gray-900"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block font-semibold text-gray-700 mb-1">Pujo Day</label>
                          <input
                            type="text"
                            disabled
                            value={`${activeDay.date} (${activeDay.dayName})`}
                            className="w-full p-2.5 border border-gray-200 rounded-xl bg-gray-100 font-semibold text-gray-700 outline-none text-[11px] cursor-not-allowed"
                          />
                        </div>

                        <div>
                          <label className="block font-semibold text-gray-700 mb-1">Time (e.g. 08:30 AM) *</label>
                          <input
                            type="text"
                            required
                            value={newEvent.time}
                            onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                            placeholder="08:30 AM"
                            className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none font-mono text-gray-900 font-bold"
                          />
                        </div>
                      </div>

                      {/* Fast Preset Time Chips */}
                      <div>
                        <span className="text-[10px] text-gray-400 font-semibold block mb-1">Quick Time Presets:</span>
                        <div className="flex flex-wrap gap-1">
                          {["07:30 AM", "08:30 AM", "09:30 AM", "11:30 AM", "01:00 PM", "04:30 PM", "06:30 PM", "07:45 PM", "08:30 PM"].map((t) => (
                            <button
                              key={t}
                              type="button"
                              onClick={() => setNewEvent({ ...newEvent, time: t })}
                              className={`px-2 py-1 rounded-lg text-[10px] font-mono transition border ${
                                newEvent.time === t
                                  ? "bg-primary text-white border-primary"
                                  : "bg-gray-50 text-gray-600 border-gray-200 hover:border-primary"
                              }`}
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block font-semibold text-gray-700 mb-1">Category / Type</label>
                        <select
                          value={newEvent.event_type}
                          onChange={(e) => setNewEvent({ ...newEvent, event_type: e.target.value })}
                          className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none font-semibold text-gray-800"
                        >
                          <option value="Nirghanto">Pujo Ritual / Puja Nirghanto</option>
                          <option value="Bhog">Maha Bhog / Food Offering</option>
                          <option value="Aarti">Dhunuchi &amp; Sandhya Aarti</option>
                          <option value="Pratibimb">Pratibimb Cultural Night</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-semibold text-gray-700 mb-1">Short Description (Optional)</label>
                        <textarea
                          rows={2}
                          value={newEvent.description}
                          onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                          placeholder="Devotional synopsis or resident instructions..."
                          className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none text-xs"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmittingEvent}
                        className="w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-xl font-bold transition shadow-xs flex items-center justify-center gap-1.5 disabled:opacity-50"
                      >
                        <Save size={15} />
                        <span>{isEditingEvent ? `Update on ${activeDay.dayName}` : `Save to ${activeDay.dayName} Nirghanto`}</span>
                      </button>
                    </form>
                  </div>

                  {/* Right Column: Schedule Timeline Table for Active Day */}
                  <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden flex flex-col justify-between">
                    <div>
                      <div className="p-4 border-b border-gray-200 bg-gray-50/50 flex items-center justify-between">
                        <div>
                          <h3 className="font-heading text-lg font-bold text-gray-900 flex items-center gap-2">
                            <span>{activeDay.dayName} Nirghanto</span>
                            <span className="text-xs bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full font-normal">
                              {activeDay.date}
                            </span>
                          </h3>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Theme: <strong className="text-amber-900">{activeDay.theme}</strong> ({activeRituals.length} ritual events sorted chronologically)
                          </p>
                        </div>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="bg-gray-100 text-gray-600 font-semibold border-b border-gray-200">
                              <th className="p-3.5">Time</th>
                              <th className="p-3.5">Ritual Event &amp; Details</th>
                              <th className="p-3.5">Type</th>
                              <th className="p-3.5 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {activeRituals.map((ritual, idx) => (
                              <tr key={`${ritual.event}-${idx}`} className="hover:bg-gray-50/60">
                                <td className="p-3.5 whitespace-nowrap">
                                  <span className="font-mono font-bold text-primary bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg">
                                    {ritual.time}
                                  </span>
                                </td>
                                <td className="p-3.5">
                                  <span className="font-bold text-gray-900 block">{ritual.event}</span>
                                  {ritual.description && (
                                    <span className="text-[11px] text-gray-500 line-clamp-2 mt-0.5">
                                      {ritual.description}
                                    </span>
                                  )}
                                </td>
                                <td className="p-3.5">
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                                    ritual.type === "ritual"
                                      ? "bg-red-100 text-red-800"
                                      : ritual.type === "bhog"
                                      ? "bg-amber-100 text-amber-900"
                                      : ritual.type === "aarti"
                                      ? "bg-orange-100 text-orange-800"
                                      : "bg-purple-100 text-purple-800"
                                  }`}>
                                    {ritual.type}
                                  </span>
                                </td>
                                <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                                  <button
                                    onClick={() => handleEditEvent(ritual, activeDay.isoDate)}
                                    className="p-1.5 text-amber-700 hover:bg-amber-100 rounded-lg transition"
                                    title="Edit Ritual"
                                  >
                                    <Edit2 size={14} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteEvent(ritual.event)}
                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                                    title="Delete Ritual"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </td>
                              </tr>
                            ))}
                            {activeRituals.length === 0 && (
                              <tr>
                                <td colSpan={4} className="p-8 text-center text-gray-400">
                                  No rituals added for {activeDay.dayName} yet. Use the form on the left to add rituals!
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="p-4 bg-amber-50/60 border-t border-amber-200 text-xs text-amber-950 flex flex-col sm:flex-row items-center justify-between gap-2">
                      <span>
                        💡 <strong>Tip:</strong> Rituals are sorted automatically in chronological order from morning to evening.
                      </span>
                      <button
                        onClick={() => {
                          const ev = eveningsConfig.find((e) => e.dayId === activeDay.id || e.id.includes(activeDay.id)) || eveningsConfig[0];
                          if (ev) setEditingEvening(ev);
                        }}
                        className="text-xs font-bold text-primary hover:text-primary-hover underline cursor-pointer"
                      >
                        Edit {activeDay.dayName} Evening Theme &amp; Line-Up →
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            );
          })()}

          {scheduleSubView === "pratibimb" && (
            <div className="space-y-6">
              
              {/* Pratibimb Timing & Slots Config */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-2 mb-6">
                  <div>
                    <h3 className="font-heading text-xl font-bold text-primary">
                      Pratibimb Evening Slots &amp; Timings Configuration
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Set daily evening start/end timings, maximum resident slot capacities, and manage PSS Flagship Headliners.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {eveningsConfig.map((ev) => (
                    <div key={ev.id} className="bg-gray-50/80 rounded-2xl p-5 border border-gray-200 flex flex-col justify-between relative group hover:border-amber-400 transition">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full uppercase">
                            {ev.day} ({ev.date})
                          </span>
                          {ev.hasPssFlagship && (
                            <span className="text-[10px] font-bold bg-amber-200 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Star size={10} className="fill-amber-600 text-amber-600" /> PSS Headliner
                            </span>
                          )}
                        </div>

                        <div>
                          <h4 className="font-heading text-base font-bold text-gray-900 mb-1">{ev.theme}</h4>
                          {ev.description && (
                            <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed">{ev.description}</p>
                          )}
                        </div>
                        
                        <div className="space-y-1.5 text-xs text-gray-600 pt-2.5 border-t border-gray-200">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-500">Stage Timings:</span>
                            <span className="font-bold text-gray-900">{ev.startTime} - {ev.endTime}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-500">Max Resident Slots:</span>
                            <span className="font-bold text-primary">{ev.maxResidentSlots} Slots</span>
                          </div>
                        </div>

                        {/* Featured Acts Lineup */}
                        {ev.acts && ev.acts.length > 0 && (
                          <div className="pt-2 border-t border-gray-200/80">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                              Featured Acts Lineup ({ev.acts.length}):
                            </span>
                            <ul className="space-y-1">
                              {ev.acts.map((act: string, idx: number) => (
                                <li key={idx} className="text-[11px] text-gray-700 flex items-start gap-1 font-medium">
                                  <span className="text-primary font-bold">›</span>
                                  <span>{act}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* PSS Flagship Details */}
                        {ev.hasPssFlagship && (
                          <div className="p-3 bg-amber-100/70 rounded-xl border border-amber-300 text-xs space-y-0.5">
                            <span className="text-[10px] font-bold text-amber-900 uppercase block">⭐ Flagship Show:</span>
                            <p className="font-bold text-gray-900">{ev.pssEventTitle}</p>
                            <span className="text-amber-800 font-semibold text-[11px] block">{ev.pssEventTime} ({ev.pssDuration})</span>
                            {ev.pssGenre && <span className="text-gray-600 text-[10px] block italic">{ev.pssGenre}</span>}
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => setEditingEvening({
                          ...ev,
                          actsText: (ev.acts || []).join("\n"),
                        })}
                        className="mt-4 w-full bg-white hover:bg-amber-50 text-gray-800 hover:text-primary border border-gray-300 hover:border-amber-300 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-2xs"
                      >
                        <Settings size={13} /> Edit Theme, Featured Acts &amp; Headliner
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Registered Resident Acts Table */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
                <div className="p-4 border-b border-gray-200 bg-gray-50/50 flex items-center justify-between">
                  <h3 className="font-heading text-lg font-bold text-gray-900">
                    Registered Resident Stage Performers ({performances.length})
                  </h3>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setIsEmceeModalOpen(true)} 
                      className="bg-primary hover:bg-primary-hover text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-xs transition"
                    >
                      <ClipboardList size={14} /> Open Emcee Run-Sheet
                    </button>
                    <button onClick={() => window.print()} className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1.5">
                      <Download size={14} /> Print
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-gray-100 text-gray-600 font-semibold border-b border-gray-200">
                        <th className="p-3.5">Contact Lead</th>
                        <th className="p-3.5">Flat Number</th>
                        <th className="p-3.5">WhatsApp Phone</th>
                        <th className="p-3.5">Performance Date &amp; Day</th>
                        <th className="p-3.5">Genre</th>
                        <th className="p-3.5">Format</th>
                        <th className="p-3.5">Song / Act</th>
                        <th className="p-3.5">Performers List</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {performances.map((p) => (
                        <tr key={p.id} className="hover:bg-gray-50/60">
                          <td className="p-3.5 font-bold text-gray-900">{p.contact_name}</td>
                          <td className="p-3.5 text-gray-700">{p.flat_number}</td>
                          <td className="p-3.5 text-gray-600 font-mono">{p.phone}</td>
                          <td className="p-3.5">
                            <span className="bg-amber-100 text-amber-950 font-bold px-2.5 py-1 rounded-full text-[11px] whitespace-nowrap border border-amber-300/80 shadow-2xs inline-flex items-center gap-1">
                              <span>📅</span> {formatPerformanceDate(p)}
                            </span>
                          </td>
                          <td className="p-3.5 font-semibold text-primary">{p.performance_type}</td>
                          <td className="p-3.5 text-gray-600">{p.format}</td>
                          <td className="p-3.5 font-medium text-amber-900">{p.song_name || "N/A"}</td>
                          <td className="p-3.5 max-w-xs truncate text-gray-500">{p.participant_names}</td>
                        </tr>
                      ))}
                      {performances.length === 0 && (
                        <tr>
                          <td colSpan={8} className="p-6 text-center text-gray-500">
                            No resident performance submissions recorded yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* Edit Modal for Evening Timing, Featured Acts & Headliner */}
          {editingEvening && (
            <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full border border-amber-400/40 shadow-2xl relative max-h-[90vh] overflow-y-auto">
                <button onClick={() => setEditingEvening(null)} className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition">
                  <X size={18} />
                </button>

                <div className="mb-4 pb-2 border-b border-gray-100">
                  <span className="text-xs font-bold bg-amber-100 text-amber-900 px-3 py-1 rounded-full uppercase">
                    {editingEvening.day} ({editingEvening.date})
                  </span>
                  <h3 className="font-heading text-2xl font-bold text-gray-900 mt-2">
                    Edit Evening, Featured Acts &amp; Headliner
                  </h3>
                  <p className="text-xs text-gray-500">Updates will reflect live across the homepage and /programs schedule card.</p>
                </div>

                <form onSubmit={handleSaveEveningConfig} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Evening Theme / Main Title *</label>
                    <input
                      type="text"
                      required
                      value={editingEvening.theme}
                      onChange={(e) => setEditingEvening({ ...editingEvening, theme: e.target.value })}
                      className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Evening Synopsis / Description</label>
                    <textarea
                      rows={2}
                      value={editingEvening.description || ""}
                      onChange={(e) => setEditingEvening({ ...editingEvening, description: e.target.value })}
                      placeholder="Welcoming Maa Durga with heartfelt Agomoni songs, traditional Rabindra Sangeet..."
                      className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Stage Start Time *</label>
                      <input
                        type="text"
                        required
                        value={editingEvening.startTime}
                        onChange={(e) => setEditingEvening({ ...editingEvening, startTime: e.target.value })}
                        placeholder="06:30 PM"
                        className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Stage End Time *</label>
                      <input
                        type="text"
                        required
                        value={editingEvening.endTime}
                        onChange={(e) => setEditingEvening({ ...editingEvening, endTime: e.target.value })}
                        placeholder="10:30 PM"
                        className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Max Resident Performance Slots Capacity *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      max="40"
                      value={editingEvening.maxResidentSlots}
                      onChange={(e) => setEditingEvening({ ...editingEvening, maxResidentSlots: Number(e.target.value) })}
                      className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none font-bold text-primary"
                    />
                  </div>

                  {/* FEATURED ACTS OF THE EVENING (BULLET POINTS) */}
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="block font-bold text-gray-900">
                        Featured Acts of the Evening (Program Lineup)
                      </label>
                      <span className="text-[10px] text-gray-400 font-semibold">1 act per line</span>
                    </div>
                    <p className="text-[11px] text-gray-500">
                      These bullet points appear under "Featured Acts of the Evening" on the Cultural Stage Card.
                    </p>
                    <textarea
                      rows={3}
                      value={editingEvening.actsText !== undefined ? editingEvening.actsText : (editingEvening.acts || []).join("\n")}
                      onChange={(e) => setEditingEvening({ ...editingEvening, actsText: e.target.value })}
                      placeholder="Agomoni Choral Melodies&#10;Kids Anandamela Performance&#10;Opening Classical Dance Recital"
                      className="w-full p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary outline-none font-mono text-xs bg-white"
                    />
                  </div>

                  {/* PSS FLAGSHIP HEADLINER SECTION */}
                  <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50/60 rounded-2xl border border-amber-300 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-amber-950 flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={Boolean(editingEvening.hasPssFlagship)}
                          onChange={(e) => setEditingEvening({ ...editingEvening, hasPssFlagship: e.target.checked })}
                          className="w-4 h-4 text-primary rounded"
                        />
                        <span>Enable PSS Flagship Headliner Show</span>
                      </label>
                      {editingEvening.hasPssFlagship && (
                        <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-2.5 py-0.5 rounded-full border border-amber-300 flex items-center gap-1">
                          <Star size={10} className="fill-amber-600 text-amber-600" /> Active Headliner
                        </span>
                      )}
                    </div>

                    {editingEvening.hasPssFlagship && (
                      <div className="space-y-3 pt-2 border-t border-amber-200/80">
                        <div>
                          <label className="block font-bold text-gray-800 mb-1">Show / Artist Title *</label>
                          <input
                            type="text"
                            value={editingEvening.pssEventTitle || ""}
                            onChange={(e) => setEditingEvening({ ...editingEvening, pssEventTitle: e.target.value })}
                            placeholder="e.g. 🎸 Retro Rock by Fushmontor"
                            className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none font-bold bg-white"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold text-gray-700 mb-1">Genre &amp; Performance Style</label>
                          <input
                            type="text"
                            value={editingEvening.pssGenre || ""}
                            onChange={(e) => setEditingEvening({ ...editingEvening, pssGenre: e.target.value })}
                            placeholder="e.g. Live Bengali & Bollywood Retro Rock Fusion"
                            className="w-full p-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none bg-white text-xs"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2.5">
                          <div>
                            <label className="block font-semibold text-gray-700 mb-1">Headliner Stage Time</label>
                            <input
                              type="text"
                              value={editingEvening.pssEventTime || ""}
                              onChange={(e) => setEditingEvening({ ...editingEvening, pssEventTime: e.target.value })}
                              placeholder="08:15 PM Start"
                              className="w-full p-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none bg-white text-xs font-mono"
                            />
                          </div>
                          <div>
                            <label className="block font-semibold text-gray-700 mb-1">Duration</label>
                            <input
                              type="text"
                              value={editingEvening.pssDuration || ""}
                              onChange={(e) => setEditingEvening({ ...editingEvening, pssDuration: e.target.value })}
                              placeholder="1.5 Hours (90 mins)"
                              className="w-full p-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none bg-white text-xs font-mono"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingEvening(null)}
                      className="px-4 py-2.5 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-primary hover:bg-primary-hover text-white py-2.5 px-6 rounded-xl font-bold transition shadow-sm golden-glow"
                    >
                      Save &amp; Sync Live to Website
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>
      )}

      {/* TAB CONTENT: 6. VOLUNTEERS ROSTER & WHATSAPP DISPATCH */}
      {activeTab === "volunteers" && (
        <div className="space-y-6">
          
          {/* WhatsApp Dispatch Toolbar */}
          <div className="bg-gradient-to-r from-green-50 via-emerald-50/50 to-white rounded-2xl p-5 border border-green-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1 text-[11px] font-bold text-green-800 uppercase tracking-wider mb-1">
                <span>💬 WhatsApp Shift Dispatcher</span>
              </div>
              <h3 className="font-heading text-lg font-bold text-gray-900">
                1-Click Ready-to-Paste WhatsApp Duty Rosters
              </h3>
              <p className="text-xs text-gray-600">
                Click any department below to generate and copy a clean, beautifully formatted seva roster to paste directly into your core team WhatsApp group.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleCopyWhatsAppRoster("Bhog", "All Days")}
                className="bg-white hover:bg-green-100 text-green-900 border border-green-300 text-xs font-bold px-3 py-2 rounded-xl transition flex items-center gap-1.5 shadow-2xs"
              >
                <Copy size={13} /> <span>🍲 Food & Bhog</span>
              </button>
              <button
                onClick={() => handleCopyWhatsAppRoster("Security", "All Days")}
                className="bg-white hover:bg-green-100 text-green-900 border border-green-300 text-xs font-bold px-3 py-2 rounded-xl transition flex items-center gap-1.5 shadow-2xs"
              >
                <Copy size={13} /> <span>🛡️ Crowd & Security</span>
              </button>
              <button
                onClick={() => handleCopyWhatsAppRoster("Pratibimb", "Evening")}
                className="bg-white hover:bg-green-100 text-green-900 border border-green-300 text-xs font-bold px-3 py-2 rounded-xl transition flex items-center gap-1.5 shadow-2xs"
              >
                <Copy size={13} /> <span>🎭 Stage & Sound</span>
              </button>
              <button
                onClick={() => handleCopyWhatsAppRoster("", "Full Schedule")}
                className="bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow-xs"
              >
                <Copy size={13} /> <span>📋 Copy All Volunteers</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50/50 flex items-center justify-between">
              <h3 className="font-heading text-lg font-bold text-gray-900">
                Registered Volunteer Sevaks ({volunteers.length})
              </h3>
              <button onClick={() => window.print()} className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1">
                <Download size={13} /> Print Roster
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-100 text-gray-600 font-semibold border-b border-gray-200">
                    <th className="p-3.5">Volunteer Name</th>
                    <th className="p-3.5">Flat Number</th>
                    <th className="p-3.5">Assigned Domain / Role</th>
                    <th className="p-3.5">Duty Date</th>
                    <th className="p-3.5">Phone / WhatsApp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {volunteers.map((v) => (
                    <tr key={v.id} className="hover:bg-gray-50/60">
                      <td className="p-3.5 font-bold text-gray-900">{v.full_name || v.volunteer_name || "Sevak"}</td>
                      <td className="p-3.5 text-gray-700">{v.flat_number}</td>
                      <td className="p-3.5 font-semibold text-primary">{v.volunteer_slots?.volunteer_categories?.name || "Pujo Seva"}</td>
                      <td className="p-3.5 text-gray-600">{v.volunteer_slots?.slot_date || "Pujo Day"}</td>
                      <td className="p-3.5 font-mono">
                        <a
                          href={`https://api.whatsapp.com/send?phone=${v.phone?.replace(/[^0-9]/g, "")}&text=Hello%20${encodeURIComponent(v.full_name || v.volunteer_name || "Sevak")}%2C%20thank%20you%20for%20volunteering%20for%20PBEL%20Durgotsav%202026!`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-green-700 hover:underline flex items-center gap-1"
                        >
                          <span>💬 {v.phone}</span>
                        </a>
                      </td>
                    </tr>
                  ))}
                  {volunteers.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-gray-500">
                        No volunteer registrations recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 7. ANANDAMELA FOOD STALLS MODERATION & MANAGEMENT */}
      {activeTab === "anandamela" && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/80 text-amber-900 text-xs font-bold mb-2">
                <Utensils size={13} className="text-primary" />
                <span>Anandamela Food Fiesta • Home Chef Stalls</span>
              </div>
              <h2 className="font-heading text-2xl font-bold text-gray-900">
                Food Stall Registrations &amp; Moderation
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Approve or reject resident home chef stall registrations before they go live on the public festival website.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={async () => {
                  if (!confirm("Are you sure you want to clear ALL registered food stalls?")) return;
                  setAnandamelaStalls([]);
                  await saveCloudConfig("anandamela_stalls", []);
                }}
                className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
              >
                <Trash2 size={14} /> Clear All Stalls
              </button>
            </div>
          </div>

          {/* Stalls Table */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
              <span className="font-bold text-xs text-gray-700">
                Registered Stalls ({anandamelaStalls.length}) • {anandamelaStalls.filter((s: any) => s.status === "Pending").length} Pending Approval
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50/50 text-gray-500 uppercase text-[10px] font-bold border-b border-gray-100">
                  <tr>
                    <th className="p-3.5">Stall &amp; Category</th>
                    <th className="p-3.5">Chef &amp; Tower</th>
                    <th className="p-3.5">WhatsApp</th>
                    <th className="p-3.5">Dishes / Menu</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Moderation Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {anandamelaStalls.length > 0 ? (
                    anandamelaStalls.map((stall: any, idx: number) => (
                      <tr key={stall.id || idx} className="hover:bg-amber-50/30 transition">
                        <td className="p-3.5">
                          <span className="font-bold text-gray-900 block">{stall.stallName}</span>
                          <span className="text-[10px] text-gray-500">{stall.category || "General"}</span>
                        </td>
                        <td className="p-3.5">
                          <span className="font-semibold text-gray-800 block">{stall.chefName}</span>
                          <span className="text-[11px] text-gray-500">{stall.flatNumber}</span>
                        </td>
                        <td className="p-3.5 font-mono text-gray-700">
                          {stall.phone}
                        </td>
                        <td className="p-3.5 max-w-xs">
                          {stall.dishes && stall.dishes.length > 0 ? (
                            <div className="space-y-0.5">
                              {stall.dishes.map((d: any, dIdx: number) => (
                                <div key={dIdx} className="text-[11px] text-gray-700">
                                  • {d.name} <span className="font-bold text-green-700">(₹{d.price})</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-gray-400 italic">Specialties</span>
                          )}
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                              stall.status === "Approved"
                                ? "bg-green-100 text-green-800 border border-green-200"
                                : "bg-amber-100 text-amber-800 border border-amber-200"
                            }`}
                          >
                            {stall.status || "Pending"}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {stall.status !== "Approved" && (
                              <button
                                onClick={async () => {
                                  const updated = anandamelaStalls.map((s: any) =>
                                    (s.id === stall.id || s.stallName === stall.stallName) ? { ...s, status: "Approved" } : s
                                  );
                                  setAnandamelaStalls(updated);
                                  await saveCloudConfig("anandamela_stalls", updated);
                                }}
                                className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold text-[11px] transition shadow-2xs"
                              >
                                Approve ✓
                              </button>
                            )}
                            <button
                              onClick={async () => {
                                if (!confirm(`Delete stall "${stall.stallName}"?`)) return;
                                const updated = anandamelaStalls.filter((s: any) =>
                                  s.id ? s.id !== stall.id : s.stallName !== stall.stallName
                                );
                                setAnandamelaStalls(updated);
                                await saveCloudConfig("anandamela_stalls", updated);
                              }}
                              className="px-2.5 py-1 bg-gray-100 hover:bg-red-50 hover:text-red-700 text-gray-600 rounded-lg font-bold text-[11px] transition"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-gray-500">
                        No food stalls registered yet. New resident registrations will appear here for admin approval.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 8. SPONSORS & CAMPAIGNS MANAGER */}
      {activeTab === "sponsors" && (
        <div className="space-y-6">
          
          {/* Sub-View Switcher Bar */}
          <div className="flex flex-wrap items-center gap-2 bg-gray-100 p-1.5 rounded-2xl w-fit border border-gray-200">
            <button
              onClick={() => setSponsorsSubView("tiers")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                sponsorsSubView === "tiers"
                  ? "bg-white text-primary shadow-xs"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Award size={14} />
              <span>1. Sponsorship Packages &amp; Tier Cards CMS ({sponsorshipTiers.length})</span>
            </button>
            <button
              onClick={() => setSponsorsSubView("confirmed")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                sponsorsSubView === "confirmed"
                  ? "bg-white text-primary shadow-xs"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Building size={14} />
              <span>2. Brand Logos &amp; Homepage Marquee ({sponsorsList.length})</span>
            </button>
            <button
              onClick={() => setSponsorsSubView("leads")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                sponsorsSubView === "leads"
                  ? "bg-white text-primary shadow-xs"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Mail size={14} />
              <span>3. Inbound Inquiries &amp; Callbacks ({sponsorLeads.length})</span>
            </button>
          </div>

          {/* SUB-VIEW 1: SPONSORSHIP PACKAGES & TIER CARDS CMS */}
          {sponsorsSubView === "tiers" && (
            <div className="space-y-6">
              
              {/* Top Action Header */}
              <div className="bg-gradient-to-r from-amber-50 via-white to-amber-50/80 p-5 rounded-2xl border border-amber-300 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="font-heading text-base font-bold text-gray-900 flex items-center gap-2">
                    <Sparkles size={18} className="text-primary" />
                    <span>Sponsorship Packages &amp; Public Cards CMS</span>
                  </h4>
                  <p className="text-xs text-gray-600 mt-1 max-w-2xl">
                    Configure the partnership packages shown on the public <a href="/sponsors" target="_blank" className="text-primary underline font-semibold">/sponsors</a> page. Add new tier packages, edit pricing and deliverable bullet points, or mark a card as "Most Popular".
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleRestoreDefaultTiers}
                  className="text-xs font-semibold text-gray-600 hover:text-red-700 hover:bg-red-50 border border-gray-300 px-3.5 py-2 rounded-xl transition self-start sm:self-auto bg-white cursor-pointer"
                  title="Reset all tier packages to standard baseline"
                >
                  🔄 Restore Baseline Defaults
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Form Card: Add / Edit Package */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs h-fit">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <Award size={18} className="text-primary" />
                      <h3 className="font-heading text-base font-bold text-gray-900">
                        {isEditingTier ? "Edit Sponsorship Package" : "Create Sponsorship Package"}
                      </h3>
                    </div>
                    {isEditingTier && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditingTier(false);
                          setTierForm({
                            id: "",
                            title: "",
                            amount: "₹50,000",
                            tag: "High Visibility",
                            isHighlight: false,
                            deliverablesText: "",
                          });
                        }}
                        className="text-xs text-gray-500 hover:text-gray-800 underline cursor-pointer"
                      >
                        Cancel Edit
                      </button>
                    )}
                  </div>

                  <form onSubmit={handleSaveTier} className="space-y-4 text-xs">
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Package Title *</label>
                      <input
                        type="text"
                        required
                        value={tierForm.title}
                        onChange={(e) => setTierForm({ ...tierForm, title: e.target.value })}
                        placeholder="e.g. Title / Platinum Partner or Kids Zone Partner"
                        className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-gray-700 mb-1">Pricing / Amount *</label>
                        <input
                          type="text"
                          required
                          value={tierForm.amount}
                          onChange={(e) => setTierForm({ ...tierForm, amount: e.target.value })}
                          placeholder="e.g. ₹1,00,000 or ₹75,000"
                          className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none text-xs font-mono"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-gray-700 mb-1">Tagline / Badge</label>
                        <input
                          type="text"
                          value={tierForm.tag}
                          onChange={(e) => setTierForm({ ...tierForm, tag: e.target.value })}
                          placeholder="e.g. Maximum Dominance"
                          className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none text-xs"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-3 bg-amber-50/60 border border-amber-200 rounded-xl">
                      <input
                        type="checkbox"
                        id="isHighlightTier"
                        checked={tierForm.isHighlight}
                        onChange={(e) => setTierForm({ ...tierForm, isHighlight: e.target.checked })}
                        className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                      />
                      <label htmlFor="isHighlightTier" className="font-semibold text-amber-950 text-xs cursor-pointer select-none">
                        ★ Highlight as "Most Popular" (Golden Glow Card)
                      </label>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block font-semibold text-gray-700">Package Deliverables / Benefits *</label>
                        <span className="text-[10px] text-gray-400">One bullet point per line</span>
                      </div>
                      <textarea
                        rows={6}
                        required
                        value={tierForm.deliverablesText}
                        onChange={(e) => setTierForm({ ...tierForm, deliverablesText: e.target.value })}
                        placeholder="Exclusive Prime Stage LED Backdrop Branding&#10;Grand Pandal Entrance Archway Branding&#10;Prime Anandamela Stall Space (Panchami Evening)&#10;Logo on Official Website & Carousel&#10;Full Page Color Ad in Pujo Souvenir Brochure"
                        className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none font-sans text-xs leading-relaxed"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmittingTier}
                      className="w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-xl font-bold transition shadow-sm golden-glow flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Save size={14} />
                      <span>{isSubmittingTier ? "Saving..." : isEditingTier ? "Update Package Live" : "Publish Package Live"}</span>
                    </button>
                  </form>
                </div>

                {/* Live Cards Grid Preview */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-heading text-base font-bold text-gray-900">
                      Live Sponsorship Packages ({sponsorshipTiers.length} Active Tiers)
                    </h4>
                    <span className="text-[11px] text-gray-500">Rendered on /sponsors portal</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {sponsorshipTiers.map((tier) => (
                      <div
                        key={tier.id || tier.title}
                        className={`rounded-2xl p-5 flex flex-col justify-between transition-all border ${
                          tier.isHighlight
                            ? "bg-gradient-to-b from-[#FFFDF9] to-[#FFF8ED] border-amber-400 shadow-md relative"
                            : "bg-white border-gray-200 shadow-2xs hover:shadow-xs"
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900">
                              {tier.tag || "Brand Tier"}
                            </span>
                            {tier.isHighlight && (
                              <span className="text-[10px] font-bold bg-primary text-white px-2.5 py-0.5 rounded-full shadow-2xs">
                                ★ Most Popular
                              </span>
                            )}
                          </div>

                          <h4 className="font-heading text-lg font-bold text-gray-900 mb-0.5">{tier.title}</h4>
                          <div className="text-2xl font-bold text-primary font-heading mb-4 font-mono">{tier.amount}</div>

                          <div className="space-y-2 mb-6">
                            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                              Deliverables ({tier.deliverables?.length || 0}):
                            </div>
                            {(tier.deliverables || []).map((item, idx) => (
                              <div key={idx} className="flex items-start gap-1.5 text-xs text-gray-600">
                                <CheckCircle2 size={13} className="text-green-600 shrink-0 mt-0.5" />
                                <span className="line-clamp-2">{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Card Edit / Delete Actions */}
                        <div className="flex items-center gap-2 pt-3 border-t border-gray-100 mt-2">
                          <button
                            type="button"
                            onClick={() => handleEditTier(tier)}
                            className="flex-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 py-1.5 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Edit3 size={13} />
                            <span>Edit Package</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteTier(tier.id, tier.title)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition cursor-pointer"
                            title="Delete Package"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SUB-VIEW 2: BRAND LOGOS & LIVE MARQUEE */}
          {sponsorsSubView === "confirmed" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs h-fit">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                  <Building size={18} className="text-primary" />
                  <h3 className="font-heading text-lg font-bold text-gray-900">Add Corporate Sponsor</h3>
                </div>

                <form onSubmit={handleAddSponsor} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Company / Brand Name *</label>
                    <input
                      type="text"
                      required
                      value={newSponsor.name}
                      onChange={(e) => setNewSponsor({ ...newSponsor, name: e.target.value })}
                      placeholder="e.g. ICICI Bank / Ratnadeep"
                      className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Sponsorship Tier *</label>
                    <select
                      value={newSponsor.tier}
                      onChange={(e) => setNewSponsor({ ...newSponsor, tier: e.target.value })}
                      className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                    >
                      {sponsorshipTiers.map((t) => (
                        <option key={t.id || t.title} value={t.title}>
                          {t.title} ({t.amount})
                        </option>
                      ))}
                      <option value="Food & Bhog Partner">Food &amp; Bhog Partner</option>
                      <option value="Cultural Stage Partner">Cultural Stage Partner</option>
                      <option value="Anandamela Stall Partner">Anandamela Stall Partner</option>
                      <option value="General Corporate Partner">General Corporate Partner</option>
                    </select>
                  </div>

                  {/* Sponsor Brand Logo Upload & URL */}
                  <div className="space-y-2">
                    <label className="block font-semibold text-gray-700">Brand Logo Image</label>
                    
                    {/* File Upload Button */}
                    <div className="flex items-center gap-2">
                      <label className="cursor-pointer bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition">
                        <Upload size={13} />
                        <span>Upload Logo File</span>
                        <input
                          type="file"
                          accept="image/png, image/jpeg, image/svg+xml, image/webp"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              if (file.size > 2 * 1024 * 1024) {
                                alert("Please select a logo image smaller than 2MB.");
                                return;
                              }
                              const reader = new FileReader();
                              reader.onload = () => {
                                if (typeof reader.result === "string") {
                                  setNewSponsor({ ...newSponsor, logo_url: reader.result });
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                      <span className="text-[10px] text-gray-400">PNG, SVG, or JPG</span>
                    </div>

                    <div className="text-[10px] text-gray-400 text-center uppercase font-bold tracking-wider">— OR PASTE URL —</div>

                    <input
                      type="url"
                      value={newSponsor.logo_url}
                      onChange={(e) => setNewSponsor({ ...newSponsor, logo_url: e.target.value })}
                      placeholder="https://example.com/brand-logo.png"
                      className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                    />

                    {/* Logo Preview if available */}
                    {newSponsor.logo_url && (
                      <div className="p-3 bg-gray-50 border border-amber-200 rounded-xl flex items-center gap-3">
                        <img
                          src={newSponsor.logo_url}
                          alt="Logo preview"
                          className="h-10 max-w-[100px] object-contain"
                        />
                        <div className="text-[11px] text-green-700 font-semibold flex items-center gap-1">
                          <span>✓ Logo ready for preview</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Company Website URL (Optional)</label>
                    <input
                      type="url"
                      value={(newSponsor as any).website || ""}
                      onChange={(e) => setNewSponsor({ ...newSponsor, website: e.target.value } as any)}
                      placeholder="https://www.company.com"
                      className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingSponsor}
                    className="w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-xl font-bold transition shadow-sm golden-glow cursor-pointer"
                  >
                    {isSubmittingSponsor ? "Publishing..." : "Publish Sponsor with Logo"}
                  </button>
                </form>
              </div>

              <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-heading text-lg font-bold text-gray-900">
                      Published Corporate Sponsors &amp; Brand Logos ({sponsorsList.length})
                    </h3>
                    <span className="text-xs text-gray-500">
                      Displayed live in the brand marquee on the homepage &amp; sponsorship deck.
                    </span>
                  </div>
                </div>
                
                {sponsorsList.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {sponsorsList.map((s) => (
                      <div key={s.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 hover:border-amber-400 transition flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-14 bg-white rounded-xl border border-gray-200 p-1 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
                            {s.logo_url ? (
                              <img src={s.logo_url} alt={s.name} className="max-h-12 max-w-full object-contain" />
                            ) : (
                              <span className="text-xl">🏢</span>
                            )}
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-gray-900">{s.name}</h4>
                            <span className="text-xs text-amber-800 font-semibold bg-amber-100/70 px-2 py-0.5 rounded-full inline-block mt-0.5">
                              {s.tier}
                            </span>
                            {s.website && (
                              <a href={s.website} target="_blank" rel="noreferrer" className="block text-[11px] text-primary hover:underline mt-0.5 truncate max-w-[160px]">
                                {s.website}
                              </a>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteSponsor(s.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition shrink-0 cursor-pointer"
                          title="Remove Sponsor"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 py-6 text-center">No corporate sponsors added yet.</p>
                )}
              </div>
            </div>
          )}

          {/* SUB-VIEW 3: INBOUND INQUIRIES & CALLBACKS */}
          {sponsorsSubView === "leads" && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                <div>
                  <h4 className="font-heading text-base font-bold text-gray-900">
                    📥 Inbound Sponsor Inquiries &amp; Callbacks ({sponsorLeads.length})
                  </h4>
                  <span className="text-[11px] text-gray-500">
                    Submissions from the public /sponsors partnership portal
                  </span>
                </div>
                <a
                  href="/docs/PBEL_Durgotsav_2026_Sponsorship_Deck.pdf"
                  download
                  className="text-xs bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 px-3 py-1 rounded-lg font-semibold flex items-center gap-1"
                >
                  <Download size={12} />
                  <span>Download Deck PDF</span>
                </a>
              </div>

              {sponsorLeads.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-gray-100 text-gray-600 font-semibold border-b border-gray-200">
                        <th className="p-3">Company &amp; Contact</th>
                        <th className="p-3">Phone / WhatsApp</th>
                        <th className="p-3">Preferred Tier</th>
                        <th className="p-3">Message</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {sponsorLeads.map((lead, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="p-3">
                            <span className="font-bold text-gray-900 block">{lead.name}</span>
                            <span className="text-gray-500 text-[11px]">{lead.contact_person || lead.email}</span>
                          </td>
                          <td className="p-3 font-mono">
                            <a
                              href={`https://api.whatsapp.com/send?phone=${lead.phone?.replace(/[^0-9]/g, '')}&text=Hello%20${encodeURIComponent(lead.contact_person || 'Sir/Madam')}%2C%20greetings%20from%20PBEL%20Sanskritik%20Samiti%20regarding%20Durgotsav%202026%20Sponsorship!`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-green-700 font-bold hover:underline inline-flex items-center gap-1"
                            >
                              <span>📱 {lead.phone}</span>
                            </a>
                          </td>
                          <td className="p-3">
                            <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              {lead.tier}
                            </span>
                          </td>
                          <td className="p-3 text-gray-600 max-w-xs truncate">{lead.message || "—"}</td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => handleClearSponsorLead(idx)}
                              className="text-gray-400 hover:text-red-600 p-1 cursor-pointer"
                              title="Archive / Remove Lead"
                            >
                              <X size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="bg-gray-50 p-6 rounded-xl text-center text-xs text-gray-500">
                  No new sponsor inquiry leads yet. Leads from the public <strong>/sponsors</strong> page will appear here with 1-click WhatsApp callback links.
                </div>
              )}
            </div>
          )}

        </div>
      )}

      {/* TAB CONTENT: 8. COMMITTEE BUDGET & EXPENSES LEDGER */}
      {activeTab === "budget" && (
        <div className="space-y-6">
          
          {/* Financial Summary KPIs */}
          {(() => {
            const totalMemberships = pssMembers.length * 7500;
            const totalSponsorships = sponsorsList.length * 50000;
            const totalInflow = totalFunds + totalMemberships + totalSponsorships;
            const totalPlanned = budgetExpenses.reduce((acc, e) => acc + (Number(e.planned) || 0), 0);
            const totalActual = budgetExpenses.reduce((acc, e) => acc + (Number(e.actual) || 0), 0);
            const netSurplus = totalInflow - totalActual;

            return (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
                  <span className="text-[11px] font-bold text-gray-500 uppercase block mb-1">
                    Total Inflow / Collections
                  </span>
                  <div className="text-2xl sm:text-3xl font-bold font-heading text-green-700">
                    ₹{totalInflow.toLocaleString("en-IN")}
                  </div>
                  <span className="text-[10px] text-gray-400 block mt-1">
                    Donations (₹{totalFunds.toLocaleString("en-IN")}) + Members (₹{totalMemberships.toLocaleString("en-IN")}) + Sponsors (₹{totalSponsorships.toLocaleString("en-IN")})
                  </span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
                  <span className="text-[11px] font-bold text-gray-500 uppercase block mb-1">
                    Budgeted Target
                  </span>
                  <div className="text-2xl sm:text-3xl font-bold font-heading text-gray-900">
                    ₹{totalPlanned.toLocaleString("en-IN")}
                  </div>
                  <span className="text-[10px] text-gray-400 block mt-1">
                    Across {budgetExpenses.length} departmental allocations
                  </span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
                  <span className="text-[11px] font-bold text-gray-500 uppercase block mb-1">
                    Incurred Expenses
                  </span>
                  <div className="text-2xl sm:text-3xl font-bold font-heading text-amber-900">
                    ₹{totalActual.toLocaleString("en-IN")}
                  </div>
                  <span className="text-[10px] text-gray-400 block mt-1">
                    Committed / Paid to Vendors
                  </span>
                </div>

                <div className={`p-5 rounded-2xl border shadow-xs ${
                  netSurplus >= 0 ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                }`}>
                  <span className="text-[11px] font-bold uppercase block mb-1 text-gray-700">
                    Projected Net Balance / Surplus
                  </span>
                  <div className={`text-2xl sm:text-3xl font-bold font-heading ${
                    netSurplus >= 0 ? "text-green-800" : "text-red-700"
                  }`}>
                    ₹{netSurplus.toLocaleString("en-IN")}
                  </div>
                  <span className="text-[10px] text-gray-500 block mt-1">
                    {netSurplus >= 0 ? "✓ Financially balanced & solvent" : "⚠️ Collections deficit"}
                  </span>
                </div>
              </div>
            );
          })()}

          {/* Budget Expense Management Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Add Expense Form */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs h-fit">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                <DollarSign size={18} className="text-primary" />
                <h3 className="font-heading text-lg font-bold text-gray-900">Record Department Expense</h3>
              </div>

              <form onSubmit={handleAddExpense} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Department / Head</label>
                  <select
                    value={newExpense.category}
                    onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                    className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                  >
                    <option value="Pratima & Purohit">Pratima & Purohit Dakshina</option>
                    <option value="Pandal & Lighting">Pandal Structure & Chandernagore Lighting</option>
                    <option value="Dhaaki & Traditional Samagri">Dhaaki Troupe & Traditional Samagri</option>
                    <option value="Maha Bhog & Kitchen">Maha Bhog Groceries & Dining Setup</option>
                    <option value="Sound & Cultural Stage">Sound, LED Stage & Acoustics</option>
                    <option value="Sanitation & Green Pujo">Sanitation, Dustbins & Green Pujo</option>
                    <option value="Miscellaneous">Permits, Security & Miscellaneous</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Expense Description / Line Item *</label>
                  <input
                    type="text"
                    required
                    value={newExpense.title}
                    onChange={(e) => setNewExpense({ ...newExpense, title: e.target.value })}
                    placeholder="e.g. 108 Red Lotuses & Sandhi Aarti Ghee"
                    className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Planned Budget (₹)</label>
                    <input
                      type="number"
                      required
                      value={newExpense.planned}
                      onChange={(e) => setNewExpense({ ...newExpense, planned: Number(e.target.value) })}
                      className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Actual Amount (₹)</label>
                    <input
                      type="number"
                      required
                      value={newExpense.actual}
                      onChange={(e) => setNewExpense({ ...newExpense, actual: Number(e.target.value) })}
                      className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none font-bold text-amber-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Vendor / Payee</label>
                    <input
                      type="text"
                      value={newExpense.paidTo}
                      onChange={(e) => setNewExpense({ ...newExpense, paidTo: e.target.value })}
                      placeholder="e.g. Kumartuli Artisan"
                      className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Payment Status</label>
                    <select
                      value={newExpense.status}
                      onChange={(e) => setNewExpense({ ...newExpense, status: e.target.value })}
                      className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                    >
                      <option value="Advance Paid">Advance Paid</option>
                      <option value="Partially Paid">Partially Paid</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Procured">Procured</option>
                      <option value="Allocated">Allocated</option>
                    </select>
                  </div>
                </div>

                {/* Upload Bill / Receipt */}
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Attach Expense Bill / Voucher (PDF or Image &lt; 2MB)
                  </label>
                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 px-3 py-2 rounded-xl font-semibold text-xs transition flex items-center gap-1.5 shrink-0">
                      <Upload size={13} />
                      <span>{newExpense.bill_url ? "Replace Bill" : "Upload Bill File"}</span>
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (file.size > 2 * 1024 * 1024) {
                              alert("File size must be under 2MB. Please compress before uploading.");
                              return;
                            }
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setNewExpense((prev) => ({
                                ...prev,
                                bill_url: reader.result as string,
                                bill_name: file.name,
                              }));
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                    {newExpense.bill_url && (
                      <div className="flex items-center gap-1 text-xs text-green-700 bg-green-50 px-2.5 py-1 rounded-lg border border-green-200 truncate">
                        <CheckCircle2 size={13} className="shrink-0" />
                        <span className="truncate max-w-[140px]">{newExpense.bill_name || "Bill Attached"}</span>
                        <button
                          type="button"
                          onClick={() => setNewExpense((prev) => ({ ...prev, bill_url: "", bill_name: "" }))}
                          className="text-red-500 hover:text-red-700 ml-1"
                          title="Remove attached bill"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-xl font-bold transition shadow-sm mt-2"
                >
                  Record Expense in Ledger
                </button>
              </form>
            </div>

            {/* Departmental Ledger Table */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                <div>
                  <h3 className="font-heading text-lg font-bold text-gray-900">
                    Committee Budget & Incurred Expenses
                  </h3>
                  <span className="text-xs text-gray-500">
                    {budgetExpenses.length} ledger entries recorded
                  </span>
                </div>
                <button
                  onClick={() => window.print()}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1"
                >
                  <Download size={13} /> Print Financial Report
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-gray-100 text-gray-600 font-semibold border-b border-gray-200">
                      <th className="p-3">Department</th>
                      <th className="p-3">Expense Item & Payee</th>
                      <th className="p-3">Planned</th>
                      <th className="p-3">Actual Paid</th>
                      <th className="p-3">Bill / Voucher</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {budgetExpenses.map((exp) => (
                      <tr key={exp.id} className="hover:bg-gray-50/60">
                        <td className="p-3 font-semibold text-gray-800">
                          {exp.category}
                        </td>
                        <td className="p-3">
                          <span className="font-bold text-gray-900 block">{exp.title}</span>
                          <span className="text-gray-500 text-[11px]">Payee: {exp.paidTo}</span>
                        </td>
                        <td className="p-3 font-mono text-gray-600">
                          ₹{Number(exp.planned).toLocaleString("en-IN")}
                        </td>
                        <td className="p-3 font-mono font-bold text-amber-950">
                          ₹{Number(exp.actual).toLocaleString("en-IN")}
                        </td>
                        <td className="p-3">
                          {exp.bill_url ? (
                            <button
                              onClick={() => setViewingBillExpense(exp)}
                              className="bg-amber-100/80 hover:bg-amber-200 text-amber-900 px-2.5 py-1 rounded-lg font-bold text-[11px] flex items-center gap-1 shadow-2xs transition"
                              title="Inspect Bill Document"
                            >
                              <FileText size={12} className="text-primary" />
                              <span>View Bill</span>
                            </button>
                          ) : (
                            <span className="text-gray-400 text-[11px] italic">No bill</span>
                          )}
                        </td>
                        <td className="p-3">
                          <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            {exp.status}
                          </span>
                        </td>
                        <td className="p-3 text-right space-x-1">
                          <button
                            onClick={() => setEditingExpense(exp)}
                            className="p-1 text-gray-400 hover:text-primary rounded-lg transition"
                            title="Edit Expense"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteExpense(exp.id)}
                            className="p-1 text-gray-400 hover:text-red-600 rounded-lg transition"
                            title="Remove Entry"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* EDIT EXPENSE MODAL */}
          {editingExpense && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
              <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-amber-300 relative">
                <button
                  onClick={() => setEditingExpense(null)}
                  className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition"
                >
                  <X size={18} />
                </button>

                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                  <Edit2 size={20} className="text-primary" />
                  <h3 className="font-heading text-lg font-bold text-gray-900">
                    Edit Budget / Expense Line Item
                  </h3>
                </div>

                <form onSubmit={handleSaveEditedExpense} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Department</label>
                    <select
                      value={editingExpense.category}
                      onChange={(e) => setEditingExpense({ ...editingExpense, category: e.target.value })}
                      className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                    >
                      <option value="Pratima & Purohit">Pratima & Purohit</option>
                      <option value="Pandal & Lighting">Pandal & Lighting</option>
                      <option value="Dhaaki & Traditional Samagri">Dhaaki & Traditional Samagri</option>
                      <option value="Maha Bhog & Kitchen">Maha Bhog & Kitchen</option>
                      <option value="Sound & Cultural Stage">Sound & Cultural Stage</option>
                      <option value="Sanitation & Green Pujo">Sanitation & Green Pujo</option>
                      <option value="Security & Facility Ops">Security & Facility Ops</option>
                      <option value="General & Miscellaneous">General & Miscellaneous</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Expense Title / Item *</label>
                    <input
                      type="text"
                      required
                      value={editingExpense.title}
                      onChange={(e) => setEditingExpense({ ...editingExpense, title: e.target.value })}
                      className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none font-bold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Planned Budget (₹)</label>
                      <input
                        type="number"
                        required
                        value={editingExpense.planned}
                        onChange={(e) => setEditingExpense({ ...editingExpense, planned: Number(e.target.value) })}
                        className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none font-bold"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Actual Paid (₹)</label>
                      <input
                        type="number"
                        required
                        value={editingExpense.actual}
                        onChange={(e) => setEditingExpense({ ...editingExpense, actual: Number(e.target.value) })}
                        className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none font-bold text-amber-950"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Vendor / Payee</label>
                      <input
                        type="text"
                        value={editingExpense.paidTo}
                        onChange={(e) => setEditingExpense({ ...editingExpense, paidTo: e.target.value })}
                        className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Payment Status</label>
                      <select
                        value={editingExpense.status}
                        onChange={(e) => setEditingExpense({ ...editingExpense, status: e.target.value })}
                        className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none font-semibold"
                      >
                        <option value="Advance Paid">Advance Paid</option>
                        <option value="Partially Paid">Partially Paid</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Procured">Procured</option>
                        <option value="Allocated">Allocated</option>
                      </select>
                    </div>
                  </div>

                  {/* Bill Attachment in Edit Modal */}
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      Expense Bill / Invoice (Image or PDF)
                    </label>
                    <div className="flex items-center gap-2">
                      <label className="cursor-pointer bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 px-3 py-2 rounded-xl font-semibold text-xs transition flex items-center gap-1.5 shrink-0">
                        <Upload size={13} />
                        <span>{editingExpense.bill_url ? "Replace File" : "Upload Bill"}</span>
                        <input
                          type="file"
                          accept="image/*,application/pdf"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              if (file.size > 2 * 1024 * 1024) {
                                alert("File size must be under 2MB. Please compress before uploading.");
                                return;
                              }
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setEditingExpense((prev: any) => ({
                                  ...prev,
                                  bill_url: reader.result as string,
                                  bill_name: file.name,
                                }));
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                      {editingExpense.bill_url && (
                        <div className="flex items-center gap-1 text-xs text-green-700 bg-green-50 px-2.5 py-1 rounded-lg border border-green-200 truncate">
                          <CheckCircle2 size={13} className="shrink-0" />
                          <span className="truncate max-w-[140px]">{editingExpense.bill_name || "Bill Attached"}</span>
                          <button
                            type="button"
                            onClick={() => setEditingExpense((prev: any) => ({ ...prev, bill_url: "", bill_name: "" }))}
                            className="text-red-500 hover:text-red-700 ml-1"
                            title="Remove attached bill"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setEditingExpense(null)}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-xl font-bold transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-primary hover:bg-primary-hover text-white py-2.5 rounded-xl font-bold transition shadow-sm flex items-center justify-center gap-1.5 golden-glow"
                    >
                      <Save size={14} />
                      <span>Update Expense</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* BILL / VOUCHER LIGHTBOX PREVIEW MODAL */}
          {viewingBillExpense && (
            <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
              <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-2xl w-full shadow-2xl border border-amber-300 relative max-h-[90vh] flex flex-col">
                <button
                  onClick={() => setViewingBillExpense(null)}
                  className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition"
                  aria-label="Close Bill Preview"
                >
                  <X size={18} />
                </button>

                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100">
                  <FileText size={20} className="text-primary" />
                  <div>
                    <h3 className="font-heading text-lg font-bold text-gray-900">
                      {viewingBillExpense.title}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {viewingBillExpense.category} • Payee: {viewingBillExpense.paidTo} • Paid: ₹{Number(viewingBillExpense.actual).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                {/* Document Preview */}
                <div className="flex-1 overflow-auto bg-gray-50 rounded-2xl border border-gray-200 p-2 flex items-center justify-center min-h-[300px]">
                  {viewingBillExpense.bill_url?.startsWith("data:application/pdf") ? (
                    <div className="text-center p-6 space-y-3">
                      <FileText size={48} className="text-primary mx-auto" />
                      <p className="text-sm font-semibold text-gray-800">
                        {viewingBillExpense.bill_name || "Expense Voucher (PDF Document)"}
                      </p>
                      <a
                        href={viewingBillExpense.bill_url}
                        download={viewingBillExpense.bill_name || `bill_${viewingBillExpense.id}.pdf`}
                        className="inline-flex items-center gap-1.5 bg-primary text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-sm"
                      >
                        <Download size={13} />
                        <span>Download & Open PDF</span>
                      </a>
                    </div>
                  ) : (
                    <img
                      src={viewingBillExpense.bill_url}
                      alt={viewingBillExpense.title}
                      className="max-h-[55vh] max-w-full object-contain rounded-xl shadow-xs"
                    />
                  )}
                </div>

                <div className="flex justify-between items-center pt-3 mt-2 border-t border-gray-100">
                  <span className="text-xs text-gray-500">
                    Payment Status: <strong className="text-green-700">{viewingBillExpense.status}</strong>
                  </span>
                  <div className="flex gap-2">
                    {viewingBillExpense.bill_url && (
                      <a
                        href={viewingBillExpense.bill_url}
                        download={viewingBillExpense.bill_name || `bill_${viewingBillExpense.id}`}
                        className="bg-amber-100 hover:bg-amber-200 text-amber-900 px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                      >
                        <Download size={13} />
                        <span>Download Voucher</span>
                      </a>
                    )}
                    <button
                      onClick={() => setViewingBillExpense(null)}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl text-xs font-bold transition"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* TAB CONTENT: ORGANIZING COMMITTEE WINGS CMS */}
      {activeTab === "committee" && (
        <div className="space-y-6">
          {/* Header Card */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50/60 rounded-3xl p-6 border border-amber-300 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 uppercase tracking-wider mb-1">
                <Users size={14} className="text-primary" />
                <span>Self-Service Committee Management</span>
              </div>
              <h2 className="font-heading text-2xl font-bold text-gray-900">
                Organizing Committee Wings &amp; Member Leads CMS
              </h2>
              <p className="text-xs text-gray-600 mt-1 max-w-2xl">
                Add, edit, or remove executive wings, leads, and operational teams. Changes synchronize live to the public Committee page.
              </p>
            </div>

            <button
              onClick={() => handleSaveCommittee(committeeWings)}
              className="bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-2xl text-xs font-bold transition shadow-sm flex items-center gap-1.5 self-start md:self-auto shrink-0 golden-glow"
            >
              <Save size={15} />
              <span>Save Committee Roster</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Add New Committee Wing Form */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs h-fit space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                <PlusCircle size={18} className="text-primary" />
                <h3 className="font-heading text-base font-bold text-gray-900">
                  Create New Committee Wing
                </h3>
              </div>

              <form onSubmit={handleAddWing} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Wing Title / Category *</label>
                  <input
                    type="text"
                    required
                    value={newWingForm.category}
                    onChange={(e) => setNewWingForm({ ...newWingForm, category: e.target.value })}
                    placeholder="e.g. Cultural Directorate & Stage"
                    className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Icon / Emoji</label>
                    <input
                      type="text"
                      value={newWingForm.icon}
                      onChange={(e) => setNewWingForm({ ...newWingForm, icon: e.target.value })}
                      placeholder="🌺"
                      className="w-full p-2.5 border border-gray-200 rounded-xl text-center text-base focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block font-semibold text-gray-700 mb-1">Wing Tagline / Scope</label>
                    <input
                      type="text"
                      value={newWingForm.tagline}
                      onChange={(e) => setNewWingForm({ ...newWingForm, tagline: e.target.value })}
                      placeholder="Stage acts, audio ops & Natok"
                      className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary-hover text-white py-2.5 rounded-xl font-bold transition shadow-xs flex items-center justify-center gap-1.5"
                >
                  <PlusCircle size={14} />
                  <span>Add Committee Wing</span>
                </button>
              </form>
            </div>

            {/* List of Committee Wings & Direct Member Editors */}
            <div className="lg:col-span-2 space-y-4">
              {committeeWings.map((wing) => (
                <div key={wing.id} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{wing.icon}</span>
                      <div>
                        <h4 className="font-heading text-base font-bold text-gray-900">{wing.category}</h4>
                        <span className="text-xs text-gray-500">{wing.tagline}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditingWing({ ...wing })}
                        className="p-1.5 text-gray-400 hover:text-primary hover:bg-amber-50 rounded-lg transition"
                        title="Edit Wing Info"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => handleDeleteWing(wing.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Delete Entire Wing"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Members inside this wing */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                      Assigned Leads &amp; Coordinators ({wing.members.length}):
                    </span>
                    {wing.members.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {wing.members.map((m) => (
                          <div
                            key={m.id}
                            className="p-2.5 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between"
                          >
                            <div>
                              <span className="font-bold text-gray-900 block">{m.name}</span>
                              <span className="text-[11px] text-amber-800 font-semibold">{m.role}</span>
                              <span className="text-[10px] text-gray-500 block">{m.tower}</span>
                            </div>
                            <div className="flex items-center gap-0.5">
                              <button
                                onClick={() => setEditingWingLead({ wingId: wing.id, member: { ...m } })}
                                className="p-1 text-gray-400 hover:text-primary rounded-lg transition"
                                title="Edit Lead Details"
                              >
                                <Edit2 size={13} />
                              </button>
                              <button
                                onClick={() => handleDeleteMemberFromWing(wing.id, m.id)}
                                className="p-1 text-gray-400 hover:text-red-600 rounded-lg transition"
                                title="Remove Member"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-xl text-center text-xs text-gray-400 italic">
                        No member leads added to this wing yet.
                      </div>
                    )}
                  </div>

                  {/* Add Member inline form */}
                  <div className="pt-3 border-t border-gray-100 flex flex-wrap gap-2 text-xs items-center">
                    <input
                      type="text"
                      placeholder="Lead / Member Name"
                      id={`name-${wing.id}`}
                      className="flex-1 min-w-[140px] p-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary"
                    />
                    <input
                      type="text"
                      placeholder="Role (e.g. Stage Director)"
                      id={`role-${wing.id}`}
                      className="flex-1 min-w-[140px] p-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary"
                    />
                    <input
                      type="text"
                      placeholder="Tower / Flat"
                      id={`tower-${wing.id}`}
                      defaultValue="PBEL Sanskritik Samiti"
                      className="w-36 p-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary text-[11px]"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const nameInput = document.getElementById(`name-${wing.id}`) as HTMLInputElement;
                        const roleInput = document.getElementById(`role-${wing.id}`) as HTMLInputElement;
                        const towerInput = document.getElementById(`tower-${wing.id}`) as HTMLInputElement;
                        if (!nameInput.value.trim() || !roleInput.value.trim()) {
                          alert("Please enter Name and Role for the member.");
                          return;
                        }
                        const member: CommitteeMember = {
                          id: `m-${Date.now()}`,
                          name: sanitizeText(nameInput.value),
                          role: sanitizeText(roleInput.value),
                          tower: sanitizeText(towerInput.value) || "PBEL Sanskritik Samiti",
                        };
                        const updated = committeeWings.map((w) =>
                          w.id === wing.id ? { ...w, members: [...w.members, member] } : w
                        );
                        handleSaveCommittee(updated);
                        nameInput.value = "";
                        roleInput.value = "";
                      }}
                      className="bg-primary hover:bg-primary-hover text-white px-3 py-2 rounded-xl font-bold transition flex items-center gap-1 shrink-0"
                    >
                      <PlusCircle size={13} />
                      <span>Add Lead</span>
                    </button>
                  </div>

                </div>
              ))}
            </div>

          </div>

          {/* EDIT WING MODAL */}
          {editingWing && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
              <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-amber-300 relative">
                <button
                  onClick={() => setEditingWing(null)}
                  className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition"
                >
                  <X size={18} />
                </button>
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                  <Edit2 size={20} className="text-primary" />
                  <h3 className="font-heading text-lg font-bold text-gray-900">
                    Edit Committee Wing
                  </h3>
                </div>
                <form onSubmit={handleSaveEditedWing} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Wing Title / Department *</label>
                    <input
                      type="text"
                      required
                      value={editingWing.category}
                      onChange={(e) => setEditingWing({ ...editingWing, category: e.target.value })}
                      className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none font-bold"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Icon / Emoji</label>
                      <input
                        type="text"
                        value={editingWing.icon}
                        onChange={(e) => setEditingWing({ ...editingWing, icon: e.target.value })}
                        className="w-full p-2.5 border border-gray-200 rounded-xl text-center text-base focus:ring-2 focus:ring-primary outline-none"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block font-semibold text-gray-700 mb-1">Wing Tagline / Scope</label>
                      <input
                        type="text"
                        value={editingWing.tagline}
                        onChange={(e) => setEditingWing({ ...editingWing, tagline: e.target.value })}
                        className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                      />
                    </div>
                  </div>
                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingWing(null)}
                      className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 text-xs font-bold text-white bg-primary hover:bg-primary-hover rounded-xl shadow-xs transition"
                    >
                      Save Wing Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* EDIT WING LEAD MODAL */}
          {editingWingLead && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
              <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-amber-300 relative">
                <button
                  onClick={() => setEditingWingLead(null)}
                  className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition"
                >
                  <X size={18} />
                </button>
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                  <Edit2 size={20} className="text-primary" />
                  <h3 className="font-heading text-lg font-bold text-gray-900">
                    Edit Wing Lead Member
                  </h3>
                </div>
                <form onSubmit={handleSaveEditedWingLead} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Lead Name *</label>
                    <input
                      type="text"
                      required
                      value={editingWingLead.member.name}
                      onChange={(e) => setEditingWingLead({
                        ...editingWingLead,
                        member: { ...editingWingLead.member, name: e.target.value }
                      })}
                      className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Assigned Role *</label>
                    <input
                      type="text"
                      required
                      value={editingWingLead.member.role}
                      onChange={(e) => setEditingWingLead({
                        ...editingWingLead,
                        member: { ...editingWingLead.member, role: e.target.value }
                      })}
                      className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Tower / Flat Affiliation</label>
                    <input
                      type="text"
                      value={editingWingLead.member.tower}
                      onChange={(e) => setEditingWingLead({
                        ...editingWingLead,
                        member: { ...editingWingLead.member, tower: e.target.value }
                      })}
                      className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>
                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingWingLead(null)}
                      className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 text-xs font-bold text-white bg-primary hover:bg-primary-hover rounded-xl shadow-xs transition"
                    >
                      Save Lead Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>
      )}

      {/* TAB CONTENT: TOWERS ROSTER CMS */}
      {activeTab === "towers" && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50/60 rounded-3xl p-6 border border-amber-300 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 uppercase tracking-wider mb-1">
                <Building size={14} className="text-primary" />
                <span>Self-Service Tower Registry</span>
              </div>
              <h2 className="font-heading text-2xl font-bold text-gray-900">
                PBEL City Towers &amp; Wings Manager
              </h2>
              <p className="text-xs text-gray-600 mt-1 max-w-2xl">
                Add, rename, or customize tower codes and building names. Updates instantly across Tower Solidarity Leaderboards, Contribution forms, and Member Bhog Passes.
              </p>
            </div>

            <button
              onClick={() => handleSaveTowers(towerList)}
              className="bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-2xl text-xs font-bold transition shadow-sm flex items-center gap-1.5 self-start md:self-auto shrink-0 golden-glow"
            >
              <Save size={15} />
              <span>Save Towers Roster</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Add Tower Form */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs h-fit space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                <PlusCircle size={18} className="text-primary" />
                <h3 className="font-heading text-base font-bold text-gray-900">
                  Add New Tower / Wing
                </h3>
              </div>

              <form onSubmit={handleAddTower} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Tower Code / Letter *</label>
                  <input
                    type="text"
                    required
                    value={newTowerForm.id}
                    onChange={(e) => setNewTowerForm({ ...newTowerForm, id: e.target.value })}
                    placeholder="e.g. L"
                    className="w-full p-2.5 border border-gray-200 rounded-xl uppercase font-mono font-bold focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Tower Title *</label>
                  <input
                    type="text"
                    required
                    value={newTowerForm.tower}
                    onChange={(e) => setNewTowerForm({ ...newTowerForm, tower: e.target.value })}
                    placeholder="e.g. Tower L"
                    className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Building / Wing Name *</label>
                  <input
                    type="text"
                    required
                    value={newTowerForm.name}
                    onChange={(e) => setNewTowerForm({ ...newTowerForm, name: e.target.value })}
                    placeholder="e.g. Amber"
                    className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary-hover text-white py-2.5 rounded-xl font-bold transition shadow-xs flex items-center justify-center gap-1.5"
                >
                  <PlusCircle size={14} />
                  <span>Register Tower</span>
                </button>
              </form>
            </div>

            {/* Towers Registry Table */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
              <div className="p-4 border-b border-gray-200 bg-gray-50/50 flex items-center justify-between">
                <div>
                  <h3 className="font-heading text-lg font-bold text-gray-900">
                    Configured Towers ({towerList.length})
                  </h3>
                  <span className="text-xs text-gray-500">Live mapped to resident flat detection</span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-gray-100 text-gray-600 font-semibold border-b border-gray-200">
                      <th className="p-3">Code</th>
                      <th className="p-3">Tower Name</th>
                      <th className="p-3">Building Name</th>
                      <th className="p-3">Full Display Label</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {towerList.map((t) => (
                      <tr key={t.id} className="hover:bg-gray-50/60">
                        <td className="p-3 font-mono font-bold text-primary">{t.id}</td>
                        <td className="p-3 font-semibold text-gray-900">{t.tower}</td>
                        <td className="p-3 text-gray-700">{t.name}</td>
                        <td className="p-3 font-medium text-amber-900">{t.fullName}</td>
                        <td className="p-3 text-right space-x-1">
                          <button
                            onClick={() => setEditingTower({ ...t })}
                            className="p-1 text-gray-400 hover:text-primary rounded-lg transition"
                            title="Edit Tower"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            onClick={() => handleDeleteTower(t.id)}
                            className="p-1 text-gray-400 hover:text-red-600 rounded-lg transition"
                            title="Delete Tower"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* EDIT TOWER MODAL */}
          {editingTower && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
              <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-amber-300 relative">
                <button
                  onClick={() => setEditingTower(null)}
                  className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition"
                >
                  <X size={18} />
                </button>
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                  <Edit2 size={20} className="text-primary" />
                  <h3 className="font-heading text-lg font-bold text-gray-900">
                    Edit Tower Details
                  </h3>
                </div>
                <form onSubmit={handleSaveEditedTower} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Tower Code / Letter *</label>
                    <input
                      type="text"
                      required
                      value={editingTower.id}
                      onChange={(e) => setEditingTower({ ...editingTower, id: e.target.value.toUpperCase() })}
                      className="w-full p-2.5 border border-gray-200 rounded-xl uppercase font-mono font-bold focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Tower Title *</label>
                    <input
                      type="text"
                      required
                      value={editingTower.tower}
                      onChange={(e) => {
                        const nextTower = e.target.value;
                        setEditingTower({
                          ...editingTower,
                          tower: nextTower,
                          fullName: `${nextTower} (${editingTower.name || ""})`,
                        });
                      }}
                      className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Building / Wing Name *</label>
                    <input
                      type="text"
                      required
                      value={editingTower.name}
                      onChange={(e) => {
                        const nextName = e.target.value;
                        setEditingTower({
                          ...editingTower,
                          name: nextName,
                          fullName: `${editingTower.tower} (${nextName})`,
                        });
                      }}
                      className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Full Display Label</label>
                    <input
                      type="text"
                      value={editingTower.fullName}
                      onChange={(e) => setEditingTower({ ...editingTower, fullName: e.target.value })}
                      className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none text-amber-900 font-semibold"
                    />
                  </div>
                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingTower(null)}
                      className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 text-xs font-bold text-white bg-primary hover:bg-primary-hover rounded-xl shadow-xs transition"
                    >
                      Save Tower Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>
      )}

      {/* TAB CONTENT: 9. BRANDING, LOGOS & AESTHETIC HERO WALLPAPER CMS */}
      {activeTab === "branding" && (
        <div className="space-y-8">
          
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50/60 rounded-3xl p-6 border border-amber-300 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 uppercase tracking-wider mb-1">
                <Palette size={14} className="text-primary" />
                <span>Self-Service First Theme CMS</span>
              </div>
              <h2 className="font-heading text-2xl font-bold text-gray-900">
                Portal Identity, Aesthetic Wallpapers &amp; Brochure CMS
              </h2>
              <p className="text-xs text-gray-600 mt-1 max-w-2xl">
                Upload custom Maa Durga photos from your computer, update Samiti and Festival logos, switch curated presets, or update the 25MB sponsorship brochure PDF directly.
              </p>
            </div>

            <button
              onClick={() => handleSaveBranding(branding)}
              className="bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-2xl text-xs font-bold transition shadow-sm flex items-center gap-1.5 self-start md:self-auto shrink-0 golden-glow"
            >
              <Save size={15} />
              <span>Save &amp; Publish Changes Live</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* COLUMN 1: AESTHETIC DURGA MAA HERO WALLPAPERS (7 COLS) */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-5">
              <div>
                <h3 className="font-heading text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Sparkles size={18} className="text-primary" />
                  <span>Aesthetic Maa Durga Hero Wallpaper Presets</span>
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Select your preferred divine backdrop to display across the homepage hero section.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {AESTHETIC_WALLPAPERS.map((wp) => {
                  const isSelected = branding.activeHeroWallpaperId === wp.id && !branding.customWallpaperUrl;
                  return (
                    <div
                      key={wp.id}
                      onClick={() => {
                        const updated = { ...branding, activeHeroWallpaperId: wp.id, customWallpaperUrl: "" };
                        handleSaveBranding(updated);
                      }}
                      className={`group cursor-pointer rounded-2xl border overflow-hidden transition-all shadow-xs relative ${
                        isSelected
                          ? "border-primary ring-3 ring-primary/20 shadow-md"
                          : "border-gray-200 hover:border-amber-400"
                      }`}
                    >
                      <div className="h-36 relative overflow-hidden bg-gray-900">
                        <img
                          src={wp.previewUrl}
                          alt={wp.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                        {isSelected && (
                          <div className="absolute top-2.5 right-2.5 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                            <CheckCircle2 size={11} /> Active Wallpaper
                          </div>
                        )}
                        <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                          <h4 className="font-heading text-sm font-bold truncate leading-tight">
                            {wp.title}
                          </h4>
                          <span className="text-[10px] text-amber-200/90 truncate block">
                            {wp.tagline}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Local File Upload for Wallpaper Directly from Computer */}
              <div className="pt-4 border-t border-gray-100 space-y-3">
                <label className="block font-semibold text-xs text-gray-700">
                  📁 Upload Custom Wallpaper Photo from Computer (JPEG, PNG, WebP)
                </label>
                <div className="border-2 border-dashed border-amber-300 hover:border-primary rounded-2xl p-4 text-center bg-amber-50/40 hover:bg-amber-50/70 transition cursor-pointer relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleUploadWallpaperFile}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  {branding.customWallpaperUrl ? (
                    <div className="space-y-2">
                      <img
                        src={branding.customWallpaperUrl}
                        alt="Custom Uploaded Wallpaper Preview"
                        className="w-full h-36 object-cover rounded-xl border border-amber-300 shadow-xs"
                      />
                      <span className="text-[11px] text-green-700 font-bold block">✓ Custom Wallpaper Active (Click to replace with new photo)</span>
                    </div>
                  ) : (
                    <div className="py-2">
                      <ImageIcon size={28} className="mx-auto text-amber-700 mb-1" />
                      <span className="font-bold text-gray-800 text-xs block">Click or Drop Photo of Maa Durga from Computer</span>
                      <span className="text-[10px] text-gray-500">Supports high-definition photos up to 15MB</span>
                    </div>
                  )}
                </div>

                {/* Or Custom URL Override */}
                <div className="flex gap-2 pt-1">
                  <input
                    type="url"
                    value={branding.customWallpaperUrl || ""}
                    onChange={(e) => setBranding({ ...branding, customWallpaperUrl: e.target.value })}
                    placeholder="Or enter Image URL: https://example.com/durga.jpg"
                    className="flex-1 p-2.5 border border-gray-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    onClick={() => handleSaveBranding(branding)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-xl text-xs font-bold transition"
                  >
                    Apply URL
                  </button>
                </div>
              </div>
            </div>

            {/* COLUMN 2: SPONSORSHIP BROCHURE PDF & LOGOS (5 COLS) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* 25MB Sponsorship Brochure PDF Manager */}
              <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-2">
                  <FileText size={18} className="text-primary" />
                  <h3 className="font-heading text-lg font-bold text-gray-900">
                    Corporate Sponsorship Deck PDF
                  </h3>
                </div>
                <p className="text-xs text-gray-500">
                  Upload up to 35MB high-resolution sponsorship brochures directly without touching GitHub or code paths.
                </p>

                <div className="border-2 border-dashed border-amber-300 hover:border-primary rounded-2xl p-5 text-center bg-amber-50/40 hover:bg-amber-50/70 transition cursor-pointer relative">
                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handleUploadPdfFile}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <div className="py-2">
                    <FileText size={32} className="mx-auto text-primary mb-2" />
                    <span className="font-bold text-gray-900 text-xs block">
                      {isUploadingPdf ? "Uploading Large PDF..." : "Click or Drop PDF Brochure (Up to 35MB)"}
                    </span>
                    <span className="text-[10px] text-gray-500">
                      Instantly updates all public brochure download buttons
                    </span>
                  </div>
                </div>

                {pdfUploadSuccess && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-[11px] text-green-800 font-semibold text-center flex items-center justify-center gap-1.5">
                    <CheckCircle2 size={14} className="text-green-600" />
                    <span>Brochure updated successfully!</span>
                  </div>
                )}

                <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100 space-y-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                    Current Active Brochure:
                  </span>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-gray-800 truncate">
                      {branding.sponsorshipDeckFileName || "PBEL_Durgotsav_2026_Sponsorship_Deck.pdf"}
                    </span>
                    <a
                      href={branding.sponsorshipDeckPdfUrl || "/PBEL_City_Durgotsav_2026_Sponsorship_Deck.pdf"}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary font-bold hover:underline flex items-center gap-1 shrink-0 ml-2"
                    >
                      <Eye size={13} /> Preview
                    </a>
                  </div>
                </div>
              </div>

              {/* Official Website QR Code & Standee Card */}
              <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-heading text-lg font-bold text-gray-900">
                      Official Website QR Code
                    </h3>
                    <p className="text-xs text-gray-500">
                      Print-ready QR codes for banners, posters, lift flyers &amp; standees pointing to <code className="text-primary font-bold">https://www.pbelcitydurgotsav.com/</code>
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                    Live Portal QR
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-5 p-4 bg-amber-50/50 rounded-2xl border border-amber-200/80">
                  <div className="w-32 h-32 bg-white p-2 rounded-2xl border border-amber-300 shadow-xs flex items-center justify-center shrink-0">
                    <img
                      src="/qr-website.png"
                      alt="PBEL City Durgotsav Website QR Code"
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="space-y-2.5 flex-1 text-xs">
                    <div className="font-bold text-gray-900">
                      Target URL: https://www.pbelcitydurgotsav.com/
                    </div>
                    <p className="text-gray-600">
                      Instant scan access to live Pujo schedule, e-seva bookings, 80G receipts, and stage registrations.
                    </p>
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <a
                        href="/pbelcitydurgotsav-qr-poster.svg"
                        download="PBEL-City-Durgotsav-Standee-Poster.svg"
                        className="px-3.5 py-1.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold transition flex items-center gap-1.5 shadow-xs"
                      >
                        <Download size={13} /> Standee Poster (SVG)
                      </a>
                      <a
                        href="/qr-website.png"
                        download="pbelcitydurgotsav-qr-1000px.png"
                        className="px-3 py-1.5 rounded-xl bg-white hover:bg-gray-100 text-gray-800 font-bold border border-gray-300 transition flex items-center gap-1.5"
                      >
                        <Download size={13} /> High-Res PNG
                      </a>
                      <a
                        href="/qr-website.svg"
                        download="pbelcitydurgotsav-qr-vector.svg"
                        className="px-3 py-1.5 rounded-xl bg-white hover:bg-gray-100 text-gray-800 font-bold border border-gray-300 transition flex items-center gap-1.5"
                      >
                        <Download size={13} /> Vector SVG
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Samiti & Festival Logos with Local Uploaders */}
              <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-4">
                <h3 className="font-heading text-lg font-bold text-gray-900">
                  Logos &amp; Festival Identity
                </h3>

                <div className="space-y-4 text-xs">
                  
                  {/* PSS Logo Local Upload */}
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      1. PBEL Sanskritik Samiti (PSS) Logo
                    </label>
                    <div className="flex items-center gap-3">
                      {branding.pssLogoUrl ? (
                        <img
                          src={branding.pssLogoUrl}
                          alt="PSS Logo Preview"
                          className="w-12 h-12 object-contain rounded-xl border border-amber-300 bg-white p-1"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-300 flex items-center justify-center text-amber-700 font-bold">
                          PSS
                        </div>
                      )}
                      <div className="flex-1">
                        <label className="inline-block bg-amber-100 hover:bg-amber-200 text-amber-900 px-3 py-1.5 rounded-xl font-bold cursor-pointer transition">
                          📁 Upload PSS Logo from Computer
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleUploadPssLogoFile}
                            className="hidden"
                          />
                        </label>
                        <span className="block text-[10px] text-gray-400 mt-1">PNG, JPG, SVG with transparent background</span>
                      </div>
                    </div>
                  </div>

                  {/* Durgotsav Festival Logo Local Upload */}
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      2. PBEL Durgotsav Festival Logo
                    </label>
                    <div className="flex items-center gap-3">
                      {branding.durgotsavLogoUrl ? (
                        <img
                          src={branding.durgotsavLogoUrl}
                          alt="Festival Logo Preview"
                          className="w-12 h-12 object-contain rounded-xl border border-amber-300 bg-white p-1"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-300 flex items-center justify-center text-amber-700 font-bold">
                          🕉️
                        </div>
                      )}
                      <div className="flex-1">
                        <label className="inline-block bg-amber-100 hover:bg-amber-200 text-amber-900 px-3 py-1.5 rounded-xl font-bold cursor-pointer transition">
                          📁 Upload Festival Logo from Computer
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleUploadDurgotsavLogoFile}
                            className="hidden"
                          />
                        </label>
                        <span className="block text-[10px] text-gray-400 mt-1">Updates Header and Hero logos</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      3. Festival Sub-title / Tagline
                    </label>
                    <input
                      type="text"
                      value={branding.tagline || ""}
                      onChange={(e) => setBranding({ ...branding, tagline: e.target.value })}
                      placeholder="Joy Maa Durga • 15th to 20th October (Panchami to Dashami)"
                      className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary font-medium"
                    />
                  </div>

                  {/* Official Contribution Receipt & Legal Tax Settings */}
                  <div className="pt-3 border-t border-gray-200 mt-3 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-base">📜</span>
                      <h4 className="font-heading font-bold text-gray-900 text-xs uppercase tracking-wider">
                        Official Contribution Receipt &amp; 80G Legal Settings
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-gray-700 mb-1">
                          Society PAN Number
                        </label>
                        <input
                          type="text"
                          value={branding.societyPan || ""}
                          onChange={(e) => setBranding({ ...branding, societyPan: e.target.value.toUpperCase() })}
                          placeholder="e.g. AANAP3884F"
                          className="w-full p-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary font-mono font-bold text-xs"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-gray-700 mb-1">
                          Society Registration No.
                        </label>
                        <input
                          type="text"
                          value={branding.societyRegNo || ""}
                          onChange={(e) => setBranding({ ...branding, societyRegNo: e.target.value })}
                          placeholder="e.g. 2024/469"
                          className="w-full p-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary font-mono text-xs"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-gray-700 mb-1">
                          80G Registration URN
                        </label>
                        <input
                          type="text"
                          value={branding.tax80gUrn || ""}
                          onChange={(e) => setBranding({ ...branding, tax80gUrn: e.target.value.toUpperCase() })}
                          placeholder="e.g. AANAP3884FF20251"
                          className="w-full p-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary font-mono font-bold text-xs"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-gray-700 mb-1">
                          80G Order / Approval Date
                        </label>
                        <input
                          type="text"
                          value={branding.tax80gDate || ""}
                          onChange={(e) => setBranding({ ...branding, tax80gDate: e.target.value })}
                          placeholder="e.g. 30-Jun-2025"
                          className="w-full p-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary font-mono text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">
                        Registered Society Address (Printed on Receipt)
                      </label>
                      <input
                        type="text"
                        value={branding.registeredAddress || ""}
                        onChange={(e) => setBranding({ ...branding, registeredAddress: e.target.value })}
                        placeholder="PBEL City, Appa Junction, Peeramcheruvu, Hyderabad, Telangana - 500091"
                        className="w-full p-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary text-xs"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">
                        Signatory Designation / Title
                      </label>
                      <input
                        type="text"
                        value={branding.signatoryTitle || ""}
                        onChange={(e) => setBranding({ ...branding, signatoryTitle: e.target.value })}
                        placeholder="e.g. President / General Secretary or Treasurer"
                        className="w-full p-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary text-xs"
                      />
                    </div>

                    {/* President / Signatory Signature Upload */}
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">
                        President / Signatory Signature Image
                      </label>
                      <div className="flex items-center gap-3">
                        {branding.presidentSignatureUrl ? (
                          <div className="relative p-1 border border-amber-300 rounded-xl bg-white">
                            <img
                              src={branding.presidentSignatureUrl}
                              alt="Signature Preview"
                              className="h-10 max-w-[120px] object-contain"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const updated = { ...branding, presidentSignatureUrl: "" };
                                setBranding(updated);
                                saveStoredBranding(updated);
                              }}
                              className="absolute -top-1.5 -right-1.5 bg-red-600 text-white rounded-full p-0.5 cursor-pointer"
                              title="Remove Signature"
                            >
                              <X size={11} />
                            </button>
                          </div>
                        ) : (
                          <div className="h-10 px-3 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-[10px] text-gray-500 italic">
                            Default Digitize Calligraphy Active
                          </div>
                        )}
                        <div className="flex-1">
                          <label className="inline-block bg-amber-100 hover:bg-amber-200 text-amber-900 px-3 py-1.5 rounded-xl font-bold cursor-pointer transition text-xs">
                            ✍️ Upload Signature Image
                            <input
                              type="file"
                              accept="image/png, image/jpeg, image/webp"
                              onChange={handleUploadPresidentSignatureFile}
                              className="hidden"
                            />
                          </label>
                          <span className="block text-[10px] text-gray-400 mt-0.5">Transparent PNG recommended</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSaveBranding(branding)}
                    className="w-full bg-primary hover:bg-primary-hover text-white py-2.5 rounded-xl font-bold transition shadow-xs mt-2 cursor-pointer"
                  >
                    Save Logo, Receipt &amp; Identity Settings
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* TAB CONTENT: 10. GALLERY CAROUSEL CMS & SOCIAL CHANNELS */}
      {activeTab === "gallery" && (
        <div className="space-y-8">
          
          {/* A. OFFICIAL SOCIAL CHANNELS & STREAM LINKS */}
          <div className="bg-gradient-to-r from-red-50 via-white to-amber-50 rounded-2xl border border-red-200/80 p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-red-600 text-white rounded-xl flex items-center justify-center shrink-0 shadow-xs">
                  <Play size={18} className="fill-white translate-x-0.5" />
                </div>
                <div>
                  <h3 className="font-heading text-base font-bold text-gray-900">
                    Official Social &amp; Video Broadcast Channels
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    Featured across the public Gallery page and social cards.
                  </p>
                </div>
              </div>
              <button
                onClick={handleSaveSocialChannels}
                className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Save size={13} />
                <span>Save Social Channels</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-600"></span>
                  Official YouTube Channel Link
                </label>
                <input
                  type="url"
                  value={branding.youtubeChannelUrl || ""}
                  onChange={(e) => setBranding({ ...branding, youtubeChannelUrl: e.target.value })}
                  placeholder="https://www.youtube.com/@pbelsanskritiksamiti-offic3003"
                  className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-pink-600"></span>
                  Official Instagram Page Link
                </label>
                <input
                  type="url"
                  value={branding.instagramUrl || ""}
                  onChange={(e) => setBranding({ ...branding, instagramUrl: e.target.value })}
                  placeholder="https://www.instagram.com/pbelsanskritiksamiti"
                  className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  Official Facebook Page Link
                </label>
                <input
                  type="url"
                  value={branding.facebookUrl || ""}
                  onChange={(e) => setBranding({ ...branding, facebookUrl: e.target.value })}
                  placeholder="https://www.facebook.com/pbelsanskritiksamiti"
                  className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-mono text-[11px]"
                />
              </div>
            </div>
          </div>

          {/* B. PHOTO CAROUSEL & GALLERY CMS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Add Photo Form with Actual File Upload */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs h-fit">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
              <ImageIcon size={18} className="text-primary" />
              <h3 className="font-heading text-lg font-bold text-gray-900">Upload Photo to Carousel</h3>
            </div>

            <form onSubmit={handleAddPhoto} className="space-y-4 text-xs">
              
              {/* Actual Image File Upload Picker */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Upload Image File from Device (JPEG, PNG, WebP)
                </label>
                <div className="border-2 border-dashed border-amber-300 hover:border-primary rounded-2xl p-4 text-center bg-amber-50/40 hover:bg-amber-50/80 transition cursor-pointer relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setNewPhoto({ ...newPhoto, image_url: reader.result as string });
                        };
                        if (file.size > 2 * 1024 * 1024) {
                          alert("File size must be under 2MB. Please compress or resize the image before uploading.");
                          return;
                        }
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  {newPhoto.image_url ? (
                    <div className="space-y-2">
                      <img
                        src={newPhoto.image_url}
                        alt="Preview"
                        className="w-full h-32 object-cover rounded-xl border border-amber-300 shadow-xs"
                      />
                      <span className="text-[11px] text-green-700 font-bold block">✓ Image Selected (Click to change)</span>
                    </div>
                  ) : (
                    <div className="py-2">
                      <ImageIcon size={28} className="mx-auto text-amber-700 mb-1" />
                      <span className="font-bold text-gray-800 block">Click to Browse / Drop Photo File</span>
                      <span className="text-[10px] text-gray-500">Supports photos up to 10MB</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Or Web Image URL (Optional)</label>
                <input
                  type="url"
                  value={newPhoto.image_url}
                  onChange={(e) => setNewPhoto({ ...newPhoto, image_url: e.target.value })}
                  placeholder="https://example.com/durga-idol.jpg"
                  className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Photo Title / Caption *</label>
                <input
                  type="text"
                  required
                  value={newPhoto.title}
                  onChange={(e) => setNewPhoto({ ...newPhoto, title: e.target.value })}
                  placeholder="e.g. 2025 Maha Ashtami Dhunuchi Naach"
                  className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Pujo Year</label>
                  <select
                    value={newPhoto.year}
                    onChange={(e) => setNewPhoto({ ...newPhoto, year: e.target.value })}
                    className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                  >
                    <option value="2026">2026</option>
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                    <option value="2022">2022</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Category / Tag</label>
                  <input
                    type="text"
                    value={newPhoto.category}
                    onChange={(e) => setNewPhoto({ ...newPhoto, category: e.target.value })}
                    placeholder="e.g. Pratima Darshan / Stage"
                    className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-xl font-bold transition shadow-sm flex items-center justify-center gap-2"
              >
                <ImageIcon size={15} />
                <span>Publish Photo to Homepage Carousel</span>
              </button>
            </form>
          </div>

          {/* Current Gallery Roster */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-lg font-bold text-gray-900">Photos in Homepage Carousel ({galleryList.length})</h3>
              <span className="text-xs text-gray-500">Live sync with Homepage</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {galleryList.map((p) => (
                <div key={p.id} className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {p.imageUrl || p.image_url ? (
                      <img
                        src={p.imageUrl || p.image_url}
                        alt={p.title}
                        className="w-14 h-14 object-cover rounded-xl border border-amber-300"
                      />
                    ) : (
                      <span className="text-3xl">{p.emoji || "🌺"}</span>
                    )}
                    <div>
                      <h4 className="font-bold text-sm text-gray-900 line-clamp-1">{p.title}</h4>
                      <span className="text-xs text-amber-800 font-semibold">{p.category} ({p.year})</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingPhoto({ ...p })}
                      className="p-2 text-gray-400 hover:text-primary hover:bg-amber-50 rounded-lg transition"
                      title="Edit Photo"
                    >
                      <Edit2 size={15} />
                    </button>
                    <button
                      onClick={() => handleDeletePhoto(p.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Delete Photo"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* EDIT GALLERY PHOTO MODAL */}
          {editingPhoto && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
              <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-amber-300 relative">
                <button
                  onClick={() => setEditingPhoto(null)}
                  className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition"
                >
                  <X size={18} />
                </button>
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                  <Edit2 size={20} className="text-primary" />
                  <h3 className="font-heading text-lg font-bold text-gray-900">
                    Edit Gallery Photo
                  </h3>
                </div>
                <form onSubmit={handleSaveEditedPhoto} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Photo Title / Caption *</label>
                    <input
                      type="text"
                      required
                      value={editingPhoto.title}
                      onChange={(e) => setEditingPhoto({ ...editingPhoto, title: e.target.value })}
                      className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none font-bold"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Pujo Year</label>
                      <select
                        value={editingPhoto.year}
                        onChange={(e) => setEditingPhoto({ ...editingPhoto, year: e.target.value })}
                        className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                      >
                        <option value="2026">2026</option>
                        <option value="2025">2025</option>
                        <option value="2024">2024</option>
                        <option value="2023">2023</option>
                        <option value="2022">2022</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Category / Tag</label>
                      <input
                        type="text"
                        value={editingPhoto.category}
                        onChange={(e) => setEditingPhoto({ ...editingPhoto, category: e.target.value })}
                        className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                      />
                    </div>
                  </div>
                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingPhoto(null)}
                      className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 text-xs font-bold text-white bg-primary hover:bg-primary-hover rounded-xl shadow-xs transition"
                    >
                      Save Photo Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          </div>

          {/* C. YOUTUBE VIDEO SHOWCASE CMS */}
          <div className="pt-6 border-t border-gray-200">
            <div className="mb-6">
              <h3 className="font-heading text-lg font-bold text-gray-900 flex items-center gap-2">
                <Video size={20} className="text-red-600" />
                <span>YouTube Video Showcase (Gallery Page)</span>
              </h3>
              <p className="text-xs text-gray-500">
                Configure YouTube videos of Pratibimb stage dramas, musical evenings, Sandhi Aarti, and Dhunuchi naach to display on the public Gallery page.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Add Video Form */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs h-fit">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                  <Play size={16} className="text-red-600 fill-red-600" />
                  <h4 className="font-heading text-base font-bold text-gray-900">Add YouTube Video</h4>
                </div>

                <form onSubmit={handleAddVideo} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      YouTube Video URL or Video ID *
                    </label>
                    <input
                      type="text"
                      required
                      value={newVideo.youtubeUrl}
                      onChange={(e) => setNewVideo({ ...newVideo, youtubeUrl: e.target.value })}
                      placeholder="e.g. https://www.youtube.com/watch?v=... or youtu.be/..."
                      className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none font-mono text-[11px]"
                    />
                    {newVideo.youtubeUrl && (() => {
                      const id = extractYouTubeVideoId(newVideo.youtubeUrl);
                      if (id) {
                        return (
                          <div className="mt-2 space-y-1">
                            <span className="text-[10.5px] text-green-700 font-bold block flex items-center gap-1">
                              ✓ Valid Video ID: <code className="bg-green-50 px-1 py-0.5 rounded">{id}</code>
                            </span>
                            <img
                              src={`https://img.youtube.com/vi/${id}/hqdefault.jpg`}
                              alt="Thumbnail Preview"
                              className="w-full h-24 object-cover rounded-lg border border-gray-200"
                            />
                          </div>
                        );
                      }
                      return (
                        <span className="text-[10.5px] text-amber-700 block mt-1">
                          ⚠️ Enter a valid YouTube watch, youtu.be or embed link
                        </span>
                      );
                    })()}
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Video Title / Act Name *</label>
                    <input
                      type="text"
                      required
                      value={newVideo.title}
                      onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                      placeholder="e.g. Maha Ashtami Dhunuchi Naach 2025"
                      className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none font-semibold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Pujo Year</label>
                      <select
                        value={newVideo.year}
                        onChange={(e) => setNewVideo({ ...newVideo, year: e.target.value })}
                        className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
                      >
                        <option value="2026">2026</option>
                        <option value="2025">2025</option>
                        <option value="2024">2024</option>
                        <option value="2023">2023</option>
                        <option value="2022">2022</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Category / Tag</label>
                      <input
                        type="text"
                        value={newVideo.category}
                        onChange={(e) => setNewVideo({ ...newVideo, category: e.target.value })}
                        placeholder="e.g. Pratibimb Stage / Aarti"
                        className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Short Description (Optional)</label>
                    <textarea
                      rows={2}
                      value={newVideo.description}
                      onChange={(e) => setNewVideo({ ...newVideo, description: e.target.value })}
                      placeholder="Brief note about performers or celebration"
                      className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-bold transition shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Play size={14} className="fill-white" />
                    <span>Add Video to Gallery Page</span>
                  </button>
                </form>
              </div>

              {/* Videos Roster */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-heading text-base font-bold text-gray-900">
                    Showcase Videos on Gallery Page ({galleryVideos.length})
                  </h4>
                  <span className="text-xs text-gray-500">Live sync with /gallery</span>
                </div>

                {galleryVideos.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {galleryVideos.map((v) => {
                      const vId = v.youtubeVideoId || extractYouTubeVideoId(v.youtubeUrl);
                      return (
                        <div key={v.id} className="p-3 bg-gray-50 rounded-2xl border border-gray-200 flex flex-col justify-between">
                          <div>
                            <div className="relative aspect-video rounded-xl overflow-hidden bg-black mb-2.5">
                              {vId ? (
                                <img
                                  src={`https://img.youtube.com/vi/${vId}/hqdefault.jpg`}
                                  alt={v.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-500">
                                  <Video size={30} />
                                </div>
                              )}
                              <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                                {v.year}
                              </span>
                            </div>
                            <h5 className="font-bold text-xs text-gray-900 line-clamp-1 mb-0.5">{v.title}</h5>
                            <span className="text-[10px] text-amber-800 font-semibold bg-amber-100/80 px-2 py-0.5 rounded-full inline-block">
                              {v.category}
                            </span>
                          </div>

                          <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-gray-200 text-xs">
                            <a
                              href={v.youtubeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-red-600 hover:text-red-700 font-semibold text-[11px] flex items-center gap-1"
                            >
                              <span>Watch</span>
                              <ExternalLink size={11} />
                            </a>
                            <button
                              onClick={() => handleDeleteVideo(v.id)}
                              className="text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition"
                              title="Delete Video"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200 p-6">
                    <Video size={32} className="mx-auto text-gray-400 mb-2" />
                    <p className="font-bold text-xs text-gray-700">No YouTube videos added yet</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">Use the form on the left to add video links for the Gallery page.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TAB CONTENT: 10. USER MANAGEMENT & ACCESS CONTROL */}
      {activeTab === "users" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add Admin User Form */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs h-fit">
            <div className="flex items-center gap-2 mb-4 text-primary">
              <Users size={20} />
              <h3 className="font-heading text-lg font-bold text-gray-900">Add Committee Admin</h3>
            </div>
            <p className="text-xs text-gray-500 mb-5">
              Grant committee members access to manage finances, schedule, or volunteer rosters.
            </p>

            <form onSubmit={handleAddUser} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Full Member Name *</label>
                <input
                  type="text"
                  required
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  placeholder="e.g. Anirban Banerjee"
                  className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Username / Login ID *</label>
                <input
                  type="text"
                  required
                  value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                  placeholder="e.g. anirban.pss"
                  className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Assigned Role *</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value as any })}
                  className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                >
                  <option value="Super Admin">Super Admin (Full Access)</option>
                  <option value="Finance & Fund Verification">Finance & Fund Verification</option>
                  <option value="Cultural & Pratibimb Lead">Cultural & Pratibimb Lead</option>
                  <option value="Volunteer Lead">Volunteer Lead</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Security Passcode / Password *</label>
                <input
                  type="password"
                  required
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  placeholder="Initial login PIN or password"
                  className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-xl font-bold transition shadow-sm flex items-center justify-center gap-2"
              >
                <UserCheck size={15} />
                <span>Authorize & Create User</span>
              </button>
            </form>
          </div>

          {/* Authorized Users Registry Table */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50/50 flex items-center justify-between">
              <div>
                <h3 className="font-heading text-lg font-bold text-gray-900">Authorized Committee Members ({adminUsers.length})</h3>
                <span className="text-xs text-gray-500">Manage committee accounts and access permissions</span>
              </div>
              <span className="text-xs bg-green-100 text-green-900 font-bold px-3 py-1 rounded-full">
                {adminUsers.filter((u) => u.status === "Active").length} Active
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-100 text-gray-600 font-semibold border-b border-gray-200">
                    <th className="p-3.5">Name</th>
                    <th className="p-3.5">Username</th>
                    <th className="p-3.5">Assigned Role</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Added Date</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {adminUsers.map((u) => {
                    const isMaster = u.id === "usr-master";
                    const isActive = u.status === "Active";

                    return (
                      <tr key={u.id} className={`hover:bg-gray-50/60 ${!isActive ? "bg-gray-50/80 opacity-70" : ""}`}>
                        <td className="p-3.5 font-bold text-gray-900 flex items-center gap-2">
                          <span className="w-7 h-7 rounded-full bg-amber-100 text-amber-900 font-bold flex items-center justify-center text-[10px]">
                            {u.name.substring(0, 2).toUpperCase()}
                          </span>
                          <div>
                            <span>{u.name}</span>
                            {isMaster && <span className="block text-[9px] text-amber-700 font-bold">Primary Master</span>}
                          </div>
                        </td>
                        <td className="p-3.5 font-mono text-gray-700">{u.username}</td>
                        <td className="p-3.5">
                          <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            {u.role}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}>
                            {isActive ? "✓ Active" : "✕ Suspended"}
                          </span>
                        </td>
                        <td className="p-3.5 text-gray-500">{u.created_at}</td>
                        <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                          {!isMaster && (
                            <>
                              <button
                                onClick={() => handleToggleUserStatus(u.id)}
                                className={`rounded-lg transition text-[11px] font-semibold px-2.5 py-1 ${
                                  isActive
                                    ? "bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200"
                                    : "bg-green-50 text-green-800 hover:bg-green-100 border border-green-200"
                                }`}
                                title={isActive ? "Suspend Access" : "Reactivate Access"}
                              >
                                {isActive ? "Suspend" : "Activate"}
                              </button>
                              <button
                                onClick={() => handleDeleteUser(u.id)}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                                title="Delete User"
                              >
                                <Trash2 size={14} />
                              </button>
                            </>
                          )}
                          {isMaster && (
                            <span className="text-[10px] text-gray-400 italic">Protected Master</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 3. PSS ANNUAL MEMBERS & DAILY BHOG PASSES (UNIFIED) */}
      {activeTab === "pss_members" && (
        <div className="space-y-6">
          
          {/* Sub Switcher */}
          <div className="flex items-center gap-2 bg-gray-100 p-1.5 rounded-2xl w-fit border border-gray-200">
            <button
              onClick={() => setMembersSubView("roster")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                membersSubView === "roster"
                  ? "bg-white text-primary shadow-xs"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Users size={14} />
              <span>1. PSS Patron Members Roster &amp; CSV Import ({pssMembers.length})</span>
            </button>
            <button
              onClick={() => setMembersSubView("kitchen")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                membersSubView === "kitchen"
                  ? "bg-white text-primary shadow-xs"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Utensils size={14} />
              <span>2. Issued Lunch Passes &amp; Live Kitchen Headcounts ({bhogPasses.length})</span>
            </button>
          </div>

          {/* SUB-VIEW 1: PATRON MEMBERS ROSTER & CSV IMPORT */}
          {membersSubView === "roster" && (
            <div className="space-y-6">
              
              {/* Top Metrics Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-amber-300/80 shadow-xs">
                  <div className="text-xs font-bold text-amber-900 uppercase mb-1">Registered PSS Patron Families</div>
                  <div className="text-3xl font-bold text-primary font-heading">
                    {pssMembers.length} Families
                  </div>
                  <div className="text-[11px] text-gray-500 mt-1">₹7,500 Annual Member Subscription</div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-amber-300/80 shadow-xs">
                  <div className="text-xs font-bold text-amber-900 uppercase mb-1">Total Patron Fund Raised</div>
                  <div className="text-3xl font-bold text-green-700 font-heading">
                    ₹{(pssMembers.length * 7500).toLocaleString("en-IN")}
                  </div>
                  <div className="text-[11px] text-gray-500 mt-1">Sustaining Pujo &amp; Maha Bhog operations</div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-amber-300/80 shadow-xs">
                  <div className="text-xs font-bold text-amber-900 uppercase mb-1">Daily Member Lunch Capacity</div>
                  <div className="text-3xl font-bold text-amber-700 font-heading">
                    {pssMembers.reduce((acc, m) => acc + Math.min(Number(m.headcount) || 4, 6), 0)} Meals / Day
                  </div>
                  <div className="text-[11px] text-gray-500 mt-1">Capped at max 6 members per family</div>
                </div>
              </div>

              {/* Public Collection Counter Inclusion Switch */}
              <div className="bg-gradient-to-r from-amber-50 via-white to-amber-50/80 p-5 rounded-2xl border border-amber-300 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className={`p-3 rounded-xl text-white shrink-0 ${includeMemberContributions ? "bg-green-600 shadow-sm" : "bg-gray-400"}`}>
                    <Users size={22} />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-heading text-base font-bold text-gray-900">
                        Include Member Subscriptions in Public Fund Counter &amp; Tower Totals
                      </h4>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                        includeMemberContributions ? "bg-green-100 text-green-800 border border-green-300" : "bg-gray-100 text-gray-700 border border-gray-300"
                      }`}>
                        {includeMemberContributions ? "● Live: Included in Public Counter" : "○ Live: Excluded (Online Only)"}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1 max-w-2xl leading-relaxed">
                      When enabled, the <strong>₹7,500 annual subscription per member family</strong> ({pssMembers.length} registered families = <strong>₹{(pssMembers.length * 7500).toLocaleString("en-IN")}</strong>) is included in the collection counter, tower breakdown, and displayed on the Devotee Wall of Honor / Donation page with the offering label <strong>&quot;Member Contribution&quot;</strong>.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end md:self-center shrink-0 bg-white/80 p-2 rounded-xl border border-amber-200">
                  <span className="text-xs font-bold text-gray-700">
                    {includeMemberContributions ? "Include in Public Total" : "Online Only"}
                  </span>
                  <button
                    type="button"
                    onClick={handleToggleMemberContributions}
                    disabled={isUpdatingMemberToggle}
                    className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      includeMemberContributions ? "bg-green-600" : "bg-gray-300"
                    }`}
                    title="Toggle member subscription inclusion in public totals"
                  >
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                        includeMemberContributions ? "translate-x-7" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* CSV / Spreadsheet Bulk Importer Card */}
                <div className="bg-white rounded-2xl border border-amber-300/80 p-6 shadow-xs h-fit space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                    <Download size={18} className="text-primary" />
                    <div>
                      <h3 className="font-heading text-base font-bold text-gray-900">
                        ⚡ Quick CSV / Bulk Member Import
                      </h3>
                      <span className="text-[11px] text-gray-500">Paste rows from Excel, Sheets, or CSV file</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Upload CSV File
                    </label>
                    <input
                      type="file"
                      accept=".csv,.txt,.tsv"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            setCsvText(event.target?.result as string);
                          };
                          reader.readAsText(file);
                        }
                      }}
                      className="w-full text-xs text-gray-500 file:mr-2.5 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-hover"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-semibold text-gray-700">
                        Or Paste Spreadsheet Rows Directly:
                      </label>
                      <span className="text-[10px] text-gray-400">Format: Name, Flat, Phone, Headcount</span>
                    </div>
                    <textarea
                      rows={5}
                      value={csvText}
                      onChange={(e) => setCsvText(e.target.value)}
                      placeholder="Sourav Ganguly, Emerald 802, 9845000000, 4&#10;Anirban Mukherjee, Sapphire 1104, 9845000001, 4&#10;Debashis Roy, Pearl 1401, 9845000002, 5"
                      className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none font-mono text-xs"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleBulkImportCsv}
                    className="w-full bg-primary hover:bg-primary-hover text-white py-2.5 rounded-xl font-bold text-xs transition shadow-xs flex items-center justify-center gap-1.5 golden-glow"
                  >
                    <Sparkles size={14} />
                    <span>Parse &amp; Import Members</span>
                  </button>
                </div>

                {/* Add Single Member Form Card */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs h-fit space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                    <PlusCircle size={18} className="text-primary" />
                    <h3 className="font-heading text-base font-bold text-gray-900">
                      Add Single Member Family
                    </h3>
                  </div>

                  <form onSubmit={handleAddSingleMember} className="space-y-3 text-xs">
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Head of Family Name *</label>
                      <input
                        type="text"
                        required
                        value={newMemberForm.name}
                        onChange={(e) => setNewMemberForm({ ...newMemberForm, name: e.target.value })}
                        placeholder="e.g. Subhashish Mukherjee"
                        className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block font-semibold text-gray-700 mb-1">Tower</label>
                        <select
                          value={newMemberForm.tower}
                          onChange={(e) => setNewMemberForm({ ...newMemberForm, tower: e.target.value })}
                          className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                        >
                          {towerList.map((t) => (
                            <option key={t.id} value={t.fullName || `${t.tower} (${t.name})`}>
                              {t.fullName || `${t.tower} (${t.name})`}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block font-semibold text-gray-700 mb-1">Flat / Unit (e.g. 402, G01) *</label>
                        <input
                          type="text"
                          required
                          autoCapitalize="characters"
                          maxLength={8}
                          value={newMemberForm.flatNumber}
                          onChange={(e) => {
                            const val = e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, "").slice(0, 8);
                            setNewMemberForm({ ...newMemberForm, flatNumber: val });
                          }}
                          placeholder="e.g. 402 or G01"
                          className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none font-bold font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block font-semibold text-gray-700 mb-1">Mobile / WhatsApp (10 Digits)</label>
                        <input
                          type="tel"
                          inputMode="numeric"
                          maxLength={10}
                          pattern="[0-9]{10}"
                          value={newMemberForm.phone}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                            setNewMemberForm({ ...newMemberForm, phone: val });
                          }}
                          placeholder="e.g. 9876543210"
                          className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none font-mono"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-gray-700 mb-1">Headcount (Max 6)</label>
                        <select
                          value={newMemberForm.headcount}
                          onChange={(e) => setNewMemberForm({ ...newMemberForm, headcount: Number(e.target.value) })}
                          className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                        >
                          {[1, 2, 3, 4, 5, 6].map((num) => (
                            <option key={num} value={num}>{num} Members</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-primary hover:bg-primary-hover text-white py-2.5 rounded-xl font-bold transition shadow-xs flex items-center justify-center gap-1.5"
                    >
                      <PlusCircle size={14} />
                      <span>Save Member Family</span>
                    </button>
                  </form>
                </div>

                {/* Quick Helper / Info Card */}
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-6 shadow-xs h-fit space-y-3 text-xs text-gray-700">
                  <h4 className="font-heading font-bold text-sm text-gray-900 flex items-center gap-1.5">
                    <Utensils size={15} className="text-primary" />
                    <span>Day-Wise Pass Generation Rules</span>
                  </h4>
                  <p>
                    • Every verified PSS Member family entry has direct <strong>Day-Wise 1-Click Lunch Pass</strong> generation buttons in the directory table below.
                  </p>
                  <p>
                    • Headcounts are automatically <strong>capped at a maximum of 6 members per flat</strong>.
                  </p>
                  <p>
                    • Generated passes automatically increment the kitchen headcount counters in real time.
                  </p>
                </div>

              </div>

              {/* Members Table */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
                <div className="p-4 sm:p-5 border-b border-gray-200 bg-gray-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <h3 className="font-heading text-base font-bold text-gray-900">
                      PSS Registered Member Families ({pssMembers.length})
                    </h3>
                    <span className="text-xs bg-green-100 text-green-800 font-bold px-2.5 py-0.5 rounded-full">
                      ₹7,500 Paid Roster
                    </span>
                  </div>

                  <div className="relative w-full sm:w-72">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={memberSearchQuery}
                      onChange={(e) => setMemberSearchQuery(e.target.value)}
                      placeholder="Search name, flat, tower..."
                      className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                {pssMembers.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-gray-100 text-gray-600 font-semibold border-b border-gray-200">
                          <th className="p-3.5">Member Name &amp; Flat</th>
                          <th className="p-3.5">WhatsApp / Phone</th>
                          <th className="p-3.5">Headcount</th>
                          <th className="p-3.5 text-center">Day-Wise 1-Click Lunch Pass Generation (Capped at 6)</th>
                          <th className="p-3.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {pssMembers
                          .filter((m) => {
                            const q = memberSearchQuery.toLowerCase().trim();
                            return !q || m.name.toLowerCase().includes(q) || m.flatNumber.toLowerCase().includes(q) || m.tower.toLowerCase().includes(q);
                          })
                          .map((m) => (
                            <tr key={m.id} className="hover:bg-amber-50/40 transition">
                              <td className="p-3.5">
                                <span className="font-bold text-gray-900 block text-sm">{m.name}</span>
                                <span className="text-gray-500 text-xs">{m.tower} • Flat {m.flatNumber}</span>
                              </td>
                              <td className="p-3.5 font-mono">
                                <a
                                  href={`https://api.whatsapp.com/send?phone=${m.phone?.replace(/[^0-9]/g, '')}&text=Hello%20${encodeURIComponent(m.name)}%2C%20greetings%20from%20PBEL%20Sanskritik%20Samiti!`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-green-700 font-bold hover:underline inline-flex items-center gap-1"
                                >
                                  <span>📱 {m.phone || "PBEL Resident"}</span>
                                </a>
                              </td>
                              <td className="p-3.5">
                                <span className="font-bold text-gray-900 font-heading text-sm">
                                  {Math.min(m.headcount || 4, 6)} Members
                                </span>
                              </td>
                              <td className="p-3.5 text-center">
                                <div className="flex flex-wrap items-center justify-center gap-1.5">
                                  {["Saptami", "Ashtami", "Nabami", "Dashami"].map((day) => (
                                    <button
                                      key={day}
                                      onClick={() => handleGenerateMemberPass(m, day)}
                                      className="bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold px-2.5 py-1 rounded-lg text-[11px] transition border border-amber-300 shadow-2xs"
                                      title={`Generate ${day} Lunch Pass for ${Math.min(m.headcount || 4, 6)} members`}
                                    >
                                      🍛 {day}
                                    </button>
                                  ))}
                                  <button
                                    onClick={() => handleGenerateMemberPass(m, "All 4 Pujo Days")}
                                    className="bg-primary hover:bg-primary-hover text-white font-bold px-3 py-1 rounded-lg text-[11px] transition shadow-2xs"
                                    title="Generate All Days Pass"
                                  >
                                    🎫 All Days
                                  </button>
                                </div>
                              </td>
                              <td className="p-3.5 text-right space-x-1">
                                <button
                                  onClick={() => setEditingMember({ ...m })}
                                  className="p-1.5 text-gray-500 hover:text-primary hover:bg-amber-50 rounded-lg transition"
                                  title="Edit Member Details"
                                >
                                  <Edit2 size={14} />
                                </button>
                                <button
                                  onClick={() => handleDeleteMember(m.id)}
                                  className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                                  title="Remove Member"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="bg-gray-50/70 p-8 rounded-xl text-center text-xs text-gray-500 space-y-2">
                    <p className="font-semibold text-gray-700 text-sm">No PSS Member records uploaded yet.</p>
                    <p>Use the <strong>Quick CSV Import</strong> box above to paste rows from your member roster or add a family manually.</p>
                  </div>
                )}
              </div>

              {/* EDIT MEMBER MODAL */}
              {editingMember && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
                  <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-amber-300 relative">
                    <button
                      onClick={() => setEditingMember(null)}
                      className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition"
                    >
                      <X size={18} />
                    </button>

                    <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                      <Edit2 size={20} className="text-primary" />
                      <h3 className="font-heading text-lg font-bold text-gray-900">
                        Edit Member Family Details
                      </h3>
                    </div>

                    <form onSubmit={handleSaveEditedMember} className="space-y-4 text-xs">
                      <div>
                        <label className="block font-semibold text-gray-700 mb-1">Head of Family Name *</label>
                        <input
                          type="text"
                          required
                          value={editingMember.name}
                          onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                          className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none font-bold"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-semibold text-gray-700 mb-1">Tower</label>
                          <select
                            value={editingMember.tower}
                            onChange={(e) => setEditingMember({ ...editingMember, tower: e.target.value })}
                            className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                          >
                            {towerList.map((t) => (
                              <option key={t.id} value={t.fullName || `${t.tower} (${t.name})`}>
                                {t.fullName || `${t.tower} (${t.name})`}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block font-semibold text-gray-700 mb-1">Flat / Unit (e.g. 402, G01) *</label>
                          <input
                            type="text"
                            required
                            autoCapitalize="characters"
                            maxLength={8}
                            value={editingMember.flatNumber}
                            onChange={(e) => {
                              const val = e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, "").slice(0, 8);
                              setEditingMember({ ...editingMember, flatNumber: val });
                            }}
                            className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none font-bold font-mono"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-semibold text-gray-700 mb-1">Mobile / WhatsApp (10 Digits)</label>
                          <input
                            type="tel"
                            inputMode="numeric"
                            maxLength={10}
                            pattern="[0-9]{10}"
                            value={editingMember.phone}
                            onChange={(e) => {
                              const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                              setEditingMember({ ...editingMember, phone: val });
                            }}
                            className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none font-mono"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold text-gray-700 mb-1">Headcount (Max 6)</label>
                          <select
                            value={editingMember.headcount}
                            onChange={(e) => setEditingMember({ ...editingMember, headcount: Number(e.target.value) })}
                            className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                          >
                            {[1, 2, 3, 4, 5, 6].map((num) => (
                              <option key={num} value={num}>{num} Members</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="pt-2 flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingMember(null)}
                          className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 text-xs font-bold text-white bg-primary hover:bg-primary-hover rounded-xl shadow-xs transition"
                        >
                          Save Changes
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* SUB-VIEW 2: ISSUED LUNCH PASSES & LIVE KITCHEN HEADCOUNTS */}
          {membersSubView === "kitchen" && (
            <div className="space-y-6">
              
              {/* Daily Kitchen Headcount Metrics */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { id: "saptami", day: "Maha Saptami (17 Oct)", menu: "Khichuri, Labra, Payesh" },
                  { id: "ashtami", day: "Maha Ashtami (18 Oct)", menu: "Bhog Khichuri, Luchi, Chanar Payesh" },
                  { id: "nabami", day: "Maha Nabami (19 Oct)", menu: "Basanti Pulao, Paneer/Veg Delicacy" },
                  { id: "dashami", day: "Vijaya Dashami (20 Oct)", menu: "Shanti Jal, Prasad & Sweets" },
                ].map((d) => {
                  const countForDay = bhogPasses
                    .filter((p) => p.days && p.days.includes(d.id))
                    .reduce((acc, p) => acc + (Number(p.passCount) || 0), 0);

                  return (
                    <div key={d.id} className="bg-white p-5 rounded-2xl border border-amber-300/80 shadow-xs">
                      <div className="text-xs font-bold text-amber-900 uppercase mb-1">{d.day}</div>
                      <div className="text-2xl sm:text-3xl font-bold text-primary font-heading">
                        {countForDay} <span className="text-xs font-sans text-gray-500 font-normal">Registered Meals</span>
                      </div>
                      <div className="text-[11px] text-gray-500 mt-1 line-clamp-1">{d.menu}</div>
                    </div>
                  );
                })}
              </div>

              {/* Registered Families Table */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-gray-200 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-heading text-lg font-bold text-gray-900">
                      🍽️ Issued Daily Bhog Lunch Passes ({bhogPasses.length} Passes)
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Passes generated for PSS Member families with real-time kitchen headcount tracking (Max 6 per flat).
                    </p>
                  </div>

                  <button
                    onClick={() => window.print()}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 w-fit"
                  >
                    <Download size={14} /> Print Kitchen Roster
                  </button>
                </div>

                {bhogPasses.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-gray-100 text-gray-600 font-semibold border-b border-gray-200">
                          <th className="p-3">Family Head &amp; Flat</th>
                          <th className="p-3">Phone / WhatsApp</th>
                          <th className="p-3">Pass Count</th>
                          <th className="p-3">Registered Pujo Days</th>
                          <th className="p-3">Token ID</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {bhogPasses.map((pass) => (
                          <tr key={pass.passId} className="hover:bg-gray-50">
                            <td className="p-3">
                              <span className="font-bold text-gray-900 block">{pass.name}</span>
                              <span className="text-gray-500 text-[11px]">{pass.tower} • Flat {pass.flatNumber}</span>
                            </td>
                            <td className="p-3 font-mono">
                              <a
                                href={`https://api.whatsapp.com/send?phone=${pass.phone?.replace(/[^0-9]/g, '')}&text=Hello%20${encodeURIComponent(pass.name)}%2C%20greetings%20from%20PBEL%20Sanskritik%20Samiti!%20Your%20Daily%20Maha%20Bhog%20Pass%20ID%20is%20${pass.passId}.`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-green-700 font-bold hover:underline inline-flex items-center gap-1"
                              >
                                <span>📱 {pass.phone}</span>
                              </a>
                            </td>
                            <td className="p-3">
                              <span className="bg-green-100 text-green-800 font-bold px-2.5 py-0.5 rounded-full">
                                {pass.passCount} Members
                              </span>
                            </td>
                            <td className="p-3">
                              <div className="flex flex-wrap gap-1">
                                {pass.days?.map((d: string) => (
                                  <span key={d} className="bg-amber-100 text-amber-900 text-[10px] font-semibold px-2 py-0.5 rounded-md capitalize">
                                    {d}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="p-3 font-mono text-[11px] font-bold text-primary">
                              {pass.passId}
                            </td>
                            <td className="p-3 text-right">
                              <button
                                onClick={() => handleClearBhogPass(pass.passId)}
                                className="p-1 text-gray-400 hover:text-red-600 rounded"
                                title="Remove Pass"
                              >
                                <Trash2 size={14} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="bg-gray-50 p-6 rounded-xl text-center text-xs text-gray-500">
                    No family lunch passes issued yet. Generate passes from the <strong>Patron Members Roster</strong> tab to track daily kitchen headcounts.
                  </div>
                )}
              </div>

            </div>
          )}

        </div>
      )}

      {/* ADMIN DIGITAL PASS POPUP MODAL */}
      {adminPassModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border-2 border-amber-400 shadow-2xl relative text-center animate-fade-in">
            <button
              onClick={() => setAdminPassModal(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center font-bold"
            >
              ✕
            </button>

            <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-3">
              <ShieldCheck size={13} className="text-primary" />
              <span>Official PSS Dining Pass (Admin Stamped)</span>
            </div>

            <h2 className="font-heading text-2xl font-bold text-primary mb-1">
              Maha Bhog Lunch Token
            </h2>
            <p className="text-xs text-gray-500 mb-5">
              PBEL Sanskritik Samiti • PBEL City Durgotsav 2026
            </p>

            <div className="bg-gradient-to-br from-[#FFFDF9] to-[#FDF8F0] rounded-2xl p-5 border border-amber-300 text-left space-y-3 mb-6 shadow-sm">
              <div className="flex items-center justify-between pb-2.5 border-b border-amber-900/10">
                <div>
                  <span className="font-heading text-lg font-bold text-gray-900 block">{adminPassModal.name}</span>
                  <span className="text-xs text-amber-800 font-semibold">{adminPassModal.tower} • Flat {adminPassModal.flatNumber}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-gray-400 block font-mono">TOKEN ID</span>
                  <span className="font-mono text-xs font-bold text-primary">{adminPassModal.passId}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-gray-500 text-[11px] block">Daily Pass Headcount</span>
                  <span className="font-bold text-green-700 text-base font-heading">{adminPassModal.passCount} Members</span>
                </div>
                <div>
                  <span className="text-gray-500 text-[11px] block">Dining Timing</span>
                  <span className="font-semibold text-gray-900">01:00 PM – 03:30 PM</span>
                </div>
              </div>

              <div className="pt-2 border-t border-amber-900/10 text-xs">
                <span className="text-gray-500 text-[11px] block mb-1">Selected Day:</span>
                <span className="bg-amber-200/90 text-amber-950 text-xs font-bold px-3 py-1 rounded-full">
                  🍛 {adminPassModal.dayLabel || "All Pujo Days"}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => window.print()}
                className="flex-1 bg-primary hover:bg-primary-hover text-white py-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Download size={14} />
                <span>Save / Print Token</span>
              </button>
              <button
                onClick={() => setAdminPassModal(null)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-3 rounded-xl text-xs font-semibold transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🎭 PRATIBIMB EMCEE MASTER RUN-SHEET MODAL */}
      {isEmceeModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-5xl w-full p-6 sm:p-8 border border-amber-400/40 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsEmceeModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
            >
              <X size={18} />
            </button>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-gray-100">
              <div>
                <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-2">
                  <ClipboardList size={13} className="text-primary" />
                  <span>Pratibimb Stage &amp; Sound Cue Sheet</span>
                </div>
                <h2 className="font-heading text-2xl font-bold text-gray-900">
                  Emcee Master Run-Sheet &amp; Stage Lineup
                </h2>
                <p className="text-xs text-gray-500">
                  Live, chronological stage cue order for Sound Engineers, Stage Leads, and Emcees.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="bg-primary hover:bg-primary-hover text-white px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                >
                  <Printer size={14} />
                  <span>Print Stage Cue Sheet</span>
                </button>
              </div>
            </div>

            {/* DAY SELECTION FILTER TABS */}
            <div className="flex flex-wrap items-center gap-1.5 mb-5 p-1.5 bg-amber-50/70 rounded-2xl border border-amber-200/70">
              {[
                { id: "all", label: "All 6 Days", date: "" },
                { id: "2026-10-15", label: "Panchami", date: "15 Oct" },
                { id: "2026-10-16", label: "Maha Sashti", date: "16 Oct" },
                { id: "2026-10-17", label: "Maha Saptami", date: "17 Oct" },
                { id: "2026-10-18", label: "Maha Ashtami", date: "18 Oct" },
                { id: "2026-10-19", label: "Maha Nabami", date: "19 Oct" },
                { id: "2026-10-20", label: "Vijaya Dashami", date: "20 Oct" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setEmceeFilterDay(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    emceeFilterDay === tab.id
                      ? "bg-primary text-white shadow-xs"
                      : "bg-white/80 hover:bg-white text-gray-700 hover:text-primary border border-amber-200/50"
                  }`}
                >
                  {tab.label} {tab.date && <span className="opacity-80 text-[10px]">({tab.date})</span>}
                </button>
              ))}
            </div>

            {/* DYNAMIC PER-DAY RUN SHEET */}
            {(() => {
              const currentScheduleList = getStoredSchedule();
              const targetDays = emceeFilterDay === "all"
                ? currentScheduleList
                : currentScheduleList.filter((d) => d.isoDate === emceeFilterDay);

              if (targetDays.length === 0) {
                return (
                  <div className="p-8 text-center text-xs text-gray-500 bg-gray-50 rounded-2xl">
                    No schedule configured for this selected date.
                  </div>
                );
              }

              return (
                <div className="space-y-6">
                  {targetDays.map((dayItem) => {
                    const dayPerfs = performances.filter((p) => {
                      const rawDate = p.cultural_evenings?.evening_date || p.evening_date || p.scheduled_date || (p.created_at ? p.created_at.split("T")[0] : "");
                      return rawDate === dayItem.isoDate;
                    });

                    const headliner = dayItem.culturalEvening?.pssHeadliner;
                    const startTime = (dayItem.culturalEvening?.time || "06:30 PM").split(" - ")[0] || "06:30 PM";

                    return (
                      <div key={dayItem.id} className="border border-amber-300/80 rounded-2xl overflow-hidden shadow-xs">
                        {/* Day Banner */}
                        <div className="bg-gradient-to-r from-amber-100 via-amber-50 to-white px-4 py-3 border-b border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <div className="flex items-center gap-2">
                            <span className="bg-primary text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                              {dayItem.dayName}
                            </span>
                            <span className="font-heading font-bold text-gray-900 text-sm">
                              {dayItem.theme}
                            </span>
                          </div>
                          <span className="text-xs font-semibold text-amber-900">
                            📅 {dayItem.date} • ⏱️ {dayItem.culturalEvening?.time || "06:30 PM - 10:30 PM"}
                          </span>
                        </div>

                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse text-xs">
                            <thead>
                              <tr className="bg-amber-50/80 text-amber-950 font-bold border-b border-amber-200/80">
                                <th className="p-3 w-16">Cue #</th>
                                <th className="p-3 w-28">Stage Time</th>
                                <th className="p-3">Performance / Act Title</th>
                                <th className="p-3 w-32">Format / Genre</th>
                                <th className="p-3">Artists / Contact</th>
                                <th className="p-3">Audio &amp; Stage Cues</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 bg-white">
                              {/* 1. Day Opening Cue */}
                              <tr className="bg-amber-100/30 font-medium">
                                <td className="p-3 font-mono font-bold text-primary">#01</td>
                                <td className="p-3 font-mono font-bold text-gray-900">{startTime}</td>
                                <td className="p-3">
                                  <span className="font-bold text-primary block">
                                    Stage Diya Lighting &amp; Agomoni Welcome
                                  </span>
                                  <span className="text-gray-500 text-[11px]">{dayItem.theme}</span>
                                </td>
                                <td className="p-3">
                                  <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md font-semibold text-[11px]">
                                    Inauguration
                                  </span>
                                </td>
                                <td className="p-3 text-gray-700">PSS Cultural Leads &amp; Priests</td>
                                <td className="p-3 text-gray-600">2 Wireless Handheld Mics + Aarti Light Wash Cue</td>
                              </tr>

                              {/* 2. Registered Resident Performances for this day */}
                              {dayPerfs.map((p, pIdx) => (
                                <tr key={p.id || pIdx} className="hover:bg-gray-50/70">
                                  <td className="p-3 font-mono font-bold text-gray-700">
                                    #{String(pIdx + 2).padStart(2, "0")}
                                  </td>
                                  <td className="p-3 font-mono font-semibold text-gray-900">
                                    {p.scheduled_time || `Act ${pIdx + 1}`}
                                  </td>
                                  <td className="p-3">
                                    <span className="font-bold text-gray-900 block">{p.song_name || p.performance_type}</span>
                                    <span className="text-gray-500 text-[11px]">{p.performance_type}</span>
                                  </td>
                                  <td className="p-3">
                                    <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded-md font-medium text-[11px]">
                                      {p.format || "Solo"}
                                    </span>
                                  </td>
                                  <td className="p-3">
                                    <span className="font-semibold text-gray-900 block">{p.contact_name} (Flat {p.flat_number})</span>
                                    <span className="text-gray-500 text-[11px]">
                                      {p.participant_names || "Solo"} • 📱 {p.phone}
                                    </span>
                                  </td>
                                  <td className="p-3 text-gray-600">
                                    {p.performance_type === "Dance"
                                      ? "Aux / Bluetooth Audio Track • Stage Wash"
                                      : "1 Vocal Mic + Instrument In"}
                                  </td>
                                </tr>
                              ))}

                              {/* If no resident performances registered for this day yet */}
                              {dayPerfs.length === 0 && (
                                <tr>
                                  <td colSpan={6} className="p-4 text-center text-gray-400 italic text-[11px]">
                                    Resident performance slots open ({dayItem.culturalEvening?.residentSlotsAvailable || 8} slots available).
                                  </td>
                                </tr>
                              )}

                              {/* 3. Day Flagship Headliner or Evening Finale */}
                              {headliner ? (
                                <tr className="bg-gradient-to-r from-red-50 to-amber-50 font-semibold border-t border-amber-200">
                                  <td className="p-3 font-mono font-bold text-primary">#FINAL</td>
                                  <td className="p-3 font-mono font-bold text-primary">{headliner.time}</td>
                                  <td className="p-3">
                                    <span className="font-heading font-bold text-primary block text-sm">
                                      {headliner.title}
                                    </span>
                                    <span className="text-amber-900 text-[11px] font-medium">{headliner.genre}</span>
                                  </td>
                                  <td className="p-3">
                                    <span className="bg-amber-200 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-md text-[11px] font-bold">
                                      {headliner.duration}
                                    </span>
                                  </td>
                                  <td className="p-3 text-gray-900 font-bold">PSS Flagship Production / Artists</td>
                                  <td className="p-3 text-gray-700">
                                    Full Stage Sound Setup, 4 Vocal Mics, Percussion Mics &amp; LED Visuals
                                  </td>
                                </tr>
                              ) : (
                                <tr className="bg-amber-50/50 font-semibold border-t border-amber-200">
                                  <td className="p-3 font-mono font-bold text-primary">#FINAL</td>
                                  <td className="p-3 font-mono font-bold text-gray-900">
                                    {(dayItem.culturalEvening?.time || "10:00 PM").split(" - ")[1] || "10:00 PM"}
                                  </td>
                                  <td className="p-3">
                                    <span className="font-heading font-bold text-primary block">
                                      Grand Sandhya Aarti &amp; Community Farewell
                                    </span>
                                    <span className="text-gray-500 text-[11px]">Pratibimb Daily Stage Finale</span>
                                  </td>
                                  <td className="p-3">
                                    <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md text-[11px] font-medium">
                                      Community Aarti
                                    </span>
                                  </td>
                                  <td className="p-3 text-gray-700">All Residents &amp; Cultural Volunteers</td>
                                  <td className="p-3 text-gray-600">Dhaak Beats &amp; Stage Follow Spot</td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}

            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <span>Pratibimb Stage Coordination Desk • PBEL Sanskritik Samiti</span>
              <button
                onClick={() => setIsEmceeModalOpen(false)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold px-4 py-2 rounded-xl"
              >
                Close Run-Sheet
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ADMIN POP-UP HIGHLIGHT LIVE PREVIEW MODAL */}
      {isPreviewingPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fadeIn">
          <div className="bg-gradient-to-b from-[#FFFDF9] to-[#FDF8F0] rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-amber-400 relative animate-scaleUp max-h-[90vh] flex flex-col">
            <button
              onClick={() => setIsPreviewingPopup(false)}
              className="absolute top-3.5 right-3.5 z-20 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition backdrop-blur-md shadow-md"
              aria-label="Close Preview"
            >
              <X size={16} />
            </button>

            {/* Feature Image */}
            {popupHighlight.imageUrl && (
              <div className="relative h-44 sm:h-52 w-full bg-gradient-to-r from-[#850E1F] to-[#5C0A15] overflow-hidden shrink-0">
                <img
                  src={popupHighlight.imageUrl}
                  alt={popupHighlight.title}
                  className="w-full h-full object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#200206] via-transparent to-black/30" />
                {popupHighlight.badge && (
                  <div className="absolute bottom-3 left-4 bg-amber-400/95 text-amber-950 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md">
                    <Sparkles size={12} className="text-amber-900" />
                    <span>{popupHighlight.badge}</span>
                  </div>
                )}
              </div>
            )}

            <div className="p-5 sm:p-6 space-y-3.5 overflow-y-auto">
              {!popupHighlight.imageUrl && popupHighlight.badge && (
                <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider">
                  <Sparkles size={12} className="text-primary" />
                  <span>{popupHighlight.badge}</span>
                </div>
              )}

              <div>
                <h3 className="font-heading text-xl sm:text-2xl font-bold text-gray-900 leading-snug">
                  {popupHighlight.title}
                </h3>
                {popupHighlight.subtitle && (
                  <p className="text-xs sm:text-sm font-semibold text-primary mt-1">
                    {popupHighlight.subtitle}
                  </p>
                )}
              </div>

              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                {popupHighlight.snippet}
              </p>

              <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsPreviewingPopup(false)}
                  className="flex-1 bg-gradient-to-r from-[#D99B26] to-[#B8801C] hover:from-[#B8801C] hover:to-[#966714] text-white py-3 px-4 rounded-xl font-bold text-xs sm:text-sm transition text-center shadow-md golden-glow"
                >
                  {popupHighlight.actionText || "Learn More →"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsPreviewingPopup(false)}
                  className="bg-amber-100/70 hover:bg-amber-200/80 text-amber-900 py-3 px-5 rounded-xl font-semibold text-xs transition text-center"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )}
</>
);
}
