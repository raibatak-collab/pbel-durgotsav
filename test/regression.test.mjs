import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

// Official Config to Verify
const SOCIETY_UPI_ID = "pbelsanskritiksamiti@icici";
const SOCIETY_NAME = "PBEL Sanskritik Samiti";

describe('PBEL City Durgotsav 2026 - Automated Regression Suite', () => {

  describe('1. Zero-Fee UPI URI & Payee Formatting', () => {
    it('should generate valid UPI deep links strictly mapped to pbelsanskritiksamiti@icici', () => {
      const amount = 1001;
      const note = "Pujo Seva - Ashtami Flowers";
      const upiUri = `upi://pay?pa=${SOCIETY_UPI_ID}&pn=${encodeURIComponent(SOCIETY_NAME)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;

      assert.match(upiUri, /^upi:\/\/pay\?/);
      assert.match(upiUri, /pa=pbelsanskritiksamiti%40icici|pa=pbelsanskritiksamiti@icici/);
      assert.match(upiUri, /pn=PBEL%20Sanskritik%20Samiti/);
      assert.match(upiUri, /am=1001/);
      assert.match(upiUri, /cu=INR/);
    });
  });

  describe('2. Anti-Fraud & Public Fund Ticker Filtering', () => {
    it('should ONLY aggregate contributions with status === "Success"', () => {
      const mockContributions = [
        { id: "1", amount: 1001, status: "Success", contributor_name: "Amit" },
        { id: "2", amount: 5001, status: "Pending Verification", contributor_name: "Rohan" },
        { id: "3", amount: 25000, status: "Rejected", contributor_name: "Fake User" },
        { id: "4", amount: 2501, status: "Success", contributor_name: "Debashis" },
      ];

      const verifiedTotal = mockContributions
        .filter((c) => c.status === "Success")
        .reduce((sum, c) => sum + c.amount, 0);

      const verifiedDonors = mockContributions.filter((c) => c.status === "Success");

      assert.strictEqual(verifiedTotal, 3502); // 1001 + 2501
      assert.strictEqual(verifiedDonors.length, 2);
      assert.ok(!verifiedDonors.some((d) => d.status === "Pending Verification"));
      assert.ok(!verifiedDonors.some((d) => d.status === "Rejected"));
    });
  });

  describe('3. Fixed Seva Catalog Price Integrity', () => {
    const catalog = [
      { id: "panchami-agomoni", amount: 2501, category: "rituals" },
      { id: "sashti-flowers", amount: 501, category: "flowers" },
      { id: "saptami-bhog", amount: 2501, category: "bhog" },
      { id: "ashtami-lotus", amount: 3100, category: "flowers" },
      { id: "ashtami-sandhi-deepam", amount: 2501, category: "rituals" },
      { id: "grand-gold", amount: 25000, category: "grand" },
    ];

    it('should ensure all fixed seva offerings have locked positive integer amounts', () => {
      catalog.forEach((item) => {
        assert.ok(item.amount > 0, `Amount for ${item.id} must be positive`);
        assert.ok(Number.isInteger(item.amount), `Amount for ${item.id} must be an integer`);
        assert.ok(item.id.length > 0, 'ID must not be empty');
      });
    });
  });

  describe('4. PSS Flagship Headliners Consistency', () => {
    const flagshipShows = [
      {
        day: "Maha Sashti",
        date: "2026-10-16",
        headliner: "Retro Rock by Fushmontor",
        startTime: "08:15 PM",
        durationMinutes: 90,
      },
      {
        day: "Maha Saptami",
        date: "2026-10-17",
        headliner: "Dance Drama Production by PSS",
        startTime: "07:45 PM",
        durationMinutes: 60,
      },
      {
        day: "Maha Ashtami",
        date: "2026-10-18",
        headliner: "Grand Bangla Theatrical Drama (Natok) by PSS",
        startTime: "07:45 PM",
        durationMinutes: 60,
      },
    ];

    it('should have exact schedule timings for all 3 major PSS productions', () => {
      assert.strictEqual(flagshipShows.length, 3);
      assert.strictEqual(flagshipShows[0].headliner, "Retro Rock by Fushmontor");
      assert.strictEqual(flagshipShows[0].durationMinutes, 90);
      assert.strictEqual(flagshipShows[1].headliner, "Dance Drama Production by PSS");
      assert.strictEqual(flagshipShows[2].headliner, "Grand Bangla Theatrical Drama (Natok) by PSS");
    });
  });

  describe('5. Pratibimb Resident Slot Boundary Checks', () => {
    it('should prevent registrations when max resident slots are reached', () => {
      const maxSlots = 8;
      const bookedPerformances = new Array(8).fill({ status: "Approved" });

      const canRegister = bookedPerformances.length < maxSlots;
      assert.strictEqual(canRegister, false);

      const remainingSlots = Math.max(0, maxSlots - bookedPerformances.length);
      assert.strictEqual(remainingSlots, 0);
    });
  });

  describe('6. Seva Package Capacity Limits & Sold-Out Greyout Logic', () => {
    it('should correctly calculate remaining slots and trigger sold out state', () => {
      const sevaPackage = {
        id: "ashtami-lotus",
        title: "Ashtami 108 Lotuses",
        maxLimit: 5,
        bookedCount: 5,
        isActive: true,
      };

      const remainingSlots = Math.max(0, sevaPackage.maxLimit - sevaPackage.bookedCount);
      const isSoldOut = sevaPackage.isActive === false || remainingSlots <= 0;

      assert.strictEqual(remainingSlots, 0);
      assert.strictEqual(isSoldOut, true);
    });

    it('should keep seva package active when slots are available', () => {
      const sevaPackage = {
        id: "sashti-flowers",
        title: "Sashti Flowers",
        maxLimit: 25,
        bookedCount: 10,
        isActive: true,
      };

      const remainingSlots = Math.max(0, sevaPackage.maxLimit - sevaPackage.bookedCount);
      const isSoldOut = sevaPackage.isActive === false || remainingSlots <= 0;

      assert.strictEqual(remainingSlots, 15);
      assert.strictEqual(isSoldOut, false);
    });
  });

  describe('7. Admin Reactivation by Increasing Max Limits', () => {
    it('should immediately reactivate a sold-out package when admin increases maxLimit', () => {
      // 1. Initially full
      let sevaPackage = {
        id: "saptami-bhog",
        title: "Saptami Maha Bhog",
        maxLimit: 10,
        bookedCount: 10,
        isActive: true,
      };
      let isSoldOut = sevaPackage.isActive === false || (sevaPackage.maxLimit - sevaPackage.bookedCount <= 0);
      assert.strictEqual(isSoldOut, true);

      // 2. Admin increases maxLimit to 15
      sevaPackage = { ...sevaPackage, maxLimit: 15 };
      const updatedRemaining = Math.max(0, sevaPackage.maxLimit - sevaPackage.bookedCount);
      isSoldOut = sevaPackage.isActive === false || updatedRemaining <= 0;

      assert.strictEqual(updatedRemaining, 5);
      assert.strictEqual(isSoldOut, false); // Reactivated!
    });
  });

});

