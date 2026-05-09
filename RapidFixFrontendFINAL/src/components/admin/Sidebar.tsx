"use client";
import { useEffect } from "react";
import { C, NAV } from "@/lib/constants";
import type { Role, Page } from "@/lib/types";

interface SidebarProps {
  page: Page;
  setPage: (p: Page) => void;
  role: Role;
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({
  page,
  setPage,
  role,
  isOpen,
  onClose,
}: SidebarProps) {
  const nav = NAV.filter((item) => role === "owner" || !item.ownerOnly);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    onClose();
  }, [page]);

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      <style>{`
        .sidebar {
          width: 216px;
          background: ${C.sb};
          display: flex;
          flex-direction: column;
          border-right: 1px solid ${C.sbBorder};
          flex-shrink: 0;
          user-select: none;
          transition: transform 0.22s ease;
          z-index: 100;
        }
        @media (max-width: 768px) {
          .sidebar {
            position: fixed;
            top: 0; left: 0;
            height: 100vh;
            transform: ${isOpen ? "translateX(0)" : "translateX(-100%)"};
          }
          .sidebar-overlay {
            display: ${isOpen ? "block" : "none"};
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.4);
            z-index: 99;
          }
        }
        @media (min-width: 769px) {
          .sidebar { transform: none !important; }
          .sidebar-overlay { display: none !important; }
        }
      `}</style>

      {/* Overlay for mobile */}
      <div className="sidebar-overlay" onClick={onClose} />

      <div className="sidebar">
        {/* Logo */}
        <div
          style={{
            padding: "18px 18px 14px",
            borderBottom: `1px solid ${C.sbBorder}`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: 5,
                background: C.accent,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <i
                className="ti ti-tool"
                style={{ color: "#fff", fontSize: 15 }}
              />
            </div>
            <div>
              <div
                style={{
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: 14,
                  lineHeight: 1.2,
                }}
              >
                RepairOS
              </div>
              <div style={{ color: C.sbText, fontSize: 10 }}>
                Workshop Manager
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "6px 0" }}>
          {nav.map((item) => {
            const active = page === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setPage(item.id)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 9,
                  padding: "9px 20px 9px 16px",
                  background: active ? C.sbActive : "transparent",
                  border: "none",
                  borderLeft: `2px solid ${active ? C.accent : "transparent"}`,
                  color: active ? "#fff" : C.sbText,
                  fontSize: 13,
                  fontWeight: active ? 500 : 400,
                  cursor: "pointer",
                  textAlign: "left",
                  fontFamily: "inherit",
                }}
              >
                <i
                  className={`ti ${item.icon}`}
                  style={{ fontSize: 15, flexShrink: 0 }}
                />
                {item.label}
                {item.badge ? (
                  <span
                    style={{
                      marginLeft: "auto",
                      background: C.accent,
                      color: "#fff",
                      borderRadius: 10,
                      fontSize: 10,
                      fontWeight: 600,
                      padding: "1px 6px",
                    }}
                  >
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>

        {/* User */}
        <div
          style={{ padding: "14px 16px", borderTop: `1px solid ${C.sbBorder}` }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: C.accent,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 10,
                color: "#fff",
                fontWeight: 600,
                flexShrink: 0,
              }}
            >
              {role === "owner" ? "RO" : "MK"}
            </div>
            <div>
              <div style={{ color: "#fff", fontSize: 12, fontWeight: 500 }}>
                {role === "owner" ? "Rajesh (Owner)" : "Ramesh K."}
              </div>
              <div style={{ color: C.sbText, fontSize: 10 }}>
                {role === "owner" ? "Full Access" : "Mechanic View"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
