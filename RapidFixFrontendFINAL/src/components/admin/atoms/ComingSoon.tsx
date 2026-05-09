import { C } from "@/lib/constants";

export function ComingSoon({ label }: { label: string }) {
  return (
    <div
      style={{
        background: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 0",
        gap: 10,
      }}
    >
      <i className="ti ti-hammer" style={{ fontSize: 28, color: "#d1d5db" }} />
      <div style={{ fontSize: 14, fontWeight: 500, color: C.textSec }}>
        {label} — coming soon
      </div>
      <div style={{ fontSize: 12, color: C.textMuted }}>
        This section is under construction
      </div>
    </div>
  );
}