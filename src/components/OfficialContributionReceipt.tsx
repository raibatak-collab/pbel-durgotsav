"use client";

import React, { useRef } from "react";
import { Download, Share2, ShieldCheck, CheckCircle2, RotateCcw } from "lucide-react";
import { SamitiBrandingConfig } from "@/config/branding";
import { numberToIndianRupeesWords } from "@/utils/numberToWords";

export interface ReceiptData {
  name: string;
  flatNumber: string;
  phone?: string;
  email?: string;
  amount: number;
  category: string;
  paymentId: string;
  upiRef?: string;
  upiId?: string;
  date: string;
  requiresTaxExemption?: boolean;
  panNumber?: string;
  wantsWhatsappUpdates?: boolean;
}

interface OfficialContributionReceiptProps {
  receiptData: ReceiptData;
  branding: SamitiBrandingConfig;
  onMakeAnother?: () => void;
  onOpenShareModal?: () => void;
}

/**
 * Built-in Vector Fallback: PBEL Sanskritik Samiti Official Emblem
 */
export function PssLogoFallback({ className = "w-16 h-16" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-label="PBEL Sanskritik Samiti Logo">
      <circle cx="50" cy="50" r="46" fill="#800000" stroke="#D4AF37" strokeWidth="3" />
      <circle cx="50" cy="50" r="41" fill="none" stroke="#D4AF37" strokeWidth="1" strokeDasharray="2,2" />
      {/* Traditional Kalash with Coconut and Mango Leaves */}
      <path d="M 38 68 L 62 68 L 60 52 L 40 52 Z" fill="#D4AF37" stroke="#FFF" strokeWidth="0.8" />
      <path d="M 35 52 L 65 52 L 63 46 L 37 46 Z" fill="#E6C65C" />
      {/* Sacred Coconut on Top */}
      <circle cx="50" cy="40" r="8" fill="#5C2E0B" stroke="#D4AF37" strokeWidth="0.8" />
      {/* Sacred Mango Leaves */}
      <path d="M 50 44 C 42 38, 36 30, 42 24 C 48 30, 48 38, 50 44 Z" fill="#2E7D32" />
      <path d="M 50 44 C 58 38, 64 30, 58 24 C 52 30, 52 38, 50 44 Z" fill="#2E7D32" />
      {/* Sacred Trishul Central Finial */}
      <path d="M 49 14 L 51 14 L 51 25 L 49 25 Z" fill="#D4AF37" />
      <path d="M 46 17 C 47 22, 53 22, 54 17" fill="none" stroke="#D4AF37" strokeWidth="1.2" />
      {/* Text in Outer Circle */}
      <text x="50" y="81" textAnchor="middle" fill="#FFFFFF" fontSize="6.5" fontWeight="bold" letterSpacing="0.8">
        PBEL SANSKRITIK
      </text>
      <text x="50" y="88" textAnchor="middle" fill="#D4AF37" fontSize="5.5" fontWeight="bold" letterSpacing="0.8">
        SAMITI • HYD
      </text>
    </svg>
  );
}

/**
 * Built-in Vector Fallback: PBEL City Durgotsav Festive Logo
 */
export function DurgotsavLogoFallback({ className = "w-16 h-16" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-label="PBEL City Durgotsav Logo">
      <circle cx="50" cy="50" r="46" fill="#FFF8EE" stroke="#991B1B" strokeWidth="2.5" />
      <circle cx="50" cy="50" r="42" fill="none" stroke="#D97706" strokeWidth="1" />
      {/* Sacred Trinetra - Durga Maa Third Eye & Crescent */}
      <path d="M 50 28 C 45 34, 45 42, 50 48 C 55 42, 55 34, 50 28 Z" fill="#991B1B" />
      <circle cx="50" cy="38" r="2.5" fill="#D97706" />
      {/* Left Divine Eye */}
      <path d="M 28 46 Q 38 38 46 47 Q 38 53 28 46 Z" fill="#991B1B" />
      <circle cx="38" cy="46" r="2.8" fill="#1A1A1A" />
      <circle cx="37" cy="45" r="1" fill="#FFFFFF" />
      {/* Right Divine Eye */}
      <path d="M 72 46 Q 62 38 54 47 Q 62 53 72 46 Z" fill="#991B1B" />
      <circle cx="62" cy="46" r="2.8" fill="#1A1A1A" />
      <circle cx="61" cy="45" r="1" fill="#FFFFFF" />
      {/* Sacred Tilak / Sindoor dot */}
      <circle cx="50" cy="22" r="3" fill="#991B1B" />
      {/* Text Ring */}
      <text x="50" y="73" textAnchor="middle" fill="#991B1B" fontSize="6.5" fontWeight="bold" letterSpacing="0.5">
        PBEL CITY
      </text>
      <text x="50" y="81" textAnchor="middle" fill="#D97706" fontSize="7" fontWeight="extrabold" letterSpacing="0.8">
        DURGOTSAV
      </text>
      <text x="50" y="88" textAnchor="middle" fill="#6B7280" fontSize="5.5" fontWeight="bold" letterSpacing="1">
        2026
      </text>
    </svg>
  );
}

