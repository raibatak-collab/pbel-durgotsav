"use client";

import { useState } from "react";
import { 
  HeartHandshake, 
  CheckCircle2, 
  QrCode, 
  Smartphone, 
  ShieldCheck, 
  Copy, 
  Check, 
  ArrowRight,
  Receipt,
  Download,
  X,
  Info,
  Lock
} from "lucide-react";
import Link from "next/link";
import { supabase } from "@/utils/supabase/client";

const SOCIETY_UPI_ID = "pbelsanskritiksamiti@icici";
const SOCIETY_NAME = "PBEL Sanskritik Samiti";

export function HomeQuickContribute() {
  const [amount, setAmount] = useState<number | "">(1001);
  const [purpose, setPurpose] = useState<string>("General Pujo Fund");
  const [formData, setFormData] = useState({
    name: "",
    flatNumber: "",
    phone: "",
    email: "",
    upiRef: "",
    isNameVisible: true,
  });

  const [copiedUpi, setCopiedUpi] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [receiptData, setReceiptData] = useState<any>(null);

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(SOCIETY_UPI_ID);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const generateUpiString = (amt: number) => {
    return `upi://pay?pa=${SOCIETY_UPI_ID}&pn=${encodeURIComponent(SOCIETY_NAME)}&am=${amt}&cu=INR&tn=${encodeURIComponent(purpose || "Pujo Seva")}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || amount <= 0) return;

    if (!formData.name.trim() || !formData.flatNumber.trim() || !formData.phone.trim()) {
      alert("Please enter your Name, Flat Number, and Phone Number.");
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Get or create category
      let { data: catData } = await supabase
        .from("contribution_categories")
        .select("id")
        .eq("name", purpose || "General Pujo Fund")
        .single();

      if (!catData) {
        const { data: newCat } = await supabase
          .from("contribution_categories")
          .insert({ name: purpose || "General Pujo Fund" })
          .select("id")
          .single();
        catData = newCat;
      }

      const generatedPaymentId = formData.upiRef.trim() 
        ? `UTR_${formData.upiRef.trim()}` 
        : `WEB_${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

      // 2. Insert with status "Pending" to comply with PostgreSQL check constraint
      const { error } = await supabase.from("contributions").insert({
        contributor_name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        flat_number: formData.flatNumber.trim(),
        amount: Number(amount),
        category_id: catData?.id,
        status: "Pending",
        is_name_visible: formData.isNameVisible,
        payment_id: generatedPaymentId,
      });

      if (error) throw error;

      setReceiptData({
        name: formData.name.trim(),
        flatNumber: formData.flatNumber.trim(),
        phone: formData.phone.trim(),
        amount: Number(amount),
        category: purpose || "General Pujo Fund",
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
    } catch (err) {
      console.error("Error submitting contribution:", err);
      alert("Submission failed. Please check your network connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      {/* E-RECEIPT MODAL */}
      {isSuccess && receiptData && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-amber-400/40 shadow-2xl relative text-center">
            
            <button
              onClick={() => setIsSuccess(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
            >
              <X size={18} />
            </button>

            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
              <CheckCircle2 size={36} />
            </div>

            <span className="text-[10px] uppercase font-bold text-amber-800 tracking-wider bg-amber-100/70 px-3 py-0.5 rounded-full inline-block">
              Offering Recorded
            </span>
            <h2 className="font-heading text-2xl font-bold text-primary mt-1 mb-1">
              ধন্যবাদ! (Dhonnobad)
            </h2>
            <p className="text-gray-600 text-xs max-w-sm mx-auto mb-5">
              Your contribution of <strong>₹{Number(receiptData.amount).toLocaleString("en-IN")}</strong> to <strong>PBEL Sanskritik Samiti</strong> has been submitted.
            </p>

            {/* Official Receipt Card */}
            <div className="bg-[#FFFDF9] rounded-2xl p-4 border border-amber-300/60 text-left text-xs space-y-2 mb-4 shadow-xs">
              <div className="flex items-center justify-between pb-2 border-b border-amber-900/10">
                <span className="font-heading font-bold text-primary">PBEL Sanskritik Samiti</span>
                <span className="text-amber-800 font-mono text-[10px]">{receiptData.paymentId}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-gray-500 block">Devotee</span>
                  <span className="font-bold text-gray-900">{receiptData.name} ({receiptData.flatNumber})</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Amount</span>
                  <span className="font-bold text-green-700 text-sm">₹{Number(receiptData.amount).toLocaleString("en-IN")}</span>
                </div>
              </div>

              <div className="pt-2 text-[10px] text-gray-500 border-t border-amber-900/10 flex items-center justify-between">
                <span>{receiptData.date}</span>
                <span className="text-amber-800 font-semibold bg-amber-100 px-2 py-0.5 rounded-md">
                  ⏳ Verification In Progress
                </span>
              </div>
            </div>

            <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200/80 text-[11px] text-amber-900 mb-5 flex items-start gap-2 text-left">
              <Info size={14} className="text-primary shrink-0 mt-0.5" />
              <span>
                Your offering will appear on the public <strong>Wall of Contributors</strong> once verified against the society bank account.
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <button
                onClick={() => window.print()}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold px-5 py-2 rounded-full text-xs transition flex items-center justify-center gap-1.5"
              >
                <Download size={13} /> Print E-Receipt
              </button>
              <button
                onClick={() => {
                  setIsSuccess(false);
                  setAmount(1001);
                  setFormData({ name: "", flatNumber: "", phone: "", email: "", upiRef: "", isNameVisible: true });
                }}
                className="bg-primary hover:bg-primary-hover text-white font-semibold px-5 py-2 rounded-full text-xs transition shadow-xs"
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}

      {/* HOMEPAGE EMBEDDED ZERO-FRICTION CARD */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 border border-amber-900/15 shadow-2xl relative overflow-hidden">
        
        {/* Decorative Top Accent */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-gray-100 gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-100/70 px-3 py-1 rounded-full uppercase tracking-wider mb-2">
              <HeartHandshake size={14} className="text-primary" />
              <span>Zero-Friction General Contribution</span>
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl text-gray-900 font-bold">
              Contribute to PBEL City Durgotsav
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Every contribution directly powers the rituals, daily Maha Bhog feast, Dhaaki artists, and Pratibimb cultural stage.
            </p>
          </div>

          <div className="shrink-0 bg-amber-50 border border-amber-200 px-3.5 py-2 rounded-2xl flex items-center gap-2">
            <ShieldCheck size={16} className="text-green-600" />
            <div className="text-left">
              <span className="text-[10px] text-gray-500 block uppercase font-bold">Direct Society UPI</span>
              <span className="text-xs font-mono font-bold text-primary">{SOCIETY_UPI_ID}</span>
            </div>
            <button
              type="button"
              onClick={handleCopyUpi}
              className="ml-1 p-1.5 bg-white text-gray-700 hover:text-black rounded-lg border border-gray-200 transition"
              title="Copy UPI ID"
            >
              {copiedUpi ? <Check size={13} className="text-green-600" /> : <Copy size={13} />}
            </button>
          </div>
        </div>

        {/* Form Grid: Left = Details & Chips | Right = Live QR Scanner & 1-Click Pay */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT 7 COLUMNS: Amount Chips & Personal Details */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* Quick Amount Chips */}
            <div>
              <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">
                Select Contribution Amount (₹ INR) *
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-3">
                {[251, 501, 1001, 2001, 5001].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setAmount(amt)}
                    className={`py-2 px-2 rounded-xl border text-xs font-bold transition-all ${
                      amount === amt
                        ? "bg-primary text-white border-primary shadow-sm scale-102"
                        : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-amber-50 hover:border-amber-300"
                    }`}
                  >
                    ₹{amt.toLocaleString("en-IN")}
                  </button>
                ))}
              </div>

              <div className="relative">
                <span className="absolute left-3.5 top-3 text-gray-500 font-bold text-sm">₹</span>
                <input
                  type="number"
                  min="1"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : "")}
                  placeholder="Or enter any custom amount..."
                  className="w-full pl-8 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm font-semibold text-gray-900"
                />
              </div>
            </div>

            {/* Resident Details Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-gray-700 uppercase mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your Name"
                  className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-700 uppercase mb-1">
                  Flat Number * (Required)
                </label>
                <input
                  type="text"
                  required
                  value={formData.flatNumber}
                  onChange={(e) => setFormData({ ...formData, flatNumber: e.target.value })}
                  placeholder="e.g. Tower B - 1204"
                  className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-700 uppercase mb-1">
                  WhatsApp Phone *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="10-digit mobile"
                  className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-700 uppercase mb-1">
                  UPI UTR / Ref No. (Optional)
                </label>
                <input
                  type="text"
                  value={formData.upiRef}
                  onChange={(e) => setFormData({ ...formData, upiRef: e.target.value })}
                  placeholder="12-digit UTR from GPay"
                  className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none text-xs font-mono"
                />
              </div>
            </div>

            {/* Privacy Checkbox */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="home-wall-visibility"
                checked={formData.isNameVisible}
                onChange={(e) => setFormData({ ...formData, isNameVisible: e.target.checked })}
                className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
              />
              <label htmlFor="home-wall-visibility" className="text-xs text-gray-700 cursor-pointer">
                Display my name on the public <strong>Wall of Contributors</strong>
              </label>
            </div>

          </div>

          {/* RIGHT 5 COLUMNS: Live Scannable QR & 1-Click Pay */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#FFFDF9] to-[#FDF8F0] p-5 rounded-2xl border border-amber-300/80 flex flex-col justify-between text-center">
            
            <div>
              <span className="text-[11px] font-bold text-amber-900 uppercase flex items-center justify-center gap-1.5 mb-2">
                <QrCode size={14} className="text-primary" /> Scan with Any UPI App
              </span>

              {/* Dynamic QR Code */}
              <div className="bg-white p-2.5 rounded-2xl border border-amber-300 shadow-sm inline-block mx-auto mb-2">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
                    generateUpiString(Number(amount) || 1001)
                  )}`}
                  alt="PBEL Sanskritik Samiti UPI QR"
                  className="w-32 h-32 sm:w-36 sm:h-36 mx-auto rounded-lg"
                />
              </div>

              <p className="text-xs font-bold text-gray-900">
                Pay ₹{Number(amount || 0).toLocaleString("en-IN")} via GPay, PhonePe, Paytm
              </p>
              <span className="text-[10px] text-gray-500 block mt-0.5">
                0% Gateway Fee • Directly to Society ICICI A/C
              </span>
            </div>

            <div className="space-y-2 pt-3 border-t border-amber-200/60 mt-3">
              {/* Mobile 1-Click Deep Link */}
              <a
                href={generateUpiString(Number(amount) || 1001)}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow-xs"
              >
                <Smartphone size={14} />
                <span>1-Click Pay on Mobile (GPay / PhonePe)</span>
              </a>

              {/* Submit Confirmation Button */}
              <button
                type="submit"
                disabled={isSubmitting || !amount || amount <= 0}
                className="w-full bg-gradient-to-r from-[#D99B26] to-[#B8801C] hover:from-[#B8801C] hover:to-[#966714] text-white font-bold py-3 px-4 rounded-xl text-xs transition shadow-md golden-glow flex items-center justify-center gap-2"
              >
                <CheckCircle2 size={15} />
                <span>
                  {isSubmitting ? "Recording..." : `Confirm Offering of ₹${Number(amount || 0).toLocaleString("en-IN")}`}
                </span>
              </button>
            </div>

          </div>

        </form>

        {/* BOTTOM SEVA CATALOG CTA LINK */}
        <div className="mt-6 pt-5 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs bg-amber-50/50 p-3.5 rounded-2xl border border-amber-200/60">
          <div className="flex items-center gap-2 text-amber-950">
            <span className="text-base">🌺</span>
            <span>
              Looking to sponsor specific items like <strong>Flowers, Sweets, Maha Bhog, or 108 Lotuses</strong>?
            </span>
          </div>
          <Link
            href="/contribute"
            className="inline-flex items-center gap-1 text-primary font-bold hover:underline shrink-0 bg-white px-3 py-1.5 rounded-xl border border-amber-300 shadow-2xs"
          >
            <span>Explore Day-wise Seva Catalog</span>
            <ArrowRight size={13} />
          </Link>
        </div>

      </div>
    </div>
  );
}
