/**
 * PBEL City Durgotsav 2026 - Security & Validation Utilities
 * Enterprise-grade input sanitization, anti-tamper validations, and Calendar Generators
 */

/**
 * Strips dangerous HTML tags, script injections, and event handlers from text inputs.
 */
export function sanitizeText(input: string | null | undefined): string {
  if (!input) return "";
  return String(input)
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<[^>]+>/g, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "")
    .replace(/[\u0000-\u0008\u000B-\u000C\u000E-\u001F]/g, "")
    .trim();
}

/**
 * Validates that a donation/seva amount is a positive integer within valid boundaries.
 */
export function validateDonationAmount(amount: any, min = 10, max = 1000000): { isValid: boolean; parsedAmount: number; error?: string } {
  const num = Number(amount);
  if (isNaN(num) || !Number.isInteger(num)) {
    return { isValid: false, parsedAmount: 0, error: "Amount must be a valid whole number." };
  }
  if (num < min) {
    return { isValid: false, parsedAmount: num, error: `Minimum seva offering is ₹${min}.` };
  }
  if (num > max) {
    return { isValid: false, parsedAmount: num, error: `Maximum seva offering is ₹${max.toLocaleString('en-IN')}.` };
  }
  return { isValid: true, parsedAmount: num };
}

/**
 * Validates a 10-digit Indian mobile / WhatsApp number.
 */
export function validatePhoneNumber(phone: string | null | undefined): boolean {
  if (!phone) return false;
  const cleaned = phone.replace(/[^0-9]/g, "");
  return /^(\+?91)?[6789]\d{9}$/.test(cleaned) || cleaned.length === 10;
}

/**
 * Generates an RFC 5545 compliant .ics calendar event content string.
 */
export function generateIcsContent(event: {
  title: string;
  description: string;
  location?: string;
  startDate: string; // YYYY-MM-DD
  startTime: string; // e.g. "10:30 AM" or "08:15 PM"
  durationMinutes?: number;
}): string {
  const location = event.location || "PBEL City Community Arena, Hyderabad, Telangana";
  const duration = event.durationMinutes || 90;

  // Parse time into 24-hour format
  const [timeStr, modifier] = event.startTime.trim().split(/\s+/);
  let [hours, minutes] = (timeStr || "10:00").split(":").map(Number);
  if (modifier && modifier.toUpperCase() === "PM" && hours < 12) hours += 12;
  if (modifier && modifier.toUpperCase() === "AM" && hours === 12) hours = 0;

  const [year, month, day] = event.startDate.split("-").map(Number);
  const startDt = new Date(Date.UTC(year, month - 1, day, hours, minutes));
  // Subtract 5.5 hours to convert IST to UTC
  startDt.setMinutes(startDt.getMinutes() - 330);

  const endDt = new Date(startDt.getTime() + duration * 60 * 1000);

  const pad = (n: number) => String(n).padStart(2, "0");
  const formatDate = (d: Date) =>
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;

  const uid = `pbel-durgotsav-2026-${Date.now()}-${Math.random().toString(36).substring(2, 8)}@pbelcity.org`;

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//PBEL Sanskritik Samiti//PBEL Durgotsav 2026//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${formatDate(new Date())}`,
    `DTSTART:${formatDate(startDt)}`,
    `DTEND:${formatDate(endDt)}`,
    `SUMMARY:${sanitizeText(event.title)}`,
    `DESCRIPTION:${sanitizeText(event.description)} - PBEL City Durgotsav 2026`,
    `LOCATION:${sanitizeText(location)}`,
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

/**
 * Generates a direct 1-Click Google Calendar event link.
 */
export function generateGoogleCalendarUrl(event: {
  title: string;
  description: string;
  location?: string;
  startDate: string; // YYYY-MM-DD
  startTime: string; // e.g. "10:30 AM" or "08:15 PM"
  durationMinutes?: number;
}): string {
  const location = event.location || "PBEL City Community Arena, Hyderabad, Telangana";
  const duration = event.durationMinutes || 90;

  const [timeStr, modifier] = event.startTime.trim().split(/\s+/);
  let [hours, minutes] = (timeStr || "10:00").split(":").map(Number);
  if (modifier && modifier.toUpperCase() === "PM" && hours < 12) hours += 12;
  if (modifier && modifier.toUpperCase() === "AM" && hours === 12) hours = 0;

  const [year, month, day] = event.startDate.split("-").map(Number);
  const startDt = new Date(Date.UTC(year, month - 1, day, hours, minutes));
  startDt.setMinutes(startDt.getMinutes() - 330); // Convert IST to UTC

  const endDt = new Date(startDt.getTime() + duration * 60 * 1000);

  const pad = (n: number) => String(n).padStart(2, "0");
  const formatDate = (d: Date) =>
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;

  const datesParam = `${formatDate(startDt)}/${formatDate(endDt)}`;

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: datesParam,
    details: `${event.description}\n\nOrganized by PBEL Sanskritik Samiti • PBEL City Durgotsav 2026`,
    location: location,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Official ICICI Bank EazyPay Terminal Configuration for PBEL Sanskritik Samiti
 */
export const OFFICIAL_BANK_UPI = {
  pa: "pbelsanskritiksamiti@icici",
  pn: "PBEL SANSKRITIK SAMITI",
  tr: "EZYS9347708431",
  mc: "1520",
  cu: "INR",
};

/**
 * Builds an official bank-verified UPI URI for physical QR codes and mobile 1-Click Pay intents.
 * Uses official ICICI EazyPay terminal credentials (mc=1520, tr=EZYS9347708431).
 * Enforces lowercased VPA, literal '@', and NPCI standard upi://pay scheme for maximum P2M compatibility.
 */
export function buildUpiPayUri(options: {
  pa?: string;
  pn?: string;
  am?: number | string;
  tn?: string;
  mc?: string;
  tr?: string;
  appScheme?: "generic" | "gpay" | "phonepe" | "paytm";
}): string {
  const {
    pa = OFFICIAL_BANK_UPI.pa,
    pn = OFFICIAL_BANK_UPI.pn,
    am,
    tn = "Pujo Seva 2026",
    mc = OFFICIAL_BANK_UPI.mc,
    tr = OFFICIAL_BANK_UPI.tr,
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
}