/**
 * Built-in Circular Samiti Administrative Seal (Vector SVG)
 */
export function SamitiOfficialSeal({ className = "w-24 h-24" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-label="Official Samiti Stamp Seal">
      <g transform="rotate(-6 60 60)">
        {/* Distressed Outer Seal Rings */}
        <circle cx="60" cy="60" r="54" fill="none" stroke="#991B1B" strokeWidth="2.5" strokeDasharray="30 1 10 1" />
        <circle cx="60" cy="60" r="49" fill="none" stroke="#991B1B" strokeWidth="1" />
        <circle cx="60" cy="60" r="33" fill="none" stroke="#991B1B" strokeWidth="1.2" strokeDasharray="6 2" />
        
        {/* Curved Text Simulation via Centered Text Blocks */}
        <text x="60" y="24" textAnchor="middle" fill="#991B1B" fontSize="6.5" fontWeight="bold" letterSpacing="1.2">
          PBEL SANSKRITIK SAMITI
        </text>
        <text x="60" y="32" textAnchor="middle" fill="#991B1B" fontSize="5" fontWeight="bold" letterSpacing="0.8">
          ★ HYDERABAD ★
        </text>
        
        {/* Center Sacred Trishul & Kalash Motif */}
        <path d="M 60 40 L 60 76 M 52 48 Q 60 54 68 48 M 52 48 Q 50 42 52 38 M 68 48 Q 70 42 68 38" fill="none" stroke="#991B1B" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="60" cy="38" r="1.5" fill="#991B1B" />
        
        <text x="60" y="92" textAnchor="middle" fill="#991B1B" fontSize="5.5" fontWeight="bold" letterSpacing="0.8">
          OFFICIAL VERIFIED SEAL
        </text>
        <text x="60" y="100" textAnchor="middle" fill="#991B1B" fontSize="4.5" fontWeight="semibold" letterSpacing="0.5">
          REGD. SOCIETY
        </text>
      </g>
    </svg>
  );
}

/**
 * Digitized Stylized Signature of the President / Signatory
 */
