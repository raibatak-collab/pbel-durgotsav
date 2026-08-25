# 🌺 PBEL City Durgotsav 2026 Web Platform
> **Official Digital Hub for PBEL Sanskritik Samiti, Hyderabad**  
> *6 Days of Celebration: 15th to 20th October 2026 (Panchami to Dashami)*

- **🌐 Live Production Website:** [https://pbel-durgotsav.vercel.app](https://pbel-durgotsav.vercel.app)
- **📦 Official GitHub Repository:** [https://github.com/raibatak-collab/pbel-durgotsav](https://github.com/raibatak-collab/pbel-durgotsav)
- **💳 Official Society Bank UPI ID:** `pbelsanskritiksamiti@icici` (0% Gateway Fees)

---

## 📖 Complete SDLC Documentation Suite

All software engineering and project management documents are available in this directory:

1. **[01_Requirements_Specification.md](./01_Requirements_Specification.md):** Functional & Non-Functional Requirements, 6-Day Festival Scope (Panchami to Dashami), Seva Catalog, and User Personas.
2. **[02_Architecture.md](./02_Architecture.md):** JAMStack Serverless Edge Architecture, Component Decomposition, Data Workflows, and Zero-Cost Sizing.
3. **[03_Design_Specifications.md](./03_Design_Specifications.md):** Royal Crimson & Gold Visual Identity, Glassmorphism Tokens, Typography, and Mobile UX Guidelines.
4. **[04_Database_and_ERD.md](./04_Database_and_ERD.md):** Relational Schema Definitions, PostgreSQL Data Dictionary, and Mermaid Entity Relationship Diagram (ERD).
5. **[05_Test_Specifications.md](./05_Test_Specifications.md):** Automated Regression Test Suite (`regression.test.mjs`), QA Test Execution Matrix, Functional Validation, and Acceptance Criteria.
6. **[06_Supabase_Schema.sql](./06_Supabase_Schema.sql):** Master PostgreSQL DDL script with table constraints, default seed categories, and super admin role.
7. **[07_Admin_and_Deployment_Guide.md](./07_Admin_and_Deployment_Guide.md):** Production Vercel Deployment manual, CI/CD Pipeline, and 9-Module Admin CMS Operations Guide.

---

## 🚀 Quick Start & Automated Testing

The Next.js 16 application is located in the `pbel-durgotsav` subfolder.

```bash
# 1. Navigate to the project directory
cd pbel-durgotsav

# 2. Run Automated Regression Test Suite
npm test

# 3. Production Build and Type Check
npm run build

# 4. Start local development server
npm run dev
# Local URL: http://localhost:3000
```

---

## 🌟 Key Application Modules

- **🏠 Homepage Zero-Friction Contribution (`/`):** Instant quick donation widget with chips (₹251, ₹501, ₹1,001, ₹2,001, ₹5,001), Dynamic Society Bank UPI QR Code (`pbelsanskritiksamiti@icici`), 1-Click Pay on Mobile, and live verified fund ticker.
- **🌺 Dual-Mode Contribute & E-Seva Storefront (`/contribute`):** Mode 1: General Open Contribution (Top) vs Mode 2: 18-package curated Seva catalog with locked amounts and instant verified E-Receipts.
- **🛡️ Anti-Fraud & Reconciliation CRM (`/admin`):** Online submissions recorded as `Pending Verification` with 1-click committee Approve (✓) / Reject (✕) actions against ICICI bank statement match before displaying on public Wall of Contributors.
- **📅 6-Day Pujo Nirghanto & Pratibimb Stage (`/programs`):** Interactive daily switcher with ritual timings, afternoon bhog, the 3 PSS Flagship Headliners (*Fushmontor*, *Dance Drama*, *Grand Natok*), and resident performance registration.
- **🤝 Volunteer Seva Roster (`/volunteer`):** Shift selection across Bhog Distribution, Purohit Seva, Stage Team, and Pandal Flow.
- **🖼️ Gallery Carousel CMS (`/admin`):** Drag-and-drop image file upload from device directly into the Homepage Carousel and Fullscreen Lightbox.

---

## 🛠️ Technology Stack

- **Frontend:** Next.js 16 (App Router), React 19, Tailwind CSS v4, Lucide Icons
- **Database & Backend:** Supabase (PostgreSQL 15+ Managed Cloud)
- **Deployment & Hosting:** Vercel Global Edge Network (Free Tier Zero Cost)
- **CI/CD:** Automated GitHub + Vercel deployment with Node.js regression testing
