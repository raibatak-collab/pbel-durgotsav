# 5. Automated Test Specifications & QA Execution Matrix
## PBEL City Durgotsav 2026 Web Platform

### 1. Test Execution Summary

The platform is guarded by an automated regression test suite executed via Node.js test runner:
```powershell
npm test
```
- **Current Test Coverage**: **154 automated tests across 72 suites**.
- **Passing Rate**: **100% (154/154 passing, 0 failures)**.
- **Execution Speed**: ~2.1 seconds.

---

### 2. Test Suite Architecture (Suites 1 to 72)

- **Suites 1-50**: Core domain testing covering UPI URI construction, payment security, PAN validation, number-to-words currency formatting, tower mapping, volunteer slots, cultural acts parsing, and budget expense serialization.
- **Suites 51-60**: Member aggregation (₹7,500 family passes), Top sponsor ribbon error boundaries, Seva catalog day filtering, Nirghanto chronological sorting.
- **Suites 61-68**: Admin CMS persistence, sponsorship tier packages, official receipt generation, QR poster assets, OpenGraph link preview metadata.
- **Suite 69: Devotee Privacy Protection & Admin Tools**:
  - Direct token lookup on `/receipt?id=...` with privacy fallback against open browsing.
  - DevotionalShareModal receipt checkbox toggle without broadcasting amounts.
  - Admin Seva sponsor copy tool and receipt generator.
- **Suite 70: 80G Deactivation, Committee Hardening & Dedicated Gallery**:
  - 80G checkbox deactivation across all contributor touchpoints.
  - Official committee directory synchronization with live DB (7 wings).
  - YouTube video ID parser supporting watch, shorts, live, embed, and youtu.be.
  - Dedicated `/gallery` route, Top Navigation link, and Admin YouTube CMS.
- **Suite 71: Wall of Honor, Contributor Management & Homepage Teaser**:
  - Admin typo editing and 1-click wall visibility toggle.
  - Dedicated `/wall-of-honor` route with search, tower filters, and impact counters.
  - Streamlined 3-card homepage gallery spotlight teaser.
- **Suite 72: Receipt WhatsApp Sharing, Exact Seva Categories, Keepsake Memento & Date Filter**:
  - Standalone WhatsApp share execution on `OfficialContributionReceipt.tsx` when modals are omitted.
  - Admin receipt modal passing active WhatsApp sender callback.
  - Wall of Honor exact category resolution querying `contribution_categories(name)`.
  - Devotional Keepsake Memento Card modal rendering commemorative message without monetary amounts.
  - Wall of Honor date filtering and resident name/flat search.
