"use client";

import { useState, useEffect } from "react";
import { 
  CalendarDays, 
  Music, 
  CheckCircle2, 
  Sparkles, 
  Clock, 
  Flame, 
  MapPin, 
  Users, 
  Info,
  Calendar,
  Layers,
  ChevronRight,
  HeartHandshake,
  Star,
  Mic,
  Tv,
  Download,
  Building
} from "lucide-react";
import { supabase } from "@/utils/supabase/client";
import { generateGoogleCalendarUrl, generateIcsContent } from "@/utils/security";
import { getStoredTowers, fetchStoredTowers, TowerDefinition } from "@/config/towers";
import { getStoredSchedule, fetchStoredSchedule, DaySchedule } from "@/config/schedule";

export default function ProgramsPage() {
  const [selectedDay, setSelectedDay] = useState<string>("sashti");
  const [schedule, setSchedule] = useState<DaySchedule[]>(getStoredSchedule());
  const [towersList, setTowersList] = useState<TowerDefinition[]>([]);
  const [selectedTower, setSelectedTower] = useState<string>("");
  const [flatUnit, setFlatUnit] = useState<string>("");

  const [formData, setFormData] = useState({
    eveningDate: "2026-10-16",
    performanceType: "Song",
    format: "Solo (3-5 mins)",
    songName: "",
    participantNames: "",
    contactName: "",
    phone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleDownloadIcs = (event: {
    title: string;
    description: string;
    startDate: string;
    startTime: string;
    durationMinutes?: number;
  }) => {
    const icsString = generateIcsContent(event);
    const blob = new Blob([icsString], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute("download", `${event.title.toLowerCase().replace(/[^a-z0-9]/g, "-")}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Sync selected day with URL query param ?day=... and hydrate dynamic schedule + towers
  useEffect(() => {
    try {
      const stored = getStoredTowers();
      setTowersList(stored);
      if (stored.length > 0) {
        setSelectedTower(stored[0].fullName || `${stored[0].tower} (${stored[0].name})`);
      }
      fetchStoredTowers().then((cloudTowers) => {
        if (cloudTowers && cloudTowers.length > 0) {
          setTowersList(cloudTowers);
        }
      });

      // Hydrate dynamic Pujo Nirghanto & Pratibimb schedule
      const localSched = getStoredSchedule();
      setSchedule(localSched);
      fetchStoredSchedule().then((cloudSched) => {
        if (cloudSched && cloudSched.length > 0) {
          setSchedule(cloudSched);
        }
      });
    } catch (_) {}

    const handleTowerUpdate = () => {
      setTowersList(getStoredTowers());
    };

    const handleScheduleUpdate = () => {
      setSchedule(getStoredSchedule());
    };

    window.addEventListener("pbel_towers_updated", handleTowerUpdate);
    window.addEventListener("pbel_schedule_updated", handleScheduleUpdate);

    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const dayParam = params.get("day");
      if (dayParam && schedule.some((s) => s.id === dayParam)) {
        setSelectedDay(dayParam);
        const dayDates: Record<string, string> = {
          panchami: "2026-10-15",
          sashti: "2026-10-16",
          saptami: "2026-10-17",
          ashtami: "2026-10-18",
          nabami: "2026-10-19",
          dashami: "2026-10-20",
        };
        setFormData((prev) => ({
          ...prev,
          eveningDate: dayDates[dayParam] || "2026-10-16",
        }));
      }
    }

    return () => {
      window.removeEventListener("pbel_towers_updated", handleTowerUpdate);
      window.removeEventListener("pbel_schedule_updated", handleScheduleUpdate);
    };
  }, []);

  const currentSchedule = schedule.find((s) => s.id === selectedDay) || schedule[1] || schedule[0];

  const handleRegisterPerformance = async (e: React.FormEvent) => {
    e.preventDefault();

    const formattedFlat = selectedTower === "Other"
      ? flatUnit.trim() || "Guest Devotee"
      : `${selectedTower} - ${flatUnit.trim()}`;

    if (!formData.contactName.trim() || !flatUnit.trim() || !formData.phone.trim()) {
      alert("Please enter Contact Name, Flat Number, and WhatsApp Phone.");
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Get or create cultural evening
      let { data: eveningData } = await supabase
        .from("cultural_evenings")
        .select("id")
        .eq("evening_date", formData.eveningDate)
        .single();

      if (!eveningData) {
        const { data: newEvening } = await supabase
          .from("cultural_evenings")
          .insert({ evening_date: formData.eveningDate, total_slots: 25 })
          .select("id")
          .single();
        eveningData = newEvening;
      }

      // 2. Insert performance
      const { error } = await supabase.from("cultural_performances").insert({
        evening_id: eveningData?.id,
        performance_type: formData.performanceType,
        format: formData.format,
        song_name: formData.songName,
        participant_names: formData.participantNames,
        contact_name: formData.contactName,
        phone: formData.phone,
        flat_number: formattedFlat,
      });

      if (error) throw error;
      setIsSuccess(true);
    } catch (err) {
      console.error("Error submitting performance:", err);
      alert("Submission failed. Please check database connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full min-h-screen">
      
      {/* 1. ROYAL FESTIVE HERO BANNER */}
      <section className="w-full bg-festive-hero text-white relative overflow-hidden py-14 md:py-20 px-4 sm:px-6 lg:px-8 border-b border-amber-500/20 text-center">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-4 backdrop-blur-md">
            <Calendar size={14} className="text-amber-400" />
            <span>6 Days of Divine Celebration: 15 - 20 Oct 2026</span>
          </div>

          <h1 className="font-heading text-4xl sm:text-6xl font-bold tracking-tight text-white mb-4 leading-tight">
            Pujo Nirghanto & <span className="text-gold-gradient">Pratibimb Stage</span>
          </h1>

          <p className="text-sm sm:text-base text-amber-100/90 max-w-2xl mx-auto font-normal leading-relaxed mb-6">
            Explore daily ritual timings, sacred pushpanjali batches, community bhog feasts, and our dazzling Pratibimb cultural stage headliners.
          </p>

          {/* Quick Highlight Chips */}
          <div className="flex flex-wrap justify-center gap-3 text-xs text-amber-200">
            <div className="bg-black/30 border border-amber-400/20 px-4 py-1.5 rounded-full flex items-center gap-1.5 backdrop-blur-md">
              <Sparkles size={14} className="text-amber-400" />
              <span>Kumari Puja: 18 Oct 11:30 AM</span>
            </div>
            <div className="bg-black/30 border border-amber-400/20 px-4 py-1.5 rounded-full flex items-center gap-1.5 backdrop-blur-md">
              <Flame size={14} className="text-amber-400" />
              <span>Sandhi Pujo: 18 Oct 04:15 PM</span>
            </div>
            <div className="bg-black/30 border border-amber-400/20 px-4 py-1.5 rounded-full flex items-center gap-1.5 backdrop-blur-md">
              <Music size={14} className="text-amber-400" />
              <span>3 Flagship PSS Headliners</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. INTERACTIVE 6-DAY TIMELINE SWITCHER */}
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-start md:justify-center gap-2.5 overflow-x-auto pb-4 pt-2 no-scrollbar">
          {schedule.map((day) => (
            <button
              key={day.id}
              onClick={() => {
                setSelectedDay(day.id);
                setFormData((prev) => ({
                  ...prev,
                  eveningDate: `2026-10-${day.id === "panchami" ? "15" : day.id === "sashti" ? "16" : day.id === "saptami" ? "17" : day.id === "ashtami" ? "18" : day.id === "nabami" ? "19" : "20"}`,
                }));
              }}
              className={`px-4 sm:px-6 py-3 rounded-2xl transition-all shrink-0 flex flex-col items-center border ${
                selectedDay === day.id
                  ? "bg-primary text-white border-amber-400 shadow-lg scale-105 golden-glow"
                  : "bg-white text-gray-700 border-gray-200 hover:border-amber-400 hover:bg-amber-50/50"
              }`}
            >
              <span className="text-[11px] uppercase font-bold opacity-80">{day.date}</span>
              <span className="font-heading text-base sm:text-lg font-bold">{day.dayName}</span>
              <span className="text-[11px] opacity-75">{day.bengaliName}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. DUAL-COLUMN SCHEDULE VIEW */}
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        
        {/* Day Header Banner */}
        <div className="bg-gradient-to-r from-[#FFFDF9] to-[#FDF8F0] border border-amber-300/80 rounded-3xl p-6 mb-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-900 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles size={13} className="text-primary" />
              <span>{currentSchedule.date} • {currentSchedule.bengaliName}</span>
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl text-gray-900 font-bold">
              {currentSchedule.dayName}: <span className="text-primary">{currentSchedule.theme}</span>
            </h2>
          </div>

          <a
            href="#register-performance"
            className="bg-primary hover:bg-primary-hover text-white text-xs font-bold px-5 py-2.5 rounded-full transition shadow-sm self-start md:self-auto flex items-center gap-1.5"
          >
            <Music size={14} /> Register for Open Stage Slots
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* COLUMN 1: SACRED PUJO NIRGHANTO (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-amber-900/10">
              <h3 className="font-heading text-xl font-bold text-gray-900 flex items-center gap-2">
                <Flame size={20} className="text-primary" />
                <span>Sacred Pujo Nirghanto (Rituals)</span>
              </h3>
              <span className="text-xs text-amber-800 font-semibold bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                Purohit Guided
              </span>
            </div>

            <div className="space-y-3">
              {currentSchedule.rituals.map((ritual, idx) => {
                const gCalUrl = generateGoogleCalendarUrl({
                  title: `${ritual.event} (${currentSchedule.dayName})`,
                  description: `${ritual.event} at PBEL City Durgotsav 2026.`,
                  startDate: currentSchedule.isoDate,
                  startTime: ritual.time,
                  durationMinutes: ritual.type === "bhog" ? 150 : 60,
                });

                return (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl p-4 sm:p-5 border border-amber-900/10 shadow-xs hover:border-amber-400 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="bg-amber-100/70 text-primary px-3 py-2 rounded-xl text-center shrink-0 border border-amber-200">
                        <Clock size={15} className="mx-auto mb-1 text-primary" />
                        <span className="text-[11px] font-bold block whitespace-nowrap">{ritual.time}</span>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
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
                        </div>
                        <h4 className="font-bold text-sm sm:text-base text-gray-900">{ritual.event}</h4>
                      </div>
                    </div>

                    {/* Calendar 1-Click Sync */}
                    <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100 w-full sm:w-auto justify-end">
                      <a
                        href={gCalUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-gray-50 hover:bg-amber-50 text-gray-700 hover:text-amber-900 border border-gray-200 hover:border-amber-300 px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition flex items-center gap-1 shadow-2xs"
                        title="Add to Google Calendar"
                      >
                        <Calendar size={12} className="text-primary" />
                        <span>Google Cal</span>
                      </a>
                      <button
                        onClick={() =>
                          handleDownloadIcs({
                            title: `${ritual.event} - PBEL Durgotsav 2026`,
                            description: `${ritual.event} at PBEL City Community Arena.`,
                            startDate: currentSchedule.isoDate,
                            startTime: ritual.time,
                            durationMinutes: ritual.type === "bhog" ? 150 : 60,
                          })
                        }
                        className="bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-200 px-2 py-1.5 rounded-xl text-[11px] font-bold transition flex items-center gap-1"
                        title="Download Apple / Outlook iCal File"
                      >
                        <Download size={12} />
                        <span>.ics</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* COLUMN 2: PRATIBIMB CULTURAL EVENING (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-amber-900/10">
              <h3 className="font-heading text-xl font-bold text-gray-900 flex items-center gap-2">
                <Music size={20} className="text-primary" />
                <span>Pratibimb Cultural Stage</span>
              </h3>
              <span className="text-xs text-amber-800 font-semibold bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                Live Evening
              </span>
            </div>

            <div className="bg-gradient-to-br from-[#FFFDF9] to-[#FDF7EE] rounded-3xl p-6 border border-amber-400/60 shadow-md space-y-5">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-amber-900 bg-amber-100 px-3 py-0.5 rounded-full uppercase">
                    Stage Time: {currentSchedule.culturalEvening.time}
                  </span>
                  <span className="text-[11px] font-bold text-primary">
                    {currentSchedule.culturalEvening.residentSlotsAvailable} Open Slots
                  </span>
                </div>
                <h4 className="font-heading text-xl font-bold text-gray-900 mb-2">
                  {currentSchedule.culturalEvening.title}
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {currentSchedule.culturalEvening.description}
                </p>
              </div>

              {/* ⭐ PSS SPECIAL FLAGSHIP HEADLINER CARD */}
              {(() => {
                const headliner = currentSchedule.culturalEvening.pssHeadliner;
                if (!headliner) return null;
                return (
                  <div className="bg-gradient-to-r from-[#850E1F] to-[#5C0A15] text-white p-5 rounded-2xl shadow-lg border border-amber-400/40 relative overflow-hidden space-y-3">
                    <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-amber-500/20 rounded-full blur-xl" />
                    
                    <div>
                      <div className="flex items-center gap-1.5 text-amber-300 text-[10px] font-bold uppercase tracking-wider mb-1">
                        <Star size={12} className="fill-amber-300" />
                        <span>PBEL Sanskritik Samiti Flagship Show</span>
                      </div>

                      <h5 className="font-heading text-lg font-bold text-white mb-1">
                        {headliner.title}
                      </h5>

                      <p className="text-xs text-amber-100/90">
                        {headliner.genre}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-2 border-t border-white/15 text-amber-200">
                      <span className="font-bold flex items-center gap-1">
                        <Clock size={13} /> {headliner.time}
                      </span>
                      <span className="bg-black/30 px-2 py-0.5 rounded-md font-mono text-[11px]">
                        Duration: {headliner.duration}
                      </span>
                    </div>

                    {/* 1-Click Sync for Headliner */}
                    <div className="flex items-center gap-2 pt-1">
                      <a
                        href={generateGoogleCalendarUrl({
                          title: headliner.title,
                          description: `${headliner.genre} - Flagship Evening Show at PBEL City Durgotsav 2026`,
                          startDate: currentSchedule.isoDate,
                          startTime: headliner.time.replace(" Start", ""),
                          durationMinutes: 90,
                        })}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 bg-amber-400 hover:bg-amber-500 text-amber-950 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 shadow-sm"
                      >
                        <Calendar size={13} />
                        <span>Add Concert to Cal</span>
                      </a>
                      <button
                        onClick={() =>
                          handleDownloadIcs({
                            title: headliner.title,
                            description: `${headliner.genre} at PBEL City Community Arena.`,
                            startDate: currentSchedule.isoDate,
                            startTime: headliner.time.replace(" Start", ""),
                            durationMinutes: 90,
                          })
                        }
                        className="bg-white/20 hover:bg-white/30 text-white px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1"
                        title="Download iCal File"
                      >
                        <Download size={13} />
                        <span>.ics</span>
                      </button>
                    </div>
                  </div>
                );
              })()}

              {/* Other Acts Lineup */}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-2">
                  Featured Acts of the Evening:
                </span>
                <ul className="space-y-2">
                  {currentSchedule.culturalEvening.acts.map((act, i) => (
                    <li key={i} className="text-xs text-gray-700 flex items-start gap-2">
                      <ChevronRight size={14} className="text-primary shrink-0 mt-0.5" />
                      <span className="font-semibold">{act}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 border-t border-amber-900/10">
                <a
                  href="#register-performance"
                  className="w-full bg-gradient-to-r from-[#D99B26] to-[#B8801C] hover:from-[#B8801C] hover:to-[#966714] text-white py-3 rounded-2xl font-bold text-xs transition shadow-md golden-glow flex items-center justify-center gap-2"
                >
                  <Music size={15} />
                  <span>Apply for Resident Performance Slot</span>
                </a>
              </div>

            </div>

          </div>

        </div>

        {/* 4. PRATIBIMB PERFORMANCE REGISTRATION FORM */}
        <div id="register-performance" className="mt-16 bg-white rounded-3xl p-6 sm:p-10 border border-amber-900/15 shadow-xl">
          
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-100/60 px-3 py-1 rounded-full uppercase tracking-wider mb-2">
              <Users size={14} /> Pratibimb Resident Artist Portal
            </span>
            <h3 className="font-heading text-3xl text-gray-900 font-bold">
              Register for Pratibimb Cultural Stage
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-2">
              PBEL City residents can apply for solo (3-5 min) or group (5-8 min) performance slots in Song, Dance, Drama, or Instrumental.
            </p>
          </div>

          {isSuccess ? (
            <div className="p-8 bg-green-50 rounded-2xl border border-green-200 text-center max-w-md mx-auto">
              <CheckCircle2 size={48} className="text-green-600 mx-auto mb-3" />
              <h4 className="font-heading text-xl font-bold text-gray-900 mb-1">Registration Submitted!</h4>
              <p className="text-xs text-gray-600 mb-4">
                Thank you, <strong>{formData.contactName}</strong>. The Pratibimb cultural committee will review your act and confirm your stage slot time!
              </p>
              <button
                onClick={() => setIsSuccess(false)}
                className="bg-primary text-white text-xs font-semibold px-6 py-2 rounded-full"
              >
                Submit Another Act
              </button>
            </div>
          ) : (
            <form onSubmit={handleRegisterPerformance} className="max-w-3xl mx-auto space-y-6 text-xs sm:text-sm">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Preferred Cultural Evening *</label>
                  <select
                    value={formData.eveningDate}
                    onChange={(e) => setFormData({ ...formData, eveningDate: e.target.value })}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                  >
                    <option value="2026-10-15">15 Oct (Panchami Evening - Agomoni)</option>
                    <option value="2026-10-16">16 Oct (Sashti Evening - Retro Rock Night)</option>
                    <option value="2026-10-17">17 Oct (Saptami Evening - Dance Drama)</option>
                    <option value="2026-10-18">18 Oct (Ashtami Evening - Grand Drama)</option>
                    <option value="2026-10-19">19 Oct (Nabami Evening - Finale & Awards)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Performance Genre *</label>
                  <select
                    value={formData.performanceType}
                    onChange={(e) => setFormData({ ...formData, performanceType: e.target.value })}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                  >
                    <option value="Song">Song / Vocals (Classical / Folk / Bollywood)</option>
                    <option value="Dance">Dance (Classical / Contemporary / Fusion)</option>
                    <option value="Skit">Skit / Short Play (Natok)</option>
                    <option value="Instrumental">Instrumental (Guitar, Keyboard, Flute)</option>
                    <option value="Recitation">Recitation / Poetry (Kobita)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Format & Slot Duration *</label>
                  <select
                    value={formData.format}
                    onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                  >
                    <option value="Solo (3-5 mins)">Solo Performance (3-5 mins)</option>
                    <option value="Duet (4-6 mins)">Duet Performance (4-6 mins)</option>
                    <option value="Group (5-8 mins)">Group Performance (5-8 mins)</option>
                    <option value="Drama (15-20 mins)">Drama / Natok (15-20 mins)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Song / Track / Act Name</label>
                  <input
                    type="text"
                    value={formData.songName}
                    onChange={(e) => setFormData({ ...formData, songName: e.target.value })}
                    placeholder="e.g. Dhitang Dhitang Bole / Kathak Fusion"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Participant Names & Age Groups *</label>
                <textarea
                  rows={2}
                  required
                  value={formData.participantNames}
                  onChange={(e) => setFormData({ ...formData, participantNames: e.target.value })}
                  placeholder="e.g. Suman (Adult), Rahul (10 yrs), Ananya (8 yrs)"
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-100">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Contact Lead Person *</label>
                  <input
                    type="text"
                    required
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    placeholder="Your Full Name"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">WhatsApp Phone *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="10-digit number"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
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
                    value={selectedTower}
                    onChange={(e) => setSelectedTower(e.target.value)}
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
                    Flat / Unit Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={flatUnit}
                    onChange={(e) => setFlatUnit(e.target.value)}
                    placeholder="e.g. 402 or 1204"
                    className="w-full p-2.5 border border-amber-300/80 rounded-xl bg-white focus:ring-2 focus:ring-primary outline-none text-xs sm:text-sm font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-[#D99B26] via-[#B8801C] to-[#966714] text-white font-bold text-base py-4 rounded-2xl transition-all shadow-xl hover:shadow-2xl disabled:opacity-50 golden-glow flex items-center justify-center gap-2"
              >
                <Music size={20} />
                <span>{isSubmitting ? "Submitting Registration..." : "Submit Performance Slot Application"}</span>
              </button>

            </form>
          )}

        </div>

      </div>

    </div>
  );
}
