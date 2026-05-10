import type {
  JobStatus,
  BookingStatus,
  BillStatus,
  LeadStatus,
  NavItem,
  Page,
} from "./types";

// ── Design tokens ─────────────────────────────────────────────────────────────

export const C = {
  sb: "#1b2332",
  sbBorder: "#26344a",
  sbText: "#7d97b8",
  sbActive: "#243044",
  accent: "#f48024",
  bg: "#f3f5f7",
  surface: "#ffffff",
  border: "#e1e5eb",
  borderFaint: "#f0f2f5",
  text: "#1a202c",
  textSec: "#6b7280",
  textMuted: "#9ca3af",
  danger: "#ef4444",
  success: "#10b981",
  warning: "#f59e0b",
  info: "#3b82f6",
} as const;

// ── Status display config ─────────────────────────────────────────────────────

export const JOB_STATUS_CFG: Record<
  JobStatus,
  { bg: string; text: string; dot: string; label: string }
> = {
  received: {
    bg: "#f0fdf4",
    text: "#166534",
    dot: "#16a34a",
    label: "Received",
  },
  diagnosed: {
    bg: "#fffbeb",
    text: "#92400e",
    dot: "#f59e0b",
    label: "Diagnosed",
  },
  in_progress: {
    bg: "#eff6ff",
    text: "#1d4ed8",
    dot: "#3b82f6",
    label: "In Progress",
  },
  ready: { bg: "#f0fdf4", text: "#065f46", dot: "#10b981", label: "Ready" },
  delivered: {
    bg: "#f1f5f9",
    text: "#475569",
    dot: "#94a3b8",
    label: "Delivered",
  },
};

export const BOOKING_STATUS_CFG: Record<
  BookingStatus,
  { bg: string; text: string; dot: string; label: string }
> = {
  pending: { bg: "#f9fafb", text: "#374151", dot: "#9ca3af", label: "Pending" },
  confirmed: {
    bg: "#eff6ff",
    text: "#1d4ed8",
    dot: "#3b82f6",
    label: "Confirmed",
  },
  converted: {
    bg: "#f0fdf4",
    text: "#065f46",
    dot: "#10b981",
    label: "Converted",
  },
  arrived: { bg: "#f0fdf4", text: "#065f46", dot: "#10b981", label: "Arrived" },
  cancelled: {
    bg: "#fef2f2",
    text: "#991b1b",
    dot: "#ef4444",
    label: "Cancelled",
  },
};

export const BILL_STATUS_CFG: Record<
  BillStatus,
  { bg: string; text: string; dot: string; label: string }
> = {
  draft: { bg: "#f1f5f9", text: "#475569", dot: "#94a3b8", label: "Draft" },
  sent: { bg: "#eff6ff", text: "#1d4ed8", dot: "#3b82f6", label: "Sent" },
  paid: { bg: "#f0fdf4", text: "#065f46", dot: "#10b981", label: "Paid" },
  partial: { bg: "#fff7ed", text: "#9a3412", dot: "#ea580c", label: "Partial" },
  unpaid: { bg: "#fffbeb", text: "#92400e", dot: "#f59e0b", label: "Unpaid" },
};

export const LEAD_STATUS_CFG: Record<
  LeadStatus,
  { bg: string; text: string; dot: string; label: string }
> = {
  new: { bg: "#eff6ff", text: "#1d4ed8", dot: "#3b82f6", label: "New" },
  follow_up: {
    bg: "#fff7ed",
    text: "#9a3412",
    dot: "#ea580c",
    label: "Follow up",
  },
  converted: {
    bg: "#f0fdf4",
    text: "#065f46",
    dot: "#10b981",
    label: "Converted",
  },
  spam: { bg: "#fef2f2", text: "#991b1b", dot: "#ef4444", label: "Spam" },
};

export const BOOKING_SOURCE_CFG: Record<string, { bg: string; text: string }> =
  {
    online: { bg: "#eff6ff", text: "#1d4ed8" },
    whatsapp: { bg: "#f0fdf4", text: "#166534" },
    phone: { bg: "#faf5ff", text: "#6d28d9" },
    walkin: { bg: "#fff7ed", text: "#9a3412" },
  };

export const JOB_STATUS_ORDER: JobStatus[] = [
  "received",
  "diagnosed",
  "in_progress",
  "ready",
  "delivered",
];

// ── Navigation ────────────────────────────────────────────────────────────────

export const NAV: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: "ti-layout-dashboard",
    ownerOnly: true,
  },
  { id: "jobs", label: "Jobs", icon: "ti-tool" },
  { id: "bookings", label: "Bookings", icon: "ti-calendar", ownerOnly: true },
  { id: "bills", label: "Bills", icon: "ti-receipt", ownerOnly: true },
  { id: "customers", label: "Customers", icon: "ti-users", ownerOnly: true },
  { id: "leads", label: "Leads", icon: "ti-message-circle-2", ownerOnly: true },
  { id: "inbox", label: "Inbox", icon: "ti-inbox", ownerOnly: true },
  { id: "settings", label: "Settings", icon: "ti-settings", ownerOnly: true },
];
