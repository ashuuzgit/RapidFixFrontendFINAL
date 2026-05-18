"use client";
import { useAuth } from "@/app/context/AuthContext";
import { LoginForm } from "@/components/admin/atoms/LoginForm";
import  Admin  from "@/components/admin/Admin"; // your existing admin shell
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin",
  description: "RapidFix Admin Panel.",
  robots: { index: false, follow: false }, // never index admin pages
};

export default function AdminPage() {
  const { staff, loading } = useAuth();

  if (loading)
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f3f5f7",
          fontSize: 13,
          color: "#6b7280",
        }}
      >
        Loading…
      </div>
    );

  if (!staff) return <LoginForm />;

  return <Admin staff={staff} />;
}
