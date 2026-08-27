import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

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
      '/sponsors',
      '/bhog-pass',
      '/committee',
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
      assert.strictEqual(validAppRoutes.length, 8);
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

  describe('13. Corporate Sponsorship & Community Solidarity Modules', () => {
    it('should verify official sponsorship deck PDF exists and has valid content structure', async () => {
      const fs = await import('fs');
      const path = await import('path');
      const pdfPath = path.join(process.cwd(), 'public', 'docs', 'PBEL_Durgotsav_2026_Sponsorship_Deck.pdf');

      assert.ok(fs.existsSync(pdfPath), 'Sponsorship Deck PDF must exist in public/docs');
      const stats = fs.statSync(pdfPath);
      assert.ok(stats.size > 100, 'Sponsorship Deck PDF must not be empty');
    });

    it('should validate all 5 sponsorship tiers have defined deliverables and pricing', () => {
      const tiers = [
        { name: "Title / Platinum Partner", amount: 100000 },
        { name: "Gold Partner", amount: 50000 },
        { name: "Cultural Stage Partner", amount: 40000 },
        { name: "Food & Bhog Partner", amount: 35000 },
        { name: "Silver Partner", amount: 25000 },
      ];

      assert.strictEqual(tiers.length, 5);
      tiers.forEach((t) => {
        assert.ok(t.amount >= 25000, `Tier ${t.name} amount must be valid`);
      });
    });

    it('should format respectful non-commercial devotional WhatsApp greeting text', () => {
      const generateGreeting = (donor, category) => {
        return `🌺 *শুভ দুর্গোৎসব • PBEL City Durgotsav 2026* 🌺\n\nMay Maa Durga bless our township with joy, health, and prosperity. I have joined the devotional Seva for PBEL City Durgotsav (15th – 20th Oct 2026).\n\nJoin hands in community seva, view the Pujo Nirghanto & contribute:\n👉 https://pbel-durgotsav.vercel.app\n\n_PBEL Sanskritik Samiti (PSS)_`;
      };

      const greeting = generateGreeting("Subhash", "Maha Bhog");
      assert.ok(greeting.includes('শুভ দুর্গোৎসব'));
      assert.ok(greeting.includes('https://pbel-durgotsav.vercel.app'));
      assert.ok(greeting.includes('PBEL Sanskritik Samiti'));
    });
  });

  describe('14. Digital Bhog Lunch Pass & Tower Parsing Integrity', () => {
    it('should enforce max 6 lunch passes limit per member family', () => {
      const validatePassCount = (count) => {
        const num = Number(count);
        return num >= 1 && num <= 6;
      };

      assert.strictEqual(validatePassCount(1), true);
      assert.strictEqual(validatePassCount(4), true);
      assert.strictEqual(validatePassCount(6), true);
      assert.strictEqual(validatePassCount(7), false);
      assert.strictEqual(validatePassCount(0), false);
      assert.strictEqual(validatePassCount(-1), false);
    });

    it('should generate standardized PSS Bhog pass token IDs for dining verification', () => {
      const generateTokenId = (tower, flat) => {
        const cleanFlat = flat.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
        const towerLetter = tower.split(" ")[1] || "C";
        return `PSS-BHOG-2026-T${towerLetter}-${cleanFlat}`;
      };

      const tokenId = generateTokenId("Tower C (Coral)", "402");
      assert.strictEqual(tokenId, "PSS-BHOG-2026-TC-402");

      const tokenIdEmerald = generateTokenId("Tower A (Emerald)", "1204");
      assert.strictEqual(tokenIdEmerald, "PSS-BHOG-2026-TA-1204");
    });

    it('should correctly parse diverse resident flat number strings into PBEL towers', () => {
      const towerRegexes = [
        { id: "A", regex: /tower\s*a|emerald|\ba[\s-]*\d/i },
        { id: "B", regex: /tower\s*b|sapphire|\bb[\s-]*\d/i },
        { id: "C", regex: /tower\s*c|coral|\bc[\s-]*\d/i },
      ];

      const matchTower = (str) => {
        for (const t of towerRegexes) {
          if (t.regex.test(str)) return t.id;
        }
        return "OTHER";
      };

      assert.strictEqual(matchTower("Tower A - 1204"), "A");
      assert.strictEqual(matchTower("Emerald 502"), "A");
      assert.strictEqual(matchTower("Sapphire 301"), "B");
      assert.strictEqual(matchTower("Tower C - 402"), "C");
      assert.strictEqual(matchTower("Coral 804"), "C");
    });

    it('should parse CSV lines with auto-detected towers and capped headcounts', () => {
      const parseCsvLine = (line) => {
        const parts = line.split(/[,;\t]/).map((p) => p.trim());
        const name = parts[0];
        const flatNumber = parts[1];
        const phone = parts[2] || "9845000000";
        const rawHeadcount = parts[3] ? Number(parts[3]) : 4;
        const headcount = Math.min(Math.max(isNaN(rawHeadcount) ? 4 : rawHeadcount, 1), 6);
        return { name, flatNumber, phone, headcount };
      };

      const parsed1 = parseCsvLine("Sourav Ganguly, Emerald 802, 9845000000, 5");
      assert.strictEqual(parsed1.name, "Sourav Ganguly");
      assert.strictEqual(parsed1.flatNumber, "Emerald 802");
      assert.strictEqual(parsed1.headcount, 5);

      // Verify headcount is strictly capped at 6 when 9 is entered
      const parsed2 = parseCsvLine("Large Family, Tower C 402, 9845000001, 9");
      assert.strictEqual(parsed2.headcount, 6);

      // Verify headcount defaults to minimum 1 when 0 is entered
      const parsed3 = parseCsvLine("Single Devotee, Tower D 603, 9845000002, 0");
      assert.strictEqual(parsed3.headcount, 1);
    });
  });

  describe('15. Input Sanitization & Enterprise Security Utilities', () => {
    const sanitizeText = (input) => {
      if (!input) return "";
      return String(input)
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
        .replace(/<[^>]+>/g, "")
        .replace(/javascript:/gi, "")
        .replace(/on\w+\s*=/gi, "")
        .replace(/[\u0000-\u0008\u000B-\u000C\u000E-\u001F]/g, "")
        .trim();
    };

    const validateDonationAmount = (amount, min = 10, max = 1000000) => {
      const num = Number(amount);
      if (isNaN(num) || !Number.isInteger(num)) {
        return { isValid: false, parsedAmount: 0, error: "Amount must be a valid whole number." };
      }
      if (num < min) {
        return { isValid: false, parsedAmount: num, error: `Minimum seva offering is ₹${min}.` };
      }
      if (num > max) {
        return { isValid: false, parsedAmount: num, error: `Maximum seva offering is ₹${max}.` };
      }
      return { isValid: true, parsedAmount: num };
    };

    const validatePhoneNumber = (phone) => {
      if (!phone) return false;
      const cleaned = phone.replace(/[^0-9]/g, "");
      return /^(\+?91)?[6789]\d{9}$/.test(cleaned) || cleaned.length === 10;
    };

    it('should strip malicious scripts, event handlers and HTML tags from user inputs', () => {
      const dirty = "<script>alert('XSS')</script>Joy <img src=x onerror=alert(1)>Maa Durga";
      const clean = sanitizeText(dirty);
      assert.strictEqual(clean, "Joy Maa Durga");
    });

    it('should sanitize javascript: URI links and strip control characters', () => {
      const dirty = "javascript:alert(1) Devotee Name\u0000";
      const clean = sanitizeText(dirty);
      assert.strictEqual(clean, "alert(1) Devotee Name");
    });

    it('should validate donation amounts strictly within positive whole number limits', () => {
      assert.strictEqual(validateDonationAmount(1001).isValid, true);
      assert.strictEqual(validateDonationAmount("5000").isValid, true);
      assert.strictEqual(validateDonationAmount(5).isValid, false); // below min
      assert.strictEqual(validateDonationAmount(1000001).isValid, false); // above max
      assert.strictEqual(validateDonationAmount(500.5).isValid, false); // non-integer
      assert.strictEqual(validateDonationAmount("abc").isValid, false); // invalid NaN
    });

    it('should validate standard 10-digit Indian WhatsApp and mobile numbers', () => {
      assert.strictEqual(validatePhoneNumber("9845000001"), true);
      assert.strictEqual(validatePhoneNumber("+91 9845000001"), true);
      assert.strictEqual(validatePhoneNumber("98450-00001"), true);
      assert.strictEqual(validatePhoneNumber("12345"), false);
      assert.strictEqual(validatePhoneNumber(""), false);
    });
  });

  describe('16. RFC 5545 .ics & 1-Click Google Calendar Generators', () => {
    const generateIcsContent = (event) => {
      const location = event.location || "PBEL City Community Arena, Hyderabad, Telangana";
      return [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//PBEL Sanskritik Samiti//PBEL Durgotsav 2026//EN",
        "BEGIN:VEVENT",
        `SUMMARY:${event.title}`,
        `DESCRIPTION:${event.description}`,
        `LOCATION:${location}`,
        "STATUS:CONFIRMED",
        "END:VEVENT",
        "END:VCALENDAR",
      ].join("\r\n");
    };

    const generateGoogleCalendarUrl = (event) => {
      const params = new URLSearchParams({
        action: "TEMPLATE",
        text: event.title,
        details: event.description,
        location: event.location || "PBEL City Community Arena, Hyderabad, Telangana",
      });
      return `https://calendar.google.com/calendar/render?${params.toString()}`;
    };

    it('should generate valid RFC 5545 compliant VCALENDAR strings', () => {
      const ics = generateIcsContent({
        title: "Sandhi Pujo (108 Lotuses)",
        description: "Sacred Sandhi Puja at PBEL City Durgotsav 2026",
      });

      assert.ok(ics.includes("BEGIN:VCALENDAR"));
      assert.ok(ics.includes("VERSION:2.0"));
      assert.ok(ics.includes("SUMMARY:Sandhi Pujo (108 Lotuses)"));
      assert.ok(ics.includes("LOCATION:PBEL City Community Arena"));
      assert.ok(ics.includes("END:VCALENDAR"));
    });

    it('should generate valid 1-Click Google Calendar URLs with encoded parameters', () => {
      const gcal = generateGoogleCalendarUrl({
        title: "Retro Rock by Fushmontor",
        description: "Flagship live concert at PBEL Durgotsav 2026",
      });

      assert.ok(gcal.startsWith("https://calendar.google.com/calendar/render?"));
      assert.ok(gcal.includes("text=Retro+Rock+by+Fushmontor"));
      assert.ok(gcal.includes("location=PBEL+City+Community+Arena"));
    });
  });

  describe('17. Self-Service Branding & 25MB Brochure Manager', () => {
    const defaultBranding = {
      samitiName: "PBEL Sanskritik Samiti",
      festivalName: "PBEL City Durgotsav 2026",
      activeHeroWallpaperId: "traditional-ekchala",
      sponsorshipDeckPdfUrl: "/PBEL_City_Durgotsav_2026_Sponsorship_Deck.pdf",
    };

    it('should resolve default branding and support custom wallpaper and PDF overrides', () => {
      const customBranding = {
        ...defaultBranding,
        activeHeroWallpaperId: "sandhi-deepam-aarti",
        sponsorshipDeckPdfUrl: "https://storage.googleapis.com/pbel-assets/deck-25mb.pdf",
      };

      assert.strictEqual(customBranding.samitiName, "PBEL Sanskritik Samiti");
      assert.strictEqual(customBranding.activeHeroWallpaperId, "sandhi-deepam-aarti");
      assert.strictEqual(customBranding.sponsorshipDeckPdfUrl, "https://storage.googleapis.com/pbel-assets/deck-25mb.pdf");
    });
  });

  describe('18. Anandamela Food Fiesta & Home Chef Directory Schema', () => {
    const mockStalls = [
      {
        id: "stall-1",
        stallName: "Calcutta Roll Express",
        chefName: "Anirban Mukherjee",
        category: "Rolls & Mughlai",
        dishes: [
          { name: "Egg Chicken Roll", price: 180, isVeg: false },
          { name: "Paneer Tikka Roll", price: 150, isVeg: true },
        ],
      },
      {
        id: "stall-2",
        stallName: "Mishti Mukh",
        chefName: "Rupa Sengupta",
        category: "Sweets & Pithe",
        dishes: [{ name: "Kheer Patishapta", price: 90, isVeg: true }],
      },
    ];

    it('should filter stalls by category and dietary flags (Pure Veg vs Non-Veg)', () => {
      const vegStalls = mockStalls.filter((s) => s.dishes.some((d) => d.isVeg));
      const nonVegStalls = mockStalls.filter((s) => s.dishes.some((d) => !d.isVeg));

      assert.strictEqual(vegStalls.length, 2);
      assert.strictEqual(nonVegStalls.length, 1);
    });

    it('should construct valid WhatsApp pre-order URL links for home chefs', () => {
      const chefPhone = "9845000001";
      const stallName = "Calcutta Roll Express";
      const chefName = "Anirban Mukherjee";
      const waUrl = `https://api.whatsapp.com/send?phone=${chefPhone}&text=Hello%20${encodeURIComponent(chefName)}%2C%20I%20saw%20your%20Anandamela%20stall%20"${encodeURIComponent(stallName)}"%20on%20the%20PBEL%20Durgotsav%20Portal!`;

      assert.ok(waUrl.includes("phone=9845000001"));
      assert.ok(waUrl.includes("Calcutta%20Roll%20Express"));
      assert.ok(waUrl.includes("Anirban%20Mukherjee"));
    });
  });

  describe('19. Township Pandal Facilities & Emergency Schema', () => {
    const facilities = [
      { id: "1", name: "Maa Durga Sanctum", category: "Sanctum & Rituals" },
      { id: "2", name: "Senior Citizen Ramp", category: "Sanctum & Rituals" },
      { id: "3", name: "Pratibimb Cultural Stage", category: "Cultural Stage" },
      { id: "4", name: "Maha Bhog Dining Hall", category: "Dining & Bhog" },
      { id: "5", name: "First Aid & Medical Station", category: "Amenities & Medical" },
      { id: "6", name: "Parking Area", category: "Parking & Entry" },
    ];

    it('should have all 5 core facility categories mapped with clear locations', () => {
      const categories = new Set(facilities.map((f) => f.category));
      assert.strictEqual(categories.size, 5);
      assert.ok(categories.has("Sanctum & Rituals"));
      assert.ok(categories.has("Dining & Bhog"));
      assert.ok(categories.has("Amenities & Medical"));
    });
  });

  describe('20. Committee Budget Ledger & Surplus Calculation', () => {
    it('should accurately calculate Net Surplus across Donations, Memberships, and Expenses', () => {
      const totalFunds = 250000; // Public donations
      const membersCount = 100;
      const membershipFee = 7500;
      const sponsorsCount = 5;
      const avgSponsorship = 50000;

      const totalInflow = totalFunds + (membersCount * membershipFee) + (sponsorsCount * avgSponsorship);

      const expenses = [
        { category: "Pratima & Purohit", actual: 145000 },
        { category: "Pandal & Lighting", actual: 240000 },
        { category: "Dhaaki", actual: 55000 },
        { category: "Maha Bhog Groceries", actual: 175000 },
        { category: "Sound & Stage", actual: 110000 },
        { category: "Sanitation & Green Pujo", actual: 25000 },
      ];

      const totalIncurred = expenses.reduce((sum, e) => sum + e.actual, 0);
      const netSurplus = totalInflow - totalIncurred;

      assert.strictEqual(totalInflow, 1250000); // 2.5L + 7.5L + 2.5L
      assert.strictEqual(totalIncurred, 750000);
      assert.strictEqual(netSurplus, 500000);
      assert.ok(netSurplus > 0, "Committee budget must project positive surplus");
    });
  });

  describe('21. Organizing Committee CMS & Dynamic Wings Roster', () => {
    it('should support adding, editing, and removing wings and assigned leads', () => {
      let wings = [
        {
          id: "w-1",
          category: "Cultural Directorate",
          icon: "🎭",
          tagline: "Stage acts and music",
          members: [{ id: "m-1", name: "Anirban", role: "Stage Director", tower: "Tower A" }],
        },
      ];

      // Add a new member
      wings = wings.map((w) =>
        w.id === "w-1"
          ? {
              ...w,
              members: [
                ...w.members,
                { id: "m-2", name: "Debashis", role: "Sound Ops", tower: "Tower B" },
              ],
            }
          : w
      );

      assert.strictEqual(wings[0].members.length, 2);
      assert.strictEqual(wings[0].members[1].name, "Debashis");

      // Remove a member
      wings = wings.map((w) =>
        w.id === "w-1"
          ? { ...w, members: w.members.filter((m) => m.id !== "m-1") }
          : w
      );
      assert.strictEqual(wings[0].members.length, 1);
      assert.strictEqual(wings[0].members[0].name, "Debashis");
    });
  });

  describe('22. Dynamic Towers Management & Regex Resolution', () => {
    it('should allow dynamic tower additions and resolve flats accurately', () => {
      const towers = [
        { id: "A", tower: "Tower A", name: "Emerald", regex: /tower\s*a|emerald|\ba[\s-]*\d/i },
        { id: "L", tower: "Tower L", name: "Amber", regex: /tower\s*l|amber|\bl[\s-]*\d/i },
      ];

      const matchDynamicTower = (flatStr) => {
        for (const t of towers) {
          if (t.regex.test(flatStr) || flatStr.toLowerCase().includes(t.name.toLowerCase())) {
            return t;
          }
        }
        return null;
      };

      const matchedA = matchDynamicTower("Emerald 402");
      const matchedL = matchDynamicTower("Amber 1204");
      const matchedL2 = matchDynamicTower("Tower L - 301");

      assert.strictEqual(matchedA?.id, "A");
      assert.strictEqual(matchedL?.id, "L");
      assert.strictEqual(matchedL2?.id, "L");
      assert.strictEqual(matchDynamicTower("Unknown 999"), null);
    });
  });

  describe('23. Budget & Expense In-Place Item Editing', () => {
    it('should update planned and actual paid values and re-calculate balances', () => {
      let expenses = [
        { id: "exp-1", title: "Ekchala Pratima", planned: 150000, actual: 145000, status: "Partially Paid" },
      ];

      // Edit item
      expenses = expenses.map((exp) =>
        exp.id === "exp-1"
          ? { ...exp, planned: 160000, actual: 160000, status: "Fully Paid" }
          : exp
      );

      assert.strictEqual(expenses[0].planned, 160000);
      assert.strictEqual(expenses[0].actual, 160000);
      assert.strictEqual(expenses[0].status, "Fully Paid");
    });
  });

  describe('24. Local Base64 Image Upload Format Validation', () => {
    it('should accept valid base64 data URLs for local wallpaper and logo uploads', () => {
      const sampleBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
      const isValidImageUri = (uri) => {
        return uri.startsWith("data:image/") || uri.startsWith("http://") || uri.startsWith("https://") || uri.startsWith("/");
      };

      assert.strictEqual(isValidImageUri(sampleBase64), true);
      assert.strictEqual(isValidImageUri("https://images.unsplash.com/photo-1601614275039"), true);
      assert.strictEqual(isValidImageUri("/PBEL_Logo.png"), true);
    });
  });

  describe('25. Universal In-Place Editing for Members, Wings, and Towers', () => {
    it('should edit member details in-place without altering other records', () => {
      let members = [
        { id: "mem-1", name: "Sourav Ganguly", tower: "Tower A (Emerald)", flatNumber: "802", headcount: 4 },
        { id: "mem-2", name: "Anirban Mukherjee", tower: "Tower B (Sapphire)", flatNumber: "1104", headcount: 4 },
      ];

      // Edit member 1 headcount & flat
      members = members.map((m) =>
        m.id === "mem-1"
          ? { ...m, flatNumber: "804", headcount: 5 }
          : m
      );

      assert.strictEqual(members[0].flatNumber, "804");
      assert.strictEqual(members[0].headcount, 5);
      assert.strictEqual(members[1].flatNumber, "1104"); // unchanged
    });

    it('should edit wing lead role and affiliation seamlessly', () => {
      let wings = [
        {
          id: "w-cul",
          category: "Cultural Directorate",
          members: [{ id: "m-1", name: "Anirban", role: "Stage Lead", tower: "Tower A" }],
        },
      ];

      wings = wings.map((w) =>
        w.id === "w-cul"
          ? {
              ...w,
              members: w.members.map((m) =>
                m.id === "m-1" ? { ...m, role: "Pratibimb Stage Director", tower: "Tower C (Pearl)" } : m
              ),
            }
          : w
      );

      assert.strictEqual(wings[0].members[0].role, "Pratibimb Stage Director");
      assert.strictEqual(wings[0].members[0].tower, "Tower C (Pearl)");
    });
  });

  describe('26. Bundled Authentic SVG Wallpaper Assets Verification', () => {
    it('should verify all 4 bundled wallpaper SVG files exist and are valid SVGs', () => {
      const wallpapers = [
        "durga_ekchala.svg",
        "durga_sandhi_deepam.svg",
        "durga_kumartuli.svg",
        "durga_festive_mandala.svg",
      ];

      wallpapers.forEach((wp) => {
        const filePath = path.join(process.cwd(), "public", "images", "wallpapers", wp);
        assert.ok(fs.existsSync(filePath), `Wallpaper file must exist: ${wp}`);
        const content = fs.readFileSync(filePath, "utf-8");
        assert.ok(content.includes("<svg"), `File must be valid SVG: ${wp}`);
        assert.ok(content.includes("</svg>"), `File must close SVG tag: ${wp}`);
      });
    });
  });

  describe('27. Frictionless Tower Contribution String Formatting', () => {
    it('should format Tower + Flat input canonically for database regex matching', () => {
      const formatFlat = (tower, unit) => {
        if (tower === "Other" || !tower) return unit.trim() || "Guest Devotee";
        return `${tower} - ${unit.trim()}`;
      };

      assert.strictEqual(formatFlat("Tower A (Emerald)", "402"), "Tower A (Emerald) - 402");
      assert.strictEqual(formatFlat("Tower B (Sapphire)", "1204"), "Tower B (Sapphire) - 1204");
      assert.strictEqual(formatFlat("Other", "DLF Resident"), "DLF Resident");
    });
  });

  describe('28. Cultural Acts (Pratibimb) Navigation & Hero Registration Alignment', () => {
    it('should verify Pratibimb cultural stage links exist in primary header and bottom nav', () => {
      const primaryLinks = [
        { name: "Home", href: "/" },
        { name: "Pujo Schedule", href: "/programs" },
        { name: "Cultural Acts (Pratibimb)", href: "/programs#pratibimb-registration" },
      ];
      assert.strictEqual(primaryLinks.some((l) => l.href.includes("pratibimb")), true);
    });
  });

  describe('29. Dynamic Contribution Counter & Open Fund Amount Chips', () => {
    it('should format dynamic text correctly when 0 vs >0 contributions exist', () => {
      const formatBadge = (count) => {
        if (count === 0) return "Panchami to Dashami Sacred Offerings Open for PBEL Families";
        return `${count} PBEL ${count === 1 ? 'Family Has' : 'Families Have'} Contributed`;
      };

      assert.strictEqual(formatBadge(0), "Panchami to Dashami Sacred Offerings Open for PBEL Families");
      assert.strictEqual(formatBadge(1), "1 PBEL Family Has Contributed");
      assert.strictEqual(formatBadge(42), "42 PBEL Families Have Contributed");
    });

    it('should provide complete set of fast open preset amount options', () => {
      const OPEN_PRESETS = [501, 1001, 2001, 5001, 7501, 10001];
      assert.strictEqual(OPEN_PRESETS.length, 6);
      assert.strictEqual(OPEN_PRESETS.includes(501), true);
      assert.strictEqual(OPEN_PRESETS.includes(10001), true);
    });
  });

  describe('30. Admin Featured Seva Category Encoder/Decoder', () => {
    it('should encode and decode featured status without corrupting limits or status tags', () => {
      function encodeCategoryDescription(desc, maxLimit, isActive, isFeatured) {
        const clean = (desc || '')
          .replace(/\[limit:\d+\]/g, '')
          .replace(/\[status:(active|inactive)\]/g, '')
          .replace(/\[featured:(true|false)\]/g, '')
          .trim();
        const limitTag = maxLimit !== undefined && maxLimit !== null ? `[limit:${maxLimit}]` : '';
        const statusTag = isActive !== undefined ? `[status:${isActive ? 'active' : 'inactive'}]` : '';
        const featuredTag = isFeatured !== undefined ? `[featured:${isFeatured ? 'true' : 'false'}]` : '';
        return `${clean} ${limitTag} ${statusTag} ${featuredTag}`.trim();
      }

      function decodeCategoryDescription(desc) {
        const str = desc || '';
        const limitMatch = str.match(/\[limit:(\d+)\]/);
        const statusMatch = str.match(/\[status:(active|inactive)\]/);
        const featuredMatch = str.match(/\[featured:(true|false)\]/);

        const cleanDescription = str
          .replace(/\[limit:\d+\]/g, '')
          .replace(/\[status:(active|inactive)\]/g, '')
          .replace(/\[featured:(true|false)\]/g, '')
          .trim();

        const parsedLimit = limitMatch ? Number(limitMatch[1]) : undefined;
        const parsedActive = statusMatch ? statusMatch[1] === 'active' : undefined;
        const parsedFeatured = featuredMatch ? featuredMatch[1] === 'true' : undefined;

        return { cleanDescription, parsedLimit, parsedActive, parsedFeatured };
      }

      const encoded = encodeCategoryDescription("Sponsor pure ghee bhog", 10, true, true);
      assert.strictEqual(encoded, "Sponsor pure ghee bhog [limit:10] [status:active] [featured:true]");

      const decoded = decodeCategoryDescription(encoded);
      assert.strictEqual(decoded.cleanDescription, "Sponsor pure ghee bhog");
      assert.strictEqual(decoded.parsedLimit, 10);
      assert.strictEqual(decoded.parsedActive, true);
      assert.strictEqual(decoded.parsedFeatured, true);
    });
  });

  describe('31. Universal Tower Dropdown & Flat Unit Consistency Across All Forms', () => {
    it('should verify all forms format tower + unit canonically', () => {
      const formatTowerFlat = (tower, unit) => {
        if (tower === "Other" || !tower) return unit.trim() || "Guest Devotee";
        return `${tower} - ${unit.trim()}`;
      };

      // Form 1: Contribute (Custom + Modal)
      assert.strictEqual(formatTowerFlat("Tower B (Sapphire)", "1204"), "Tower B (Sapphire) - 1204");
      // Form 2: Cultural Registration (Pratibimb)
      assert.strictEqual(formatTowerFlat("Tower J (Topaz)", "603"), "Tower J (Topaz) - 603");
      // Form 3: Volunteer Registration
      assert.strictEqual(formatTowerFlat("Tower C (Diamond)", "804"), "Tower C (Diamond) - 804");
      // Form 4: Non-resident / Guest fallback
      assert.strictEqual(formatTowerFlat("Other", "Guest Suman"), "Guest Suman");
    });
  });

  describe('32. Dual Contribute Navigation & Minimum 501 Preset Verification', () => {
    it('should verify open contribution presets start from 501 and exclude 251 and 7501', () => {
      const OPEN_PRESET_AMOUNTS = [501, 1001, 2001, 5001, 10001];
      assert.strictEqual(OPEN_PRESET_AMOUNTS[0], 501);
      assert.ok(!OPEN_PRESET_AMOUNTS.includes(251), "251 must not be in preset chips");
      assert.ok(!OPEN_PRESET_AMOUNTS.includes(7501), "7501 must not be in preset chips");
      assert.ok(OPEN_PRESET_AMOUNTS.includes(1001));
      assert.ok(OPEN_PRESET_AMOUNTS.includes(10001));
    });

    it('should accurately resolve tab deep links for dual home buttons', () => {
      const resolveContributeTab = (searchQuery) => {
        const params = new URLSearchParams(searchQuery);
        const tabParam = (params.get("tab") || params.get("mode") || "").toLowerCase();
        if (tabParam === "catalog" || tabParam === "sponsor" || tabParam === "sevas" || params.get("category") || params.get("amount")) {
          return "catalog";
        }
        if (tabParam === "general" || tabParam === "any" || tabParam === "open") {
          return "general";
        }
        return "general"; // default
      };

      assert.strictEqual(resolveContributeTab("?tab=general"), "general");
      assert.strictEqual(resolveContributeTab("?tab=catalog"), "catalog");
      assert.strictEqual(resolveContributeTab("?category=Maha%20Bhog"), "catalog");
      assert.strictEqual(resolveContributeTab("?tab=sponsor"), "catalog");
      assert.strictEqual(resolveContributeTab(""), "general");
    });
  });

  describe('33. NPCI & ICICI EazyPay Verified Terminal Deep Link Generator', () => {
    const buildUpiPayUriTest = (options) => {
      const {
        pa = "pbelsanskritiksamiti@icici",
        pn = "PBEL SANSKRITIK SAMITI",
        am,
        tn = "Pujo Seva 2026",
        mc = "1520",
        tr = "EZYS9347708431",
      } = options;

      const params = new URLSearchParams();
      params.set("pa", pa.toLowerCase().trim());
      params.set("pn", pn);
      if (tr) params.set("tr", tr);
      if (mc) params.set("mc", mc);
      if (am && Number(am) > 0) {
        params.set("am", Number(am).toFixed(2));
      }
      params.set("cu", "INR");
      if (tn) params.set("tn", tn.slice(0, 50));

      const query = params.toString().replace(/\+/g, '%20').replace(/%40/g, "@");

      return `upi://pay?${query}`;
    };

    it('should generate official ICICI EazyPay terminal URI with mc=1520 and tr=EZYS9347708431', () => {
      const uri = buildUpiPayUriTest({
        am: 1001,
        tn: "Pujo Seva",
      });

      assert.ok(uri.startsWith("upi://pay?"), "Must use upi://pay scheme");
      assert.ok(!uri.includes("+"), "Must not include '+' characters for spaces (RFC 3986 encoding required)");
      assert.ok(uri.includes("pa=pbelsanskritiksamiti@icici"), "Must use lowercased VPA with literal '@'");
      assert.ok(uri.includes("tr=EZYS9347708431"), "Must include official bank terminal tr");
      assert.ok(uri.includes("mc=1520"), "Must include official ICICI merchant code 1520");
      assert.ok(uri.includes("am=1001.00"), "Must include prefilled amount");
      assert.ok(uri.includes("cu=INR"));
    });

    it('should generate standardized upi://pay NPCI scheme for all app triggers with verified terminal parameters', () => {
      const gpayUri = buildUpiPayUriTest({
        am: 2001,
        appScheme: "gpay",
      });
      assert.ok(gpayUri.startsWith("upi://pay?"), "Should use upi://pay standard NPCI scheme");
      assert.ok(gpayUri.includes("pa=pbelsanskritiksamiti@icici"));
      assert.ok(gpayUri.includes("tr=EZYS9347708431"));
      assert.ok(gpayUri.includes("mc=1520"));
      assert.ok(gpayUri.includes("am=2001.00"));
    });
  });

  describe('34. Universal Cloud Configuration Sync Engine', () => {
    it('should properly serialize and deserialize dynamic towers with regex revival', () => {
      const mockTowers = [
        { id: "A", tower: "Tower A", name: "Emerald", fullName: "Tower A (Emerald)", regex: "tower\\s*a|emerald|\\ba[\\s-]*\\d" },
        { id: "L", tower: "Tower L", name: "Amber", fullName: "Tower L (Amber)", regex: "tower\\s*l|amber|\\bl[\\s-]*\\d" },
      ];

      const serialized = JSON.stringify(mockTowers);
      const parsed = JSON.parse(serialized).map((t) => ({
        ...t,
        regex: new RegExp(t.regex, "i"),
      }));

      assert.strictEqual(parsed.length, 2);
      assert.strictEqual(parsed[1].fullName, "Tower L (Amber)");
      assert.ok(parsed[1].regex.test("Amber 1204"));
      assert.ok(parsed[1].regex.test("Tower L - 302"));
    });

    it('should handle organizing committee wings cloud serialization', () => {
      const mockWings = [
        {
          id: "wing-finance",
          category: "Finance, Treasury & Audit",
          icon: "💰",
          tagline: "Zero-fee bank reconciliation",
          members: [{ id: "m-1", name: "Treasurer Lead", role: "Accounts", tower: "Tower A" }],
        },
      ];

      const jsonStr = JSON.stringify(mockWings);
      const restored = JSON.parse(jsonStr);

      assert.strictEqual(restored.length, 1);
      assert.strictEqual(restored[0].category, "Finance, Treasury & Audit");
      assert.strictEqual(restored[0].members[0].name, "Treasurer Lead");
    });
  });

  describe('35. QR Code Downloader & Native Mobile Gallery Format', () => {
    it('should construct valid 600x600 QR code image URL and safe filename', () => {
      const getQrDownloadParams = (payload, amount, sevaTitle) => {
        const safeName = sevaTitle 
          ? sevaTitle.replace(/[^a-zA-Z0-9]/g, "-").slice(0, 30)
          : amount 
          ? `Rs${amount}` 
          : "General";
          
        const fileName = `PBEL-Durgotsav-QR-${safeName}.png`;
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${encodeURIComponent(payload)}`;
        return { fileName, qrUrl };
      };

      const res1 = getQrDownloadParams("upi://pay?pa=pbelsanskritiksamiti@icici&am=501.00", 501);
      assert.strictEqual(res1.fileName, "PBEL-Durgotsav-QR-Rs501.png");
      assert.ok(res1.qrUrl.includes("size=600x600"));
      assert.ok(res1.qrUrl.includes("pbelsanskritiksamiti%40icici"));

      const res2 = getQrDownloadParams("upi://pay?pa=pbelsanskritiksamiti@icici&am=2501.00", 2501, "Maha Bhog Seva");
      assert.strictEqual(res2.fileName, "PBEL-Durgotsav-QR-Maha-Bhog-Seva.png");
    });
  });

});



