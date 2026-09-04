# 1. Software Requirements Specification (SRS)
## PBEL City Durgotsav 2026 Web Platform

### 1. Executive Summary & Objective
The **PBEL City Durgotsav Web Platform** is a high-performance, mobile-first, luxury festive web application developed for **PBEL Sanskritik Samiti**, Hyderabad. The platform serves as the central digital hub for over 5,000 residents and visitors across the 6-day Durga Pujo celebrations (15th to 20th October 2026), providing:
- Real-time Pujo Nirghanto ritual timings and Pratibimb cultural stage schedules.
- Curated day-wise fixed E-Seva and Maha Bhog sponsorship booking.
- Dedicated Devotee Wall of Honor (`/wall-of-honor`) with Tower & Date filtering, resident name/flat search, and printable Devotional Keepsake Memento Cards.
- Dedicated Photo & Video Gallery (`/gallery`) with YouTube Video Showcase CMS and official social channels.
- Zero-fee direct bank UPI contributions (`pbelsanskritiksamiti@icici`) and secure direct-token E-Receipt generation.
- Resident volunteer shift registration across specialized duty domains.
- Pratibimb cultural stage performance slot applications.
- Corporate sponsorship showcase and marketing deck.
- Secure Admin CMS control center for real-time donor reconciliation, typo correction, wall visibility toggles, schedule editing, and content management.

---

### 2. Festival Scope & Timeline (6 Days)
- **Maha Panchami (15 Oct 2026):** Agomoni Songs, Anandamela Food Fiesta, Pandal Lighting & Cultural Inauguration.
- **Maha Sashti (16 Oct 2026):** Pratima Sthapana, Devi Bodhon, Amantran & Adhibas, Sandhya Aarti.
  - ⭐ **PSS Flagship Headliner 1:** **Retro Rock by Fushmontor (08:15 PM start, 1.5 Hours / 90 mins)**.
- **Maha Saptami (17 Oct 2026):** Nabapatrika (Kola Bou) Snan & Pravesh, Pushpanjali, Afternoon Maha Bhog.
  - ⭐ **PSS Flagship Headliner 2:** **Dance Drama Production by PBEL Sanskritik Samiti (07:45 PM start, 1.0 Hour / 60 mins)**.
- **Maha Ashtami (18 Oct 2026):** Kumari Puja, Maha Ashtami Pushpanjali, Sandhi Pujo (108 Lotuses & 108 Deepam), Dhaak Jugalbandi.
  - ⭐ **PSS Flagship Headliner 3:** **Grand Bangla Theatrical Drama (Natok) by PBEL Sanskritik Samiti (07:45 PM start, 1.0 Hour / 60 mins)**.
- **Maha Nabami (19 Oct 2026):** Navami Maha Yajna & Havan, Grand Community Feast, Pratibimb Participant Awards & DJ Dandiya Finale.
- **Vijaya Dashami (20 Oct 2026):** Darpan Visarjan, Devi Baran, Sindoor Khela, Dhunuchi Naach, Shanti Jal & Visarjan Shobha Yatra.

---

### 3. User Personas & Roles

| Persona | Description | Key Capabilities |
| :--- | :--- | :--- |
| **PBEL Resident / Visitor** | Community members accessing the site via WhatsApp links on mobile or laptop. | View 6-day rituals & stage line-up, book fixed Seva/Bhog, view Wall of Honor, download Devotional Keepsake Memento Cards, apply for cultural performance slots, register for volunteer duties. |
| **Corporate Sponsor** | Corporate marketing managers & local brand sponsors. | Review corporate ROI, township footfall demographics (1,500+ apartments, 5,000+ residents), download sponsorship deck PDF, view tier visibility. |
| **Performer / Artist** | Township residents participating in Pratibimb cultural evenings. | Register performance slots (Solo, Duet, Group, Drama), submit song/act titles, specify required duration (3-5m / 5-8m). |
| **Volunteer** | Resident volunteers helping in pujo operations. | Choose preferred duty domain (Bhog Distribution, Pujo Assistance, Stage Team, Pandal Flow) and date slots. |
| **Core Committee Admin** | PBEL Sanskritik Samiti executive members. | Live donor CRM, typo editor, 1-click wall visibility toggle, dynamic schedule editor, corporate sponsor publishing, gallery photo/video CMS, volunteer/performer roster export. |

---

### 4. Functional Requirements

#### 4.1 Home Page & Hero Experience
- **FR-01:** Hero banner displaying festive greetings, dates (15 - 20 Oct 2026), township venue, and quick-action CTA buttons.
- **FR-02:** Live aggregated contribution counter fetching verified donations (`status = 'Success'`) and member pass totals in real-time.
- **FR-03:** Embedded Zero-Friction Quick Contribution Card on Homepage:
  - Instant quick-select chips (₹251, ₹501, ₹1,001, ₹2,001, ₹5,001) and custom input.
  - Direct Society Bank UPI QR Code (`pbelsanskritiksamiti@icici`) + 1-Click Pay on Mobile (GPay/PhonePe/Paytm).
  - Devotee details & 12-digit UPI UTR/Ref capture for committee reconciliation.
  - Instant printable E-Receipt generation.
- **FR-04:** 6-day interactive timeline preview cards with 1-click deep linking to `/programs?day=id` and golden highlight badges for the 3 PSS Flagship Headliners (*Fushmontor*, *Dance Drama*, *Grand Natok*).
- **FR-05:** Featured fixed Seva offerings with 1-click booking redirection.
- **FR-06:** Pratibimb cultural stage highlight banner with call-to-action to register acts.
- **FR-07:** Corporate sponsorship ribbon highlighting sponsor logos with fallback error handling.
- **FR-08:** Streamlined 3-Card Media Teaser linking to `/gallery` and the official YouTube channel.
- **FR-09:** Wall of Contributors section with direct navigation to the dedicated `/wall-of-honor`.

