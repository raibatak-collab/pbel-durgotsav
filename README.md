# 🌺 PBEL City Durgotsav 2026 Web Platform
> **Official Digital Hub for PBEL Sanskritik Samiti, Hyderabad**  
> *6 Days of Celebration: 15th to 20th October 2026 (Panchami to Dashami)*

- **🌐 Live Production Website:** [https://www.pbelcitydurgotsav.com](https://www.pbelcitydurgotsav.com)
- **📦 Official GitHub Repository:** [https://github.com/raibatak-collab/pbel-durgotsav](https://github.com/raibatak-collab/pbel-durgotsav)
- **💳 Official Society Bank UPI ID:** `pbelsanskritiksamiti@icici` (0% Gateway Fees)

---

## 📖 Complete SDLC Documentation Suite

All software engineering and project management documents are maintained in this repository:

1. **[01_Requirements_Specification.md](./docs/01_Requirements_Specification.md):** Functional & Non-Functional Requirements, Seva Catalog, Devotee Wall of Honor, Memento Cards, Media Gallery, and Admin Controls.
2. **[02_Architecture.md](./docs/02_Architecture.md):** JAMStack Serverless Edge Architecture, 18-Route Inventory, Component Hierarchy, and Data Privacy Design.
3. **[03_Design_Specifications.md](./docs/03_Design_Specifications.md):** Sacred Crimson & Gold Design System, Devotee Wall of Honor UI, and Devotional Keepsake Memento Card specifications.
4. **[04_Database_and_ERD.md](./docs/04_Database_and_ERD.md):** PostgreSQL Schema, Entity Relationship Diagram (ERD), and Data Dictionary.
5. **[05_Test_Specifications.md](./docs/05_Test_Specifications.md):** Automated Regression Test Suite (154 tests across 72 suites), Acceptance Criteria, and QA Matrix.
6. **[06_Supabase_Schema.sql](./docs/06_Supabase_Schema.sql):** Master PostgreSQL DDL script with table constraints and default seed categories.
7. **[07_Admin_and_Deployment_Guide.md](./docs/07_Admin_and_Deployment_Guide.md):** Production Vercel Deployment manual and 10-Module Admin CMS Operations Guide.

---

## 🚀 Quick Start & Automated Testing

The Next.js 16 application is located in the `pbel-durgotsav` directory.

```bash
# 1. Navigate to the project directory
cd pbel-durgotsav

# 2. Run Automated Regression Test Suite (154 tests across 72 suites)
npm test

# 3. Production Build and Type Check
npm run build

# 4. Start local development server
npm run dev
# Local URL: http://localhost:3000
```

---

## 🌟 Key Application Modules

- **🏠 Homepage Zero-Friction Contribution (`/`):** Instant quick donation widget with chips, Dynamic Bank UPI QR Code, 1-Click Mobile Pay, and live verified fund ticker.
- **🌺 Dual-Mode Contribute & E-Seva Storefront (`/contribute`):** Mode 1: General Open Contribution vs Mode 2: Curated Seva catalog with locked amounts and instant verified E-Receipts.
- **📜 Devotee Wall of Honor (`/wall-of-honor`):** Dedicated honor roll with exact seva offerings, Tower filter chips, Date filter, Resident Name/Flat search, and printable Devotional Keepsake Memento Cards.
- **🎥 Media & Video Gallery (`/gallery`):** Curated photo gallery and YouTube Video Showcase CMS with official YouTube, Instagram, and Facebook channels.
- **🛡️ Anti-Fraud & Reconciliation CRM (`/admin`):** Real-time donor CRM, typo correction, 1-click wall visibility toggle, schedule editor, and sponsor publisher.
- **📅 6-Day Pujo Nirghanto & Pratibimb Stage (`/programs`):** Interactive daily switcher with ritual timings and resident performance registration.
- **🤝 Volunteer Seva Roster (`/volunteer`):** Shift selection across Bhog Distribution, Purohit Seva, Stage Team, and Pandal Flow.

---

## 🛠️ Technology Stack

- **Frontend:** Next.js 16 (App Router), React 19, Turbopack, Tailwind CSS v4, Lucide Icons
- **Database & Backend:** Supabase (PostgreSQL 15+ Managed Cloud)
- **Deployment:** Vercel Edge CDN with Automatic Continuous Deployment
