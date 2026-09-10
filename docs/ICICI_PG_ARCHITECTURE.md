# ICICI Payment Gateway Architecture & Reconciliation Design

## 1. Core Integration Flow
The PBEL City Durgotsav platform uses the **ICICI Pay (Direct Mode) v2** Integration. 
- **Initiation**: The frontend calls our `/api/payment/icici/initiate` route. We dynamically build a payload, strictly hash it using V1 Concatenation logic (as expected by ICICI UAT despite v2 endpoint), and POST it to ICICI.
- **Redirection**: On `R1000` success, the user is redirected via the browser to the ICICI Checkout screen using `redirectURI` and `tranCtx`.
- **Callback**: Upon checkout completion, ICICI performs a form POST back to `/api/payment/icici/callback`. Our server verifies the payload signature, matches the `merchantTxnNo` to our Supabase database, updates the status to `Approved`, and issues a `303 See Other` redirect to seamlessly transition the user's browser to the `/receipt` page.

## 2. Boundary Cases & Edge Scenarios

### 2.1 Connectivity Loss & Browser "Back" Button
If a user completes a successful payment on the ICICI portal but loses their internet connection during the redirect, or manually closes the browser/clicks "Back", the browser POST callback to our server will never happen. 
**Handling**: The transaction will remain `Pending` in the Supabase database. This is a standard PG edge case. 

### 2.2 Server-to-Server Reconciliation (Status API)
To catch orphaned transactions from Scenario 2.1, we implement Server-to-Server Reconciliation using the **ICICI Transaction Status API** (Interface Document Chapter 12).
- The Admin Portal will feature a **"Sync with ICICI"** capability. 
- The backend will directly query ICICI using `merchantTxnNo`.
- If ICICI responds with `txnStatus: "SUC"`, the backend safely updates the Supabase record to `Approved` and triggers the official receipt generation.

### 2.3 Session Timeouts & Failures
If the ICICI session times out or the card is declined, the callback (if reached) or Status API will return `txnStatus: "REJ"` or `ERR`. The Supabase record will automatically be marked as `Failed`, releasing the booking lock on any limited categories (e.g., specific sponsorship tiers).

### 2.4 Refunds (Refund/Auth/Void API)
If reconciliation discovers a duplicate charge, or if the user pays but the requested Seva limit is suddenly breached, the admin can trigger the **ICICI Refund API** (Chapter 11) using the original `merchantTxnNo`.

## 3. Database Updates
The Supabase `contributions` table handles the core tracking. 
*Current State*: Tracks via `payment_id` (`merchantTxnNo`).
*Pending Update*: A new schema column `pg_bank_ref_no` (varchar) will be added to securely store the `txnID` (ICICI's unique reference) returned during the callback for financial auditing.
