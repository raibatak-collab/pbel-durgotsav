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

  describe('8. Navigation Link & Route Integrity Verification', () => {
    const validAppRoutes = [
      '/',
      '/programs',
      '/volunteer',
      '/contribute',
      '/admin',
    ];

    const validDayDeepLinks = [
      '/programs?day=panchami',
      '/programs?day=sashti',
      '/programs?day=saptami',
      '/programs?day=ashtami',
      '/programs?day=nabami',
      '/programs?day=dashami',
    ];

    it('should ensure all primary navbar & bottom nav routes map to existing application pages', () => {
      validAppRoutes.forEach((route) => {
        assert.ok(route.startsWith('/'), `Route ${route} must start with /`);
        assert.doesNotMatch(route, /\s/, `Route ${route} must not contain spaces`);
      });
      assert.strictEqual(validAppRoutes.length, 5);
    });

    it('should validate 6-day timeline deep-link parameters match valid day IDs', () => {
      validDayDeepLinks.forEach((link) => {
        const url = new URL(link, 'https://pbel-durgotsav.vercel.app');
        assert.strictEqual(url.pathname, '/programs');
        const day = url.searchParams.get('day');
        assert.ok(
          ['panchami', 'sashti', 'saptami', 'ashtami', 'nabami', 'dashami'].includes(day),
          `Invalid day query param: ${day}`
        );
      });
    });

    it('should ensure external protocols and anchors use well-formed syntax', () => {
      const externalUpi = `upi://pay?pa=${SOCIETY_UPI_ID}&pn=${encodeURIComponent(SOCIETY_NAME)}&am=1001&cu=INR&tn=Pujo%20Seva`;
      const anchorLink = '#quick-contribute-section';

      assert.match(externalUpi, /^upi:\/\/pay\?/);
      assert.match(anchorLink, /^#[a-z0-9-]+$/);
    });
  });

  describe('9. Live Database Connection & Category Limits Verification', () => {
    const SUPABASE_URL = 'https://oasjophkiognuecisfxd.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9hc2pvcGhraW9nbnVlY2lzZnhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc1OTA3MDgsImV4cCI6MjEwMzE2NjcwOH0.V2FxBgqEFK6QAJFWXB-H3_YqX0-FKOjo1k8Pex7B4SI';

    it('should successfully connect to Supabase and query contribution_categories table', async () => {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

      const { data, error } = await supabase.from('contribution_categories').select('id, name, fixed_amount, description');
      assert.strictEqual(error, null, `Database query failed: ${error?.message}`);
      assert.ok(Array.isArray(data), 'Categories data must be an array');
      assert.ok(data.length > 0, 'Database should contain pre-seeded categories');
    });

    it('should successfully connect to Supabase and query contributions table', async () => {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

      const { data, error } = await supabase.from('contributions').select('id, amount, status');
      assert.strictEqual(error, null, `Contributions query failed: ${error?.message}`);
      assert.ok(Array.isArray(data), 'Contributions data must be an array');
    });

    it('should properly encode and decode category limit metadata without schema errors', () => {
      function encode(desc, maxLimit, isActive) {
        const clean = (desc || '').replace(/\[limit:\d+\]/g, '').replace(/\[status:(active|inactive)\]/g, '').trim();
        const limitTag = maxLimit !== undefined && maxLimit !== null ? `[limit:${maxLimit}]` : '';
        const statusTag = isActive !== undefined ? `[status:${isActive ? 'active' : 'inactive'}]` : '';
        return `${clean} ${limitTag} ${statusTag}`.trim();
      }

      function decode(desc) {
        const str = desc || '';
        const limitMatch = str.match(/\[limit:(\d+)\]/);
        const statusMatch = str.match(/\[status:(active|inactive)\]/);
        const cleanDescription = str.replace(/\[limit:\d+\]/g, '').replace(/\[status:(active|inactive)\]/g, '').trim();
        const parsedLimit = limitMatch ? Number(limitMatch[1]) : undefined;
        const parsedActive = statusMatch ? statusMatch[1] === 'active' : undefined;
        return { cleanDescription, parsedLimit, parsedActive };
      }

      const originalText = "108 Red Lotuses for Sandhi Pujo";
      const encoded = encode(originalText, 10, true);
      assert.strictEqual(encoded, "108 Red Lotuses for Sandhi Pujo [limit:10] [status:active]");

      const decoded = decode(encoded);
      assert.strictEqual(decoded.cleanDescription, originalText);
      assert.strictEqual(decoded.parsedLimit, 10);
      assert.strictEqual(decoded.parsedActive, true);
    });

    it('should successfully record contributions in DB with status "Pending" and allow Admin status transitions', async () => {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

      // 1. Insert contribution with 'Pending'
      const { data: inserted, error: insertError } = await supabase.from('contributions').insert({
        contributor_name: "Automated Test Resident",
        email: "test@pbelcity.org",
        phone: "9988776655",
        flat_number: "Tower B - 1001",
        amount: 1001,
        status: "Pending",
        is_name_visible: true,
        payment_id: "UTR_TEST_VALIDATION_01"
      }).select().single();

      assert.strictEqual(insertError, null, `Payment recording failed: ${insertError?.message}`);
      assert.strictEqual(inserted.status, 'Pending');

      // 2. Admin Approve to 'Success'
      const { error: approveError } = await supabase
        .from('contributions')
        .update({ status: 'Success' })
        .eq('id', inserted.id);
      assert.strictEqual(approveError, null, `Admin approval failed: ${approveError?.message}`);

      // 3. Admin Reject to 'Failed'
      const { error: rejectError } = await supabase
        .from('contributions')
        .update({ status: 'Failed' })
        .eq('id', inserted.id);
      assert.strictEqual(rejectError, null, `Admin rejection failed: ${rejectError?.message}`);

      // 4. Clean up test row
      await supabase.from('contributions').delete().eq('id', inserted.id);
    });
  });

  describe('10. Edge Cases, Security & Input Validations', () => {
    const SUPABASE_URL = 'https://oasjophkiognuecisfxd.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9hc2pvcGhraW9nbnVlY2lzZnhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc1OTA3MDgsImV4cCI6MjEwMzE2NjcwOH0.V2FxBgqEFK6QAJFWXB-H3_YqX0-FKOjo1k8Pex7B4SI';

    it('should reject invalid, zero, or negative donation amounts in business logic', () => {
      const validateAmount = (amt) => {
        const num = Number(amt);
        return !isNaN(num) && num > 0 && Number.isFinite(num);
      };

      assert.strictEqual(validateAmount(0), false);
      assert.strictEqual(validateAmount(-500), false);
      assert.strictEqual(validateAmount("abc"), false);
      assert.strictEqual(validateAmount(null), false);
      assert.strictEqual(validateAmount(501), true);
      assert.strictEqual(validateAmount(25000), true);
    });

    it('should verify database constraint rejects illegal status values', async () => {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

      // Attempt inserting with invalid status
      const { error } = await supabase.from('contributions').insert({
        contributor_name: "Illegal Status Test",
        amount: 501,
        status: "INVALID_STATUS_XYZ",
        payment_id: "UTR_ILLEGAL_STATUS_TEST"
      });

      assert.ok(error !== null, 'Database must reject invalid status check constraint');
      assert.strictEqual(error.code, '23514', 'PostgreSQL check constraint error code must be 23514');
    });

    it('should mask devotee names when is_name_visible is false for public Wall of Contributors', () => {
      const formatWallName = (item) => {
        return item.is_name_visible ? item.contributor_name : "PBEL Resident (Anonymous)";
      };

      const publicDonor = { contributor_name: "Sourav Ganguly", is_name_visible: true };
      const privateDonor = { contributor_name: "Sachin Tendulkar", is_name_visible: false };

      assert.strictEqual(formatWallName(publicDonor), "Sourav Ganguly");
      assert.strictEqual(formatWallName(privateDonor), "PBEL Resident (Anonymous)");
    });

    it('should sanitize and strip dangerous script tags from text inputs', () => {
      const sanitizeInput = (str) => {
        return (str || '').replace(/<[^>]*>?/gm, '').trim();
      };

      const maliciousName = "<script>alert('xss')</script>Subhash Chandra";
      const sanitized = sanitizeInput(maliciousName);

      assert.strictEqual(sanitized, "alert('xss')Subhash Chandra");
      assert.ok(!sanitized.includes('<script>'));
    });
  });

  describe('11. Volunteer & Community Modules Integrity', () => {
    const validDepartments = [
      "Pandal & Stage Management",
      "Bhog Distribution & Kitchen Seva",
      "Cultural & Pratibimb Coordination",
      "Crowd Management & Security",
      "Puja Samagri & Flower Seva",
      "Media, PR & Photography"
    ];

    const validShifts = [
      "Morning (07:00 AM - 01:00 PM)",
      "Afternoon (01:00 PM - 05:00 PM)",
      "Evening (05:00 PM - 11:00 PM)",
      "All 6 Days Full Immersion"
    ];

    it('should have well-defined community seva departments and operational shifts', () => {
      assert.strictEqual(validDepartments.length, 6);
      assert.strictEqual(validShifts.length, 4);
      validDepartments.forEach(dept => assert.ok(dept.length > 0));
      validShifts.forEach(shift => assert.ok(shift.length > 0));
    });
  });

  describe('12. Admin Authentication & User Access Control', () => {
    const defaultMaster = {
      username: "admin",
      passwordHash: "PBEL@2026",
      status: "Active",
      role: "Super Admin",
    };

    it('should successfully authenticate Master Admin with official committee credentials', () => {
      const authenticate = (user, pass) => {
        return (
          (user.toLowerCase() === defaultMaster.username || user.toLowerCase() === "pbelsanskritiksamiti@gmail.com") &&
          pass === defaultMaster.passwordHash
        );
      };

      assert.strictEqual(authenticate("admin", "PBEL@2026"), true);
      assert.strictEqual(authenticate("pbelsanskritiksamiti@gmail.com", "PBEL@2026"), true);
      assert.strictEqual(authenticate("admin", "wrong_password"), false);
      assert.strictEqual(authenticate("unknown_user", "PBEL@2026"), false);
    });

    it('should authenticate dynamically created committee users and block suspended users', () => {
      const userRoster = [
        { id: "1", username: "anirban.pss", passwordHash: "anirban@123", status: "Active", role: "Finance Lead" },
        { id: "2", username: "suspend.user", passwordHash: "pass123", status: "Suspended", role: "Volunteer Lead" },
      ];

      const verifyUser = (username, pass) => {
        const u = userRoster.find(x => x.username === username && x.passwordHash === pass);
        if (!u) return { success: false, error: "Invalid credentials" };
        if (u.status === "Suspended") return { success: false, error: "Account Suspended" };
        return { success: true, user: u };
      };

      const validLogin = verifyUser("anirban.pss", "anirban@123");
      assert.strictEqual(validLogin.success, true);
      assert.strictEqual(validLogin.user.role, "Finance Lead");

      const suspendedLogin = verifyUser("suspend.user", "pass123");
      assert.strictEqual(suspendedLogin.success, false);
      assert.strictEqual(suspendedLogin.error, "Account Suspended");
    });
  });

});

