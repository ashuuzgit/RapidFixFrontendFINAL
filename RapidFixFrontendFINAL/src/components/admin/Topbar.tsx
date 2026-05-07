"use client";

import { C, NAV } from "@/lib/constants";
import type { Page, StaffPayload } from "@/lib/types";

interface TopbarProps {
  page: Page;
  staff: StaffPayload;
  onMenuToggle: () => void;
  onLogout: () => void;
}

export function Topbar({ page, staff, onMenuToggle, onLogout }: TopbarProps) {
  const label = NAV.find((n) => n.id === page)?.label ?? page;

  return (
    <>
      <style>{`
        .topbar-hamburger {
          display: none;
        }

        @media (max-width: 768px) {
          .topbar-hamburger {
            display: flex;
          }
        }
      `}</style>

      <div
        style={{
          height: 50,
          background: C.surface,
          borderBottom: `1px solid ${C.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 22px",
          flexShrink: 0,
          gap: 12,
        }}
      >
        {/* Left */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            className="topbar-hamburger"
            onClick={onMenuToggle}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: C.textSec,
              padding: 0,
              alignItems: "center",
              justifyContent: "center",
            }}
            aria-label="Toggle menu"
          >
            <i className="ti ti-menu-2" style={{ fontSize: 20 }} />
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 11, color: C.textSec }}>RepairOS</span>

            <span style={{ color: "#d1d5db", fontSize: 13 }}>/</span>

            <span
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: C.text,
              }}
            >
              {label}
            </span>
          </div>
        </div>

        {/* Right */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: C.accent,
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              {staff.name?.[0] ?? "U"}
            </div>

            <div style={{ lineHeight: 1.2 }}>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: C.text,
                }}
              >
                {staff.name}
              </div>

              <div
                style={{
                  fontSize: 11,
                  color: C.textSec,
                  textTransform: "capitalize",
                }}
              >
                {staff.role}
              </div>
            </div>
          </div>

          <button
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: C.textSec,
            }}
            aria-label="Notifications"
          >
            <i className="ti ti-bell" style={{ fontSize: 18 }} />
          </button>

          <button
            onClick={onLogout}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#dc2626",
              fontWeight: 500,
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
}
