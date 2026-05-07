import {
  JOB_STATUS_CFG,
  BOOKING_STATUS_CFG,
  BILL_STATUS_CFG,
  LEAD_STATUS_CFG,
} from "@/lib/constants";
import type {
  JobStatus,
  BookingStatus,
  BillStatus,
  LeadStatus,
} from "@/lib/types";

type AnyStatus = JobStatus | BookingStatus | BillStatus | LeadStatus;

const ALL_STATUS_CFG = {
  ...JOB_STATUS_CFG,
  ...BOOKING_STATUS_CFG,
  ...BILL_STATUS_CFG,
  ...LEAD_STATUS_CFG,
};

export function Badge({ status }: { status: AnyStatus }) {
  const s = ALL_STATUS_CFG[status];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "2px 8px",
        borderRadius: 3,
        fontSize: 11,
        fontWeight: 500,
        background: s.bg,
        color: s.text,
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: s.dot,
          flexShrink: 0,
        }}
      />
      {s.label}
    </span>
  );
}
