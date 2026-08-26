"use client";

import { useState, useEffect } from "react";
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
  Settings
} from "lucide-react";
import { supabase } from "@/utils/supabase/client";

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

// Default Evening configurations with PSS Special Flagship Events
const initialEveningsConfig = [
  {
    id: "ev-panchami",
    day: "Panchami",
    date: "2026-10-15",
    theme: "Agomoni & Opening Gala",
    startTime: "07:00 PM",
    endTime: "09:30 PM",
    maxResidentSlots: 10,
    hasPssFlagship: false,
    pssEventTitle: "Agomoni Musical Night & Anandamela Opening",
    pssEventTime: "07:00 PM - 09:30 PM",
    pssDuration: "2.5 Hours",
  },
  {
    id: "ev-sashti",
    day: "Maha Sashti",
    date: "2026-10-16",
    theme: "Retro Rock Night & Dance",
    startTime: "06:30 PM",
    endTime: "10:30 PM",
    maxResidentSlots: 8,
    hasPssFlagship: true,
    pssEventTitle: "⭐ Retro Rock by Fushmontor (PSS Headliner)",
    pssEventTime: "08:15 PM - 09:45 PM",
    pssDuration: "1.5 Hours (90 Mins)",
  },
  {
    id: "ev-saptami",
    day: "Maha Saptami",
    date: "2026-10-17",
    theme: "Dance Drama & Vocal Gala",
    startTime: "06:30 PM",
    endTime: "10:30 PM",
    maxResidentSlots: 8,
    hasPssFlagship: true,
    pssEventTitle: "⭐ Dance Drama Production by PSS (PSS Headliner)",
    pssEventTime: "07:45 PM - 08:45 PM",
    pssDuration: "1.0 Hour (60 Mins)",
  },
  {
    id: "ev-ashtami",
    day: "Maha Ashtami",
    date: "2026-10-18",
    theme: "Grand Bangla Drama & Dhaak",
    startTime: "06:30 PM",
    endTime: "11:00 PM",
    maxResidentSlots: 8,
    hasPssFlagship: true,
    pssEventTitle: "⭐ Grand Bangla Theatrical Drama (Natok) by PSS (PSS Headliner)",
    pssEventTime: "07:45 PM - 08:45 PM",
    pssDuration: "1.0 Hour (60 Mins)",
  },
  {
    id: "ev-nabami",
    day: "Maha Nabami",
    date: "2026-10-19",
    theme: "Cultural Stage Grand Finale",
    startTime: "07:00 PM",
    endTime: "11:00 PM",
    maxResidentSlots: 12,
    hasPssFlagship: false,
    pssEventTitle: "Pratibimb Participant Awards & DJ Dandiya Finale",
    pssEventTime: "07:30 PM - 11:00 PM",
    pssDuration: "3.5 Hours",
  },
  {
    id: "ev-dashami",
    day: "Vijaya Dashami",
    date: "2026-10-20",
    theme: "Subho Bijoya Sammilani",
    startTime: "06:30 PM",
    endTime: "09:30 PM",
    maxResidentSlots: 6,
    hasPssFlagship: false,
    pssEventTitle: "Dhunuchi Master Showcase & Subho Bijoya Kolakoli",
    pssEventTime: "07:00 PM - 09:00 PM",
    pssDuration: "2.0 Hours",
  },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "contributions" | "categories" | "schedule" | "pratibimb_config" | "pratibimb_acts" | "volunteers" | "sponsors" | "gallery">("overview");

  // Live Data States
  const [contributions, setContributions] = useState<any[]>([]);
  const [categoriesList, setCategoriesList] = useState<any[]>([]);
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [performances, setPerformances] = useState<any[]>([]);
  const [eventsList, setEventsList] = useState<any[]>(initialDefaultEvents);
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
  const [loading, setLoading] = useState(true);

  // Form State: Add / Edit Seva Category
  const [newCategory, setNewCategory] = useState({ 
    id: "", 
    name: "", 
    fixed_amount: 1001, 
    description: "", 
    max_limit: 5, 
    is_active: true 
  });
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [isSubmittingCategory, setIsSubmittingCategory] = useState(false);

  // Form State: Add / Edit Schedule Event
  const [newEvent, setNewEvent] = useState({ id: "", title: "", event_type: "Nirghanto", date: "2026-10-15", time: "10:00 AM", description: "" });
  const [isEditingEvent, setIsEditingEvent] = useState(false);
  const [isSubmittingEvent, setIsSubmittingEvent] = useState(false);

  // Form State: Edit Evening Config
  const [editingEvening, setEditingEvening] = useState<any | null>(null);

  // Form State: Sponsor
  const [newSponsor, setNewSponsor] = useState({ name: "", tier: "Gold", logo_url: "" });
  const [isSubmittingSponsor, setIsSubmittingSponsor] = useState(false);

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

      // 5. Fetch Events (merge DB events with initial list)
      const { data: evts } = await supabase
        .from("events")
        .select("*")
        .order("start_time", { ascending: true });
      if (evts && evts.length > 0) {
        setEventsList(evts);
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

// Category limit & status metadata helpers for reliable backwards compatibility
function encodeCategoryDescription(desc: string, maxLimit?: number, isActive?: boolean) {
  const clean = (desc || '').replace(/\[limit:\d+\]/g, '').replace(/\[status:(active|inactive)\]/g, '').trim();
  const limitTag = maxLimit !== undefined && maxLimit !== null ? `[limit:${maxLimit}]` : '';
  const statusTag = isActive !== undefined ? `[status:${isActive ? 'active' : 'inactive'}]` : '';
  return `${clean} ${limitTag} ${statusTag}`.trim();
}

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

  // 1. Overview Calculations
  const verifiedContributions = contributions.filter((c) => c.status === "Success");
  const pendingContributions = contributions.filter((c) => c.status === "Pending Verification" || c.status === "Pending");
  const totalFunds = verifiedContributions.reduce((acc, c) => acc + (Number(c.amount) || 0), 0);
  const pendingFunds = pendingContributions.reduce((acc, c) => acc + (Number(c.amount) || 0), 0);

  // CATEGORIES CMS
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingCategory(true);
    try {
      const encodedDesc = encodeCategoryDescription(
        newCategory.description, 
        newCategory.max_limit, 
        newCategory.is_active
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
        alert("Seva Category & Limits updated successfully!");
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
      setNewCategory({ id: "", name: "", fixed_amount: 1001, description: "", max_limit: 5, is_active: true });
      setIsEditingCategory(false);
      await fetchData();
    } catch (err: any) {
      console.error("Error saving category:", err);
      alert(`Unexpected error: ${err.message || err}`);
    } finally {
      setIsSubmittingCategory(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Are you sure you want to delete this Seva Category?")) return;
    await supabase.from("contribution_categories").delete().eq("id", id);
    setCategoriesList(categoriesList.filter((c) => c.id !== id));
  };

  // SCHEDULE (Pujo Nirghanto) CMS
  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingEvent(true);
    try {
      if (isEditingEvent && newEvent.id) {
        // Update in state & DB
        setEventsList(eventsList.map((evt) => (evt.id === newEvent.id ? { ...evt, ...newEvent } : evt)));
        try {
          await supabase.from("events").update({
            title: newEvent.title,
            description: newEvent.description,
            event_type: newEvent.event_type,
          }).eq("id", newEvent.id);
        } catch (_) {}
        alert("Event updated successfully!");
      } else {
        // Add new
        const newEntry = {
          id: Date.now().toString(),
          title: newEvent.title,
          description: newEvent.description,
          date: newEvent.date,
          time: newEvent.time,
          event_type: newEvent.event_type,
        };
        setEventsList([...eventsList, newEntry]);
        try {
          const startTime = new Date(`${newEvent.date}T${newEvent.time.includes("PM") ? "18:00:00" : "09:00:00"}`).toISOString();
          await supabase.from("events").insert({
            title: newEvent.title,
            description: newEvent.description,
            start_time: startTime,
            end_time: startTime,
            event_type: newEvent.event_type,
          });
        } catch (_) {}
        alert("New event published to live schedule!");
      }

      setNewEvent({ id: "", title: "", event_type: "Nirghanto", date: "2026-10-15", time: "10:00 AM", description: "" });
      setIsEditingEvent(false);
    } finally {
      setIsSubmittingEvent(false);
    }
  };

  const handleEditEvent = (evt: any) => {
    setNewEvent({
      id: evt.id,
      title: evt.title,
      event_type: evt.event_type || "Nirghanto",
      date: evt.date || "2026-10-15",
      time: evt.time || "10:00 AM",
      description: evt.description || "",
    });
    setIsEditingEvent(true);
  };

  const handleDeleteEvent = (id: string) => {
    if (!confirm("Are you sure you want to delete this event from the schedule?")) return;
    setEventsList(eventsList.filter((evt) => evt.id !== id));
    try {
      supabase.from("events").delete().eq("id", id);
    } catch (_) {}
  };

  // PRATIBIMB EVENINGS & CAPACITY CONFIGURATION CMS
  const handleSaveEveningConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvening) return;

    setEveningsConfig(
      eveningsConfig.map((ev) => (ev.id === editingEvening.id ? editingEvening : ev))
    );
    alert(`Configuration updated for ${editingEvening.day}!`);
    setEditingEvening(null);
  };

  // SPONSORS CMS
  const handleAddSponsor = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingSponsor(true);
    try {
      const { error } = await supabase.from("sponsors").insert({
        name: newSponsor.name,
        tier: newSponsor.tier,
        logo_url: newSponsor.logo_url || null,
        is_active: true,
      });

      if (error) throw error;
      alert("New corporate sponsor published to homepage!");
      setNewSponsor({ name: "", tier: "Gold", logo_url: "" });
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
    fetchData();
  };

  // GALLERY CMS
  const handleAddPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry = {
      id: Date.now().toString(),
      title: newPhoto.title,
      year: newPhoto.year,
      category: newPhoto.category,
      emoji: newPhoto.emoji || "🌺",
    };
    setGalleryList([newEntry, ...galleryList]);
    alert("New photo added to the Homepage Gallery Carousel!");
    setNewPhoto({ title: "", year: "2025", category: "Pujo Rituals", emoji: "🌺", image_url: "" });
  };

  const handleDeletePhoto = (id: string) => {
    setGalleryList(galleryList.filter((p) => p.id !== id));
  };

  return (
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
          <p className="text-xs text-gray-500 mt-1">Logged in as: raibatak@gmail.com (Super Admin)</p>
        </div>

        <button
          onClick={fetchData}
          className="bg-primary hover:bg-primary-hover text-white text-xs font-semibold px-5 py-2.5 rounded-full transition flex items-center gap-2 self-start md:self-auto shadow-sm"
        >
          <span>Refresh Live Data</span>
        </button>
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

      {/* Admin Module Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
        {[
          { id: "overview", label: "📊 Overview" },
          { id: "contributions", label: "💰 Contributions (CRM)" },
          { id: "categories", label: "🌺 Seva Categories CMS" },
          { id: "schedule", label: "📅 Schedule (Nirghanto) CMS" },
          { id: "pratibimb_config", label: "⚙️ Pratibimb Timings & Slots CMS" },
          { id: "pratibimb_acts", label: "🎭 Registered Acts" },
          { id: "volunteers", label: "🤝 Volunteers Roster" },
          { id: "sponsors", label: "🏢 Sponsors & Brands" },
          { id: "gallery", label: "🖼️ Gallery Carousel CMS" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition shrink-0 ${
              activeTab === tab.id
                ? "bg-primary text-white shadow-sm"
                : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT: 1. OVERVIEW */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
        </div>
      )}

      {/* TAB CONTENT: 2. CONTRIBUTIONS CRM */}
      {activeTab === "contributions" && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
          
          {/* Header & Verification Summary Cards */}
          <div className="p-4 sm:p-6 border-b border-gray-200 bg-gray-50/50 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-heading text-lg font-bold text-gray-900">Donor Contributions & Verification CRM</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Verify UTR / bank reference numbers against society bank account before approving onto public Wall & Ticker.
                </p>
              </div>
              <button
                onClick={() => window.print()}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 self-start sm:self-auto shadow-2xs"
              >
                <Download size={14} /> Export / Print Registry
              </button>
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
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-100 text-gray-600 font-semibold border-b border-gray-200">
                  <th className="p-3.5">Contributor Name</th>
                  <th className="p-3.5">Flat Number</th>
                  <th className="p-3.5">Phone</th>
                  <th className="p-3.5">Amount</th>
                  <th className="p-3.5">UTR / Payment ID</th>
                  <th className="p-3.5">Wall Visibility</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Verification Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {contributions.map((c) => {
                  const isVerified = c.status === "Success";
                  const isPending = c.status === "Pending" || c.status === "Pending Verification";
                  const isRejected = c.status === "Failed" || c.status === "Rejected";

                  return (
                    <tr key={c.id} className={`hover:bg-gray-50/60 ${isPending ? "bg-amber-50/30" : ""}`}>
                      <td className="p-3.5 font-bold text-gray-900">{c.contributor_name}</td>
                      <td className="p-3.5 text-gray-700">{c.flat_number || "N/A"}</td>
                      <td className="p-3.5 text-gray-600">{c.phone}</td>
                      <td className="p-3.5 font-bold text-green-700 text-sm font-mono">₹{Number(c.amount).toLocaleString("en-IN")}</td>
                      <td className="p-3.5 font-mono text-[11px] text-gray-700 font-semibold">{c.payment_id}</td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${c.is_name_visible ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}>
                          {c.is_name_visible ? "Public" : "Anonymous"}
                        </span>
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
                        {!isVerified && (
                          <button
                            onClick={() => handleUpdateContributionStatus(c.id, "Success")}
                            className="bg-green-600 hover:bg-green-700 text-white font-bold text-[11px] px-2.5 py-1 rounded-lg transition shadow-2xs"
                            title="Approve and add to public fund ticker & Wall"
                          >
                            Approve (✓)
                          </button>
                        )}
                        {!isRejected && (
                          <button
                            onClick={() => handleUpdateContributionStatus(c.id, "Failed")}
                            className="bg-red-600 hover:bg-red-700 text-white font-bold text-[11px] px-2.5 py-1 rounded-lg transition shadow-2xs"
                            title="Reject fake/unverified submission"
                          >
                            Reject (✕)
                          </button>
                        )}
                        {isVerified && (
                          <button
                            onClick={() => handleUpdateContributionStatus(c.id, "Pending")}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-[10px] px-2 py-1 rounded-lg transition"
                            title="Mark back to Pending"
                          >
                            Revert
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
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
                    setNewCategory({ id: "", name: "", fixed_amount: 1001, description: "", max_limit: 5, is_active: true });
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

              <button
                type="submit"
                disabled={isSubmittingCategory}
                className="w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-xl font-bold transition shadow-sm flex items-center justify-center gap-2"
              >
                <Save size={15} />
                <span>{isSubmittingCategory ? "Saving..." : isEditingCategory ? "Update Seva Limits & Info" : "Publish Seva Category"}</span>
              </button>
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
                    <th className="p-3.5">Price</th>
                    <th className="p-3.5">Max Limit</th>
                    <th className="p-3.5">Booked</th>
                    <th className="p-3.5">Remaining</th>
                    <th className="p-3.5">Public Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {categoriesList.map((cat) => {
                    const decoded = decodeCategoryDescription(cat.description);
                    const booked = contributions.filter(
                      (c) => (c.category_id === cat.id || c.contribution_categories?.name?.toLowerCase() === cat.name?.toLowerCase()) && c.status !== "Rejected"
                    ).length;
                    
                    const max = cat.max_limit !== undefined && cat.max_limit !== null 
                      ? Number(cat.max_limit) 
                      : (decoded.parsedLimit !== undefined ? decoded.parsedLimit : 5);
                      
                    const isActive = cat.is_active !== undefined 
                      ? (cat.is_active !== false) 
                      : (decoded.parsedActive !== undefined ? decoded.parsedActive : true);

                    const remaining = Math.max(0, max - booked);
                    const isFull = remaining <= 0;

                    return (
                      <tr key={cat.id} className={`hover:bg-gray-50/60 ${isFull || !isActive ? "bg-gray-50/70" : ""}`}>
                        <td className="p-3.5 font-bold text-gray-900">{cat.name}</td>
                        <td className="p-3.5 font-bold text-primary font-mono">₹{cat.fixed_amount ? Number(cat.fixed_amount).toLocaleString("en-IN") : "Custom"}</td>
                        <td className="p-3.5 font-semibold text-gray-800">{max} slots</td>
                        <td className="p-3.5 font-bold text-amber-900">{booked}</td>
                        <td className="p-3.5">
                          <span className={`font-bold font-mono ${remaining > 0 ? "text-green-700" : "text-red-600"}`}>
                            {remaining} left
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            !isActive 
                              ? "bg-gray-200 text-gray-700" 
                              : isFull 
                              ? "bg-red-100 text-red-800" 
                              : "bg-green-100 text-green-800"
                          }`}>
                            {!isActive ? "Inactive" : isFull ? "🔒 Full / Greyed Out" : "✓ Active"}
                          </span>
                        </td>
                        <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                          <button
                            onClick={() => {
                              setNewCategory({
                                id: cat.id,
                                name: cat.name,
                                fixed_amount: cat.fixed_amount ? Number(cat.fixed_amount) : 1001,
                                description: decoded.cleanDescription,
                                max_limit: max,
                                is_active: isActive,
                              });
                              setIsEditingCategory(true);
                            }}
                            className="p-1.5 text-amber-700 hover:bg-amber-100 rounded-lg transition"
                            title="Edit / Increase Max Limit & Reactivate"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(cat.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Delete Category"
                          >
                            <Trash2 size={14} />
                          </button>
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

      {/* TAB CONTENT: 4. SCHEDULE (PUJO NIRGHANTO) CMS */}
      {activeTab === "schedule" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Add / Edit Event Form */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs h-fit">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <PlusCircle size={18} className="text-primary" />
                <h3 className="font-heading text-lg font-bold text-gray-900">
                  {isEditingEvent ? "Edit Schedule Item" : "Add Schedule Ritual"}
                </h3>
              </div>
              {isEditingEvent && (
                <button onClick={() => { setIsEditingEvent(false); setNewEvent({ id: "", title: "", event_type: "Nirghanto", date: "2026-10-15", time: "10:00 AM", description: "" }); }} className="text-xs text-gray-500 hover:text-gray-800 flex items-center gap-1">
                  <X size={14} /> Cancel
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
                  placeholder="e.g. Kola Bou Snan / Sandhi Pujo"
                  className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Date</label>
                  <select
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                  >
                    <option value="2026-10-15">15 Oct (Panchami)</option>
                    <option value="2026-10-16">16 Oct (Sashti)</option>
                    <option value="2026-10-17">17 Oct (Saptami)</option>
                    <option value="2026-10-18">18 Oct (Ashtami)</option>
                    <option value="2026-10-19">19 Oct (Nabami)</option>
                    <option value="2026-10-20">20 Oct (Dashami)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Timing (e.g. 10:30 AM)</label>
                  <input
                    type="text"
                    required
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                    placeholder="10:30 AM"
                    className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Description / Details</label>
                <textarea
                  rows={3}
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  placeholder="Ritual guidelines or details..."
                  className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingEvent}
                className="w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-xl font-bold transition shadow-sm flex items-center justify-center gap-2"
              >
                <Save size={15} />
                <span>{isSubmittingEvent ? "Saving..." : isEditingEvent ? "Update Schedule Ritual" : "Publish to Pujo Schedule"}</span>
              </button>
            </form>
          </div>

          {/* Current Schedule Rituals List with Edit & Delete */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50/50 flex items-center justify-between">
              <h3 className="font-heading text-lg font-bold text-gray-900">
                Pujo Nirghanto Rituals ({eventsList.length})
              </h3>
              <span className="text-xs text-gray-500">Live sync with `/programs` schedule</span>
            </div>

            <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-100 text-gray-600 font-semibold border-b border-gray-200 sticky top-0 bg-gray-100">
                    <th className="p-3.5">Date / Time</th>
                    <th className="p-3.5">Ritual Title</th>
                    <th className="p-3.5">Description</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {eventsList.map((evt) => (
                    <tr key={evt.id} className="hover:bg-gray-50/60">
                      <td className="p-3.5">
                        <span className="font-bold text-gray-900 block">{evt.date}</span>
                        <span className="text-primary font-semibold text-[11px]">{evt.time}</span>
                      </td>
                      <td className="p-3.5 font-bold text-gray-900">{evt.title}</td>
                      <td className="p-3.5 text-gray-500 max-w-xs truncate">{evt.description || "N/A"}</td>
                      <td className="p-3.5 text-right space-x-2">
                        <button onClick={() => handleEditEvent(evt)} className="p-1.5 text-amber-700 hover:bg-amber-50 rounded-lg transition" title="Edit Ritual"><Edit2 size={14} /></button>
                        <button onClick={() => handleDeleteEvent(evt.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition" title="Delete Ritual"><Trash2 size={14} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB CONTENT: 5. PRATIBIMB EVENINGS TIMINGS & CAPACITY CMS */}
      {activeTab === "pratibimb_config" && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-2 mb-6">
              <div>
                <h3 className="font-heading text-xl font-bold text-primary">
                  Pratibimb Evening Slots & Timings Configuration
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Set daily evening start/end timings, maximum resident slot capacities, and manage PSS Flagship Headliners.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {eveningsConfig.map((ev) => (
                <div key={ev.id} className="bg-gray-50/80 rounded-2xl p-5 border border-gray-200 flex flex-col justify-between relative group hover:border-amber-400 transition">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full uppercase">
                        {ev.day} ({ev.date})
                      </span>
                      {ev.hasPssFlagship && (
                        <span className="text-[10px] font-bold bg-amber-200 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Star size={10} className="fill-amber-600 text-amber-600" /> PSS Headliner
                        </span>
                      )}
                    </div>

                    <h4 className="font-heading text-lg font-bold text-gray-900 mb-1">{ev.theme}</h4>
                    
                    <div className="space-y-1.5 text-xs text-gray-600 mt-3 pt-3 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Evening Timings:</span>
                        <span className="font-bold text-gray-900">{ev.startTime} - {ev.endTime}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Max Resident Slots:</span>
                        <span className="font-bold text-primary">{ev.maxResidentSlots} Slots</span>
                      </div>
                    </div>

                    {/* PSS Flagship Details */}
                    {ev.hasPssFlagship && (
                      <div className="mt-3 p-3 bg-amber-100/70 rounded-xl border border-amber-300 text-xs">
                        <span className="text-[10px] font-bold text-amber-900 uppercase block mb-0.5">⭐ Flagship Show:</span>
                        <p className="font-bold text-gray-900">{ev.pssEventTitle}</p>
                        <span className="text-amber-800 font-semibold text-[11px]">{ev.pssEventTime} ({ev.pssDuration})</span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => setEditingEvening({ ...ev })}
                    className="mt-4 w-full bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 py-2 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5"
                  >
                    <Settings size={13} /> Edit Timing & Capacity
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Edit Modal for Evening Timing & Capacity */}
          {editingEvening && (
            <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-amber-400/40 shadow-2xl relative">
                <button onClick={() => setEditingEvening(null)} className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition">
                  <X size={18} />
                </button>

                <h3 className="font-heading text-2xl font-bold text-primary mb-1">
                  Edit {editingEvening.day} Configuration
                </h3>
                <p className="text-xs text-gray-500 mb-6">{editingEvening.date}</p>

                <form onSubmit={handleSaveEveningConfig} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Evening Theme / Title</label>
                    <input
                      type="text"
                      required
                      value={editingEvening.theme}
                      onChange={(e) => setEditingEvening({ ...editingEvening, theme: e.target.value })}
                      className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Stage Start Time</label>
                      <input
                        type="text"
                        required
                        value={editingEvening.startTime}
                        onChange={(e) => setEditingEvening({ ...editingEvening, startTime: e.target.value })}
                        placeholder="06:30 PM"
                        className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Stage End Time</label>
                      <input
                        type="text"
                        required
                        value={editingEvening.endTime}
                        onChange={(e) => setEditingEvening({ ...editingEvening, endTime: e.target.value })}
                        placeholder="10:30 PM"
                        className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Max Resident Performance Slots</label>
                    <input
                      type="number"
                      required
                      min="1"
                      max="30"
                      value={editingEvening.maxResidentSlots}
                      onChange={(e) => setEditingEvening({ ...editingEvening, maxResidentSlots: Number(e.target.value) })}
                      className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none font-bold text-primary"
                    />
                  </div>

                  {/* PSS Flagship Toggle */}
                  <div className="pt-2 border-t border-gray-100 space-y-2">
                    <label className="font-semibold text-gray-700 block">PSS Special Flagship Headliner</label>
                    <input
                      type="text"
                      value={editingEvening.pssEventTitle}
                      onChange={(e) => setEditingEvening({ ...editingEvening, pssEventTitle: e.target.value })}
                      placeholder="Title of PSS Show"
                      className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={editingEvening.pssEventTime}
                        onChange={(e) => setEditingEvening({ ...editingEvening, pssEventTime: e.target.value })}
                        placeholder="08:15 PM - 09:45 PM"
                        className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                      />
                      <input
                        type="text"
                        value={editingEvening.pssDuration}
                        onChange={(e) => setEditingEvening({ ...editingEvening, pssDuration: e.target.value })}
                        placeholder="1.5 Hours"
                        className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-xl font-bold transition shadow-sm mt-4"
                  >
                    Save & Apply Configuration
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: 6. PRATIBIMB REGISTERED ACTS */}
      {activeTab === "pratibimb_acts" && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-gray-50/50 flex items-center justify-between">
            <h3 className="font-heading text-lg font-bold text-gray-900">
              Registered Resident Stage Performers ({performances.length})
            </h3>
            <button onClick={() => window.print()} className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5">
              <Download size={14} /> Export Stage Lineup
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-100 text-gray-600 font-semibold border-b border-gray-200">
                  <th className="p-3.5">Contact Lead</th>
                  <th className="p-3.5">Flat Number</th>
                  <th className="p-3.5">WhatsApp Phone</th>
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
                    <td className="p-3.5 text-gray-600">{p.phone}</td>
                    <td className="p-3.5 font-semibold text-primary">{p.performance_type}</td>
                    <td className="p-3.5 text-gray-600">{p.format}</td>
                    <td className="p-3.5 font-medium text-amber-900">{p.song_name || "N/A"}</td>
                    <td className="p-3.5 max-w-xs truncate text-gray-500">{p.participant_names}</td>
                  </tr>
                ))}
                {performances.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-6 text-center text-gray-500">
                      No resident performance submissions recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 7. VOLUNTEERS ROSTER */}
      {activeTab === "volunteers" && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-gray-50/50">
            <h3 className="font-heading text-lg font-bold text-gray-900">Volunteer Duty Roster</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-100 text-gray-600 font-semibold border-b border-gray-200">
                  <th className="p-3.5">Volunteer Name</th>
                  <th className="p-3.5">Flat Number</th>
                  <th className="p-3.5">Assigned Domain / Role</th>
                  <th className="p-3.5">Duty Date</th>
                  <th className="p-3.5">Phone</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {volunteers.map((v) => (
                  <tr key={v.id} className="hover:bg-gray-50/60">
                    <td className="p-3.5 font-bold text-gray-900">{v.full_name}</td>
                    <td className="p-3.5 text-gray-700">{v.flat_number}</td>
                    <td className="p-3.5 font-semibold text-primary">{v.volunteer_slots?.volunteer_categories?.name || "Pujo Seva"}</td>
                    <td className="p-3.5 text-gray-600">{v.volunteer_slots?.slot_date || "Pujo Day"}</td>
                    <td className="p-3.5 text-gray-600">{v.phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 8. SPONSORS & CAMPAIGNS MANAGER */}
      {activeTab === "sponsors" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs h-fit">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
              <Award size={18} className="text-primary" />
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
                  placeholder="e.g. HDFC Bank / Tata Motors"
                  className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Sponsorship Tier</label>
                <select
                  value={newSponsor.tier}
                  onChange={(e) => setNewSponsor({ ...newSponsor, tier: e.target.value })}
                  className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                >
                  <option value="Platinum">Title / Platinum Partner</option>
                  <option value="Gold">Gold Partner</option>
                  <option value="Silver">Silver Partner</option>
                  <option value="Food & Bhog">Food & Bhog Partner</option>
                  <option value="Cultural">Cultural Stage Partner</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Logo Image URL (Optional)</label>
                <input
                  type="url"
                  value={newSponsor.logo_url}
                  onChange={(e) => setNewSponsor({ ...newSponsor, logo_url: e.target.value })}
                  placeholder="https://example.com/logo.png"
                  className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingSponsor}
                className="w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-xl font-bold transition shadow-sm"
              >
                {isSubmittingSponsor ? "Adding..." : "Publish Sponsor to Homepage"}
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
            <h3 className="font-heading text-lg font-bold text-gray-900 mb-4">Published Corporate Sponsors</h3>
            
            {sponsorsList.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {sponsorsList.map((s) => (
                  <div key={s.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-gray-900">{s.name}</h4>
                      <span className="text-xs text-amber-800 font-semibold">{s.tier} Partner</span>
                    </div>
                    <button
                      onClick={() => handleDeleteSponsor(s.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
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

      {/* TAB CONTENT: 9. GALLERY CAROUSEL CMS */}
      {activeTab === "gallery" && (
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
                  <button
                    onClick={() => handleDeletePhoto(p.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Delete Photo"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