export function DefaultPresidentSignature({ name = "President", className = "h-10" }: { name?: string; className?: string }) {
  return (
    <svg viewBox="0 0 160 50" className={className} aria-label="President Signature">
      <path
        d="M 15 35 Q 25 10 38 25 T 60 20 Q 75 12 85 30 T 110 22 Q 125 15 145 28"
        fill="none"
        stroke="#1E3A8A"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 30 28 L 70 28"
        fill="none"
        stroke="#1E3A8A"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M 20 42 L 140 38"
        fill="none"
        stroke="#1E3A8A"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function OfficialContributionReceipt({
  receiptData,
  branding,
  onMakeAnother,
  onOpenShareModal,
}: OfficialContributionReceiptProps) {
  const receiptRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const amountInWords = numberToIndianRupeesWords(receiptData.amount);
  const formattedAmount = `₹${Number(receiptData.amount).toLocaleString("en-IN")}/-`;

  // Society Legal Credentials (from Admin branding or graceful defaults)
  const societyRegNo = branding.societyRegNo?.trim() || "";
  const societyPan = branding.societyPan?.trim() || "";
  const tax80gUrn = branding.tax80gUrn?.trim() || "";
  const tax80gDate = branding.tax80gDate?.trim() || "30-Jun-2025";
  const registeredAddress = branding.registeredAddress || "PBEL City, Appa Junction, Peeramcheruvu, Hyderabad, Telangana - 500091";
  const signatoryTitle = branding.signatoryTitle || "President / General Secretary";

  // 80G Tax Exemption temporarily disabled until formal society registration; receipts exclusively render Devotional Blessing
  const is80G = false;
  const calculatedReceiptNo = `ONL-${receiptData.paymentId || "PSS2026"}`;

  return (
    <div className="w-full max-w-3xl mx-auto my-6">
      
      {/* Top Action Bar (Hidden in Print) */}
      <div className="print:hidden mb-4 bg-gradient-to-r from-amber-500/10 via-white to-amber-500/10 border border-amber-300/80 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-left">
          <div className="w-9 h-9 rounded-full bg-green-100 text-green-700 flex items-center justify-center shrink-0">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <h4 className="font-heading text-sm font-bold text-gray-900">
              Contribution Recorded Successfully!
            </h4>
            <p className="text-[11px] text-gray-600">
              Your official PBEL Sanskritik Samiti devotional receipt is ready to print or save.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => {
              if (onOpenShareModal) {
                onOpenShareModal();
              } else {
                const receiptIdentifier = receiptData.paymentId || "";
                const receiptUrl = receiptIdentifier
                  ? `https://www.pbelcitydurgotsav.com/receipt?id=${encodeURIComponent(receiptIdentifier)}`
                  : "https://www.pbelcitydurgotsav.com/receipt";
                const shareText = `🌺 *শুভ শারদীয়া • PBEL City Durgotsav 2026* 🌺\nJoy Maa Durga!\n\nOfficial Contribution Receipt of *${receiptData.name}* (${receiptData.flatNumber})\nSeva Offering: *${receiptData.category}*\nAmount: *₹${Number(receiptData.amount).toLocaleString("en-IN")}*\n🧾 *Receipt No:* ${calculatedReceiptNo}\n📄 *View & Download Official PDF Receipt:*\n👉 ${receiptUrl}\n\nMay Maa Durga bless all residents with joy, health, and prosperity! 🙏\n_PBEL Sanskritik Samiti (PSS)_`;
                window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, "_blank");
              }
            }}
            className="flex-1 sm:flex-initial bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold px-4 py-2 rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
            title="Share or forward receipt on WhatsApp"
          >
            <Share2 size={14} />
            <span>Share WhatsApp</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex-1 sm:flex-initial bg-primary hover:bg-primary-hover text-white font-bold px-4 py-2 rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow-sm golden-glow cursor-pointer"
          >
            <Download size={14} />
            <span>Print / Save PDF</span>
          </button>

          {onMakeAnother && (
            <button
              onClick={onMakeAnother}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold px-3 py-2 rounded-xl text-xs transition flex items-center justify-center gap-1 cursor-pointer"
              title="Make Another Offering"
            >
              <RotateCcw size={14} />
              <span className="hidden md:inline">Another Seva</span>
            </button>
          )}
        </div>
      </div>

      {/* PRINTABLE OFFICIAL RECEIPT CERTIFICATE */}
      <div
        id="pbel-official-receipt"
        ref={receiptRef}
        className="bg-[#FFFDF9] text-gray-900 rounded-2xl sm:rounded-3xl border-2 sm:border-4 border-[#991B1B] shadow-xl p-5 sm:p-8 relative overflow-hidden text-left print:p-6 print:border-2 print:shadow-none print:m-0 print:w-full print:rounded-none"
        style={{
          boxSizing: "border-box",
        }}
      >
        {/* Inner Gold Inset Border for authentic certificate look */}
        <div className="absolute inset-1.5 sm:inset-2.5 border border-[#D97706]/70 rounded-xl sm:rounded-2xl pointer-events-none" />

        {/* Traditional Auspicious Corner Motifs */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 text-[#991B1B] font-serif text-sm sm:text-base select-none">
          ❖
        </div>
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 text-[#991B1B] font-serif text-sm sm:text-base select-none">
          ❖
        </div>
        <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 text-[#991B1B] font-serif text-sm sm:text-base select-none">
          ❖
        </div>
        <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 text-[#991B1B] font-serif text-sm sm:text-base select-none">
          ❖
        </div>

        {/* DYNAMIC WATERMARK (Durgotsav Logo if available, else Durga Trinetra) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.045] print:opacity-[0.06] overflow-hidden">
          {branding.durgotsavLogoUrl ? (
            <img
              src={branding.durgotsavLogoUrl}
              alt=""
              className="w-[280px] sm:w-[420px] object-contain"
            />
          ) : (
            <svg viewBox="0 0 200 200" className="w-[320px] sm:w-[440px] text-[#991B1B]" fill="currentColor">
              {/* Sacred Durga Trinetra & Trishul Watermark */}
              <path d="M 100 30 C 85 45, 85 65, 100 80 C 115 65, 115 45, 100 30 Z" />
              <circle cx="100" cy="55" r="5" />
              <path d="M 45 75 Q 75 55 92 78 Q 75 92 45 75 Z" />
              <circle cx="72" cy="74" r="5" fill="#000" />
              <path d="M 155 75 Q 125 55 108 78 Q 125 92 155 75 Z" />
              <circle cx="128" cy="74" r="5" fill="#000" />
              <path d="M 100 95 L 100 170 M 80 115 Q 100 130 120 115 M 80 115 Q 75 100 80 90 M 120 115 Q 125 100 120 90" stroke="currentColor" strokeWidth="6" strokeLinecap="round" fill="none" />
            </svg>
          )}
        </div>

        {/* 1. TOP AUSPICIOUS BENGALI & ENGLISH INVOCATION */}
        <div className="text-center pb-2 mb-3 border-b border-amber-900/15 relative z-10">
          <span className="text-[11px] sm:text-xs font-bold text-[#991B1B] tracking-wider uppercase">
            ॥ জয় মা দুর্গা ॥ • PBEL City Durgotsav 2026 • শুভ শারদোৎসব
          </span>
        </div>

        {/* 2. DUAL LOGOS & SAMITI LEGAL HEADER */}
        <div className="flex items-center justify-between gap-2 sm:gap-4 pb-4 mb-3 border-b-2 border-[#991B1B]/30 relative z-10">
          
          {/* Left: PBEL Sanskritik Samiti Logo */}
          <div className="shrink-0">
            {branding.pssLogoUrl ? (
              <img
                src={branding.pssLogoUrl}
                alt="PSS Emblem"
                className="w-14 h-14 sm:w-20 sm:h-20 object-contain rounded-xl"
              />
            ) : (
              <PssLogoFallback className="w-14 h-14 sm:w-20 sm:h-20" />
            )}
          </div>

          {/* Center: Society Name & Registered Address */}
          <div className="text-center flex-1 px-1">
            <h1 className="font-heading text-lg sm:text-2xl font-black text-[#991B1B] tracking-tight sm:tracking-normal uppercase">
              PBEL SANSKRITIK SAMITI
            </h1>
            <p className="text-[10px] sm:text-xs text-gray-700 font-medium max-w-md mx-auto leading-tight mt-0.5">
              {registeredAddress}
            </p>

            {/* Legal Identification Strip (Only display fields that are set) */}
            <div className="flex flex-wrap items-center justify-center gap-x-2 sm:gap-x-3 gap-y-0.5 text-[9.5px] sm:text-[11px] text-gray-600 font-mono font-semibold mt-1">
              {societyPan && <span>PAN: <strong className="text-gray-900">{societyPan}</strong></span>}
              {societyPan && (societyRegNo || tax80gUrn) && <span>•</span>}
              {societyRegNo && <span>Society Regd. No: <strong className="text-gray-900">{societyRegNo}</strong></span>}
              {societyRegNo && tax80gUrn && <span>•</span>}
              {tax80gUrn && <span>80G Regn. URN: <strong className="text-gray-900">{tax80gUrn}</strong></span>}
            </div>
          </div>

          {/* Right: PBEL City Durgotsav 2026 Logo */}
          <div className="shrink-0">
            {branding.durgotsavLogoUrl ? (
              <img
                src={branding.durgotsavLogoUrl}
                alt="PBEL City Durgotsav Logo"
                className="w-14 h-14 sm:w-20 sm:h-20 object-contain rounded-xl"
              />
            ) : (
              <DurgotsavLogoFallback className="w-14 h-14 sm:w-20 sm:h-20" />
            )}
          </div>
        </div>

        {/* 3. DOCUMENT TITLE RIBBON */}
        <div className="text-center mb-4 relative z-10">
          <div className="inline-block bg-gradient-to-r from-[#991B1B] via-[#7F1D1D] to-[#991B1B] text-white px-5 sm:px-8 py-1 rounded-full shadow-xs border border-[#D97706]">
            <h2 className="font-heading text-xs sm:text-sm font-bold tracking-wider uppercase">
              Official Contribution &amp; Devotional Seva Receipt
            </h2>
          </div>
        </div>

        {/* 4. RECEIPT META BAR (Receipt No & Date) */}
        <div className="bg-[#FAF4E8] rounded-xl p-2.5 sm:p-3 border border-amber-300/80 mb-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs relative z-10">
          <div>
            <span className="text-[10px] text-gray-500 uppercase tracking-wider block font-semibold">Receipt No:</span>
            <span className="font-mono font-bold text-[#991B1B] text-xs">
              ONL-{receiptData.paymentId || "PSS2026"}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-gray-500 uppercase tracking-wider block font-semibold">Receipt Date:</span>
            <span className="font-semibold text-gray-900 text-xs">
              {receiptData.date || new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-gray-500 uppercase tracking-wider block font-semibold">Payment Channel:</span>
            <span className="font-semibold text-gray-900 text-xs flex items-center gap-1">
              <ShieldCheck size={13} className="text-green-600 shrink-0" />
              <span>Direct Bank / UPI</span>
            </span>
          </div>
          <div>
            <span className="text-[10px] text-gray-500 uppercase tracking-wider block font-semibold">Online Bank UTR:</span>
            <span className="font-mono font-semibold text-gray-800 text-xs truncate block">
              {receiptData.upiRef || receiptData.paymentId || "Verified"}
            </span>
          </div>
        </div>

        {/* 5. TABULAR DEVOTEE DETAILS (Well-Utilized Space) */}
        <div className="space-y-2.5 text-xs sm:text-[13px] relative z-10 mb-4">
          
          <div className="flex flex-col sm:flex-row sm:items-baseline border-b border-dashed border-amber-900/20 pb-1.5 gap-1">
            <span className="text-gray-600 font-semibold sm:w-48 shrink-0">Received with thanks from:</span>
            <span className="font-bold text-gray-950 text-sm sm:text-base flex-1">
              {receiptData.name} &amp; Family
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 border-b border-dashed border-amber-900/20 pb-1.5">
            <div className="flex items-baseline gap-1">
              <span className="text-gray-600 font-semibold sm:w-48 shrink-0">PBEL City Flat / Tower:</span>
              <span className="font-bold text-gray-900 font-mono">
                {receiptData.flatNumber}
              </span>
            </div>

            {receiptData.phone && (
              <div className="flex items-baseline gap-1">
                <span className="text-gray-600 font-semibold w-28 shrink-0">Mobile / WhatsApp:</span>
                <span className="font-mono text-gray-800 font-semibold">
                  +91 {receiptData.phone.replace(/^(\+91|91)/, "")}
                </span>
              </div>
            )}
          </div>

          {/* Contributor PAN Row (Displayed if 80G requested or if PAN is available) */}
          {is80G && (
            <div className="flex items-baseline border-b border-dashed border-amber-900/20 pb-1.5 gap-1 bg-amber-50/50 px-1 rounded">
              <span className="text-gray-700 font-bold sm:w-48 shrink-0">Contributor PAN Number:</span>
              <span className="font-mono font-black text-[#991B1B] text-sm uppercase tracking-wider">
                {receiptData.panNumber}
              </span>
              <span className="text-[10px] text-green-700 font-semibold ml-2">✓ Verified for 80G Filing</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-baseline border-b border-dashed border-amber-900/20 pb-1.5 gap-1">
            <span className="text-gray-600 font-semibold sm:w-48 shrink-0">The sum of Rupees (in words):</span>
            <span className="font-heading font-bold text-[#991B1B] flex-1 leading-snug">
              {amountInWords}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 border-b border-dashed border-amber-900/20 pb-1.5">
            <div className="flex items-baseline gap-1">
              <span className="text-gray-600 font-semibold sm:w-48 shrink-0">Amount Contributed:</span>
              <span className="font-mono text-base sm:text-lg font-black text-green-800">
                {formattedAmount}
              </span>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-gray-600 font-semibold w-20 shrink-0">Towards:</span>
              <span className="font-bold text-[#991B1B] truncate">
                {receiptData.category}
              </span>
            </div>
          </div>

        </div>

        {/* 6. CONDITIONAL DECLARATION BOX: 80G vs. DEVOTIONAL BLESSING */}
        {is80G ? (
          /* 80G TAX EXEMPTION DECLARATION BOX */
          <div className="bg-[#FFF8ED] rounded-xl p-3 sm:p-3.5 border border-[#D97706] mb-4 relative z-10">
            <h4 className="font-heading text-xs font-bold text-[#991B1B] mb-1 flex items-center gap-1.5">
              <span>📜 80G Tax Exemption Declaration (Income Tax Act, 1961)</span>
            </h4>
            <p className="text-[10px] sm:text-[11px] text-gray-700 leading-relaxed">
              This official receipt is issued for the voluntary contribution received by <strong>PBEL Sanskritik Samiti</strong>. 
              Contributions made to the Samiti are eligible for tax deduction under <strong>Section 80G(5)(vi)</strong> of the 
              Income Tax Act, 1961 vide Order/URN No: <strong className="font-mono text-gray-900">{tax80gUrn || "AANAP3884FF20251"}</strong> 
              {tax80gDate ? ` dated ${tax80gDate}.` : "."}
            </p>
          </div>
        ) : (
          /* DEVOTIONAL BLESSING & GRATITUDE CARD (No empty white space) */
          <div className="bg-[#FFFDF4] rounded-xl p-3 sm:p-3.5 border border-amber-200/90 mb-4 relative z-10 flex items-start gap-2.5">
            <span className="text-xl shrink-0 mt-0.5">🌺</span>
            <div>
              <h4 className="font-heading text-xs font-bold text-[#991B1B] mb-0.5">
                ধন্যবাদ ও আন্তরিক শুভেচ্ছা • Devotional Seva Benediction
              </h4>
              <p className="text-[10.5px] sm:text-[11px] text-gray-700 leading-relaxed">
                May Maa Durga, the epitome of Shakti, grace, and compassion, bestow good health, joy, and prosperity 
                upon you and your family. The Executive Committee of <strong>PBEL Sanskritik Samiti</strong> conveys its heartfelt 
                gratitude for your pious offering towards PBEL City Durgotsav 2026.
              </p>
            </div>
          </div>
        )}

        {/* 7. AUTHENTICATION FOOTER: NOTE, SIGNATURE, & SEAL */}
        <div className="pt-2 border-t border-amber-900/15 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
          
          {/* Realization Notice & Security Indicator */}
          <div className="text-[10px] text-gray-500 max-w-xs text-center sm:text-left leading-tight">
            <p className="font-medium italic mb-0.5">
              * Note: This official receipt is valid subject to realization in the society bank account.
            </p>
            <span className="font-mono text-[9px] text-gray-400">
              Generated by PBEL Durgotsav Digital Portal • Society ICICI Bank A/C
            </span>
          </div>

          {/* Right Side: Circular Samiti Seal + President Signature */}
          <div className="flex items-center gap-4 sm:gap-6 shrink-0">
            
            {/* Samiti Official Vector Seal Badge */}
            <div className="shrink-0 flex items-center justify-center">
              <SamitiOfficialSeal className="w-18 h-18 sm:w-22 sm:h-22" />
            </div>

            {/* Signature Block */}
            <div className="text-center min-w-[120px]">
              <div className="h-10 flex items-end justify-center mb-1">
                {branding.presidentSignatureUrl ? (
                  <img
                    src={branding.presidentSignatureUrl}
                    alt="President Signature"
                    className="max-h-9 max-w-[130px] object-contain"
                  />
                ) : (
                  <DefaultPresidentSignature className="h-8 w-28 text-blue-900" />
                )}
              </div>
              <div className="border-t border-gray-400 pt-0.5 font-bold text-[11px] text-gray-900">
                {signatoryTitle}
              </div>
              <div className="text-[9.5px] text-gray-600 font-semibold">
                PBEL Sanskritik Samiti
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* PRINT-ONLY CSS HELPER */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #pbel-official-receipt, #pbel-official-receipt * {
            visibility: visible;
          }
          #pbel-official-receipt {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 18px 24px !important;
            border-width: 2px !important;
            box-shadow: none !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          @page {
            size: A4 portrait;
            margin: 10mm;
          }
        }
      `}</style>

    </div>
  );
}

export default OfficialContributionReceipt;
