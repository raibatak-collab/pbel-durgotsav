"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Users,
  Palette,
  HelpCircle,
  Flame,
  Music2,
  Calendar,
  Clock,
  Shirt,
  Share2,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import {
  CulturalEventConfig,
  CulturalEventId,
  CulturalRegistrationEntry,
  fetchStoredCulturalEvents,
  fetchStoredCulturalRegistrations,
  submitCulturalRegistration,
  getStoredCulturalEvents,
  getStoredCulturalRegistrations,
} from "@/config/culturalEvents";
import { getStoredTowers, TowerDefinition } from "@/config/towers";
import SevaDonationNudgeModal from "@/components/SevaDonationNudgeModal";

const EVENT_ICONS: Record<CulturalEventId, React.ReactNode> = {
  sit_and_draw: <Palette size={20} className="text-pink-500" />,
  junior_quiz: <HelpCircle size={20} className="text-blue-500" />,
  mini_kumartuli: <Sparkles size={20} className="text-amber-500" />,
  duet_dhunuchi: <Flame size={20} className="text-red-500" />,
  flash_mob: <Music2 size={20} className="text-purple-500" />,
};

export function CulturalEventsRegistration() {
  const [events, setEvents] = useState<CulturalEventConfig[]>(getStoredCulturalEvents());
  const [registrations, setRegistrations] = useState<CulturalRegistrationEntry[]>(getStoredCulturalRegistrations());
  const [activeEventId, setActiveEventId] = useState<CulturalEventId>("sit_and_draw");
  const [towers, setTowers] = useState<TowerDefinition[]>([]);

  // Form State
  const [contactName, setContactName] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedTower, setSelectedTower] = useState("");
  const [flatUnit, setFlatUnit] = useState("");
  const [teamName, setTeamName] = useState("");
  const [childName, setChildName] = useState("");
  const [childAge, setChildAge] = useState("");
  const [childGrade, setChildGrade] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("group_1");
  const [flashMobAgeGroup, setFlashMobAgeGroup] = useState("Adults (18+)");
  const [flashMobAvailability, setFlashMobAvailability] = useState("Weekend Evenings");
  const [dressCodeConfirmed, setDressCodeConfirmed] = useState(false);

  // Dynamic Team Members for Kumartuli (2 extra members) and Quiz (4 extra members)
  const [member2Name, setMember2Name] = useState("");
  const [member2Grade, setMember2Grade] = useState("");
  const [member3Name, setMember3Name] = useState("");
  const [member3Grade, setMember3Grade] = useState("");
  const [member4Name, setMember4Name] = useState("");
  const [member4Grade, setMember4Grade] = useState("");
  const [member5Name, setMember5Name] = useState("");
  const [member5Grade, setMember5Grade] = useState("");

  // Partner for Duet Dhunuchi
  const [partnerName, setPartnerName] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successEntry, setSuccessEntry] = useState<CulturalRegistrationEntry | null>(null);
  const [showNudgeModal, setShowNudgeModal] = useState(false);

  useEffect(() => {
    try {
      const storedTowers = getStoredTowers();
      setTowers(storedTowers);
      if (storedTowers.length > 0) {
        setSelectedTower(storedTowers[0].fullName || (storedTowers[0].tower + " (" + storedTowers[0].name + ")"));
      }

      fetchStoredCulturalEvents().then((cloudEvents) => {
        if (cloudEvents && cloudEvents.length > 0) setEvents(cloudEvents);
      });

      fetchStoredCulturalRegistrations().then((cloudRegs) => {
        if (cloudRegs) setRegistrations(cloudRegs);
      });
    } catch (_) {}

    const handleEventsUpdate = () => {
      setEvents(getStoredCulturalEvents());
    };
    const handleRegsUpdate = () => {
      setRegistrations(getStoredCulturalRegistrations());
    };

    window.addEventListener("pbel_cultural_events_updated", handleEventsUpdate);
    window.addEventListener("pbel_cultural_registrations_updated", handleRegsUpdate);

    return () => {
      window.removeEventListener("pbel_cultural_events_updated", handleEventsUpdate);
      window.removeEventListener("pbel_cultural_registrations_updated", handleRegsUpdate);
    };
  }, []);

  const visibleEvents = events.filter((e) => e.isVisible !== false);
  const activeEvent = visibleEvents.find((e) => e.id === activeEventId) || visibleEvents[0] || events[0];
  const activeEntries = registrations.filter(
    (r) => r.eventId === activeEvent.id && r.status !== "cancelled"
  );
  const isFull = activeEntries.length >= activeEvent.maxLimit;
  const remainingSlots = Math.max(0, activeEvent.maxLimit - activeEntries.length);

  const resetForm = () => {
    setContactName("");
    setPhone("");
    setFlatUnit("");
    setTeamName("");
    setChildName("");
    setChildAge("");
    setChildGrade("");
    setDressCodeConfirmed(false);
    setMember2Name("");
    setMember2Grade("");
    setMember3Name("");
    setMember3Grade("");
    setMember4Name("");
    setMember4Grade("");
    setMember5Name("");
    setMember5Grade("");
    setPartnerName("");
    setErrorMessage(null);
  };

  const handleEventTabChange = (id: CulturalEventId) => {
    setActiveEventId(id);
    resetForm();
    setSuccessEntry(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Common validations
    if (!contactName.trim()) {
      setErrorMessage("Please enter the primary contact / participant name.");
      return;
    }
    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length !== 10) {
      setErrorMessage("Please enter a valid 10-digit WhatsApp phone number.");
      return;
    }
    if (!flatUnit.trim()) {
      setErrorMessage("Please enter your flat / unit number.");
      return;
    }

    // Specific event validations
    if (activeEvent.id === "sit_and_draw") {
      if (!childName.trim()) {
        setErrorMessage("Please enter the child's full name.");
        return;
      }
      if (!childAge || Number(childAge) < 3 || Number(childAge) > 17) {
        setErrorMessage("Please enter a valid age for the child (3 - 16 years).");
        return;
      }
    } else if (activeEvent.id === "junior_quiz") {
      if (!teamName.trim()) {
        setErrorMessage("Please enter a creative Team Name for the quiz.");
        return;
      }
      if (!childGrade.trim()) {
        setErrorMessage("Please specify the Captain's Grade (Grade 4 - 10).");
        return;
      }
      if (!member2Name.trim() || !member3Name.trim() || !member4Name.trim() || !member5Name.trim()) {
        setErrorMessage("All 5 team members are required for the Junior Discovery Quiz.");
        return;
      }
    } else if (activeEvent.id === "mini_kumartuli") {
      if (!teamName.trim()) {
        setErrorMessage("Please enter a Team Name for Mini Kumartuli.");
        return;
      }
      if (!member2Name.trim() || !member3Name.trim()) {
        setErrorMessage("Mini Kumartuli requires exactly 3 team members. Please enter Member 2 and Member 3.");
        return;
      }
    } else if (activeEvent.id === "duet_dhunuchi") {
      if (!partnerName.trim()) {
        setErrorMessage("Please enter the name of the second dance partner.");
        return;
      }
      if (!dressCodeConfirmed) {
        setErrorMessage("Traditional Saree & Dhoti/Kurta dress code is compulsory. Please confirm to proceed.");
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const formattedFlat = selectedTower + " - " + flatUnit.trim();
      const membersList = [];

      if (activeEvent.id === "mini_kumartuli") {
        membersList.push(
          { name: contactName, grade: "Captain" },
          { name: member2Name, grade: member2Grade || "Member" },
          { name: member3Name, grade: member3Grade || "Member" }
        );
      } else if (activeEvent.id === "junior_quiz") {
        membersList.push(
          { name: contactName, grade: childGrade || "Captain" },
          { name: member2Name, grade: member2Grade },
          { name: member3Name, grade: member3Grade },
          { name: member4Name, grade: member4Grade },
          { name: member5Name, grade: member5Grade }
        );
      } else if (activeEvent.id === "duet_dhunuchi") {
        membersList.push(
          { name: contactName, grade: "Dancer 1 (Lead)" },
          { name: partnerName, grade: "Dancer 2 (Partner)" }
        );
      }

      const result = await submitCulturalRegistration({
        eventId: activeEvent.id,
        eventTitle: activeEvent.title,
        contactName: activeEvent.id === "sit_and_draw" ? childName : contactName,
        phone: cleanPhone,
        tower: selectedTower,
        flat: formattedFlat,
        teamName: teamName || (activeEvent.id === "duet_dhunuchi" ? (contactName + " & " + partnerName) : undefined),
        category: activeEvent.id === "sit_and_draw" ? selectedCategory : undefined,
        grade: activeEvent.id === "sit_and_draw" ? childGrade : undefined,
        ageGroup: activeEvent.id === "flash_mob" ? flashMobAgeGroup : undefined,
        notes: activeEvent.id === "sit_and_draw" ? ("Parent: " + contactName) : (activeEvent.id === "flash_mob" ? ("Availability: " + flashMobAvailability) : undefined),
        members: membersList.length > 0 ? membersList : undefined,
        dressCodeConfirmed: activeEvent.id === "duet_dhunuchi" ? true : undefined,
      });

      if (result.success && result.registration) {
        setSuccessEntry(result.registration);
        setShowNudgeModal(true);
        resetForm();
      } else {
        setErrorMessage(result.message || "Registration could not be completed. Please try again.");
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="competitions" className="w-full max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-8 scroll-mt-20">
      
      {/* SECTION HEADER */}
      <div className="text-center space-y-2.5">
        <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-900 border border-amber-300 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-xs">
          <Sparkles size={14} className="text-amber-600 animate-pulse" />
          <span>Pratibimb 2026 • Cultural Competitions &amp; Showcase</span>
        </div>
        <h2 className="font-heading text-2xl sm:text-4xl font-bold text-gray-900">
          Cultural Event Registrations
        </h2>
        <p className="text-xs sm:text-sm text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Calling all artists, quiz masters, clay crafters, and dhunuchi dancers! Choose an event below to register your team or solo entry for PBEL City Durgotsav.
        </p>
      </div>

      {/* 5 EVENT SELECTOR TABS / CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3">
        {visibleEvents.length === 0 ? (
          <div className="col-span-full bg-white rounded-2xl border border-gray-200 p-6 text-center text-xs text-gray-500">
            No cultural competitions are currently active for registration.
          </div>
        ) : (
          visibleEvents.map((event) => {
            const isSelected = event.id === activeEventId;
            const regCount = registrations.filter((r) => r.eventId === event.id && r.status !== "cancelled").length;
            const isEventFull = regCount >= event.maxLimit;
            const isClosed = !event.isOpen || event.status === "closed";
            const isComingSoon = event.status === "coming_soon";

            return (
              <button
                key={event.id}
                type="button"
                onClick={() => handleEventTabChange(event.id)}
                className={
                  "p-3.5 rounded-2xl border text-left transition-all relative flex flex-col justify-between min-h-[115px] " +
                  (isSelected
                    ? "bg-gradient-to-br from-amber-50 to-orange-50 border-amber-500 shadow-md ring-2 ring-amber-400/40"
                    : "bg-white hover:bg-gray-50 border-gray-200 shadow-xs")
                }
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="p-1.5 rounded-xl bg-white shadow-xs border border-gray-100">
                      {EVENT_ICONS[event.id]}
                    </span>
                    <span
                      className={
                        "text-[9px] font-bold px-2 py-0.5 rounded-full border " +
                        (isEventFull
                          ? "bg-red-50 text-red-700 border-red-200"
                          : isClosed
                          ? "bg-gray-100 text-gray-600 border-gray-200"
                          : isComingSoon
                          ? "bg-amber-50 text-amber-800 border-amber-200"
                          : "bg-emerald-50 text-emerald-700 border-emerald-200")
                      }
                    >
                      {isEventFull ? "Full" : isClosed ? "Closed" : isComingSoon ? "Soon" : "Open"}
                    </span>
                  </div>
                  <div className="font-heading font-bold text-xs text-gray-900 line-clamp-2 leading-tight">
                    {event.title}
                  </div>
                </div>

                <div className="text-[10px] text-gray-500 mt-2 pt-2 border-t border-gray-100 flex items-center justify-between">
                  <span>
                    {event.teamSize === 1 ? "Solo" : (event.teamSize + "-member team")}
                  </span>
                  <span className="font-bold text-amber-900">
                    {regCount}/{event.maxLimit}
                  </span>
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* EVENT DETAILS & REGISTRATION CARD */}
      <div className="bg-white rounded-3xl border border-amber-200 shadow-xl overflow-hidden">
        
        {/* Banner with Event Overview */}
        <div className="bg-gradient-to-r from-[#4A0812] via-[#6B0D1B] to-[#3B050E] text-white p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative z-10 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="inline-flex items-center gap-2 bg-black/40 border border-amber-400/40 text-amber-300 text-xs font-bold px-3 py-1 rounded-full backdrop-blur-md">
                {EVENT_ICONS[activeEvent.id]}
                <span>{activeEvent.title}</span>
              </div>

              {/* Slots Counter Badge */}
              <div className="flex items-center gap-2">
                <span
                  className={
                    "text-xs font-extrabold px-3 py-1 rounded-full border shadow-sm " +
                    (isFull
                      ? "bg-red-500/20 text-red-200 border-red-400/40"
                      : (!activeEvent.isOpen || activeEvent.status === "closed")
                      ? "bg-gray-500/30 text-gray-200 border-gray-400/40"
                      : activeEvent.status === "coming_soon"
                      ? "bg-amber-500/20 text-amber-200 border-amber-400/40"
                      : "bg-emerald-500/20 text-emerald-200 border-emerald-400/40 animate-pulse")
                  }
                >
                  {isFull
                    ? "⚠️ Registrations Full"
                    : (!activeEvent.isOpen || activeEvent.status === "closed")
                    ? "🔒 Registrations Closed"
                    : activeEvent.status === "coming_soon"
                    ? "⏳ Registrations Opening Soon"
                    : ("🔥 " + remainingSlots + " of " + activeEvent.maxLimit + " Slots Left")}
                </span>
              </div>
            </div>

            <div>
              <h3 className="font-heading text-xl sm:text-3xl font-bold text-white mb-1">
                {activeEvent.title}
              </h3>
              <p className="text-xs sm:text-sm text-amber-100/90 max-w-2xl">
                {activeEvent.subtitle}
              </p>
            </div>

            {/* Event Logistics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-3 border-t border-white/15 text-xs text-amber-200">
              <div className="flex items-center gap-2 bg-black/30 px-3 py-2 rounded-xl border border-white/10">
                <Calendar size={14} className="text-amber-400 shrink-0" />
                <span className="truncate"><strong>Day:</strong> {activeEvent.day}</span>
              </div>
              <div className="flex items-center gap-2 bg-black/30 px-3 py-2 rounded-xl border border-white/10">
                <Clock size={14} className="text-amber-400 shrink-0" />
                <span className="truncate"><strong>Time:</strong> {activeEvent.time}</span>
              </div>
              <div className="flex items-center gap-2 bg-black/30 px-3 py-2 rounded-xl border border-white/10">
                <Users size={14} className="text-amber-400 shrink-0" />
                <span className="truncate"><strong>Limit:</strong> {activeEvent.maxLimit} {activeEvent.teamSize > 1 ? "Teams" : "Entries"}</span>
              </div>
            </div>

            {/* Dress Code Notice for Dhunuchi Jugalbandi */}
            {activeEvent.dressCode && (
              <div className="inline-flex items-center gap-2 bg-amber-400 text-amber-950 px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-md">
                <Shirt size={14} className="shrink-0" />
                <span>Mandatory Dress Code: {activeEvent.dressCode}</span>
              </div>
            )}
          </div>
        </div>

        {/* Form or Success State */}
        <div className="p-6 sm:p-10">
          {successEntry ? (
            <div className="max-w-md mx-auto text-center space-y-4 py-4">
              <CheckCircle2 size={56} className="text-emerald-600 mx-auto animate-bounce" />
              <div>
                <h4 className="font-heading text-2xl font-bold text-gray-900">
                  Registration Confirmed!
                </h4>
                <p className="text-xs text-gray-600 mt-1">
                  Thank you, <strong>{successEntry.contactName}</strong>. Your entry for <strong>{successEntry.eventTitle}</strong> ({successEntry.flat}) has been successfully submitted to the Pratibimb Cultural Committee!
                </p>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 text-left space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-gray-500">Registration ID:</span>
                  <span className="font-mono font-bold">{successEntry.id}</span>
                </div>
                {successEntry.teamName && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Team:</span>
                    <span className="font-bold">{successEntry.teamName}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">WhatsApp Contact:</span>
                  <span className="font-bold">+91 {successEntry.phone}</span>
                </div>
                {successEntry.members && successEntry.members.length > 0 && (
                  <div className="pt-2 border-t border-amber-200">
                    <span className="block text-[11px] text-gray-500 mb-1">Registered Members ({successEntry.members.length}):</span>
                    <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                      {successEntry.members.map((m, idx) => (
                        <li key={idx}><strong>{m.name}</strong> {m.grade ? ("(" + m.grade + ")") : ""}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2.5 pt-2">
                <a
                  href={
                    "https://api.whatsapp.com/send?text=" +
                    encodeURIComponent(
                      "🎉 Jai Maa Durga! I have registered for " +
                        successEntry.eventTitle +
                        " at PBEL City Durgotsav 2026 (" +
                        successEntry.flat +
                        ")! Register your team / entry now at https://pbeldurgotsav.in/programs#competitions"
                    )
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold py-3 px-6 rounded-full flex items-center justify-center gap-2 shadow-sm transition"
                >
                  <Share2 size={15} />
                  <span>Share on Tower WhatsApp Group</span>
                </a>
                <button
                  type="button"
                  onClick={() => setSuccessEntry(null)}
                  className="text-xs font-semibold text-gray-600 hover:text-gray-900 py-2 transition"
                >
                  Submit Another Registration
                </button>
              </div>
            </div>
          ) : isFull ? (
            <div className="max-w-lg mx-auto text-center py-8 space-y-3">
              <AlertCircle size={48} className="text-amber-600 mx-auto" />
              <h4 className="font-heading text-xl font-bold text-gray-900">
                All {activeEvent.maxLimit} Slots Are Currently Reserved
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Registrations for <strong>{activeEvent.title}</strong> have reached full capacity. If slots open up due to cancellations, registrations will reopen automatically.
              </p>
              <div className="pt-2">
                <a
                  href="https://api.whatsapp.com/send?phone=917032006645&text=Hello%20Pratibimb%20Committee,%20I%20would%20like%20to%20inquire%20about%20waitlist%20for%20the%20competition."
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-950 border border-amber-300 px-4 py-2 rounded-full text-xs font-bold hover:bg-amber-200 transition"
                >
                  <span>Contact Cultural Lead for Waitlist</span>
                  <ArrowRight size={13} />
                </a>
              </div>
            </div>
          ) : (!activeEvent.isOpen || activeEvent.status === "closed") ? (
            <div className="max-w-lg mx-auto text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 text-gray-600 flex items-center justify-center mx-auto border border-gray-200 shadow-xs">
                <AlertCircle size={32} />
              </div>
              <div>
                <h4 className="font-heading text-xl font-bold text-gray-900">
                  Registrations for this Event Are Currently Closed
                </h4>
                <p className="text-xs text-gray-600 mt-1 max-w-md mx-auto leading-relaxed">
                  Submissions for <strong>{activeEvent.title}</strong> have concluded or have been temporarily paused by the Cultural Committee. Please contact the cultural team if you have any questions.
                </p>
              </div>
              <div className="pt-2">
                <a
                  href={"https://api.whatsapp.com/send?phone=917032006645&text=Hello%20Pratibimb%20Committee,%20I%20am%20inquiring%20about%20registrations%20for%20" + encodeURIComponent(activeEvent.title)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300 px-4 py-2 rounded-full text-xs font-bold transition"
                >
                  <span>Inquire via WhatsApp</span>
                  <ArrowRight size={13} />
                </a>
              </div>
            </div>
          ) : activeEvent.status === "coming_soon" ? (
            <div className="max-w-xl mx-auto text-center py-8 space-y-5">
              <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto border border-amber-300 shadow-sm">
                <Sparkles size={32} className="text-amber-600 animate-pulse" />
              </div>
              <div>
                <div className="inline-block bg-amber-100 text-amber-900 border border-amber-300 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-2">
                  Opening Soon
                </div>
                <h4 className="font-heading text-xl sm:text-2xl font-bold text-gray-900">
                  Registrations for {activeEvent.title} Will Open Shortly!
                </h4>
                <p className="text-xs text-gray-600 mt-1.5 max-w-lg mx-auto leading-relaxed">
                  Get ready to showcase your talent! The registration portal will open soon. Review the competition format and team structure below so you can assemble your team in advance.
                </p>
              </div>

              {/* Rules & Team Structure Preview */}
              <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 text-xs text-left space-y-2">
                <div className="font-bold text-amber-950 uppercase tracking-wider text-[10px]">
                  📋 Competition Format &amp; Requirements Preview:
                </div>
                <ul className="space-y-1 text-gray-700">
                  <li className="flex items-start gap-1.5">
                    <span className="text-primary font-bold">›</span>
                    <span><strong>Team Size:</strong> {activeEvent.teamSize === 1 ? "Solo Entry" : (activeEvent.teamSize + " Members per Team")}</span>
                  </li>
                  {activeEvent.gradeEligibility && (
                    <li className="flex items-start gap-1.5">
                      <span className="text-primary font-bold">›</span>
                      <span><strong>Eligibility:</strong> {activeEvent.gradeEligibility}</span>
                    </li>
                  )}
                  {activeEvent.dressCode && (
                    <li className="flex items-start gap-1.5">
                      <span className="text-primary font-bold">›</span>
                      <span><strong>Dress Code:</strong> {activeEvent.dressCode}</span>
                    </li>
                  )}
                  {activeEvent.rules.map((r, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-primary font-bold">›</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-1 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={"https://api.whatsapp.com/send?text=" + encodeURIComponent("🎉 Hey neighbors! " + activeEvent.title + " registrations are opening soon at PBEL City Durgotsav 2026. Check the rules and get your team ready: https://pbeldurgotsav.in/programs#competitions")}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white px-5 py-2.5 rounded-full text-xs font-bold transition shadow-sm"
                >
                  <Share2 size={14} />
                  <span>Share with Tower Group to Form Teams</span>
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto text-xs sm:text-sm">
              
              {errorMessage && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl flex items-center gap-2 text-xs font-medium">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* RULES NOTICE */}
              <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-4 text-xs text-gray-700 space-y-1.5">
                <span className="font-bold text-amber-900 block uppercase tracking-wider text-[10px]">
                  📌 Key Competition Guidelines:
                </span>
                <ul className="space-y-1">
                  {activeEvent.rules.map((rule, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-primary font-bold">›</span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* EVENT-SPECIFIC FIELDS */}

              {/* 1. SIT AND DRAW (INDRADHANUSH) FIELDS */}
              {activeEvent.id === "sit_and_draw" && (
                <div className="space-y-4 pt-2">
                  <div>
                    <label className="block font-bold text-gray-800 mb-1">Select Age Category *</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {activeEvent.categories?.map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setSelectedCategory(cat.id)}
                          className={
                            "p-3 rounded-xl border text-left transition text-xs " +
                            (selectedCategory === cat.id
                              ? "bg-amber-100/80 border-amber-500 font-bold text-amber-950 ring-1 ring-amber-400"
                              : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100")
                          }
                        >
                          <div className="font-bold">{cat.name}</div>
                          <div className="text-[10px] text-gray-500 mt-0.5">{cat.gradeRange}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Child's Full Name *</label>
                      <input
                        type="text"
                        required
                        value={childName}
                        onChange={(e) => setChildName(e.target.value)}
                        placeholder="e.g. Aarav Roy"
                        className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary outline-none transition"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block font-semibold text-gray-700 mb-1">Age *</label>
                        <input
                          type="number"
                          required
                          min={3}
                          max={16}
                          value={childAge}
                          onChange={(e) => setChildAge(e.target.value)}
                          placeholder="e.g. 8"
                          className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary outline-none transition"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-gray-700 mb-1">Grade / Class *</label>
                        <input
                          type="text"
                          required
                          value={childGrade}
                          onChange={(e) => setChildGrade(e.target.value)}
                          placeholder="e.g. Grade 3"
                          className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary outline-none transition"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Parent / Guardian Name *</label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="e.g. Debolina Roy"
                      className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary outline-none transition"
                    />
                  </div>
                </div>
              )}

              {/* 2. JUNIOR DISCOVERY QUIZ (6 TEAMS, 5 MEMBERS, GR 4-10) */}
              {activeEvent.id === "junior_quiz" && (
                <div className="space-y-4 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Quiz Team Name *</label>
                      <input
                        type="text"
                        required
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        placeholder="e.g. PBEL Mind Sparks"
                        className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary outline-none transition"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Team Captain Name &amp; Grade *</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          required
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          placeholder="Captain Name"
                          className="flex-1 p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary outline-none transition"
                        />
                        <input
                          type="text"
                          required
                          value={childGrade}
                          onChange={(e) => setChildGrade(e.target.value)}
                          placeholder="Grade (4-10)"
                          className="w-28 p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary outline-none transition"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
                    <span className="font-bold text-gray-800 block text-xs">
                      Remaining 4 Team Members (Grade 4 to 10):
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          required
                          value={member2Name}
                          onChange={(e) => setMember2Name(e.target.value)}
                          placeholder="Member 2 Name"
                          className="flex-1 p-2.5 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-primary outline-none text-xs"
                        />
                        <input
                          type="text"
                          required
                          value={member2Grade}
                          onChange={(e) => setMember2Grade(e.target.value)}
                          placeholder="Grade"
                          className="w-20 p-2.5 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-primary outline-none text-xs"
                        />
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          required
                          value={member3Name}
                          onChange={(e) => setMember3Name(e.target.value)}
                          placeholder="Member 3 Name"
                          className="flex-1 p-2.5 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-primary outline-none text-xs"
                        />
                        <input
                          type="text"
                          required
                          value={member3Grade}
                          onChange={(e) => setMember3Grade(e.target.value)}
                          placeholder="Grade"
                          className="w-20 p-2.5 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-primary outline-none text-xs"
                        />
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          required
                          value={member4Name}
                          onChange={(e) => setMember4Name(e.target.value)}
                          placeholder="Member 4 Name"
                          className="flex-1 p-2.5 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-primary outline-none text-xs"
                        />
                        <input
                          type="text"
                          required
                          value={member4Grade}
                          onChange={(e) => setMember4Grade(e.target.value)}
                          placeholder="Grade"
                          className="w-20 p-2.5 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-primary outline-none text-xs"
                        />
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          required
                          value={member5Name}
                          onChange={(e) => setMember5Name(e.target.value)}
                          placeholder="Member 5 Name"
                          className="flex-1 p-2.5 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-primary outline-none text-xs"
                        />
                        <input
                          type="text"
                          required
                          value={member5Grade}
                          onChange={(e) => setMember5Grade(e.target.value)}
                          placeholder="Grade"
                          className="w-20 p-2.5 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-primary outline-none text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. MINI KUMARTULI (10 TEAMS, 3 MEMBERS) */}
              {activeEvent.id === "mini_kumartuli" && (
                <div className="space-y-4 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Team Name *</label>
                      <input
                        type="text"
                        required
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        placeholder="e.g. Clay Crafters"
                        className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary outline-none transition"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Team Lead / Member 1 Name *</label>
                      <input
                        type="text"
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="Member 1 (Lead)"
                        className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary outline-none transition"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Member 2 Name &amp; Age/Grade *</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          required
                          value={member2Name}
                          onChange={(e) => setMember2Name(e.target.value)}
                          placeholder="Member 2 Name"
                          className="flex-1 p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary outline-none transition"
                        />
                        <input
                          type="text"
                          value={member2Grade}
                          onChange={(e) => setMember2Grade(e.target.value)}
                          placeholder="Age/Grade"
                          className="w-24 p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary outline-none transition"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Member 3 Name &amp; Age/Grade *</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          required
                          value={member3Name}
                          onChange={(e) => setMember3Name(e.target.value)}
                          placeholder="Member 3 Name"
                          className="flex-1 p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary outline-none transition"
                        />
                        <input
                          type="text"
                          value={member3Grade}
                          onChange={(e) => setMember3Grade(e.target.value)}
                          placeholder="Age/Grade"
                          className="w-24 p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary outline-none transition"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 4. DUET DHUNUCHI (10 GROUPS, 2 MEMBERS, SAREE & DHOTI MANDATORY) */}
              {activeEvent.id === "duet_dhunuchi" && (
                <div className="space-y-4 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Duo Team / Group Name (Optional)</label>
                      <input
                        type="text"
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        placeholder="e.g. Taal-e-Taale Duet"
                        className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary outline-none transition"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Lead Dancer Name (Participant 1) *</label>
                      <input
                        type="text"
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="Participant 1"
                        className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary outline-none transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Dance Partner Name (Participant 2) *</label>
                    <input
                      type="text"
                      required
                      value={partnerName}
                      onChange={(e) => setPartnerName(e.target.value)}
                      placeholder="Participant 2"
                      className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary outline-none transition"
                    />
                  </div>

                  <div className="p-4 bg-amber-50 rounded-2xl border-2 border-amber-300 space-y-2">
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        required
                        checked={dressCodeConfirmed}
                        onChange={(e) => setDressCodeConfirmed(e.target.checked)}
                        className="w-4 h-4 mt-0.5 rounded border-amber-400 text-primary focus:ring-primary cursor-pointer shrink-0"
                      />
                      <span className="text-xs text-amber-950 font-semibold leading-relaxed">
                        Compulsory Dress Code Confirmation: I confirm that both participants will strictly wear traditional Saree and Dhoti / Pyjama Kurta during the Duet Dhunuchi competition.
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* 5. FLASH MOB (OPEN REGISTRATION) */}
              {activeEvent.id === "flash_mob" && (
                <div className="space-y-4 pt-2">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Participant Full Name *</label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="e.g. Riya Sen"
                      className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary outline-none transition"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Age Category *</label>
                      <select
                        value={flashMobAgeGroup}
                        onChange={(e) => setFlashMobAgeGroup(e.target.value)}
                        className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary outline-none transition"
                      >
                        <option value="Kids (Ages 7-12)">Kids (Ages 7-12)</option>
                        <option value="Teens (Ages 13-17)">Teens (Ages 13-17)</option>
                        <option value="Adults (18+)">Adults (18+)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Rehearsal Availability *</label>
                      <select
                        value={flashMobAvailability}
                        onChange={(e) => setFlashMobAvailability(e.target.value)}
                        className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary outline-none transition"
                      >
                        <option value="Weekend Evenings">Weekend Evenings (Sat &amp; Sun)</option>
                        <option value="Weekday Evenings">Weekday Evenings</option>
                        <option value="Both Flexible">Flexible for All Rehearsals</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* COMMON CONTACT & RESIDENCE DETAILS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-gray-100">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">WhatsApp Phone Number *</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-gray-200 bg-gray-100 text-gray-500 text-xs font-bold">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                      placeholder="10-digit mobile"
                      className="w-full p-3 border border-gray-200 rounded-r-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary outline-none transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Tower *</label>
                    <select
                      value={selectedTower}
                      onChange={(e) => setSelectedTower(e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary outline-none transition"
                    >
                      {towers.map((t) => (
                        <option key={t.tower} value={t.fullName || (t.tower + " (" + t.name + ")")}>
                          {t.fullName || (t.tower + " (" + t.name + ")")}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Flat No. *</label>
                    <input
                      type="text"
                      required
                      value={flatUnit}
                      onChange={(e) => setFlatUnit(e.target.value)}
                      placeholder="e.g. 402"
                      className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary outline-none transition"
                    />
                  </div>
                </div>
              </div>

              {/* SUBMIT BUTTON */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || isFull}
                  className="w-full bg-gradient-to-r from-[#8B1024] to-[#680A1A] hover:from-[#A5132B] hover:to-[#8B1024] disabled:opacity-50 text-white py-3.5 px-6 rounded-2xl font-bold text-sm shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 golden-glow cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>Registering...</span>
                  ) : (
                    <>
                      <ShieldCheck size={18} className="text-amber-300" />
                      <span>Confirm &amp; Register for {activeEvent.title}</span>
                    </>
                  )}
                </button>
                <p className="text-[11px] text-gray-400 text-center mt-2">
                  🔒 Entries are allocated in order of submission. The Pratibimb committee will confirm team schedules on WhatsApp.
                </p>
              </div>

            </form>
          )}
        </div>

      </div>

          {/* SEVA DONATION NUDGE MODAL WITH PAYMENT GATEWAY */}
      {showNudgeModal && successEntry && (
        <SevaDonationNudgeModal
          isOpen={showNudgeModal}
          onClose={() => setShowNudgeModal(false)}
          activityName={successEntry.eventTitle}
          residentName={successEntry.contactName}
          stallOrEventName={successEntry.teamName || successEntry.eventTitle}
          phone={successEntry.phone}
          flatNumber={successEntry.flat}
          enablePaymentGateway={true}
          note={"Your entry for " + successEntry.eventTitle + " (" + successEntry.flat + ") has been officially recorded and accepted! Registration ID: " + successEntry.id}
        />
      )}
    </div>
  );
}