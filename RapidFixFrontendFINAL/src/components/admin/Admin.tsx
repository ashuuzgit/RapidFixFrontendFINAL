"use client";
import { useState } from "react";
import { C } from "@/lib/constants";
import { useAuth } from "../../app/context/AuthContext";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { Dashboard } from "./pages/Dashboard";
import { Jobs } from "./pages/Jobs";
import { Bills } from "./pages/Bills";
import { Bookings } from "./pages/Bookings";
import { Customers } from "./pages/Customer";
import { Leads } from "./pages/Leads";
import { Inbox } from "./pages/Inbox";
import { Settings } from "./pages/Settings";
import type { Page, StaffPayload } from "@/lib/types";

interface AdminProps {
  staff: StaffPayload; // comes from AuthContext — role is real, from the JWT
}

export default function Admin({ staff }: AdminProps) {
  const { logout } = useAuth();
  const [page, setPage] = useState<Page>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Mechanics can only see the jobs page — enforce it here
  const effectivePage: Page =
    staff.role === "mechanic" && page !== "jobs" ? "jobs" : page;

  const renderPage = () => {
    switch (effectivePage) {
      case "dashboard":
        return <Dashboard setPage={setPage} />;
      case "jobs":
        return <Jobs role={staff.role} />;
      case "bills":
        return <Bills />;
      case "bookings":
        return <Bookings />;
      case "customers":
        return <Customers />;
      case "leads":
        return <Leads />;
      case "inbox":
        return <Inbox />;
      case "settings":
        return <Settings />;
      default:
        return <Dashboard setPage={setPage} />;
    }
  };

  return (
    <>
      <style>{`
        .cf-row:hover { background: #f9fafb !important; }
        * { box-sizing: border-box; }
        button:focus-visible { outline: 2px solid ${C.accent}; outline-offset: 2px; }
      `}</style>

      <div
        style={{
          display: "flex",
          fontFamily:
            "-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif",
          minHeight: "100vh",
          background: C.bg,
          fontSize: 13,
        }}
      >
        <Sidebar
          page={effectivePage}
          setPage={setPage}
          role={staff.role}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
          }}
        >
          <Topbar
            page={effectivePage}
            staff={staff} // pass full staff so Topbar can show name + role
            onMenuToggle={() => setSidebarOpen((prev) => !prev)}
            onLogout={logout}
          />
          <main style={{ flex: 1, padding: "22px", overflowY: "auto" }}>
            {renderPage()}
          </main>
        </div>
      </div>
    </>
  );
}
