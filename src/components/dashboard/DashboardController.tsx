"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SuperAdminDashboard from "./SuperAdminDashboard";
import CompanyDashboard from "./CompanyDashboard";
import DriverDashboard from "./DriverDashboard";

interface DashboardControllerProps {
  dictionary: any;
  lang: string;
}

export default function DashboardController({ dictionary, lang }: DashboardControllerProps) {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("aktur_token");
    const userRaw = localStorage.getItem("aktur_user");

    if (!token || !userRaw) {
      router.replace(`/${lang}/portal`);
      return;
    }

    try {
      const parsedUser = JSON.parse(userRaw);
      setUser(parsedUser);
      // Backend roles might be "SuperAdmin", while frontend login sets activeTab as "company" or "vehicle"
      // If we eventually get role from JWT/backend, we map it here. For now, we trust local storage.
      setRole(parsedUser.role);
    } catch (e) {
      localStorage.removeItem("aktur_token");
      localStorage.removeItem("aktur_user");
      router.replace(`/${lang}/portal`);
      return;
    }

    setIsLoading(false);
  }, [lang, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Render specific dashboard based on role
  const normalizedRole = role ? role.toLowerCase() : "";

  if (normalizedRole === "superadmin") {
    return <SuperAdminDashboard dictionary={dictionary} lang={lang} user={user} />;
  }

  if (normalizedRole === "company") {
    return <CompanyDashboard dictionary={dictionary} lang={lang} user={user} />;
  }

  if (normalizedRole === "vehicle" || normalizedRole === "driver") {
    return <DriverDashboard dictionary={dictionary} lang={lang} user={user} />;
  }

  // Fallback if role is unknown
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
      <h2 className="text-xl font-bold text-slate-800 mb-4">Unauthorized or Unknown Role</h2>
      <button
        onClick={() => {
          localStorage.removeItem("aktur_token");
          localStorage.removeItem("aktur_user");
          router.replace(`/${lang}/portal`);
        }}
        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90"
      >
        Return to Login
      </button>
    </div>
  );
}