#### 4.2 Contribute & E-Seva Portal (`/contribute`)
- **FR-10:** Dual-Mode Navigation Switcher:
  - *Mode 1 (Default / Prominent):* General Open Contribution with instant quick chips (₹251 to ₹11,000), custom amount input, Dynamic UPI QR Scanner, and 1-Click Mobile Pay.
  - *Mode 2:* Day-wise Fixed Seva Catalog with curated packages (Flowers, Sweets, Maha Bhog, 108 Lotuses, Kumari Puja, Grand Patrons) and locked-amount checkout.
- **FR-11:** Anti-Fraud Two-Tier Status & Reconciliation System:
  - Online submissions record initial status as `Pending Verification`.
  - Admin Donor CRM includes 1-click **"Approve (✓)"** and **"Reject (✕)"** actions to verify against society ICICI bank statements before showing on the public Wall of Contributors or summing into the live ticker.
- **FR-12:** Zero-Fee Bank Transfer: All payments strictly routed to official VPA `pbelsanskritiksamiti@icici` (PBEL Sanskritik Samiti) with 0% gateway deductions.
- **FR-13:** WhatsApp Sharing Modal with interactive checkbox:
  - Allows donor to decide whether to include their receipt link and number.
  - Omits financial contribution amounts to protect personal donor privacy.

#### 4.3 Devotee Wall of Honor (`/wall-of-honor`)
- **FR-14:** Dedicated community honor roll displaying verified devotee offerings.
- **FR-15:** Dynamic Seva Category Resolution: Each devotee card displays their exact offering category (e.g., *Maha Ashtami Flowers*, *Maha Ashtami Morning Puja*, *Maha Ashtami Bhog*) mapped from database relations.
- **FR-16:** Date Filtering: Interactive calendar date selector allowing visitors to filter offerings by specific date.
- **FR-17:** Resident Name and Flat Number Search: Fast live search matching devotee name, flat number (e.g. `1106`, `Tower D`), or seva category.
- **FR-18:** Tower Filter Chips: Filter contributions across all 14 PBEL towers (Tower A to K, Sapphire, Jade, etc.) and Well Wishers.
- **FR-19:** Devotional Keepsake Memento Card:
  - Replaces static card footer with an interactive "Memento Card 🪔" trigger.
  - Opens a sacred keepsake certificate inscribed *"Thank you for being part of PBEL Durgotsav 2026"*.
  - Displays Devotee Name, PBEL Tower & Flat, exact Seva Category, and auspicious date.
  - Strictly contains **no monetary amounts**.
  - Provides 1-click "Print / Save Memento" and "Share on WhatsApp" actions.

#### 4.4 Dedicated Media Gallery (`/gallery`)
- **FR-20:** Dedicated photo gallery with responsive grid and category filtering.
- **FR-21:** YouTube Video Showcase CMS: Embedded privacy-compliant YouTube players (`youtube-nocookie.com`) supporting all YouTube URL formats (watch, shorts, live, embed, youtu.be).
- **FR-22:** Official Social Links: Header and banner links to official YouTube, Instagram, and Facebook channels.

#### 4.5 Official Contribution Receipt (`/receipt`)
- **FR-23:** Strict Direct-Token Security: Direct lookup by unique receipt token/ID (`/receipt?id=...`) to prevent open public browsing of donor financial data.
- **FR-24:** Privacy Protection Screen: Informational notice displayed when accessed without an ID, routing inquiries to the committee.
- **FR-25:** Standalone WhatsApp Share Button: Top action button operates standalone even when modals are omitted, targeting the contributor's phone number directly when available.

#### 4.6 Executive Admin Control Center (`/admin`)
- **FR-26:** Authentication Barrier: Master admin login (`admin` / `PBEL@2026`) with hardened credentials.
- **FR-27:** Contributor Typo Editor & Wall Visibility Toggle:
  - 1-click `Eye` / `EyeOff` toggle to switch devotee display between Public and "Devout Well Wisher".
  - Edit modal allowing committee to correct resident typos in name and flat number safely.
- **FR-28:** YouTube Video Showcase CMS: Add, manage, and order YouTube video links in real time.
- **FR-29:** Seva Sponsor Publisher: Filter and format sponsor lists by category (All, Maha Bhog, Sweets, General) for 1-click copying.
- **FR-30:** 1-Click WhatsApp Receipt Direct Sender: Send official receipt certificates directly to the donor's WhatsApp number.

---

### 5. Non-Functional Requirements (NFR)
- **NFR-01 (Performance):** Sub-2-second initial page load on 4G mobile connections. Prerendered static pages with client-side reactive state.
- **NFR-02 (Mobile-First Responsiveness):** 100% optimized for iOS Safari, Android Chrome, and Desktop with floating bottom navigation on mobile devices.
- **NFR-03 (Security & Privacy):** Contributor monetary amounts concealed from public cards. Direct token lookup for receipts. TLS encrypted Supabase queries.
- **NFR-04 (Cost & Hosting):** Zero operational cost using Vercel Free Tier (Frontend Edge) + Supabase Free Tier (PostgreSQL Database).
- **NFR-05 (Automated Testing):** Comprehensive regression test suite with 154 automated tests across 72 suites (`test/regression.test.mjs`).
