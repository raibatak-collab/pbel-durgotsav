/**
 * PBEL City Durgotsav 2026 - Master Seed Snapshot & Offline Resiliency Layer
 * --------------------------------------------------------------------------
 * Automatically active when Supabase egress limits (402 Payment Required) or
 * network disconnects occur, ensuring 0% downtime and instant sub-50ms loads.
 */

export interface SeedSnapshotData {
  pss_members: any[];
  sponsors: any[];
  sponsors_db: any[];
  contribution_categories: any[];
  contributions: any[];
  towers: any[];
  schedule_days: any[];
  anandamela_stalls: any[];
  committee: any[];
  cultural_events: any[];
  volunteer_categories: any[];
  volunteer_slots: any[];
  cultural_evenings: any[];
  cultural_performances: any[];
  admin_users: any[];
  branding: any;
  announcement: string;
  cashfree_gateway_live: boolean;
  include_member_contributions: boolean;
  schedule_hero_chips: any[];
  [key: string]: any;
}

export const SEED_SNAPSHOT: SeedSnapshotData = {
  pss_members: [
  {
    "id": "M-1788884092238",
    "name": "Shalvi / Arijit",
    "tower": "Tower H (Turquoise)",
    "flatNumber": "G05",
    "phone": "8224817756",
    "headcount": 3,
    "status": "Active",
    "joinedYear": "2026"
  },
  {
    "id": "M-1788884000555",
    "name": "Aritra / Sandhya",
    "tower": "Tower N (Ruby)",
    "flatNumber": "1506",
    "phone": "9100949536",
    "headcount": 3,
    "status": "Active",
    "joinedYear": "2026"
  },
  {
    "id": "M-1788712324370",
    "name": "Mimi / Raktim",
    "tower": "Tower F (Crystal)",
    "flatNumber": "1803",
    "phone": "9752310176",
    "headcount": 3,
    "status": "Active",
    "joinedYear": "2026"
  },
  {
    "id": "M-1788712230206",
    "name": "Santoshree / Parthasarathi",
    "tower": "Tower P (Lakeside)",
    "flatNumber": "202",
    "phone": "8886053003",
    "headcount": 4,
    "status": "Active",
    "joinedYear": "2026"
  },
  {
    "id": "M-1788712095215",
    "name": "Bornali / Jitendar",
    "tower": "Tower N (Ruby)",
    "flatNumber": "1104",
    "phone": "9896662214",
    "headcount": 3,
    "status": "Active",
    "joinedYear": "2026"
  },
  {
    "id": "M-1788711942528",
    "name": "Abhishek Sarkar",
    "tower": "Tower L (Opal)",
    "flatNumber": "1909",
    "phone": "9668813160",
    "headcount": 3,
    "status": "Active",
    "joinedYear": "2026"
  },
  {
    "id": "M-1788612643901",
    "name": "Aniket / Swati",
    "tower": "Tower K (Aquamarine)",
    "flatNumber": "1606",
    "phone": "9052555019",
    "headcount": 3,
    "status": "Active",
    "joinedYear": "2026"
  },
  {
    "id": "M-1788532253073",
    "name": "Dibyendu / Subhamitra",
    "tower": "Tower E (Pearl)",
    "flatNumber": "1407",
    "phone": "9985682049",
    "headcount": 3,
    "status": "Active",
    "joinedYear": "2026"
  },
  {
    "id": "M-1788448935364",
    "name": "Sumana / Sudip",
    "tower": "Tower N (Ruby)",
    "flatNumber": "1101",
    "phone": "9704857729",
    "headcount": 3,
    "status": "Active",
    "joinedYear": "2026"
  },
  {
    "id": "M-1788443234509",
    "name": "Ritu / Subhankar",
    "tower": "Tower K (Aquamarine)",
    "flatNumber": "1503",
    "phone": "9382285890",
    "headcount": 3,
    "status": "Active",
    "joinedYear": "2026"
  },
  {
    "id": "M-1788443173332",
    "name": "Pallavi / Rohan",
    "tower": "Tower M (Sapphire)",
    "flatNumber": "710",
    "phone": "8879056327",
    "headcount": 5,
    "status": "Active",
    "joinedYear": "2026"
  },
  {
    "id": "M-1788110297958",
    "name": "Shilpi / Harsh",
    "tower": "Tower N (Ruby)",
    "flatNumber": "1809",
    "phone": "9810820773",
    "headcount": 3,
    "status": "Active",
    "joinedYear": "2026"
  },
  {
    "id": "M-1788110177982",
    "name": "Sutanu / Nabonita",
    "tower": "Tower J (Amethyst)",
    "flatNumber": "1901",
    "phone": "8125223133",
    "headcount": 3,
    "status": "Active",
    "joinedYear": "2026"
  },
  {
    "id": "M-1788072899601",
    "name": "Subhadip / Alokparna",
    "tower": "Tower E (Pearl)",
    "flatNumber": "208",
    "phone": "9910027344",
    "headcount": 3,
    "status": "Active",
    "joinedYear": "2026"
  },
  {
    "id": "M-1788072125130",
    "name": "Gourab",
    "tower": "Tower J (Amethyst)",
    "flatNumber": "105",
    "phone": "8908269760",
    "headcount": 3,
    "status": "Active",
    "joinedYear": "2026"
  },
  {
    "id": "M-1787992556307-0",
    "name": "Amitav Bose/Ishita",
    "tower": "Tower D (Argentum)",
    "flatNumber": "D906",
    "phone": "9581818885",
    "headcount": 3,
    "status": "Active",
    "joinedYear": "2026"
  },
  {
    "id": "M-1787992556307-1",
    "name": "Kathakali/Subhronil",
    "tower": "Tower D (Argentum)",
    "flatNumber": "D1707",
    "phone": "9866077692",
    "headcount": 5,
    "status": "Active",
    "joinedYear": "2026"
  },
  {
    "id": "M-1787992556307-2",
    "name": "Tina/Papu",
    "tower": "Tower G (Jade)",
    "flatNumber": "G606",
    "phone": "8897399587",
    "headcount": 4,
    "status": "Active",
    "joinedYear": "2026"
  },
  {
    "id": "M-1787992556307-3",
    "name": "Suchetana / Saptarshi",
    "tower": "Tower K (Aquamarine)",
    "flatNumber": "K1106",
    "phone": "8985156466",
    "headcount": 4,
    "status": "Active",
    "joinedYear": "2026"
  },
  {
    "id": "M-1787992556307-4",
    "name": "Sumeet/Pritha",
    "tower": "Tower L (Opal)",
    "flatNumber": "L409",
    "phone": "9836180035",
    "headcount": 3,
    "status": "Active",
    "joinedYear": "2026"
  },
  {
    "id": "M-1787992556307-5",
    "name": "Ishan / Samagata",
    "tower": "Tower G (Jade)",
    "flatNumber": "G1106",
    "phone": "9985187766",
    "headcount": 4,
    "status": "Active",
    "joinedYear": "2026"
  },
  {
    "id": "M-1787992556307-6",
    "name": "Santanu / Sangeeta",
    "tower": "Tower H (Turquoise)",
    "flatNumber": "H1109",
    "phone": "9490454770",
    "headcount": 4,
    "status": "Active",
    "joinedYear": "2026"
  },
  {
    "id": "M-1787992556307-7",
    "name": "Sharmili",
    "tower": "Tower C (Aurum)",
    "flatNumber": "C502",
    "phone": "8897877800",
    "headcount": 2,
    "status": "Active",
    "joinedYear": "2026"
  },
  {
    "id": "M-1787992556308-8",
    "name": "Ipshita & Kaushik Ghosal",
    "tower": "Tower N (Ruby)",
    "flatNumber": "G05",
    "phone": "9343133984",
    "headcount": 4,
    "status": "Active",
    "joinedYear": "2026"
  },
  {
    "id": "M-1787992556308-9",
    "name": "Uttam / Shraddha",
    "tower": "Other (Other)",
    "flatNumber": "Giridhari",
    "phone": "7022729291",
    "headcount": 2,
    "status": "Active",
    "joinedYear": "2026"
  },
  {
    "id": "M-1787992556308-10",
    "name": "Pooja Bhattacharya",
    "tower": "Tower K (Aquamarine)",
    "flatNumber": "K306",
    "phone": "8584026777",
    "headcount": 4,
    "status": "Active",
    "joinedYear": "2026"
  },
  {
    "id": "M-1787992556308-11",
    "name": "Arunima Dasgupta",
    "tower": "Tower E (Pearl)",
    "flatNumber": "E506",
    "phone": "8886606559",
    "headcount": 2,
    "status": "Active",
    "joinedYear": "2026"
  },
  {
    "id": "M-1787992556308-12",
    "name": "Roopan / Ankita",
    "tower": "Tower H (Turquoise)",
    "flatNumber": "H1508",
    "phone": "9701622273",
    "headcount": 3,
    "status": "Active",
    "joinedYear": "2026"
  },
  {
    "id": "M-1787992556308-13",
    "name": "Sayantan Bose",
    "tower": "Tower N (Ruby)",
    "flatNumber": "N1206",
    "phone": "7702266554",
    "headcount": 2,
    "status": "Active",
    "joinedYear": "2026"
  },
  {
    "id": "M-1787992556308-14",
    "name": "Piyali / Arko",
    "tower": "Tower D (Argentum)",
    "flatNumber": "D1808",
    "phone": "6300867017",
    "headcount": 3,
    "status": "Active",
    "joinedYear": "2026"
  },
  {
    "id": "M-1787992556308-15",
    "name": "Romita",
    "tower": "Tower J (Amethyst)",
    "flatNumber": "J1603",
    "phone": "9885910045",
    "headcount": 1,
    "status": "Active",
    "joinedYear": "2026"
  },
  {
    "id": "M-1787992556308-16",
    "name": "Raibatak /Archita",
    "tower": "Tower D (Argentum)",
    "flatNumber": "D1106",
    "phone": "9989803206",
    "headcount": 5,
    "status": "Active",
    "joinedYear": "2026"
  },
  {
    "id": "M-1787992556308-17",
    "name": "Anamika /Suthirta",
    "tower": "Tower L (Opal)",
    "flatNumber": "L1501",
    "phone": "9830513950",
    "headcount": 3,
    "status": "Active",
    "joinedYear": "2026"
  },
  {
    "id": "M-1787992556308-18",
    "name": "Madhujaya / Shantanu",
    "tower": "Tower B (Titanium)",
    "flatNumber": "1404",
    "phone": "9848173774",
    "headcount": 3,
    "status": "Active",
    "joinedYear": "2026"
  },
  {
    "id": "M-1787992556308-19",
    "name": "Vishal",
    "tower": "Other (Other)",
    "flatNumber": "Ext",
    "phone": "9949794531",
    "headcount": 4,
    "status": "Active",
    "joinedYear": "2026"
  },
  {
    "id": "M-1787992556308-20",
    "name": "Chhanda / Indranil",
    "tower": "Tower E (Pearl)",
    "flatNumber": "E207",
    "phone": "9711310043",
    "headcount": 4,
    "status": "Active",
    "joinedYear": "2026"
  },
  {
    "id": "M-1787992556308-21",
    "name": "Debashish/Bratati",
    "tower": "Tower C (Aurum)",
    "flatNumber": "C1601",
    "phone": "9618883294",
    "headcount": 3,
    "status": "Active",
    "joinedYear": "2026"
  },
  {
    "id": "M-1787992556308-22",
    "name": "Rinki / Sushanta",
    "tower": "Tower M (Sapphire)",
    "flatNumber": "M1106",
    "phone": "8897748484",
    "headcount": 3,
    "status": "Active",
    "joinedYear": "2026"
  },
  {
    "id": "M-1787992556308-23",
    "name": "Supro / Sujaya",
    "tower": "Tower D (Argentum)",
    "flatNumber": "D305",
    "phone": "7729819250",
    "headcount": 5,
    "status": "Active",
    "joinedYear": "2026"
  },
  {
    "id": "M-1787992556308-24",
    "name": "Sangeeta",
    "tower": "Tower D (Argentum)",
    "flatNumber": "D1209",
    "phone": "8902773396",
    "headcount": 2,
    "status": "Active",
    "joinedYear": "2026"
  },
  {
    "id": "M-1787992556308-25",
    "name": "Atreyee/ Partho",
    "tower": "Tower L (Opal)",
    "flatNumber": "L508",
    "phone": "7032006645",
    "headcount": 3,
    "status": "Active",
    "joinedYear": "2026"
  },
  {
    "id": "M-1787992556308-26",
    "name": "Anuja / Badri",
    "tower": "Tower D (Argentum)",
    "flatNumber": "D1208",
    "phone": "9985280045",
    "headcount": 3,
    "status": "Active",
    "joinedYear": "2026"
  },
  {
    "id": "M-1787992556308-27",
    "name": "Kalyan /Sarbani",
    "tower": "Tower D (Argentum)",
    "flatNumber": "D610",
    "phone": "9704855419",
    "headcount": 4,
    "status": "Active",
    "joinedYear": "2026"
  },
  {
    "id": "M-1787992556308-28",
    "name": "Santanu/Shreya",
    "tower": "Tower F (Crystal)",
    "flatNumber": "F1407",
    "phone": "9121425807",
    "headcount": 3,
    "status": "Active",
    "joinedYear": "2026"
  },
  {
    "id": "M-1787992556308-29",
    "name": "Snehasis / Gayatri",
    "tower": "Tower B (Titanium)",
    "flatNumber": "408",
    "phone": "9885266870",
    "headcount": 3,
    "status": "Active",
    "joinedYear": "2026"
  },
  {
    "id": "M-1787992556308-30",
    "name": "Debadrito",
    "tower": "Tower F (Crystal)",
    "flatNumber": "1010",
    "phone": "8978236137",
    "headcount": 2,
    "status": "Active",
    "joinedYear": "2026"
  },
  {
    "id": "M-1787992556308-31",
    "name": "Deb/Twastree",
    "tower": "Other (Other)",
    "flatNumber": "Kismatpur",
    "phone": "9901345466",
    "headcount": 3,
    "status": "Active",
    "joinedYear": "2026"
  },
  {
    "id": "M-1787992556308-32",
    "name": "Sourabh",
    "tower": "Tower D (Argentum)",
    "flatNumber": "D405",
    "phone": "9246284687",
    "headcount": 4,
    "status": "Active",
    "joinedYear": "2026"
  },
  {
    "id": "M-1787992556308-33",
    "name": "Nilanjan",
    "tower": "Tower K (Aquamarine)",
    "flatNumber": "K1205",
    "phone": "8886844884",
    "headcount": 4,
    "status": "Active",
    "joinedYear": "2026"
  },
  {
    "id": "M-1787992556308-34",
    "name": "Biswajit Naha",
    "tower": "Tower D (Argentum)",
    "flatNumber": "D1001",
    "phone": "9701151833",
    "headcount": 2,
    "status": "Active",
    "joinedYear": "2026"
  },
  {
    "id": "M-1787992556308-35",
    "name": "Sandeep Mishra",
    "tower": "Tower H (Turquoise)",
    "flatNumber": "H209",
    "phone": "9866889207",
    "headcount": 3,
    "status": "Active",
    "joinedYear": "2026"
  }
],
  sponsors: [
  {
    "id": "088b9eaf-7d67-4998-9f8d-4d07b85adebb",
    "name": "Vitals 360",
    "tier": "Supported by",
    "db_tier": "Other",
    "logo_url": "/images/sponsors/vitals_360.png",
    "website": "https://vitals360.ai/",
    "is_active": true,
    "created_at": "2026-09-17T17:07:45.538802+00:00"
  },
  {
    "id": "246ac724-7fcf-48b3-b218-a2ac6fcf6040",
    "name": "Jauqar",
    "tier": "Supported by",
    "db_tier": "Other",
    "logo_url": "/images/sponsors/vitals_360.png",
    "website": "https://www.jaquar.com/en/",
    "is_active": true,
    "created_at": "2026-09-08T17:12:12.393094+00:00"
  },
  {
    "id": "ab2d6528-5a98-4309-a48e-2b2b87313ad2",
    "name": "Celestee Clinic",
    "tier": "Platinum",
    "db_tier": "Platinum",
    "logo_url": "/images/sponsors/vitals_360.png",
    "website": "https://www.celesteeclinics.com/",
    "is_active": true,
    "created_at": "2026-09-08T17:11:33.54296+00:00"
  },
  {
    "id": "6670ea0c-ff1b-4e91-85db-255a16487765",
    "name": "Shreya Infra Group",
    "tier": "Platinum",
    "db_tier": "Platinum",
    "logo_url": "/images/sponsors/vitals_360.png",
    "website": "https://www.shreyainfragroup.com/",
    "is_active": true,
    "created_at": "2026-09-08T17:09:50.379521+00:00"
  }
],
  sponsors_db: [
  {
    "id": "088b9eaf-7d67-4998-9f8d-4d07b85adebb",
    "name": "Vitals 360",
    "tier": "Supported by",
    "db_tier": "Other",
    "logo_url": "/images/sponsors/vitals_360.png",
    "website": "https://vitals360.ai/",
    "is_active": true,
    "created_at": "2026-09-17T17:07:45.538802+00:00"
  },
  {
    "id": "246ac724-7fcf-48b3-b218-a2ac6fcf6040",
    "name": "Jauqar",
    "tier": "Supported by",
    "db_tier": "Other",
    "logo_url": "/images/sponsors/vitals_360.png",
    "website": "https://www.jaquar.com/en/",
    "is_active": true,
    "created_at": "2026-09-08T17:12:12.393094+00:00"
  },
  {
    "id": "ab2d6528-5a98-4309-a48e-2b2b87313ad2",
    "name": "Celestee Clinic",
    "tier": "Platinum",
    "db_tier": "Platinum",
    "logo_url": "/images/sponsors/vitals_360.png",
    "website": "https://www.celesteeclinics.com/",
    "is_active": true,
    "created_at": "2026-09-08T17:11:33.54296+00:00"
  },
  {
    "id": "6670ea0c-ff1b-4e91-85db-255a16487765",
    "name": "Shreya Infra Group",
    "tier": "Platinum",
    "db_tier": "Platinum",
    "logo_url": "/images/sponsors/vitals_360.png",
    "website": "https://www.shreyainfragroup.com/",
    "is_active": true,
    "created_at": "2026-09-08T17:09:50.379521+00:00"
  }
],
  contribution_categories: [
  {
    "id": "cat-general",
    "name": "General Pujo Fund",
    "description": "General devotional offering for township pujo celebrations",
    "min_amount": 501,
    "is_active": true
  },
  {
    "id": "cat-panchami-anandamela",
    "name": "Anandamela Food Festival Sponsorship",
    "description": "Sponsor setup and logistics for grand Anandamela food fair",
    "min_amount": 1500,
    "is_active": true
  },
  {
    "id": "cat-panchami-dhunuchi",
    "name": "Panchami Dhaak & Dhunuchi Seva",
    "description": "Traditional Dhaaki welcoming and evening dhunuchi aarti",
    "min_amount": 1100,
    "is_active": true
  },
  {
    "id": "cat-shashthi-bodhon",
    "name": "Bel Bodhon & Devi Amantran Seva",
    "description": "Awakening of Devi Durga under the sacred Bilva tree",
    "min_amount": 2100,
    "is_active": true
  },
  {
    "id": "cat-shashthi-flowers",
    "name": "Shashthi Special Flower Garland Seva",
    "description": "Fresh fragrant flower garlands for Maa Durga and deities",
    "min_amount": 1100,
    "is_active": true
  },
  {
    "id": "cat-shashthi-bhog",
    "name": "Maha Shashthi Sandhya Bhog",
    "description": "Special evening bhog offering of sweets and fruits",
    "min_amount": 1501,
    "is_active": true
  },
  {
    "id": "cat-saptami-nabapatrika",
    "name": "Kolabou Snan & Nabapatrika Seva",
    "description": "Bathing of Nabapatrika with holy waters from 8 sacred rivers",
    "min_amount": 2501,
    "is_active": true
  },
  {
    "id": "cat-saptami-bhog",
    "name": "Saptami Khichuri Bhog Sponsorship",
    "description": "Sponsor piping hot Gobindobhog rice, labra, and payesh",
    "min_amount": 2501,
    "is_active": true
  },
  {
    "id": "cat-saptami-sweets",
    "name": "Saptami Evening Mishti Prasad",
    "description": "Evening prasad boxes for Pratibimb cultural stage attendees",
    "min_amount": 1501,
    "is_active": true
  },
  {
    "id": "cat-ashtami-lotus",
    "name": "Ashtami 108 Lotuses (Pushpanjali & Sandhi)",
    "description": "108 pristine red lotuses offered at feet of Devi Durga during Sandhi Pujo",
    "min_amount": 3100,
    "is_active": true
  },
  {
    "id": "cat-ashtami-sandhi-deepam",
    "name": "Sandhi Pujo 108 Earthen Lamps & Ghee",
    "description": "108 sacred oil lamps lit during Sandhi Pujo",
    "min_amount": 2501,
    "is_active": true
  },
  {
    "id": "cat-ashtami-kumari",
    "name": "Kumari Puja Seva & Gift Hampers",
    "description": "Sponsorship of gifts, new clothes, and prasad for Kumari Puja",
    "min_amount": 2100,
    "is_active": true
  },
  {
    "id": "cat-ashtami-bhog",
    "name": "Maha Ashtami Rajbhog Seva",
    "description": "Grand royal feast: Polao, Chhanar Dalna, Beguni, Chanar Payesh",
    "min_amount": 3501,
    "is_active": true
  },
  {
    "id": "cat-nabami-yajna",
    "name": "Maha Nabami Maha Yajna & Homam",
    "description": "Sacred fire ritual with 108 offerings, samidha, pure ghee, bel leaves",
    "min_amount": 3100,
    "is_active": true
  },
  {
    "id": "cat-nabami-dhunuchi",
    "name": "Dhunuchi Dance & Dhaak Grand Finale",
    "description": "Grand festive rhythm finale with traditional clay incense burners",
    "min_amount": 2100,
    "is_active": true
  },
  {
    "id": "cat-nabami-bhog",
    "name": "Nabami Mahaprasad Feast",
    "description": "Grand community feast for all PBEL City township residents",
    "min_amount": 3501,
    "is_active": true
  },
  {
    "id": "cat-dashami-sindoor",
    "name": "Sindoor Khela & Baran Samagri",
    "description": "Traditional vermilion celebration, sweets, betel leaves, and baran",
    "min_amount": 1501,
    "is_active": true
  },
  {
    "id": "cat-dashami-immersion",
    "name": "Shobhayatra & Immersion Logistics",
    "description": "Grand farewell procession with dhak beats to sacred immersion waters",
    "min_amount": 2501,
    "is_active": true
  },
  {
    "id": "cat-dashami-sweets",
    "name": "Bijoya Dashami Sweet Distribution",
    "description": "Traditional Bengali Sandesh, Rosogolla, and Nimki distribution",
    "min_amount": 1501,
    "is_active": true
  },
  {
    "id": "cat-grand-patron",
    "name": "👑 Pujo Mahapatron (All 6 Days)",
    "description": "Supreme benefactor for all rituals, daily pushpanjali, and feasts",
    "min_amount": 15000,
    "is_active": true
  },
  {
    "id": "cat-daily-bhog-patron",
    "name": "🍽️ Daily Bhog Sponsor (All 5 Days)",
    "description": "Dedicated bhog sponsor for all 5 days of festive feast",
    "min_amount": 11000,
    "is_active": true
  },
  {
    "id": "cat-pushpanjali-patron",
    "name": "🌺 Pushpanjali & Floral Patron",
    "description": "Covers all flowers, garlands, and lotus blooms for entire Pujo",
    "min_amount": 7500,
    "is_active": true
  }
],
  contributions: [
  {
    "id": "c-seed-1",
    "contributor_name": "Amitabha & Sharmistha Ghosh",
    "flat_number": "Tower C (Coral) - 1204",
    "amount": 15000,
    "status": "Success",
    "is_name_visible": true,
    "created_at": "2026-09-12T10:15:00Z",
    "category_id": "cat-grand-patron"
  },
  {
    "id": "c-seed-2",
    "contributor_name": "Debashis & Piyali Chatterjee",
    "flat_number": "Tower E (Emerald) - 802",
    "amount": 11000,
    "status": "Success",
    "is_name_visible": true,
    "created_at": "2026-09-13T14:30:00Z",
    "category_id": "cat-daily-bhog-patron"
  },
  {
    "id": "c-seed-3",
    "contributor_name": "Soumya & Indrani Sengupta",
    "flat_number": "Tower J (Jade) - 1501",
    "amount": 7500,
    "status": "Success",
    "is_name_visible": true,
    "created_at": "2026-09-14T09:20:00Z",
    "category_id": "cat-pushpanjali-patron"
  },
  {
    "id": "c-seed-4",
    "contributor_name": "Subrata & Ruma Mukherjee",
    "flat_number": "Tower B (Beryl) - 504",
    "amount": 3501,
    "status": "Success",
    "is_name_visible": true,
    "created_at": "2026-09-15T11:45:00Z",
    "category_id": "cat-ashtami-bhog"
  },
  {
    "id": "c-seed-5",
    "contributor_name": "Anirban & Sreeparna Datta",
    "flat_number": "Tower G (Garnet) - 1103",
    "amount": 3100,
    "status": "Success",
    "is_name_visible": true,
    "created_at": "2026-09-15T16:10:00Z",
    "category_id": "cat-ashtami-lotus"
  },
  {
    "id": "c-seed-6",
    "contributor_name": "Kaushik & Gargi Banerjee",
    "flat_number": "Tower H (Heliodor) - 702",
    "amount": 2501,
    "status": "Success",
    "is_name_visible": true,
    "created_at": "2026-09-16T10:00:00Z",
    "category_id": "cat-saptami-bhog"
  },
  {
    "id": "c-seed-7",
    "contributor_name": "Prasun & Madhumita Roy",
    "flat_number": "Tower A (Aquamarine) - 903",
    "amount": 2501,
    "status": "Success",
    "is_name_visible": true,
    "created_at": "2026-09-16T18:20:00Z",
    "category_id": "cat-ashtami-sandhi-deepam"
  },
  {
    "id": "c-seed-8",
    "contributor_name": "Siddhartha & Swati Bose",
    "flat_number": "Tower K (Kunzite) - 1402",
    "amount": 3100,
    "status": "Success",
    "is_name_visible": true,
    "created_at": "2026-09-17T12:15:00Z",
    "category_id": "cat-nabami-yajna"
  },
  {
    "id": "c-seed-9",
    "contributor_name": "Tanmoy & Monalisa Dasgupta",
    "flat_number": "Tower L (Larimar) - 401",
    "amount": 2100,
    "status": "Success",
    "is_name_visible": true,
    "created_at": "2026-09-18T08:50:00Z",
    "category_id": "cat-nabami-dhunuchi"
  },
  {
    "id": "c-seed-10",
    "contributor_name": "Bhaskar & Sunita Sen",
    "flat_number": "Tower D (Diamond) - 604",
    "amount": 2100,
    "status": "Success",
    "is_name_visible": true,
    "created_at": "2026-09-18T15:30:00Z",
    "category_id": "cat-ashtami-kumari"
  }
],
  towers: [
  {
    "id": "A",
    "tower": "Tower A",
    "name": "Platinum",
    "fullName": "Tower A (Platinum)",
    "regex": "tower\\\\s*a|emerald|\\\\ba[\\\\s-]*\\\\d"
  },
  {
    "id": "B",
    "tower": "Tower B",
    "name": "Titanium",
    "fullName": "Tower B (Titanium)",
    "regex": "tower\\\\s*b|sapphire|\\\\bb[\\\\s-]*\\\\d"
  },
  {
    "id": "C",
    "tower": "Tower C",
    "name": "Aurum",
    "fullName": "Tower C (Aurum)",
    "regex": "tower\\s*C|Aurum|\\bC[\\s-]*\\d"
  },
  {
    "id": "D",
    "tower": "Tower D",
    "name": "Argentum",
    "fullName": "Tower D (Argentum)",
    "regex": "tower\\s*D|Argentum|\\bD[\\s-]*\\d"
  },
  {
    "id": "E",
    "tower": "Tower E",
    "name": "Pearl",
    "fullName": "Tower E (Pearl)",
    "regex": "tower\\s*E|Pearl|\\bE[\\s-]*\\d"
  },
  {
    "id": "F",
    "tower": "Tower F",
    "name": "Crystal",
    "fullName": "Tower F (Crystal)",
    "regex": "tower\\s*F|Crystal|\\bF[\\s-]*\\d"
  },
  {
    "id": "G",
    "tower": "Tower G",
    "name": "Jade",
    "fullName": "Tower G (Jade)",
    "regex": "tower\\s*G|Jade|\\bG[\\s-]*\\d"
  },
  {
    "id": "H",
    "tower": "Tower H",
    "name": "Turquoise",
    "fullName": "Tower H (Turquoise)",
    "regex": "tower\\s*H|Turquoise|\\bH[\\s-]*\\d"
  },
  {
    "id": "J",
    "tower": "Tower J",
    "name": "Amethyst",
    "fullName": "Tower J (Amethyst)",
    "regex": "tower\\s*J|Amethyst|\\bJ[\\s-]*\\d"
  },
  {
    "id": "K",
    "tower": "Tower K",
    "name": "Aquamarine",
    "fullName": "Tower K (Aquamarine)",
    "regex": "tower\\s*K|Aquamarine|\\bK[\\s-]*\\d"
  },
  {
    "id": "L",
    "tower": "Tower L",
    "name": "Opal",
    "fullName": "Tower L (Opal)",
    "regex": "tower\\s*L|Opal|\\bL[\\s-]*\\d"
  },
  {
    "id": "M",
    "tower": "Tower M",
    "name": "Sapphire",
    "fullName": "Tower M (Sapphire)",
    "regex": "tower\\s*M|Sapphire|\\bM[\\s-]*\\d"
  },
  {
    "id": "N",
    "tower": "Tower N",
    "name": "Ruby",
    "fullName": "Tower N (Ruby)",
    "regex": "tower\\s*N|Ruby|\\bN[\\s-]*\\d"
  },
  {
    "id": "P",
    "tower": "Tower P",
    "name": "Lakeside",
    "fullName": "Tower P (Lakeside)",
    "regex": "tower\\s*P|Lakeside|\\bP[\\s-]*\\d"
  },
  {
    "id": "OTHERS",
    "tower": "Other",
    "name": "Other",
    "fullName": "Other (Other)",
    "regex": "tower\\s*OTHERS|Other|\\bOTHERS[\\s-]*\\d"
  }
],
  schedule_days: [
  {
    "id": "panchami",
    "dayName": "Maha Panchami",
    "bengaliName": "মহাপঞ্চমী",
    "date": "15 Oct 2026",
    "isoDate": "2026-10-15",
    "theme": "Agomoni Musical Night",
    "rituals": [
      {
        "time": "06:30 PM",
        "event": "Pandal Inauguration & Diya Lighting Ceremony",
        "type": "ritual"
      },
      {
        "time": "07:00 PM",
        "event": "Agomoni Songs & Dhaak Welcome Rhythm",
        "type": "cultural"
      }
    ],
    "culturalEvening": {
      "title": "Agomoni Musical Night",
      "time": "07:00 PM - 09:30 PM",
      "description": "Welcoming Maa Durga with heartfelt Agomoni songs, traditional Rabindra Sangeet, and resident food fiesta.",
      "acts": [
        "Agomoni Event - Welcome Maa Durga",
        "PBEL Resident Performances"
      ],
      "residentSlotsAvailable": 10
    }
  },
  {
    "id": "sashti",
    "dayName": "Maha Sashti",
    "bengaliName": "মহাষষ্ঠী",
    "date": "16 Oct 2026",
    "isoDate": "2026-10-16",
    "theme": "Pratibimb : Dance Extravaganza & Retro Rock",
    "rituals": [
      {
        "time": "09:00 AM",
        "event": "Kalparambho and Morning Pujo",
        "type": "ritual",
        "description": "Kalparambhao is an early morning ritual performed on Maha Shashthi that marks the official ceremonial beginning of Durga Puja"
      },
      {
        "time": "11:15 AM",
        "event": "Maha Sashti Pushpanjali",
        "type": "ritual"
      },
      {
        "time": "05:45 PM",
        "event": "Devi Bodhon",
        "type": "ritual",
        "description": "Debi Bodhan is the sacred evening ritual on Maha Sashti that marks the formal awakening and welcoming of Goddess Durga"
      },
      {
        "time": "07:00 PM",
        "event": "Amantran & Adhibas Rituals",
        "type": "ritual",
        "description": "Amantran - formally invite Goddess Durga and her divine family to descend to earth and accept the worship.\nAdhibas - \"invocation\" - The ritual of sanctifying and securing the stay of the Goddess in the puja area."
      }
    ],
    "culturalEvening": {
      "title": "Pratibimb : Dance Extravaganza & Retro Rock",
      "time": "07:30 PM - 10:30 PM",
      "description": "Resident dance showcases followed by the electrifying flagship Retro Rock concert.",
      "pssHeadliner": {
        "title": "🎸 Retro Rock by Fushmontor",
        "time": "08:15 PM Start",
        "duration": "1.5 Hours (90 mins)",
        "genre": "Live Bengali & Bollywood Retro Rock Fusion"
      },
      "acts": [
        "Resident Opening Dance Medley (07:30 PM)",
        "⭐ Retro Rock by Fushmontor (08:15 PM)"
      ],
      "residentSlotsAvailable": 5
    }
  },
  {
    "id": "saptami",
    "dayName": "Maha Saptami",
    "bengaliName": "মহাসপ্তমী",
    "date": "17 Oct 2026",
    "isoDate": "2026-10-17",
    "theme": "Pratibimb: Dance Drama & Musical Melodies",
    "rituals": [
      {
        "time": "08:00 AM",
        "event": "Nabapatrika (Kola Bou) Snan & Pravesh & Morning Pujo",
        "type": "ritual",
        "description": "Navpatrika Puja involves bathing nine sacred plants bound together as the \"Kola Bou\" to represent nine divine forms of Goddess Durga before placing them next to Lord Ganesha's idol"
      },
      {
        "time": "11:30 AM",
        "event": "Maha Saptami Pushpanjali (Batch 1 & 2)",
        "type": "ritual",
        "description": "A sacred morning ritual where devotees offer fresh flowers and bilva leaves with folded hands to Goddess Durga while chanting mantras"
      },
      {
        "time": "12:30 PM",
        "event": "Bhog Arati",
        "type": "aarti",
        "description": "The devotional worship ceremony performed right after offering the first sacred food (bhog) to Goddess Durga"
      },
      {
        "time": "06:45 PM",
        "event": "Maha Saptami Sandhya Arati",
        "type": "aarti",
        "description": "The grand evening worship and light offering performed for Goddess Durga as the first major night of the festival begins"
      }
    ],
    "culturalEvening": {
      "title": "Pratibimb: Dance Drama & Musical Melodies",
      "time": "07:30 PM - 10:00 PM",
      "description": "The signature PSS Dance Drama production followed by Manjari and Resident performances",
      "pssHeadliner": {
        "title": "💃 Dance Drama Production and Manjari Musical Performance",
        "time": "07:30 PM Start",
        "duration": "1.5 Hour (100 mins)",
        "genre": "Thematic Bengali Cultural Dance Drama (Nritya Natya) and Songs from the Soil"
      },
      "acts": [
        "⭐ Dance Drama Production by PSS (07:30 PM)",
        "⭐Manjari Musical Performance (8:30 PM)",
        "PBEL Residents Performance (9:15 pm - 10 pm)"
      ],
      "residentSlotsAvailable": 7
    }
  },
  {
    "id": "ashtami",
    "dayName": "Maha Ashtami",
    "bengaliName": "মহাষ্টমী",
    "date": "18 Oct 2026",
    "isoDate": "2026-10-18",
    "theme": "Pratibimb: Grand Bangla Drama & Resident performances",
    "rituals": [
      {
        "time": "08:30 AM",
        "event": "Maha Ashtami Pujo",
        "type": "ritual",
        "description": "A sacred prayer ritual to honor Goddess Durga and awaken inner strength"
      },
      {
        "time": "11:15 AM",
        "event": "Maha Ashtami Pushpanjali",
        "type": "ritual",
        "description": "The most sacred and auspicious floral offering of the Durga Puja festival, symbolizing deep devotion, spiritual purification, and the invocation of Goddess Durga in her ultimate power"
      },
      {
        "time": "12:45 PM",
        "event": "Maha Ashtami Bhog Arati",
        "type": "aarti",
        "description": "Bhog (sacred food offering) and Arati hold immense spiritual significance as they mark the peak devotional energy of the entire Durga Puja festival. Ashtami is considered the most sacred day of Navratri, dedicated to Maa Mahagauri (the goddess of purity and serenity) and her ferocious manifestation as Mahishasuramardini (the slayer of the buffalo demon"
      },
      {
        "time": "01:00 PM",
        "event": "Maha Bhog Feast for All Residents",
        "type": "bhog"
      },
      {
        "time": "06:45 PM",
        "event": "Maha Ashtami Sandhya Arati",
        "type": "aarti",
        "description": "The grand evening worship ritual performed to honor Goddess Durga with oil lamps, incense, and dhunuchi"
      }
    ],
    "culturalEvening": {
      "title": "Pratibimb: Grand Bangla Drama & Resident performances",
      "time": "7:45 PM - 10:00 PM",
      "description": "The evening featuring the acclaimed annual PSS Bangla Natok.",
      "pssHeadliner": {
        "title": "🎭 Grand Bangla Theatrical Drama (Natok) by PSS",
        "time": "07:45 PM Start",
        "duration": "1.0 Hour (60 mins)",
        "genre": "Full-Length Bengali Theatrical Play / Natok"
      },
      "acts": [
        "⭐ Grand Bangla Drama by PSS (07:45 PM)",
        "PBEL Resident Performances (8:45 PM)"
      ],
      "residentSlotsAvailable": 6
    }
  },
  {
    "id": "nabami",
    "dayName": "Maha Nabami",
    "bengaliName": "মহানবমী",
    "date": "19 Oct 2026",
    "isoDate": "2026-10-19",
    "theme": "Pratibimb: Cultural Grand Finale",
    "rituals": [
      {
        "time": "07:26 AM",
        "event": "Sandhi Pujo",
        "type": "ritual",
        "description": "The most sacred and powerful ritual of Durga Puja, performed during the exact 48-minute transitional juncture when the eighth day (Ashtami Tithi) ends and the ninth day (Navami Tithi) begins"
      },
      {
        "time": "09:30 AM",
        "event": "Maha Nabami Morning Pujo",
        "type": "ritual",
        "description": "Worshipping the Goddess during the Maha Navami morning is believed to grant merits equal to offering prayers across all preceding days of the festival combined"
      },
      {
        "time": "11:45 AM",
        "event": "Maha Nabami Pushpanjali",
        "type": "ritual",
        "description": "A sacred ritual where devotees offer fresh flowers and bilva leaves with folded hands to Goddess Durga"
      },
      {
        "time": "12:30 PM",
        "event": "Maha Nabami Bhog Arati",
        "type": "aarti",
        "description": "(the ninth day of Durga Puja), Bhog Arati (or Bhoga Aarti) is the sacred ritual of offering a grand midday feast (Bhog) to Goddess Durga, immediately followed by a devotional Arati with Dhunuchi"
      },
      {
        "time": "01:00 PM",
        "event": "Maha Navami Maha Yajna & Havan",
        "type": "ritual",
        "description": "A sacred fire ritual performed offering prayers, ghee, and herbs to invoke Goddess Durga"
      },
      {
        "time": "06:45 PM",
        "event": "Maha Nabami Sandhyarati",
        "type": "ritual"
      }
    ],
    "culturalEvening": {
      "title": "Pratibimb: Cultural Grand Finale",
      "time": "06:30 PM - 9:30 PM",
      "description": "A kaleidoscope of performances starting with in-house band Saptasuram bringing Pratibimb 2026 to the closure",
      "acts": [
        "Saptasuram Vocal Performance (7:30 pm)",
        "PBEL Residents Performance (8:15 pm)"
      ],
      "residentSlotsAvailable": 10,
      "pssHeadliner": {
        "title": "Saptasuram Vocal Performance",
        "time": "7:30 pm Start",
        "duration": "40 mins",
        "genre": "PBEL Sanskritik Samiti Flagship Show"
      }
    }
  },
  {
    "id": "dashami",
    "dayName": "Vijaya Dashami",
    "bengaliName": "বিজয়াদশমী",
    "date": "20 Oct 2026",
    "isoDate": "2026-10-20",
    "theme": "Subho Bijoya Sammilani & Dhunuchi Master Finale",
    "rituals": [
      {
        "time": "09:45 AM",
        "event": "Maha Dashami Morning Pujo",
        "type": "ritual",
        "description": "A final morning puja aarti conducted with sweet offerings, flowers, and incense to thank the deity for her divine protection"
      },
      {
        "time": "11:30 AM",
        "event": "Devi Baron",
        "type": "ritual",
        "description": "A traditional farewell ritual performed by married women on Vijaya Dashami to bid an emotional adieu to Goddess Durga, leaving her earthly maternal home to return to Lord Shiva in Mount Kailash.  Devotees treat the goddess like a married daughter returning to her husband's home, sending her off with blessings and sweet offerings"
      },
      {
        "time": "12:30 PM",
        "event": "Sindoor Khela",
        "type": "ritual",
        "description": "Playing with Vermilion: After honoring the goddess, the women playfully smear sindoor on each other's faces and foreheads, accompanied by exchanging sweets and warm embraces"
      },
      {
        "time": "04:30 PM",
        "event": "Maa Durga Visarjan Shobha Yatra (Procession)",
        "type": "ritual"
      }
    ],
    "culturalEvening": {
      "title": "Subho Bijoya Sammilani & Dhunuchi Master Finale",
      "time": "12:30 PM - 1:30 PM",
      "description": "Traditional blessings, sweet distribution, and celebrating the triumph of good over evil.",
      "acts": [
        "Dhunuchi Dance"
      ],
      "residentSlotsAvailable": 20,
      "pssHeadliner": {
        "title": "Dhunuchi Dance Competition",
        "time": "12:30 pm",
        "duration": "90 mins",
        "genre": "Resident Dhunuchi Dance Talent Show"
      }
    }
  }
],
  anandamela_stalls: [
  {
    "id": "stall-1790392877117",
    "stallNumber": "Stall #12",
    "stallName": "Namaste Bella",
    "chefName": "Parul Ranjan",
    "stallType": "Non-Food",
    "tower": "Tower J (Amethyst)",
    "flatNumber": "607",
    "phone": "9718671791",
    "category": "Apparel & Festive Wear",
    "description": "Festive items and community creations curated with passion by PBEL City residents.",
    "emoji": "👗",
    "itemsDescription": ".",
    "priceRange": "1000",
    "status": "Approved",
    "tablesCount": 1,
    "totalAmount": 1000,
    "paymentRef": "626998108247",
    "paymentStatus": "Payment Verified",
    "createdAt": "2026-09-26T03:21:17.118Z"
  },
  {
    "id": "stall-1790392838763",
    "stallNumber": "Stall #11",
    "stallName": "Siya Souvenirs",
    "chefName": "Jalpa Shah",
    "stallType": "Non-Food",
    "tower": "Tower C (Aurum)",
    "flatNumber": "1305",
    "phone": "8886322004",
    "category": "Handicrafts & Art",
    "description": "Festive items, curated souvenirs and community creations curated with passion by PBEL City residents.",
    "emoji": "🎁",
    "status": "Approved",
    "tablesCount": 1,
    "totalAmount": 1000,
    "paymentRef": "663545931081",
    "paymentStatus": "Payment Verified",
    "createdAt": "2026-09-26T03:20:39.000Z"
  },
  {
    "id": "stall-1790337073537",
    "stallNumber": "Stall #10",
    "stallName": "Atrangi Abstracts",
    "chefName": "Deepali Dutta Pohoja",
    "stallType": "Non-Food",
    "tower": "Tower B (Titanium)",
    "flatNumber": "901",
    "phone": "8800761071",
    "category": "Handicrafts & Art",
    "description": "Festive items and community creations curated with passion by PBEL City residents.",
    "emoji": "🎨",
    "itemsDescription": "Handcrafted photoframes, gifiting items, home decor",
    "priceRange": "350 onwards",
    "status": "Approved",
    "tablesCount": 1,
    "totalAmount": 1000,
    "paymentRef": "663413528454",
    "paymentStatus": "Payment Verified",
    "createdAt": "2026-09-25T11:51:13.537Z"
  },
  {
    "id": "stall-1790316998697",
    "stallNumber": "Stall #09",
    "stallName": "Er. Sugar Space",
    "chefName": "Yogita Gulechha",
    "stallType": "Food",
    "tower": "Tower H (Turquoise)",
    "flatNumber": "1104",
    "phone": "9769713821",
    "category": "Sweets & Pithe",
    "description": "Home-cooked festive specialty prepared with love by PBEL City residents.",
    "emoji": "🍯",
    "dishes": [
      {
        "name": "Cupcakes",
        "price": 100,
        "isVeg": true,
        "specialty": true
      }
    ],
    "status": "Approved",
    "tablesCount": 1,
    "totalAmount": 1000,
    "paymentRef": "130198768929",
    "paymentStatus": "Payment Verified",
    "createdAt": "2026-09-25T06:16:38.697Z"
  },
  {
    "id": "stall-1790316460079",
    "stallNumber": "Stall #08",
    "stallName": "Handful _of_aroma bakes",
    "chefName": "Archana Rath",
    "stallType": "Food",
    "tower": "Tower K (Aquamarine)",
    "flatNumber": "1207",
    "phone": "8917502428",
    "category": "Sweets & Pithe",
    "description": "Home-cooked festive specialty prepared with love by PBEL City residents.",
    "emoji": "🍯",
    "dishes": [
      {
        "name": "Dessert bowl bakes",
        "price": 350,
        "isVeg": true,
        "specialty": true
      },
      {
        "name": "Pastry",
        "price": 150,
        "isVeg": true,
        "specialty": false
      }
    ],
    "status": "Approved",
    "tablesCount": 1,
    "totalAmount": 1000,
    "paymentRef": "130198314271",
    "paymentStatus": "Payment Verified",
    "createdAt": "2026-09-25T06:07:40.079Z"
  },
  {
    "id": "stall-1789974492475",
    "stallNumber": "Stall #07",
    "stallName": "Promode Agro Farms",
    "chefName": "Tina bhattacharya",
    "stallType": "Food",
    "tower": "Tower G (Jade)",
    "flatNumber": "G606",
    "phone": "8897399587",
    "category": "Bengali Delicacies",
    "description": "Home-cooked festive specialty prepared with love by PBEL City residents.",
    "emoji": "🐟",
    "dishes": [
      {
        "name": "Bhetki cutlet",
        "price": 110,
        "isVeg": false,
        "specialty": true
      },
      {
        "name": "Kosha murgir mangsho",
        "price": 300,
        "isVeg": true,
        "specialty": false
      }
    ],
    "status": "Approved",
    "tablesCount": 1,
    "totalAmount": 1000,
    "paymentRef": "663030413677",
    "paymentStatus": "Payment Verified",
    "createdAt": "2026-09-21T07:08:12.478Z"
  },
  {
    "id": "stall-1789826975590",
    "stallNumber": "Stall #06",
    "stallName": "Eiora",
    "chefName": "Shameema Farveen",
    "stallType": "Non-Food",
    "tower": "Tower K (Aquamarine)",
    "flatNumber": "202",
    "phone": "8328173250",
    "category": "Apparel & Festive Wear",
    "description": "Festive items and community creations curated with passion by PBEL City residents.",
    "emoji": "👗",
    "itemsDescription": "Women's ethnic wear\nKurtha and Anarkali sets\nCo- ord sets",
    "status": "Approved",
    "tablesCount": 2,
    "totalAmount": 2000,
    "paymentRef": "129894847053",
    "paymentStatus": "Payment Verified",
    "createdAt": "2026-09-19T14:09:35.590Z"
  },
  {
    "id": "stall-1789734286392",
    "stallNumber": "Stall #05",
    "stallName": "Saaj Jaipur",
    "chefName": "Anuvrati Gupta",
    "stallType": "Non-Food",
    "tower": "Tower H (Turquoise)",
    "flatNumber": "H1510",
    "phone": "9538227878",
    "category": "Other Services & Goods",
    "description": "Festive items and community creations curated with passion by PBEL City residents.",
    "emoji": "🛍️",
    "itemsDescription": "Hello - I would like to put a stall of jaipuri print bags, travel kits, towels, etc",
    "priceRange": "300- 2000",
    "status": "Approved",
    "tablesCount": 1,
    "totalAmount": 1000,
    "paymentRef": "626117097900",
    "paymentStatus": "Payment Verified",
    "createdAt": "2026-09-18T12:24:46.392Z"
  },
  {
    "id": "stall-1789575283706",
    "stallNumber": "Stall #04",
    "stallName": "ILANG",
    "chefName": "Danica",
    "stallType": "Non-Food",
    "tower": "Tower E (Pearl)",
    "flatNumber": "1708",
    "phone": "9769199613",
    "category": "Apparel & Festive Wear",
    "description": "Festive items and community creations curated with passion by PBEL City residents.",
    "emoji": "👗",
    "itemsDescription": "Curated Designer & Handloom Sarees + Blouse",
    "priceRange": "500",
    "status": "Approved",
    "tablesCount": 2,
    "totalAmount": 2000,
    "paymentRef": "129729988328",
    "paymentStatus": "Payment Verified",
    "createdAt": "2026-09-16T16:14:43.707Z"
  },
  {
    "id": "stall-1789558438159",
    "stallNumber": "Stall #03",
    "stallName": "Jewellery cart -imitation jewellery",
    "chefName": "Richa Sharma",
    "stallType": "Non-Food",
    "tower": "Tower M (Sapphire)",
    "flatNumber": "1205",
    "phone": "9599892959",
    "category": "Jewellery & Accessories",
    "description": "Festive items and community creations curated with passion by PBEL City residents.",
    "emoji": "💍",
    "itemsDescription": "Jewellery Cart is a home-based imitation jewellery business offering stylish, affordable and carefully hand-picked pieces.\nOur collection blends modern, Indian and contemporary trends, including everyday and festive jewellery.\nWe focus on good quality, anti-tarnish and elegant designs at accessible prices.\nOur products are curated to make everyday styling and gifting easy, beautiful and affordable.\nWe primarily serve our local community through WhatsApp, social media and offline pop-up stalls.",
    "priceRange": "Rs 150",
    "status": "Approved",
    "tablesCount": 1,
    "totalAmount": 1000,
    "paymentRef": "T2609161703166540909270/phonepay",
    "paymentStatus": "Payment Verified",
    "createdAt": "2026-09-16T11:33:58.159Z"
  },
  {
    "id": "stall-1789552731075",
    "stallNumber": "Stall #02",
    "stallName": "Cosmetics and Clothes",
    "chefName": "Sakshi Kapoor",
    "stallType": "Non-Food",
    "tower": "Tower J (Amethyst)",
    "flatNumber": "304",
    "phone": "9818095154",
    "category": "Apparel & Festive Wear",
    "description": "Festive items and community creations curated with passion by PBEL City residents.",
    "emoji": "👗",
    "itemsDescription": "Oriflame cosmetics and apparels",
    "priceRange": "150",
    "status": "Approved",
    "tablesCount": 1,
    "totalAmount": 1000,
    "paymentRef": "129699242800",
    "paymentStatus": "Payment Verified",
    "createdAt": "2026-09-16T09:58:51.077Z"
  },
  {
    "id": "stall-1789542966117",
    "stallNumber": "Stall #01",
    "stallName": "TrackMe",
    "chefName": "Vidhi",
    "stallType": "Non-Food",
    "tower": "Tower J (Amethyst)",
    "flatNumber": "1806",
    "phone": "9959661982",
    "category": "Other Services & Goods",
    "description": "Festive items and community creations curated with passion by PBEL City residents.",
    "emoji": "🛍️",
    "itemsDescription": "Kids calling watches",
    "priceRange": "2500-5500",
    "status": "Approved",
    "tablesCount": 1,
    "totalAmount": 1000,
    "paymentRef": "129695574813",
    "paymentStatus": "Payment Verified",
    "createdAt": "2026-09-16T07:16:06.117Z"
  }
],
  committee: [
  {
    "id": "wing-exec",
    "category": "Executive Leadership & Advisory Council",
    "icon": "👑",
    "tagline": "Overall governance, society alignment & festival coordination",
    "members": [
      {
        "id": "m-1",
        "name": "Kalyan Ghosh",
        "role": "President",
        "tower": "PBEL Sanskritik Samiti"
      },
      {
        "id": "m-2",
        "name": "Indranil Pal",
        "role": "General Secretary",
        "tower": "PBEL Sanskritik Samiti"
      },
      {
        "id": "m-3",
        "name": "Archita Das",
        "role": "Joint General Secretary",
        "tower": "PBEL City Community"
      }
    ]
  },
  {
    "id": "wing-finance",
    "category": "Finance, Treasury & Audit Wing",
    "icon": "💰",
    "tagline": "Zero-fee bank reconciliation, verified contribution CRM & donor receipts",
    "members": [
      {
        "id": "m-4",
        "name": "Snehasis Bose",
        "role": "Treasurer & Bank Accounts Lead",
        "tower": "PBEL Sanskritik Samiti"
      },
      {
        "id": "m-5",
        "name": "Sharmili",
        "role": "Joint Treasurer",
        "tower": "PBEL Sanskritik Samiti"
      },
      {
        "id": "m-1788531842301",
        "name": "Partho Pratim Mukherjee",
        "role": "Sponsorship Lead",
        "tower": "PBEL Sanskritik Samiti"
      },
      {
        "id": "m-1788532006435",
        "name": "Debashish",
        "role": "Executive member",
        "tower": "PBEL Sanskritik Samiti"
      }
    ]
  },
  {
    "id": "wing-cultural",
    "category": "Cultural Directorate & Pratibimb Stage",
    "icon": "🎭",
    "tagline": "Resident stage acts, rehearsals, drama, music bands & sound production",
    "members": [
      {
        "id": "m-6",
        "name": "Raibatak Chatterjee",
        "role": "Cultural Committee Lead",
        "tower": "PBEL Sanskritik Samiti"
      },
      {
        "id": "m-7",
        "name": "Santanu Chatterjee",
        "role": "Natok Production & Rehearsals",
        "tower": "PBEL Sanskritik Samiti"
      },
      {
        "id": "m-8",
        "name": "Music, & Sound Ops",
        "role": "Saptarshi Pathak",
        "tower": "PBEL Sanskritik Samiti"
      },
      {
        "id": "m-1788531826894",
        "name": "Alokparna Bhattacharya",
        "role": "Dance Drama Production",
        "tower": "PBEL Sanskritik Samiti"
      }
    ]
  },
  {
    "id": "wing-bhog",
    "category": "Maha Bhog, Kitchen Seva & Anandamela",
    "icon": "🍚",
    "tagline": "Pure ghee bhog preparation, dining passes & resident food stalls",
    "members": [
      {
        "id": "m-9",
        "name": "Kalyan Ghosh",
        "role": "Maha Bhog Kitchen & Quality Control",
        "tower": "PBEL Sanskritik Samiti"
      },
      {
        "id": "m-11",
        "name": "Dining Hall & Operations",
        "role": "Token Desk & Dining Hall Coordination",
        "tower": "PBEL Sanskritik Samiti"
      }
    ]
  },
  {
    "id": "wing-rituals",
    "category": "Pandal, Pratima & Vedic Rituals",
    "icon": "🌺",
    "tagline": "Vedic rites, sacred samagri, 108 deepam, lighting & archway production",
    "members": [
      {
        "id": "m-12",
        "name": "Amitabh Bose",
        "role": "Pujo Lead",
        "tower": "PBEL Sanskritik Samiti"
      },
      {
        "id": "m-13",
        "name": "Sharmiili",
        "role": "Pandal & Decoration",
        "tower": "PBEL Sanskritik Samiti"
      }
    ]
  },
  {
    "id": "wing-crowd",
    "category": "Operations and Logistics",
    "icon": "🤝",
    "tagline": "",
    "members": [
      {
        "id": "m-15",
        "name": "Roopan",
        "role": " Operations Lead",
        "tower": "PBEL Sanskritik Samiti"
      },
      {
        "id": "m-16",
        "name": "Dibyendu Chatterjee",
        "role": "Executive member",
        "tower": "PBEL Sanskritik Samiti"
      }
    ]
  },
  {
    "id": "wing-1788532031282",
    "category": "Communications",
    "icon": "🌺",
    "tagline": "Festival execution wing",
    "members": [
      {
        "id": "m-1788532048476",
        "name": "Kathakali Roy",
        "role": "Communications Lead",
        "tower": "PBEL Sanskritik Samiti"
      },
      {
        "id": "m-1788532068201",
        "name": "Anamika",
        "role": "Joint Communication Lead",
        "tower": "PBEL Sanskritik Samiti"
      }
    ]
  }
],
  cultural_events: [
  {
    "id": "sit_and_draw",
    "title": "Sit & Draw Competition \"Indradhanush\"",
    "subtitle": "Flagship Inter-Tower Children & Youth Art Contest",
    "day": "Maha Panchami • 15 Oct 2026 (Thu)",
    "time": "10:00 AM - 12:15 PM",
    "location": "PSS Community Hall & Activity Arena",
    "maxLimit": 120,
    "teamSize": 1,
    "gradeEligibility": "Nursery up to Grade 10",
    "categories": [
      {
        "id": "group_1",
        "name": "Group 1",
        "gradeRange": "Up to Grade 1 (Nursery - 1st)"
      },
      {
        "id": "group_2",
        "name": "Group 2",
        "gradeRange": "Grade 2 - Grade 5"
      },
      {
        "id": "group_3",
        "name": "Group 3",
        "gradeRange": "Grade 6 - Grade 10"
      }
    ],
    "rules": [
      "Total capacity is capped at 120 entries across all groups.",
      "Drawing sheets will be provided by PSS. Please bring your own drawing board, pencils, and colors.",
      "Themes will be announced at 10:00 AM sharp at the venue."
    ],
    "isOpen": false,
    "isVisible": true,
    "status": "coming_soon"
  },
  {
    "id": "junior_quiz",
    "title": "Junior Discovery Quiz",
    "subtitle": "The Ultimate Inter-Tower Battle of Wits & Knowledge",
    "day": "Maha Saptami • 17 Oct 2026 (Sat)",
    "time": "10:30 AM - 12:30 PM",
    "location": "Main Pandal Cultural Stage / Arena",
    "maxLimit": 6,
    "teamSize": 5,
    "gradeEligibility": "Grade 4 to Grade 10",
    "rules": [
      "Strictly capped at 6 teams on a first-come, first-registered basis.",
      "Each team must consist of exactly 5 members studying in Grades 4 to 10.",
      "Rounds cover Indian Culture, Bengali Heritage, Science, Literature, and Current Affairs."
    ],
    "isOpen": false,
    "isVisible": true,
    "status": "coming_soon"
  },
  {
    "id": "mini_kumartuli",
    "title": "Mini Kumartuli - Kids Clay Idol Sculpting",
    "subtitle": "Hands-on Clay Crafting & Traditional Idol Making Workshop",
    "day": "Maha Navami • 19 Oct 2026 (Mon)",
    "time": "11:00 AM - 12:00 PM",
    "location": "PSS Creative Craft Workshop Pavillion",
    "maxLimit": 10,
    "teamSize": 3,
    "gradeEligibility": "Children & Teens (Ages 6 - 16)",
    "rules": [
      "Capped at 10 teams maximum.",
      "Each team must comprise exactly 3 participants.",
      "Eco-friendly Ganga clay, wooden support bases, and basic sculpting sticks will be provided by PSS."
    ],
    "isOpen": false,
    "isVisible": true,
    "status": "coming_soon"
  },
  {
    "id": "duet_dhunuchi",
    "title": "Dhunuchi Jugalbandi (Duet Dhunuchi Competition)",
    "subtitle": "A Grand Synchronized Devotional Dance Face-off in Traditional Attire",
    "day": "Maha Navami • 19 Oct 2026 (Mon)",
    "time": "07:00 PM - 07:15 PM",
    "location": "Main Stage Arena & Pandal Courtyard",
    "maxLimit": 10,
    "teamSize": 2,
    "dressCode": "Saree and Dhoti/Pyjama Kurta compulsory",
    "rules": [
      "Strictly 10 Groups (Pairs / Duos) max.",
      "Both participants in each group must perform synchronized rhythmic Dhunuchi dance to traditional Dhaak beats.",
      "Dress code is strictly COMPULSORY: Traditional Saree and Dhoti / Pyjama Kurta."
    ],
    "isOpen": false,
    "isVisible": true,
    "status": "coming_soon"
  },
  {
    "id": "flash_mob",
    "title": "One Community. One Beat.",
    "subtitle": "High-Energy Festive Township Dance Showcase",
    "day": "Saturday • 03 Oct 2026",
    "time": "06:30 PM - 07:15 PM",
    "location": "PBEL City Central Arena",
    "maxLimit": 100,
    "teamSize": 1,
    "gradeEligibility": "Open to Kids, Teens & Adults",
    "rules": [
      "Open participation for all energetic PBEL City residents (Kids, Teens & Adults).",
      "No prior rehearsals required! Catchy, simple follow-along moves will be shared on WhatsApp and performed together on Oct 3.",
      "Costume color theme and track details will be communicated directly to registered participants on WhatsApp."
    ],
    "isOpen": false,
    "isVisible": true,
    "status": "coming_soon"
  }
],
  volunteer_categories: [
  {
    "id": "vol-cat-pandal",
    "name": "Pandal & Crowd Management"
  },
  {
    "id": "vol-cat-bhog",
    "name": "Bhog & Prasad Distribution"
  },
  {
    "id": "vol-cat-stage",
    "name": "Pratibimb Stage & Cultural Affairs"
  },
  {
    "id": "vol-cat-anandamela",
    "name": "Anandamela & Logistics"
  },
  {
    "id": "vol-cat-firstaid",
    "name": "First Aid & Medical Support"
  },
  {
    "id": "vol-cat-finance",
    "name": "Finance & Devotee Desk"
  }
],
  volunteer_slots: [
  {
    "id": "vslot-1",
    "category_id": "vol-cat-bhog",
    "slot_date": "17 Oct 2026 (Saptami)",
    "shift_time": "12:00 PM - 03:00 PM",
    "capacity": 15
  },
  {
    "id": "vslot-2",
    "category_id": "vol-cat-bhog",
    "slot_date": "18 Oct 2026 (Ashtami)",
    "shift_time": "12:00 PM - 03:30 PM",
    "capacity": 20
  },
  {
    "id": "vslot-3",
    "category_id": "vol-cat-bhog",
    "slot_date": "19 Oct 2026 (Navami)",
    "shift_time": "12:00 PM - 03:30 PM",
    "capacity": 20
  },
  {
    "id": "vslot-4",
    "category_id": "vol-cat-pandal",
    "slot_date": "18 Oct 2026 (Ashtami)",
    "shift_time": "07:00 PM - 11:00 PM",
    "capacity": 12
  },
  {
    "id": "vslot-5",
    "category_id": "vol-cat-stage",
    "slot_date": "17 Oct 2026 (Saptami)",
    "shift_time": "06:30 PM - 10:30 PM",
    "capacity": 10
  },
  {
    "id": "vslot-6",
    "category_id": "vol-cat-anandamela",
    "slot_date": "15 Oct 2026 (Panchami)",
    "shift_time": "05:00 PM - 10:00 PM",
    "capacity": 15
  }
],
  cultural_evenings: [
  {
    "id": "eve-panchami",
    "evening_date": "15 Oct 2026",
    "theme": "Anandamela Inauguration & Pratibimb Opening Gala"
  },
  {
    "id": "eve-shashthi",
    "evening_date": "16 Oct 2026",
    "theme": "Agomoni Songs & Children's Folk Dance"
  },
  {
    "id": "eve-saptami",
    "evening_date": "17 Oct 2026",
    "theme": "Rabindra & Nazrul Geeti Showcase & Drama"
  },
  {
    "id": "eve-ashtami",
    "evening_date": "18 Oct 2026",
    "theme": "Classical Sangeet & Dhunuchi Dance Competition"
  },
  {
    "id": "eve-navami",
    "evening_date": "19 Oct 2026",
    "theme": "Grand Musical Night & Township Band"
  },
  {
    "id": "eve-dashami",
    "evening_date": "20 Oct 2026",
    "theme": "Bijoya Sanmilani & Dhaak Utsav"
  }
],
  cultural_performances: [
  {
    "id": "perf-1",
    "evening_id": "eve-panchami",
    "participant_name": "PBEL Kids Choir",
    "performance_type": "Vocal",
    "title": "Sharod Vandana",
    "duration_minutes": 15,
    "status": "Approved"
  },
  {
    "id": "perf-2",
    "evening_id": "eve-saptami",
    "participant_name": "Township Youth Troupe",
    "performance_type": "Dance",
    "title": "Mahishasurmardini Recital",
    "duration_minutes": 20,
    "status": "Approved"
  }
],
  admin_users: [
  {
    "id": "usr-master",
    "name": "Executive Committee (Master Admin)",
    "username": "admin",
    "role": "Super Admin",
    "passwordHash": "PBEL@2026",
    "status": "Active",
    "created_at": "2026-08-01"
  },
  {
    "id": "usr-1787936982366",
    "name": "Anamika Roy",
    "username": "anamika",
    "role": "Super Admin",
    "passwordHash": "PBEL@2026",
    "status": "Active",
    "created_at": "2026-08-28"
  },
  {
    "id": "usr-1788542948043",
    "name": "Romita Mustafi",
    "username": "romita",
    "role": "Super Admin",
    "passwordHash": "PBEL@2026",
    "status": "Active",
    "created_at": "2026-09-04"
  },
  {
    "id": "usr-1788543008234",
    "name": "Kathakali Roy",
    "username": "katha",
    "role": "Super Admin",
    "passwordHash": "PBEL@2026",
    "status": "Active",
    "created_at": "2026-09-04"
  },
  {
    "id": "usr-1788687597472",
    "name": "Finance",
    "username": "finance",
    "role": "Finance & Fund Verification",
    "passwordHash": "PBEL@2026",
    "status": "Active",
    "created_at": "2026-09-06"
  }
],
  branding: {
  "samitiName": "PBEL Sanskritik Samiti",
  "festivalName": "PBEL City Durgotsav 2026",
  "tagline": "Joy Maa Durga • 15th to 20th October (Panchami to Dashami)",
  "pssLogoUrl": "/images/branding/pssLogoUrl.svg",
  "durgotsavLogoUrl": "/images/branding/durgotsavLogoUrl.svg",
  "activeHeroWallpaperId": "traditional-ekchala",
  "customWallpaperUrl": "",
  "sponsorshipDeckPdfUrl": "/docs/PBEL_Durgotsav_2026_Sponsorship_Deck.pdf",
  "sponsorshipDeckFileName": "PBEL City Durgotsav 2026 — Digital Sponsorship Flyer (Dark) V2.0.pdf",
  "societyRegNo": "2018/1778",
  "societyPan": "AAGAP5678L",
  "tax80gUrn": "",
  "tax80gDate": "",
  "presidentSignatureUrl": "",
  "signatoryTitle": "President / General Secretary",
  "registeredAddress": "PBEL City, Appa Junction, Peeramcheruvu, Hyderabad, Telangana - 500091",
  "youtubeChannelUrl": "https://www.youtube.com/@pbelsanskritiksamiti-offic3003",
  "instagramUrl": "https://www.instagram.com/pbelsanskritiksamiti",
  "facebookUrl": "https://www.facebook.com/pbelsanskritiksamiti"
},
  announcement: "🍲 Anandamela Stall Registrations are now OPEN! (Strictly 15 Stalls • ₹1,000/table) • Tap to Register →",
  cashfree_gateway_live: true,
  include_member_contributions: true,
  schedule_hero_chips: [
  {
    "id": "chip-1",
    "icon": "sparkles",
    "text": "Maha Ashtami Pushpanjali: 18 Oct 11:15 AM"
  },
  {
    "id": "chip-2",
    "icon": "flame",
    "text": "Sandhi Pujo: 18 Oct 04:15 PM"
  },
  {
    "id": "chip-3",
    "icon": "music",
    "text": "Dhunuchi Dnce Competition: 20 Oct 12:30 PM"
  }
],
  sponsorship_tiers: [
  {
    "id": "platinum",
    "title": "Title / Platinum Partner",
    "amount": "₹1,50,000",
    "numericAmount": 100000,
    "tag": "Maximum Brand Dominance",
    "isHighlight": false,
    "deliverables": [
      "Exclusive Prime Stage LED Backdrop Branding",
      "Grand Pandal Entrance Archway Branding",
      "Prime Anandamela Stall Space (Panchami Evening)",
      "Prime 10'×10' stall + 4 banners (entrance foyer)",
      "Prominent Logo on Homepage & Digital Carousel",
      "Maha Navami stage felicitation & 10th-Year plaque"
    ]
  },
  {
    "id": "gold",
    "title": "Associate Sponsor",
    "amount": "₹100,000",
    "numericAmount": 50000,
    "tag": "High Visibility",
    "isHighlight": true,
    "deliverables": [
      "Segment ownership (e.g., Maha Bhog food distribution)",
      "Dedicated Food / Promotional Stall Space",
      "30-sec LED ad-spots during performance",
      "Logo on Official Website & Carousel",
      "8'×8' stall + 2 dining/food-zone banners",
      "Half-page Coffee Table Book ad"
    ]
  },
  {
    "id": "cultural",
    "title": "Cultural Stage Partner",
    "amount": "₹50,000",
    "numericAmount": 40000,
    "tag": "Pratibimb Stage Sponsor",
    "isHighlight": false,
    "deliverables": [
      "Segment branding (e.g., \"Talent Arena powered by [Your Brand]\" or Antakshari Finale)",
      "3 strategic corporate standees on walkway",
      "Continuous MC acknowledgements",
      "Quarter-page book ad / logo placement"
    ]
  },
  {
    "id": "food_bhog",
    "title": "Stall & Banner Combo",
    "amount": "₹35,000",
    "numericAmount": 35000,
    "tag": "Visible placement",
    "isHighlight": false,
    "deliverables": [
      "Deliverables: 8'×8' space in foyer, table, 2 chairs, electrical point",
      "On-ground: 1 strategic banner/standee in main hall or dining zone"
    ]
  },
  {
    "id": "silver",
    "title": "Pure Banner Display",
    "amount": "₹20,000",
    "numericAmount": 25000,
    "tag": "Township Reach",
    "isHighlight": false,
    "deliverables": [
      "Deliverables: Cost-effective, high visual recall — no manpower needed",
      "On-ground: 2 standard roll-up standees or 6'×3' flex banners in premium pedestrian zones"
    ]
  }
],
  gallery_videos: [
  {
    "id": "1788538459075",
    "title": "Dance Drama - Dugga Elo",
    "youtubeUrl": "https://youtu.be/p-G9CGKuobo?si=HxczbjqY5nZdgJsv",
    "youtubeVideoId": "p-G9CGKuobo",
    "category": "Pratibimb Stage",
    "year": "2022",
    "description": "",
    "dateAdded": "2026-09-04T16:14:19.075Z"
  }
]
};

/**
 * Returns snapshot data for a specific table or config key.
 */
export function getSnapshotData<T = any>(key: string, fallback: T): T {
  const cleanKey = key.replace(/^config_/, "");
  if (cleanKey in SEED_SNAPSHOT && SEED_SNAPSHOT[cleanKey] !== undefined) {
    return SEED_SNAPSHOT[cleanKey] as T;
  }
  return fallback;
}
