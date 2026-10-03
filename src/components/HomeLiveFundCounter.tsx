"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, HeartHandshake, Users } from "lucide-react";
import { supabase } from "@/utils/supabase/client";
import { fetchCloudConfig } from "@/utils/cloudConfig";

export interface HomeLiveFundCounterProps {
  initialTotalAmount: number;
  initialContributorsCount: number;
  initialMemberSubscriptionTotal: number;
  initialMemberFamiliesCount: number;
  initialIncludeMemberContributions: boolean;
  children?: React.ReactNode;
}

export function HomeLiveFundCounter({
  initialTotalAmount,
  initialContributorsCount,
  initialMemberSubscriptionTotal,
  initialMemberFamiliesCount,
  initialIncludeMemberContributions,
  children,
}: HomeLiveFundCounterProps) {
  const [totalAmount, setTotalAmount] = useState(initialTotalAmount);
  const [contributorsCount, setContributorsCount] = useState(initialContributorsCount);
  const [memberSubscriptionTotal, setMemberSubscriptionTotal] = useState(initialMemberSubscriptionTotal);
  const [memberFamiliesCount, setMemberFamiliesCount] = useState(initialMemberFamiliesCount);
  const [includeMemberContributions, setIncludeMemberContributions] = useState(initialIncludeMemberContributions);

  useEffect(() => {
    let isMounted = true;

    async function hydrateLiveData() {
      try {
        const [contribsRes, includeMembersRes, membersRes] = await Promise.all([
          supabase
            .from("contributions")
            .select("amount, status")
            .eq("status", "Success"),
          fetchCloudConfig<boolean>("include_member_contributions", true),
          fetchCloudConfig<any[]>("pss_members", []),
        ]);

        if (!isMounted) return;

        const liveContribs = contribsRes.data || [];
        const liveTotal = liveContribs.reduce((sum, item) => sum + Number(item.amount), 0);
        const liveContribCount = liveContribs.length;

        const liveIncludeMembers = includeMembersRes ?? true;
        const liveMembers = Array.isArray(membersRes) ? membersRes : [];
        let liveMemberTotal = 0;
        let liveMemberCount = 0;

        if (liveIncludeMembers && liveMembers.length > 0) {
          liveMemberCount = liveMembers.length;
          liveMemberTotal = liveMembers.reduce(
            (sum: number, m: any) => sum + (Number(m.membershipFee) || 7500),
            0
          );
        }

        setTotalAmount(liveTotal);
        setContributorsCount(liveContribCount);
        setIncludeMemberContributions(liveIncludeMembers);
        setMemberSubscriptionTotal(liveMemberTotal);
        setMemberFamiliesCount(liveMemberCount);
      } catch (err) {
        console.error("Error hydrating live fund counter:", err);
      }
    }

    hydrateLiveData();

    const handleConfigUpdate = () => {
      hydrateLiveData();
    };

    window.addEventListener("pbel_config_updated", handleConfigUpdate);
    window.addEventListener("pbel_member_toggle_updated", handleConfigUpdate);

    return () => {
      isMounted = false;
      window.removeEventListener("pbel_config_updated", handleConfigUpdate);
      window.removeEventListener("pbel_member_toggle_updated", handleConfigUpdate);
    };
  }, []);

  const combinedTotal = totalAmount + (includeMemberContributions ? memberSubscriptionTotal : 0);
  const combinedContributorsCount = contributorsCount + (includeMemberContributions ? memberFamiliesCount : 0);

  const formattedTotal = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(combinedTotal);

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-amber-900/10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
      <div className="md:col-span-2 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-800 tracking-wider uppercase">
          <Sparkles size={14} className="text-primary" />
          <span>Community Pujo Seva Fund (Live Verified)</span>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-baseline gap-3">
            <span className="font-heading text-4xl sm:text-5xl font-bold text-green-700">
              {formattedTotal}
            </span>
            <span className="text-xs text-gray-500 font-medium">
              Raised so far from {combinedContributorsCount} resident offerings
            </span>
          </div>

          {includeMemberContributions && memberSubscriptionTotal > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-amber-900 bg-amber-50 border border-amber-200/90 px-3 py-1 rounded-full font-medium w-fit mt-1 shadow-2xs">
              <Sparkles size={12} className="text-amber-600 shrink-0" />
              <span>
                Includes <strong>₹{memberSubscriptionTotal.toLocaleString("en-IN")}</strong> from {memberFamiliesCount} Member Family Subscriptions
              </span>
            </div>
          )}
        </div>
        <p className="text-xs text-gray-600">
          100% of resident contributions fund the Pujo rituals, daily Maha Bhog distribution, Dhaaki artists, and Pratibimb cultural stage.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row md:flex-col gap-3 justify-center">
        <Link
          href="/contribute"
          className="bg-primary hover:bg-primary-hover text-white text-center py-3 px-6 rounded-2xl font-bold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2"
        >
          <HeartHandshake size={16} />
          <span>Offer Pujo Seva (UPI / QR) →</span>
        </Link>
        <Link
          href="/volunteer"
          className="bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-center py-2.5 px-6 rounded-2xl font-semibold text-xs transition-all flex items-center justify-center gap-1.5"
        >
          <Users size={14} />
          <span>Join Volunteer Seva Roster</span>
        </Link>
      </div>
    </div>
  );
}
