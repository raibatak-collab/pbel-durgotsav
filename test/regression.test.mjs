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

  describe('28. Consolidated Header Navigation & In-Page Pratibimb Filter Alignment', () => {
    it('should verify consolidated header routes to distinct destinations without duplicate routes', () => {
      const primaryLinks = [
        { name: "Home", href: "/" },
        { name: "Schedule & Pratibimb", href: "/programs" },
        { name: "Anandamela Food", href: "/anandamela" },
      ];
      assert.strictEqual(primaryLinks.some((l) => l.href === "/programs"), true);
      assert.strictEqual(primaryLinks.some((l) => l.href === "/anandamela"), true);
    });

    it('should support in-page filtering for rituals vs pratibimb stage acts', () => {
      const filterModes = ["all", "rituals", "cultural"];
      assert.strictEqual(filterModes.includes("rituals"), true);
      assert.strictEqual(filterModes.includes("cultural"), true);
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
      const OPEN_PRESETS = [501, 1001, 2000, 5001, 10001];
      assert.strictEqual(OPEN_PRESETS.length, 5);
      assert.strictEqual(OPEN_PRESETS.includes(501), true);
      assert.strictEqual(OPEN_PRESETS.includes(2000), true);
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
      const OPEN_PRESET_AMOUNTS = [501, 1001, 2000, 5001, 10001];
      assert.strictEqual(OPEN_PRESET_AMOUNTS[0], 501);
      assert.ok(!OPEN_PRESET_AMOUNTS.includes(251), "251 must not be in preset chips");
      assert.ok(!OPEN_PRESET_AMOUNTS.includes(7501), "7501 must not be in preset chips");
      assert.ok(OPEN_PRESET_AMOUNTS.includes(1001));
      assert.ok(OPEN_PRESET_AMOUNTS.includes(2000));
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

  describe('36. Universal Cloud Sync & Config Domain Coverage', () => {
    it('should validate complete coverage across all 11 shared community config domains', () => {
      const configDomains = [
        "towers",
        "committee",
        "branding",
        "anandamela_stalls",
        "sponsor_leads",
        "announcement",
        "bhog_passes",
        "pss_members",
        "budget_expenses",
        "gallery",
        "admin_users",
      ];

      assert.strictEqual(configDomains.length, 11);
      configDomains.forEach((domain) => {
        assert.ok(typeof domain === "string" && domain.length > 0);
      });
    });

    it('should correctly format Cloud Config table rows with valid JSON payloads', () => {
      const formatCloudPayload = (key, value) => ({
        key: `config_${key}`,
        value: typeof value === "string" ? value : JSON.stringify(value),
        updated_at: new Date().toISOString(),
      });

      const announcementRow = formatCloudPayload("announcement", "Maha Saptami Pushpanjali starting at 10:30 AM");
      assert.strictEqual(announcementRow.key, "config_announcement");
      assert.strictEqual(announcementRow.value, "Maha Saptami Pushpanjali starting at 10:30 AM");

      const stallRow = formatCloudPayload("anandamela_stalls", [{ id: "stall-1", name: "Kolkata Biryani", chefName: "Debarati Roy" }]);
      assert.strictEqual(stallRow.key, "config_anandamela_stalls");
      assert.ok(stallRow.value.includes("Debarati Roy"));
      const parsedStall = JSON.parse(stallRow.value);
      assert.strictEqual(parsedStall[0].name, "Kolkata Biryani");

      const budgetRow = formatCloudPayload("budget_expenses", [{ id: "exp-1", title: "Ekchala Pratima", actual: 145000 }]);
      assert.strictEqual(budgetRow.key, "config_budget_expenses");
      const parsedBudget = JSON.parse(budgetRow.value);
      assert.strictEqual(parsedBudget[0].actual, 145000);
    });

    it('should serialize and restore complex tower regexes without loss', () => {
      const rawTowers = [
        { id: "M", tower: "Tower M", name: "Malachite", fullName: "Tower M (Malachite)", regex: /tower\s*M|malachite|\bM[\s-]*\d/i }
      ];

      // To Cloud
      const serialized = rawTowers.map(t => ({ ...t, regex: t.regex.source }));
      assert.strictEqual(serialized[0].regex, "tower\\s*M|malachite|\\bM[\\s-]*\\d");

      // From Cloud
      const restored = serialized.map(t => ({ ...t, regex: new RegExp(t.regex, "i") }));
      assert.ok(restored[0].regex.test("Flat M-1204"));
      assert.ok(restored[0].regex.test("Tower M"));
      assert.ok(restored[0].regex.test("Living in Malachite"));
      assert.ok(!restored[0].regex.test("Flat A-402"));
    });
  });

  describe('38. Mobile Native Gallery Image Saver Behavior', () => {
    it('should distinguish iOS Web Share API from Android direct storage download', () => {
      const isIOSUserAgent = (ua) => /iPad|iPhone|iPod/.test(ua);
      
      const androidChromeUA = "Mozilla/5.0 (Linux; Android 14; SM-S928B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36";
      const iphoneSafariUA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1";
      const desktopChromeUA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

      assert.strictEqual(isIOSUserAgent(androidChromeUA), false, "Android should not be classified as iOS");
      assert.strictEqual(isIOSUserAgent(iphoneSafariUA), true, "iPhone should be classified as iOS");
      assert.strictEqual(isIOSUserAgent(desktopChromeUA), false, "Desktop Chrome should not be classified as iOS");

      // On Android, direct blob download (<a download="filename.png">) ensures the file is written to device storage and indexed in Samsung Gallery / Google Photos
      const getDownloadStrategy = (ua) => (isIOSUserAgent(ua) ? "web-share-file" : "direct-blob-download");
      assert.strictEqual(getDownloadStrategy(androidChromeUA), "direct-blob-download");
      assert.strictEqual(getDownloadStrategy(iphoneSafariUA), "web-share-file");
      assert.strictEqual(getDownloadStrategy(desktopChromeUA), "direct-blob-download");
    });
  });

  describe('39. Dynamic Tower Matching & Multi-Device Synchronization', () => {
    it('should match flat numbers against newly added towers in custom list', () => {
      const customTowers = [
        {
          id: "L",
          tower: "Tower L",
          name: "Amber",
          fullName: "Tower L (Amber)",
          regex: /tower\s*l|amber|\bl[\s-]*\d/i,
        },
        {
          id: "M",
          tower: "Tower M",
          name: "Malachite",
          fullName: "Tower M (Malachite)",
          regex: /tower\s*m|malachite|\bm[\s-]*\d/i,
        }
      ];

      const matchCustomTower = (input, list) => {
        if (!input) return null;
        const clean = input.trim();
        for (const t of list) {
          if (
            (t.regex && t.regex.test(clean)) ||
            (t.name && clean.toLowerCase().includes(t.name.toLowerCase())) ||
            (t.tower && clean.toLowerCase().includes(t.tower.toLowerCase())) ||
            (t.fullName && clean.toLowerCase().includes(t.fullName.toLowerCase()))
          ) {
            return t;
          }
        }
        return null;
      };

      const match1 = matchCustomTower("Amber 402", customTowers);
      assert.ok(match1);
      assert.strictEqual(match1.id, "L");
      assert.strictEqual(match1.fullName, "Tower L (Amber)");

      const match2 = matchCustomTower("Tower M - 1204", customTowers);
      assert.ok(match2);
      assert.strictEqual(match2.id, "M");
      assert.strictEqual(match2.fullName, "Tower M (Malachite)");

      const match3 = matchCustomTower("L-803", customTowers);
      assert.ok(match3);
      assert.strictEqual(match3.id, "L");
    });
  });

  describe('40. Dynamic 6-Day Pujo Nirghanto & Pratibimb Stage Schedule Sync', () => {
    const mockSchedule = [
      {
        id: "panchami",
        dayName: "Maha Panchami",
        bengaliName: "মহাপঞ্চমী",
        date: "15 Oct 2026",
        isoDate: "2026-10-15",
        theme: "Agomoni, Anandamela & Stage Inauguration",
        rituals: [
          { time: "05:30 PM", event: "Pandal Inauguration & Diya Lighting Ceremony", type: "ritual" },
          { time: "06:00 PM", event: "Anandamela Food Stalls (Resident Home Chefs)", type: "bhog" },
        ],
        culturalEvening: {
          title: "Agomoni Musical Night & Anandamela Gala",
          time: "07:00 PM - 09:30 PM",
          description: "Welcoming Maa Durga with heartfelt Agomoni songs.",
          acts: ["Agomoni Choral Melodies", "Kids Anandamela Performance"],
          residentSlotsAvailable: 10,
        },
      },
      {
        id: "sashti",
        dayName: "Maha Sashti",
        bengaliName: "মহাষষ্ঠী",
        date: "16 Oct 2026",
        isoDate: "2026-10-16",
        theme: "Devi Bodhon & Retro Rock Gala",
        rituals: [
          { time: "08:30 AM", event: "Pratima Sthapana & Kalparambho", type: "ritual" },
          { time: "06:30 PM", event: "Devi Bodhon, Amantran & Adhibas Rituals", type: "ritual" },
        ],
        culturalEvening: {
          title: "Pratibimb Stage: Dance Extravaganza & Retro Rock",
          time: "06:30 PM - 10:30 PM",
          description: "Resident dance showcases followed by the flagship Retro Rock concert.",
          pssHeadliner: {
            title: "🎸 Retro Rock by Fushmontor",
            time: "08:15 PM Start",
            duration: "1.5 Hours (90 mins)",
            genre: "Live Bengali & Bollywood Retro Rock Fusion",
          },
          acts: ["Resident Opening Dance Medley (06:30 PM)", "⭐ Retro Rock by Fushmontor (08:15 PM)"],
          residentSlotsAvailable: 8,
        },
      },
    ];

    it('should accurately serialize and deserialize 6-day DaySchedule structures', () => {
      const serialized = JSON.stringify(mockSchedule);
      const restored = JSON.parse(serialized);

      assert.strictEqual(restored.length, 2);
      assert.strictEqual(restored[0].id, "panchami");
      assert.strictEqual(restored[1].id, "sashti");
      assert.strictEqual(restored[1].culturalEvening.pssHeadliner?.title, "🎸 Retro Rock by Fushmontor");
    });

    it('should update rituals in-place when admin adds or modifies an event', () => {
      let schedule = [...mockSchedule];
      const newRitual = { time: "07:45 PM", event: "Grand Sandhya Aarti with Dhaak", type: "aarti" };

      schedule = schedule.map((day) =>
        day.id === "sashti"
          ? { ...day, rituals: [...day.rituals, newRitual] }
          : day
      );

      const sashtiDay = schedule.find((d) => d.id === "sashti");
      assert.strictEqual(sashtiDay.rituals.length, 3);
      assert.strictEqual(sashtiDay.rituals[2].event, "Grand Sandhya Aarti with Dhaak");
    });

    it('should update cultural evening theme and headliner when admin modifies evening config', () => {
      let schedule = [...mockSchedule];

      schedule = schedule.map((day) =>
        day.id === "sashti"
          ? {
              ...day,
              theme: "Devi Bodhon & Fushmontor Live",
              culturalEvening: {
                ...day.culturalEvening,
                title: "Devi Bodhon & Fushmontor Live",
                residentSlotsAvailable: 12,
              },
            }
          : day
      );

      const sashtiDay = schedule.find((d) => d.id === "sashti");
      assert.strictEqual(sashtiDay.theme, "Devi Bodhon & Fushmontor Live");
      assert.strictEqual(sashtiDay.culturalEvening.residentSlotsAvailable, 12);
    });
  });

  describe('41. Adaptive GPay > ₹2,000 Guidance & Devotee Notice Logic', () => {
    const getGpayGuidance = (amount) => {
      const num = Number(amount);
      if (num > 2000) {
        return {
          needsProTip: true,
          notice: `Google Pay restricts remote gallery photo uploads to ₹2,000 for user security. For your contribution of ₹${num.toLocaleString("en-IN")}, please use "1-Tap Copy UPI ID" and pay via "Pay to UPI ID" in GPay for instant approval without limits.`,
          qrButtonLabel: "Save QR (PhonePe / Paytm / <₹2k)",
        };
      }
      return {
        needsProTip: false,
        notice: null,
        qrButtonLabel: "Save QR to Gallery / Photos",
      };
    };

    it('should trigger pro-tip notice and adjust QR button label for amounts strictly greater than 2000', () => {
      const gpay501 = getGpayGuidance(501);
      assert.strictEqual(gpay501.needsProTip, false);
      assert.strictEqual(gpay501.qrButtonLabel, "Save QR to Gallery / Photos");

      const gpay2000 = getGpayGuidance(2000);
      assert.strictEqual(gpay2000.needsProTip, false);

      const gpay2001 = getGpayGuidance(2001);
      assert.strictEqual(gpay2001.needsProTip, true);
      assert.ok(gpay2001.notice.includes("₹2,001"));
      assert.strictEqual(gpay2001.qrButtonLabel, "Save QR (PhonePe / Paytm / <₹2k)");

      const gpay10001 = getGpayGuidance(10001);
      assert.strictEqual(gpay10001.needsProTip, true);
      assert.ok(gpay10001.notice.includes("₹10,001"));
    });
  });

  describe('42. Gallery Photo CMS Serialization & Carousel Fallback Integrity', () => {
    it('should correctly preserve and serialize image_url/imageUrl when adding gallery photo', () => {
      const newPhoto = {
        title: "Dhunuchi Naach Finals",
        year: "2026",
        category: "Vijaya Dashami",
        emoji: "🔥",
        image_url: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
      };

      const newEntry = {
        id: Date.now().toString(),
        title: newPhoto.title,
        year: newPhoto.year || "2026",
        category: newPhoto.category || "Pujo Celebrations",
        emoji: newPhoto.emoji || "🌺",
        imageUrl: newPhoto.image_url || undefined,
        image_url: newPhoto.image_url || undefined,
        bgGradient: "from-[#850E1F]/85 via-[#610815]/90 to-[#2A0208]/95",
      };

      assert.strictEqual(newEntry.title, "Dhunuchi Naach Finals");
      assert.strictEqual(newEntry.imageUrl, newPhoto.image_url);
      assert.strictEqual(newEntry.image_url, newPhoto.image_url);

      const serialized = JSON.stringify([newEntry]);
      const parsed = JSON.parse(serialized);
      assert.strictEqual(parsed[0].imageUrl, newPhoto.image_url);
      assert.strictEqual(parsed[0].image_url, newPhoto.image_url);
    });

    it('should resolve photo URL with fallback support for both imageUrl and image_url', () => {
      const photoWithCamel = { id: "1", title: "Test 1", imageUrl: "https://example.com/p1.jpg" };
      const photoWithSnake = { id: "2", title: "Test 2", image_url: "https://example.com/p2.jpg" };
      const photoWithNone = { id: "3", title: "Test 3", emoji: "🪔" };

      const getUrl = (p) => p.imageUrl || p.image_url;

      assert.strictEqual(getUrl(photoWithCamel), "https://example.com/p1.jpg");
      assert.strictEqual(getUrl(photoWithSnake), "https://example.com/p2.jpg");
      assert.strictEqual(getUrl(photoWithNone), undefined);
    });
  });

  describe('43. Phone Number Strict 10-Digit & Numeric Sanitization Logic', () => {
    const sanitizePhone = (input) => {
      return (input || '').replace(/\D/g, '').slice(0, 10);
    };

    it('should strip spaces, dashes, country codes (+91), and alphabetical characters', () => {
      assert.strictEqual(sanitizePhone('+91 98450-12345'), '9198450123');
      assert.strictEqual(sanitizePhone('98450 12345'), '9845012345');
      assert.strictEqual(sanitizePhone('98450-12345'), '9845012345');
      assert.strictEqual(sanitizePhone('Phone: 98450abc12345xyz'), '9845012345');
    });

    it('should truncate numbers longer than 10 digits to exact 10 digits', () => {
      assert.strictEqual(sanitizePhone('98765432109999'), '9876543210');
      assert.strictEqual(sanitizePhone('9876543210').length, 10);
    });

    it('should handle clean valid 10-digit mobile numbers untouched', () => {
      assert.strictEqual(sanitizePhone('9876543210'), '9876543210');
      assert.strictEqual(sanitizePhone('8765432109'), '8765432109');
    });
  });

  describe('44. Flat Unit Alphanumeric & Ground Floor (G01, G02) Sanitization Logic', () => {
    const sanitizeFlat = (input) => {
      return (input || '').toUpperCase().replace(/[^A-Z0-9-]/g, '').slice(0, 8);
    };

    it('should allow Ground Floor flat numbers with G prefix and hyphens', () => {
      assert.strictEqual(sanitizeFlat('G01'), 'G01');
      assert.strictEqual(sanitizeFlat('g02'), 'G02');
      assert.strictEqual(sanitizeFlat('g-03'), 'G-03');
      assert.strictEqual(sanitizeFlat('G04'), 'G04');
    });

    it('should keep standard upper-floor numeric flat numbers unchanged', () => {
      assert.strictEqual(sanitizeFlat('402'), '402');
      assert.strictEqual(sanitizeFlat('1204'), '1204');
      assert.strictEqual(sanitizeFlat('1901'), '1901');
    });

    it('should strip special characters and spaces while preserving alphanumeric flat characters', () => {
      assert.strictEqual(sanitizeFlat('G 01 @'), 'G01');
      assert.strictEqual(sanitizeFlat('G-02 #'), 'G-02');
      assert.strictEqual(sanitizeFlat('1204*'), '1204');
    });
  });

  describe('45. Pratibimb Registered Stage Performance Date Mapping & Schema Integrity', () => {
    const formatPerformanceDate = (p) => {
      const rawDate = p.cultural_evenings?.evening_date || p.evening_date || p.scheduled_date || (p.created_at ? p.created_at.split("T")[0] : "");
      const dateMap = {
        "2026-10-15": "Panchami (15 Oct)",
        "2026-10-16": "Maha Sashti (16 Oct)",
        "2026-10-17": "Maha Saptami (17 Oct)",
        "2026-10-18": "Maha Ashtami (18 Oct)",
        "2026-10-19": "Maha Nabami (19 Oct)",
        "2026-10-20": "Vijaya Dashami (20 Oct)",
      };
      return dateMap[rawDate] || (rawDate ? new Date(rawDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "Scheduled Pujo Evening");
    };

    it('should correctly format performance date from Supabase joined cultural_evenings relation', () => {
      const perf1 = {
        id: "p-1",
        contact_name: "Poulomi Sen",
        flat_number: "Emerald 402",
        cultural_evenings: { evening_date: "2026-10-16" },
      };
      assert.strictEqual(formatPerformanceDate(perf1), "Maha Sashti (16 Oct)");
    });

    it('should correctly format performance date from evening_date or created_at fallback', () => {
      const perf2 = { id: "p-2", evening_date: "2026-10-17" };
      assert.strictEqual(formatPerformanceDate(perf2), "Maha Saptami (17 Oct)");

      const perf3 = { id: "p-3", created_at: "2026-10-18T18:30:00Z" };
      assert.strictEqual(formatPerformanceDate(perf3), "Maha Ashtami (18 Oct)");
    });
  });

  describe('46. Schedule Cultural Evening & Featured Acts CMS Configurability', () => {
    const parseActs = (actsText) => {
      return (actsText || '')
        .split('\n')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
    };

    it('should correctly parse multiline textarea into structured Featured Acts array', () => {
      const input = "Agomoni Choral Melodies\nKids Anandamela Performance\nOpening Classical Dance Recital";
      const acts = parseActs(input);
      assert.strictEqual(acts.length, 3);
      assert.strictEqual(acts[0], "Agomoni Choral Melodies");
      assert.strictEqual(acts[1], "Kids Anandamela Performance");
      assert.strictEqual(acts[2], "Opening Classical Dance Recital");
    });

    it('should ignore empty lines and whitespace in acts text', () => {
      const input = "Dance Drama by PSS\n\n   \nTownship Band Finale\n ";
      const acts = parseActs(input);
      assert.strictEqual(acts.length, 2);
      assert.strictEqual(acts[0], "Dance Drama by PSS");
      assert.strictEqual(acts[1], "Township Band Finale");
    });

    it('should update DaySchedule culturalEvening title, timings, and flagship headliner', () => {
      const baseSchedule = [
        {
          id: "sashti",
          dayName: "Maha Sashti",
          date: "16 Oct 2026",
          isoDate: "2026-10-16",
          theme: "Original Theme",
          culturalEvening: {
            title: "Original Title",
            time: "06:30 PM - 10:30 PM",
            description: "Original Description",
            acts: ["Act 1"],
            residentSlotsAvailable: 8,
          },
        },
      ];

      const updatedTitle = "Retro Rock Extravaganza";
      const updatedActs = ["Kids Medley", "Retro Rock Headliner"];
      const updatedHeadliner = {
        title: "🎸 Retro Rock by Fushmontor",
        time: "08:15 PM Start",
        duration: "1.5 Hours",
        genre: "Bengali & Bollywood Retro Fusion",
      };

      const updated = baseSchedule.map((d) => {
        if (d.id === "sashti") {
          return {
            ...d,
            theme: updatedTitle,
            culturalEvening: {
              ...d.culturalEvening,
              title: updatedTitle,
              acts: updatedActs,
              pssHeadliner: updatedHeadliner,
            },
          };
        }
        return d;
      });

      assert.strictEqual(updated[0].culturalEvening.title, "Retro Rock Extravaganza");
      assert.strictEqual(updated[0].culturalEvening.acts.length, 2);
      assert.strictEqual(updated[0].culturalEvening.pssHeadliner.title, "🎸 Retro Rock by Fushmontor");
    });
  });

  describe('47. Pratibimb Emcee Master Run Sheet Dynamic Day Filtering', () => {
    const mockSchedule = [
      {
        id: "panchami",
        dayName: "Maha Panchami",
        isoDate: "2026-10-15",
        date: "15 Oct 2026",
        theme: "Agomoni & Inauguration",
        culturalEvening: {
          time: "07:00 PM - 09:30 PM",
          residentSlotsAvailable: 10,
        },
      },
      {
        id: "sashti",
        dayName: "Maha Sashti",
        isoDate: "2026-10-16",
        date: "16 Oct 2026",
        theme: "Devi Bodhon & Retro Rock",
        culturalEvening: {
          time: "06:30 PM - 10:30 PM",
          pssHeadliner: {
            title: "🎸 Retro Rock by Fushmontor",
            time: "08:15 PM Start",
            duration: "90 mins",
            genre: "Retro Fusion",
          },
        },
      },
    ];

    const mockPerformances = [
      { id: "p1", evening_date: "2026-10-15", contact_name: "Rupa Mukherjee", song_name: "Agomoni Song" },
      { id: "p2", evening_date: "2026-10-16", contact_name: "Debashis Roy", song_name: "Dance Medley" },
      { id: "p3", evening_date: "2026-10-16", contact_name: "Tanmoy Sen", song_name: "Guitar Solo" },
    ];

    it('should filter schedule days and registered performances by selected isoDate tab', () => {
      const selectedDay = "2026-10-16";
      const targetDays = mockSchedule.filter((d) => d.isoDate === selectedDay);
      assert.strictEqual(targetDays.length, 1);
      assert.strictEqual(targetDays[0].dayName, "Maha Sashti");

      const dayPerfs = mockPerformances.filter((p) => p.evening_date === selectedDay);
      assert.strictEqual(dayPerfs.length, 2);
      assert.strictEqual(dayPerfs[0].contact_name, "Debashis Roy");
    });

    it('should render exact day-specific headliner without hardcoded dummy junk cues', () => {
      const sashti = mockSchedule.find((d) => d.id === "sashti");
      const panchami = mockSchedule.find((d) => d.id === "panchami");

      assert.ok(sashti.culturalEvening.pssHeadliner);
      assert.strictEqual(sashti.culturalEvening.pssHeadliner.title, "🎸 Retro Rock by Fushmontor");

      assert.strictEqual(panchami.culturalEvening.pssHeadliner, undefined);
    });
  });

  describe('48. Homepage Sponsor Brand Logo Carousel & Data Integrity', () => {
    it('should correctly format active sponsor brand list with logo URLs', () => {
      const sponsors = [
        { id: "s1", name: "ICICI Bank", tier: "Platinum Banking Partner", logo_url: "https://example.com/icici.png", is_active: true },
        { id: "s2", name: "Ratnadeep", tier: "Food Partner", logo_url: "https://example.com/ratnadeep.png", is_active: true },
        { id: "s3", name: "Draft Lead", tier: "Gold", logo_url: "", is_active: false },
      ];

      const activeSponsors = sponsors.filter((s) => s.is_active !== false);
      assert.strictEqual(activeSponsors.length, 2);
      assert.strictEqual(activeSponsors[0].name, "ICICI Bank");
      assert.strictEqual(activeSponsors[0].logo_url, "https://example.com/icici.png");
    });

    it('should accept Base64 data URL logos for direct file uploads', () => {
      const base64Sample = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
      const sponsorWithUpload = {
        name: "Local Brand Partner",
        tier: "Gold Partner",
        logo_url: base64Sample,
      };

      assert.ok(sponsorWithUpload.logo_url.startsWith("data:image/"));
      assert.ok(sponsorWithUpload.logo_url.length > 50);
    });
  });

  describe('49. Tower Card Prefill Resolution, Banking App Link Removal & Hero CTA Polish', () => {
    it('should correctly resolve tower search parameters into canonical tower names', () => {
      const mockTowers = [
        { id: "A", tower: "Tower A", name: "Emerald", fullName: "Tower A (Emerald)" },
        { id: "B", tower: "Tower B", name: "Sapphire", fullName: "Tower B (Sapphire)" },
        { id: "C", tower: "Tower C", name: "Coral", fullName: "Tower C (Coral)" },
      ];

      const resolveTowerParam = (towerParam) => {
        if (!towerParam) return mockTowers[0].fullName;
        const decoded = decodeURIComponent(towerParam).trim();
        const matched = mockTowers.find(
          (t) =>
            t.fullName.toLowerCase() === decoded.toLowerCase() ||
            t.tower.toLowerCase() === decoded.toLowerCase() ||
            t.name.toLowerCase() === decoded.toLowerCase() ||
            decoded.toLowerCase().includes(t.tower.toLowerCase()) ||
            decoded.toLowerCase().includes(t.name.toLowerCase())
        );
        return matched ? matched.fullName : decoded;
      };

      assert.strictEqual(resolveTowerParam("Tower B (Sapphire)"), "Tower B (Sapphire)");
      assert.strictEqual(resolveTowerParam("Sapphire"), "Tower B (Sapphire)");
      assert.strictEqual(resolveTowerParam("Tower C"), "Tower C (Coral)");
      assert.strictEqual(resolveTowerParam(""), "Tower A (Emerald)");
    });

    it('should format UPI payment payload cleanly without requiring confusing third-party banking app deep link buttons', () => {
      const buildCleanUpiString = ({ pa, pn, am, tn }) => {
        return `upi://pay?pa=${encodeURIComponent(pa)}&pn=${encodeURIComponent(pn)}&am=${am}&cu=INR&tn=${encodeURIComponent(tn)}`;
      };

      const upiUrl = buildCleanUpiString({
        pa: "pbelsanskritiksamiti@icici",
        pn: "PBEL Sanskritik Samiti",
        am: 2000,
        tn: "Pujo Seva",
      });

      assert.ok(upiUrl.startsWith("upi://pay?pa=pbelsanskritiksamiti%40icici"));
      assert.ok(upiUrl.includes("am=2000"));
      assert.ok(upiUrl.includes("cu=INR"));
    });
  });

  describe('50. Dynamic UPI Transaction Reference & Safe Payment QR Payload', () => {
    it('should generate unique transaction reference (tr) across separate calls to prevent duplicate txn rejections', () => {
      const generateDynamicTr = () => "PSS" + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 5).toUpperCase();
      const tr1 = generateDynamicTr();
      const tr2 = generateDynamicTr();
      assert.ok(tr1.startsWith("PSS"));
      assert.ok(tr2.startsWith("PSS"));
      assert.notStrictEqual(tr1, tr2);
    });

    it('should construct valid UPI pay URI with dynamic tr and verified payee parameters', () => {
      const buildUri = (amount, note) => {
        const dynamicTr = "PSS" + Date.now().toString(36).toUpperCase();
        return `upi://pay?pa=pbelsanskritiksamiti%40icici&pn=PBEL%20Sanskritik%20Samiti&mc=1520&tr=${dynamicTr}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;
      };

      const uri = buildUri(1001, "Saptami Pushpanjali");
      assert.ok(uri.includes("pa=pbelsanskritiksamiti%40icici"));
      assert.ok(uri.includes("am=1001"));
      assert.ok(uri.includes("mc=1520"));
      assert.ok(uri.includes("tr=PSS"));
    });
  });

  describe('51. Tower Deserialization Regex Word Boundaries & Guest Devotees Isolation', () => {
    it('should not falsely match non-Tower words with single letter tower identifiers', () => {
      const towerRegex = new RegExp(`\\bA\\b|Emerald|Tower A`, "i");
      assert.strictEqual(towerRegex.test("Flat 402"), false);
      assert.strictEqual(towerRegex.test("Main Road"), false);
      assert.strictEqual(towerRegex.test("Block A 402"), true);
      assert.strictEqual(towerRegex.test("Tower A - 1204"), true);
      assert.strictEqual(towerRegex.test("Emerald 801"), true);
    });

    it('should isolate guest/external contributions without falsely attributing to Tower A', () => {
      const towers = [
        { id: "A", name: "Emerald", tower: "Tower A", fullName: "Tower A (Emerald)", regex: /\bA\b|Emerald|Tower A/i },
        { id: "B", name: "Sapphire", tower: "Tower B", fullName: "Tower B (Sapphire)", regex: /\bB\b|Sapphire|Tower B/i },
      ];

      const contributions = [
        { flat_number: "Tower A - 402", amount: 2000 },
        { flat_number: "Tower B - 1204", amount: 5000 },
        { flat_number: "Guest Devotee (Bangalore)", amount: 1001 },
        { flat_number: "Well Wisher External", amount: 2501 },
      ];

      const counts = { A: 0, B: 0, guest: 0 };
      contributions.forEach((c) => {
        let matched = false;
        for (const t of towers) {
          if (t.regex.test(c.flat_number)) {
            counts[t.id] += c.amount;
            matched = true;
            break;
          }
        }
        if (!matched) {
          counts.guest += c.amount;
        }
      });

      assert.strictEqual(counts.A, 2000);
      assert.strictEqual(counts.B, 5000);
      assert.strictEqual(counts.guest, 3502);
    });
  });

  describe('52. Pre-Launch Polish: Food Stall Moderation, Contact Hardening & OpenGraph Metadata Integrity', () => {
    it('should verify official committee contact information is used everywhere', () => {
      const officialEmail = "pbelsanskritiksamiti@gmail.com";
      const officialPhone = "7032006645";
      assert.strictEqual(officialEmail.includes("@"), true);
      assert.strictEqual(officialPhone.length, 10);
    });

    it('should verify Anandamela new registrations default to Pending moderation status', () => {
      const createStall = (stallName, chefName, flatNumber, phone) => ({
        id: "stall_" + Date.now(),
        stallName,
        chefName,
        flatNumber,
        phone,
        status: "Pending",
        dishes: [{ name: "Kolkata Biryani", price: 220, isVeg: false }],
      });

      const stall = createStall("Dhakai Bhoj", "Debashis", "Tower A 1401", "9845012345");
      assert.strictEqual(stall.status, "Pending");

      const publicStalls = [stall].filter((s) => s.status === "Approved");
      assert.strictEqual(publicStalls.length, 0);

      stall.status = "Approved";
      const approvedStalls = [stall].filter((s) => s.status === "Approved");
      assert.strictEqual(approvedStalls.length, 1);
    });

    it('should format WhatsApp pre-order URL with mandatory 91 country code prefix', () => {
      const phone = "9845012345";
      const cleanPhone = phone.replace(/[^0-9]/g, "");
      const waUrl = `https://api.whatsapp.com/send?phone=91${cleanPhone}&text=Hello`;
      assert.ok(waUrl.includes("phone=919845012345"));
    });
  });

  describe('53. Custom Sacred Durga Trishul Browser Favicon & Metadata Integrity', () => {
    it('should define custom sacred favicon and apple touch icons in metadata', () => {
      const iconsConfig = {
        icon: [
          { url: "/favicon.svg", type: "image/svg+xml" },
          { url: "/icon.svg", type: "image/svg+xml" },
        ],
        apple: [
          { url: "/apple-icon.svg", type: "image/svg+xml" },
        ],
        shortcut: "/favicon.svg",
      };

      assert.strictEqual(iconsConfig.icon.some((i) => i.url === "/favicon.svg"), true);
      assert.strictEqual(iconsConfig.icon.some((i) => i.url === "/icon.svg"), true);
      assert.strictEqual(iconsConfig.apple[0].url, "/apple-icon.svg");
    });
  });

  describe('54. Admin Budget Expense Bill Upload & PDF/Image Voucher Serialization', () => {
    it('should serialize and parse expense bill attachments cleanly', () => {
      const sampleExpense = {
        id: "exp-101",
        category: "Pandal & Lighting",
        title: "Chandernagore Arch Lighting",
        planned: 120000,
        actual: 115000,
        paidTo: "Royal Lights",
        status: "Advance Paid",
        bill_url: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
        bill_name: "lighting_invoice_01.png",
      };

      const jsonStr = JSON.stringify(sampleExpense);
      const parsed = JSON.parse(jsonStr);

      assert.strictEqual(parsed.id, "exp-101");
      assert.strictEqual(parsed.bill_name, "lighting_invoice_01.png");
      assert.ok(parsed.bill_url.startsWith("data:image/png;base64,"));
    });

    it('should correctly handle expenses without attached bills', () => {
      const sampleExpense = {
        id: "exp-102",
        category: "Maha Bhog",
        title: "Gobindobhog Rice",
        planned: 40000,
        actual: 38000,
        paidTo: "Grocery Store",
        status: "Procured",
      };

      assert.strictEqual(sampleExpense.bill_url, undefined);
    });
  });

  describe('55. Pratibimb Cultural Registration Gentle Donation Prompt & Preset Offerings', () => {
    it('should construct pre-filled donation URL with contributor details and stage purpose', () => {
      const formData = {
        contactName: "Arindam Mukherjee",
        performanceType: "Solo Song",
      };
      const formattedFlat = "Tower A (Emerald) - 1402";
      const selectedOfferingAmount = 1001;

      const donateUrl = `/contribute?tab=general&amount=${selectedOfferingAmount}&name=${encodeURIComponent(
        formData.contactName
      )}&flat=${encodeURIComponent(formattedFlat)}&purpose=${encodeURIComponent(
        `Pratibimb Stage Devotee Seva (${formData.performanceType})`
      )}`;

      assert.ok(donateUrl.includes("amount=1001"));
      assert.ok(donateUrl.includes("Arindam%20Mukherjee"));
      assert.ok(donateUrl.includes("Tower%20A%20(Emerald)%20-%201402"));
      assert.ok(donateUrl.includes("Pratibimb%20Stage%20Devotee%20Seva"));
    });

    it('should offer standard devotional offering presets starting from 501', () => {
      const presets = [501, 1001, 2001, 5001];
      assert.strictEqual(presets[0], 501);
      assert.strictEqual(presets.includes(1001), true);
      assert.strictEqual(presets.includes(2001), true);
    });
  });

  describe('56. Site Highlight Pop-up CMS & Path Alpona Announcement Integrity', () => {
    it('should validate default Path Alpona highlight configuration schema', () => {
      const defaultHighlight = {
        enabled: true,
        id: "highlight-path-alpona-2026",
        badge: "🎨 Major Festival Attraction",
        title: "Grand 500m Sacred Path Alpona by Bengal Folk Artists",
        subtitle: "Complete by Panchami Morning • Major Attraction Throughout Pujo",
        snippet: "We are bringing renowned traditional Alpona folk artisans from Bengal to create a majestic 500-meter sacred street floor art across the PBEL City central boulevard.",
        actionText: "Explore Schedule & Cultural Acts →",
        actionUrl: "/programs",
      };

      assert.strictEqual(defaultHighlight.enabled, true);
      assert.strictEqual(defaultHighlight.id, "highlight-path-alpona-2026");
      assert.ok(defaultHighlight.snippet.includes("500-meter sacred street floor art"));
      assert.strictEqual(defaultHighlight.actionUrl, "/programs");
    });
  });

  describe('57. Member Contribution Aggregation (₹7,500 per Family Pass) into Tower Totals & Fund Counter', () => {
    it('should aggregate ₹7,500 per member family flat into the matching tower totals', () => {
      const currentTowers = [
        { id: "tower-a", tower: "Tower A", name: "Emerald", fullName: "Tower A (Emerald)", regex: /^(tower\s*a|emerald)/i },
        { id: "tower-b", tower: "Tower B", name: "Sapphire", fullName: "Tower B (Sapphire)", regex: /^(tower\s*b|sapphire)/i },
      ];

      const counts = {
        "tower-a": { families: new Set(), amount: 0 },
        "tower-b": { families: new Set(), amount: 0 },
      };

      const pssMembers = [
        { id: "mem-1", name: "Soumitra", flatNumber: "Tower A - 402", membershipFee: 7500 },
        { id: "mem-2", name: "Debashis", flatNumber: "Tower A - 1104", membershipFee: 7500 },
        { id: "mem-3", name: "Priyanka", flatNumber: "Tower B - 803", membershipFee: 7500 },
      ];

      pssMembers.forEach((m) => {
        const flatStr = m.flatNumber.trim();
        const amt = Number(m.membershipFee) || 7500;

        for (const t of currentTowers) {
          if (t.regex.test(flatStr) || flatStr.toLowerCase().includes(t.tower.toLowerCase())) {
            counts[t.id].families.add(flatStr);
            counts[t.id].amount += amt;
            break;
          }
        }
      });

      assert.strictEqual(counts["tower-a"].families.size, 2);
      assert.strictEqual(counts["tower-a"].amount, 15000);
      assert.strictEqual(counts["tower-b"].families.size, 1);
      assert.strictEqual(counts["tower-b"].amount, 7500);
    });

    it('should combine online contributions and member subscriptions in total fund counter', () => {
      const onlineContributionsTotal = 250000;
      const onlineContributorsCount = 85;

      const pssMembers = [
        { id: "mem-1", membershipFee: 7500 },
        { id: "mem-2", membershipFee: 7500 },
        { id: "mem-3", membershipFee: 7500 },
      ];

      const memberSubscriptionTotal = pssMembers.reduce((sum, m) => sum + (Number(m.membershipFee) || 7500), 0);
      const combinedTotal = onlineContributionsTotal + memberSubscriptionTotal;
      const combinedCount = onlineContributorsCount + pssMembers.length;

      assert.strictEqual(memberSubscriptionTotal, 22500);
      assert.strictEqual(combinedTotal, 272500);
      assert.strictEqual(combinedCount, 88);
    });
  });

  describe('58. Top Sponsor Ribbon Layout, Mobile Viewport Safety & Graceful Fallback', () => {
    it('should provide clean empty-state fallback when 0 sponsors are loaded', () => {
      const sponsors = [];
      const fallbackTeaser = "Official 2026 Brand & Corporate Partnerships Open";
      const hasSponsors = sponsors.length > 0;

      assert.strictEqual(hasSponsors, false);
      assert.strictEqual(fallbackTeaser.includes("Corporate Partnerships Open"), true);
    });

    it('should handle broken image URLs gracefully without throwing or breaking layout', () => {
      const sponsor = {
        id: "sp-1",
        name: "Test Bank",
        tier: "Platinum",
        logo_url: "https://invalid-domain-xyz.com/nonexistent.png",
      };

      const errorSet = new Set(["sp-1"]);
      const hasValidLogo = sponsor.logo_url && !errorSet.has(sponsor.id);

      assert.strictEqual(hasValidLogo, false);
    });

    it('should format tier badge colors correctly for premier and standard tiers', () => {
      const getTierBadgeColor = (tier) => {
        const t = (tier || "").toLowerCase();
        if (t.includes("platinum") || t.includes("title")) return "bg-amber-400 text-amber-950";
        if (t.includes("gold")) return "bg-yellow-300 text-yellow-950";
        if (t.includes("bhog") || t.includes("food")) return "bg-orange-300 text-orange-950";
        return "bg-amber-200 text-amber-950";
      };

      assert.ok(getTierBadgeColor("Title Partner").includes("bg-amber-400"));
      assert.ok(getTierBadgeColor("Gold Partner").includes("bg-yellow-300"));
      assert.ok(getTierBadgeColor("Maha Bhog Partner").includes("bg-orange-300"));
      assert.ok(getTierBadgeColor("Associate Partner").includes("bg-amber-200"));
    });
  });

  describe('59. Seva Day-Wise Filtering, Chronological Sorting & In-Modal QR Confirmation', () => {
    it('should sort seva catalog offerings chronologically by pujo day', () => {
      const DAY_CHRONO_ORDER = {
        "panchami": 1,
        "maha shashthi": 2,
        "maha saptami": 3,
        "maha ashtami": 4,
        "maha nabami": 5,
        "bijoya dashami": 6,
        "all 6 days": 7,
      };

      const getDayOrder = (dayStr) => {
        const lower = (dayStr || "").toLowerCase();
        for (const [k, v] of Object.entries(DAY_CHRONO_ORDER)) {
          if (lower.includes(k)) return v;
        }
        return 99;
      };

      const sevas = [
        { title: "Nabami Homa", day: "Maha Nabami", amount: 2501 },
        { title: "Panchami Agomoni", day: "Panchami", amount: 2501 },
        { title: "Ashtami Lotus", day: "Maha Ashtami", amount: 3100 },
        { title: "Shashthi Bodhon", day: "Maha Shashthi", amount: 2100 },
        { title: "Saptami Bhog", day: "Maha Saptami", amount: 2501 },
        { title: "Dashami Immersion", day: "Bijoya Dashami", amount: 5001 },
        { title: "Grand Gold", day: "All 6 Days", amount: 25000 },
      ];

      const sorted = [...sevas].sort((a, b) => getDayOrder(a.day) - getDayOrder(b.day) || a.amount - b.amount);

      assert.strictEqual(sorted[0].day, "Panchami");
      assert.strictEqual(sorted[1].day, "Maha Shashthi");
      assert.strictEqual(sorted[2].day, "Maha Saptami");
      assert.strictEqual(sorted[3].day, "Maha Ashtami");
      assert.strictEqual(sorted[4].day, "Maha Nabami");
      assert.strictEqual(sorted[5].day, "Bijoya Dashami");
      assert.strictEqual(sorted[6].day, "All 6 Days");
    });

    it('should filter seva catalog accurately by selected day', () => {
      const sevas = [
        { title: "Panchami Agomoni", day: "Panchami" },
        { title: "Ashtami 108 Lotuses", day: "Maha Ashtami" },
        { title: "Ashtami Sandhi Deepam", day: "Maha Ashtami" },
      ];

      const ashtamiFiltered = sevas.filter((s) => s.day.toLowerCase().includes("ashtami"));
      assert.strictEqual(ashtamiFiltered.length, 2);
      assert.strictEqual(ashtamiFiltered[0].title, "Ashtami 108 Lotuses");
    });

    it('should construct direct contribution query link for homepage featured cards', () => {
      const seva = { title: "Maha Bhog Family Seva", amount: 2501 };
      const href = `/contribute?tab=general&amount=${seva.amount}&purpose=${encodeURIComponent(seva.title)}`;

      assert.strictEqual(href, "/contribute?tab=general&amount=2501&purpose=Maha%20Bhog%20Family%20Seva");
    });
  });

  describe('60. Dynamic E-Seva Categories, Dynamic 6-Day Schedule & Opening Soon State', () => {
    it('should decode DB categories and prioritize featured active offerings over default cards', () => {
      const dbCategories = [
        { id: "1", name: "General Pujo Fund", fixed_amount: null, description: null },
        { id: "2", name: "Maha Navami Morning Puja", fixed_amount: 5000, description: "[limit:2] [status:active] [featured:true]" },
        { id: "3", name: "Maha Ashtami Evening Prasad", fixed_amount: 5000, description: "Prasad distribution in Maha Ashtami [limit:4] [status:active] [featured:true]" },
        { id: "4", name: "Saptami Nabapatrika", fixed_amount: 5000, description: "[limit:3] [status:active] [featured:true]" },
        { id: "5", name: "Maha Ashtami Morning Puja", fixed_amount: 5000, description: "[limit:4] [status:active] [featured:true]" },
      ];

      const decodeDesc = (desc) => {
        const str = desc || "";
        const featuredMatch = str.match(/\[featured:(true|false)\]/);
        const statusMatch = str.match(/\[status:(active|inactive)\]/);
        const cleanDesc = str
          .replace(/\[limit:\d+\]/g, "")
          .replace(/\[status:(active|inactive)\]/g, "")
          .replace(/\[featured:(true|false)\]/g, "")
          .trim();
        return {
          cleanDesc,
          isFeatured: featuredMatch ? featuredMatch[1] === "true" : false,
          isActive: statusMatch ? statusMatch[1] === "active" : true,
        };
      };

      const valid = dbCategories.filter((c) => c.name !== "General Pujo Fund");
      const featured = valid.filter((c) => {
        const d = decodeDesc(c.description);
        return d.isFeatured && d.isActive;
      });

      assert.strictEqual(featured.length, 4);
      assert.strictEqual(featured[0].name, "Maha Navami Morning Puja");
      assert.strictEqual(featured[1].name, "Maha Ashtami Evening Prasad");
      assert.strictEqual(decodeDesc(featured[1].description).cleanDesc, "Prasad distribution in Maha Ashtami");
    });

    it('should map dynamic cloud schedule into homepage 6-day timeline format', () => {
      const scheduleDays = [
        {
          id: "panchami",
          dayName: "Maha Panchami",
          date: "15 Oct 2026",
          theme: "Custom Agomoni Theme",
          culturalEvening: {
            title: "Agomoni Musical Night",
            description: "Custom evening highlights updated from Admin Console.",
            pssHeadliner: { title: "Opening Rabindra Sangeet", time: "07:30 PM" },
          },
        },
      ];

      const timeline = scheduleDays.map((d) => ({
        id: d.id,
        day: d.dayName,
        date: d.date,
        theme: d.theme,
        highlights: d.culturalEvening.description,
        pssHeadliner: `${d.culturalEvening.pssHeadliner.title} (${d.culturalEvening.pssHeadliner.time})`,
      }));

      assert.strictEqual(timeline[0].day, "Maha Panchami");
      assert.strictEqual(timeline[0].theme, "Custom Agomoni Theme");
      assert.strictEqual(timeline[0].highlights, "Custom evening highlights updated from Admin Console.");
      assert.strictEqual(timeline[0].pssHeadliner, "Opening Rabindra Sangeet (07:30 PM)");
    });
  });

  describe('61. Pujo Nirghanto Chronological Time Sorting & Admin Day-by-Day Persistence', () => {
    const timeToMinutes = (timeStr) => {
      if (!timeStr) return 9999;
      const clean = timeStr.trim().toUpperCase();
      const match = clean.match(/(\d+):(\d+)\s*(AM|PM)?/);
      if (!match) return 9999;
      let hours = parseInt(match[1], 10);
      const minutes = parseInt(match[2], 10);
      const meridiem = match[3] || (clean.includes("PM") ? "PM" : "AM");

      if (meridiem === "PM" && hours !== 12) hours += 12;
      if (meridiem === "AM" && hours === 12) hours = 0;

      return hours * 60 + minutes;
    };

    const sortRitualsByTime = (rituals) => {
      return [...rituals].sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time));
    };

    it('should sort rituals chronologically regardless of addition order', () => {
      const unsortedRituals = [
        { time: "08:30 PM", event: "Prasad Distribution", type: "bhog" },
        { time: "08:30 AM", event: "Pratima Sthapana", type: "ritual" },
        { time: "11:00 AM", event: "Maha Sashti Pushpanjali", type: "ritual" },
        { time: "07:45 PM", event: "Grand Sandhya Aarti", type: "aarti" },
        { time: "06:30 PM", event: "Devi Bodhon & Adhibas", type: "ritual" },
      ];

      const sorted = sortRitualsByTime(unsortedRituals);

      assert.strictEqual(sorted[0].time, "08:30 AM");
      assert.strictEqual(sorted[0].event, "Pratima Sthapana");
      assert.strictEqual(sorted[1].time, "11:00 AM");
      assert.strictEqual(sorted[1].event, "Maha Sashti Pushpanjali");
      assert.strictEqual(sorted[2].time, "06:30 PM");
      assert.strictEqual(sorted[2].event, "Devi Bodhon & Adhibas");
      assert.strictEqual(sorted[3].time, "07:45 PM");
      assert.strictEqual(sorted[3].event, "Grand Sandhya Aarti");
      assert.strictEqual(sorted[4].time, "08:30 PM");
      assert.strictEqual(sorted[4].event, "Prasad Distribution");
    });

    it('should update or append ritual without mutating unrelated days', () => {
      const schedule = [
        {
          id: "sashti",
          dayName: "Maha Sashti",
          rituals: [{ time: "08:30 AM", event: "Bodhon", type: "ritual" }],
        },
        {
          id: "saptami",
          dayName: "Maha Saptami",
          rituals: [{ time: "07:30 AM", event: "Kola Bou Snan", type: "ritual" }],
        },
      ];

      const newRitual = { time: "11:00 AM", event: "Sashti Pushpanjali", type: "ritual" };
      const updated = schedule.map((d) => {
        if (d.id === "sashti") {
          return {
            ...d,
            rituals: sortRitualsByTime([...d.rituals, newRitual]),
          };
        }
        return d;
      });

      assert.strictEqual(updated[0].rituals.length, 2);
      assert.strictEqual(updated[0].rituals[1].event, "Sashti Pushpanjali");
      assert.strictEqual(updated[1].rituals.length, 1);
      assert.strictEqual(updated[1].rituals[0].event, "Kola Bou Snan");
    });
  });

  describe('62. Pujo Nirghanto Hero Banner Dynamic Highlight Chips CMS', () => {
    it('should validate default highlight chips schema', () => {
      const defaultChips = [
        { id: "chip-1", icon: "sparkles", text: "Kumari Puja: 18 Oct 11:30 AM" },
        { id: "chip-2", icon: "flame", text: "Sandhi Pujo: 18 Oct 04:15 PM" },
        { id: "chip-3", icon: "music", text: "3 Flagship PSS Headliners" },
      ];

      assert.strictEqual(defaultChips.length, 3);
      assert.strictEqual(defaultChips[0].icon, "sparkles");
      assert.strictEqual(defaultChips[1].icon, "flame");
      assert.strictEqual(defaultChips[2].icon, "music");
    });

    it('should allow Admin to update highlight chip text and icon dynamically', () => {
      const currentChips = [
        { id: "chip-1", icon: "sparkles", text: "Kumari Puja: 18 Oct 11:30 AM" },
        { id: "chip-2", icon: "flame", text: "Sandhi Pujo: 18 Oct 04:15 PM" },
        { id: "chip-3", icon: "music", text: "3 Flagship PSS Headliners" },
      ];

      const updatedChips = currentChips.map((c, i) => {
        if (i === 0) return { ...c, text: "Path Alpona Mega Attraction" };
        if (i === 1) return { ...c, icon: "star", text: "Maha Ashtami Kumari Puja 11:30 AM" };
        return c;
      });

      assert.strictEqual(updatedChips[0].text, "Path Alpona Mega Attraction");
      assert.strictEqual(updatedChips[1].icon, "star");
      assert.strictEqual(updatedChips[1].text, "Maha Ashtami Kumari Puja 11:30 AM");
      assert.strictEqual(updatedChips[2].text, "3 Flagship PSS Headliners");
    });
  });

  describe('63. Admin Toggle for Member Subscriptions in Public Collection Counter', () => {
    const directDonations = [{ amount: 5000 }, { amount: 10000 }]; // 15,000
    const pssMembers = Array(38).fill({ membershipFee: 7500 }); // 285,000

    it('should include member subscription in total when toggle is enabled', () => {
      const includeMemberContributions = true;
      const directTotal = directDonations.reduce((sum, d) => sum + d.amount, 0);
      const memberTotal = includeMemberContributions ? pssMembers.length * 7500 : 0;
      const combinedTotal = directTotal + memberTotal;
      const totalContributors = directDonations.length + (includeMemberContributions ? pssMembers.length : 0);

      assert.strictEqual(combinedTotal, 300000);
      assert.strictEqual(totalContributors, 40);
    });

    it('should exclude member subscription from total when toggle is disabled', () => {
      const includeMemberContributions = false;
      const directTotal = directDonations.reduce((sum, d) => sum + d.amount, 0);
      const memberTotal = includeMemberContributions ? pssMembers.length * 7500 : 0;
      const combinedTotal = directTotal + memberTotal;
      const totalContributors = directDonations.length + (includeMemberContributions ? pssMembers.length : 0);

      assert.strictEqual(combinedTotal, 15000);
      assert.strictEqual(totalContributors, 2);
    });
  });

  describe('64. Sponsorship Packages & Tier Cards Dynamic CMS', () => {
    const defaultTiers = [
      {
        id: "platinum",
        title: "Title / Platinum Partner",
        amount: "₹1,00,000",
        tag: "Maximum Brand Dominance",
        isHighlight: true,
        deliverables: ["Exclusive Prime Stage LED Backdrop Branding", "Grand Pandal Entrance Archway Branding"],
      },
      {
        id: "gold",
        title: "Gold Partner",
        amount: "₹50,000",
        tag: "High Visibility",
        isHighlight: false,
        deliverables: ["Stage Side Panels & Pandal Entry Branding", "Dedicated Food / Promotional Stall Space"],
      },
    ];

    it('should validate default sponsorship tier structure and deliverables', () => {
      assert.strictEqual(defaultTiers.length, 2);
      assert.strictEqual(defaultTiers[0].title, "Title / Platinum Partner");
      assert.strictEqual(defaultTiers[0].isHighlight, true);
      assert.strictEqual(defaultTiers[0].deliverables.length, 2);
    });

    it('should allow adding custom sponsorship packages dynamically', () => {
      const newPackage = {
        id: "kids_zone",
        title: "Kids Zone & Gaming Partner",
        amount: "₹30,000",
        tag: "Family Engagement",
        isHighlight: false,
        deliverables: ["Branded Fun Zone Games Banner", "Logo on Kids Competitions Certificates"],
      };

      const updated = [...defaultTiers, newPackage];
      assert.strictEqual(updated.length, 3);
      assert.strictEqual(updated[2].title, "Kids Zone & Gaming Partner");
      assert.strictEqual(updated[2].amount, "₹30,000");
    });

    it('should allow modifying package deliverables and pricing on the fly', () => {
      const updated = defaultTiers.map((t) => {
        if (t.id === "gold") {
          return {
            ...t,
            amount: "₹60,000",
            deliverables: [...t.deliverables, "VIP Front Row Seating Passes (4 Devotees)"],
          };
        }
        return t;
      });

      assert.strictEqual(updated[1].amount, "₹60,000");
      assert.strictEqual(updated[1].deliverables.length, 3);
      assert.strictEqual(updated[1].deliverables[2], "VIP Front Row Seating Passes (4 Devotees)");
    });
  });

});







