"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { authService } from "@/services";

interface PortalLoginFormProps {
  dictionary: {
    title: string;
    subtitle: string;
    companyTab: string;
    driverTab: string;
    email: string;
    emailPlaceholder: string;
    plate: string;
    platePlaceholder: string;
    password: string;
    passwordPlaceholder: string;
    loginButton: string;
    loggingIn: string;
    errorInvalid: string;
    errorGeneric: string;
    successMessage: string;
    backToHome: string;
  };
}

export default function PortalLoginForm({ dictionary }: PortalLoginFormProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<"company" | "vehicle">("company");
  const [email, setEmail] = useState("");
  const [plate, setPlate] = useState("");
  const [password, setPassword] = useState("");

  // Status states
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Auto-redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("aktur_token");
    const userRaw = localStorage.getItem("aktur_user");
    if (token && userRaw) {
      const lang = pathname.split("/")[1] || "tr";
      router.replace(`/${lang}/portal/dashboard`);
    }
  }, []);

  // Auto-format plate: Uppercase and remove excessive spaces
  const handlePlateChange = (val: string) => {
    let formatted = val.toUpperCase();
    // Allow letters, numbers and spaces
    formatted = formatted.replace(/[^A-Z0-9 ]/g, "");
    setPlate(formatted);
  };

  const handleLogout = () => {
    authService.logout();
    window.location.reload();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsLoading(true);

    try {
      let data;
      if (activeTab === "company") {
        if (!email.trim() || !password.trim()) {
          setErrorMsg(dictionary.errorInvalid);
          setIsLoading(false);
          return;
        }
        data = await authService.companyLogin(email, password);
      } else {
        if (!plate.trim() || !password.trim()) {
          setErrorMsg(dictionary.errorInvalid);
          setIsLoading(false);
          return;
        }
        data = await authService.vehicleLogin(plate, password);
      }

      if (data && data.token) {
        const actualRole = authService.decodeRole(data.token, activeTab);
        authService.saveSession(data.token, {
          name: data.name,
          email: data.email,
          role: actualRole,
        });

        setSuccessMsg(dictionary.successMessage);
        const lang = pathname.split("/")[1] || "tr";
        router.push(`/${lang}/portal/dashboard`);
      } else {
        setErrorMsg(dictionary.errorGeneric);
      }
    } catch (err: any) {
      if (err?.status === 400 || err?.status === 401 || err?.status === 404) {
        setErrorMsg(dictionary.errorInvalid);
      } else {
        setErrorMsg(dictionary.errorGeneric);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 transition-all duration-300 hover:shadow-2xl">
        <div className="p-8">
          {/* Logo & Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative w-[280px] h-[95px] mb-4">
              <Image
                src="/logo.png"
                alt="Aktur Turizm Logo"
                fill
                style={{ objectFit: "contain" }}
                priority
              />
            </div>
            <p className="text-sm text-slate-500 font-medium text-center">
              {dictionary.subtitle}
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex bg-slate-100 p-1 rounded-xl mb-8 border border-slate-200">
            <button
              type="button"
              onClick={() => {
                setActiveTab("company");
                setErrorMsg(null);
              }}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 ${activeTab === "company"
                  ? "bg-white text-primary shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
                }`}
            >
              {dictionary.companyTab}
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("vehicle");
                setErrorMsg(null);
              }}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 ${activeTab === "vehicle"
                  ? "bg-white text-primary shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
                }`}
            >
              {dictionary.driverTab}
            </button>
          </div>

          {/* Feedback Messages */}
          {errorMsg && (
            <div className="mb-6 p-4 bg-rose-50 border-l-4 border-rose-500 rounded-r-xl flex items-start space-x-3 text-rose-700 animate-shake">
              <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="text-sm font-medium">{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-6 p-4 bg-emerald-50 border-l-4 border-emerald-500 rounded-r-xl flex items-start space-x-3 text-emerald-700">
              <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium">{successMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {activeTab === "company" ? (
              /* Company Form Fields */
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  {dictionary.email}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={dictionary.emailPlaceholder}
                    disabled={isLoading}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent focus:bg-white transition-all duration-200"
                  />
                </div>
              </div>
            ) : (
              /* Vehicle Form Fields */
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  {dictionary.plate}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10M21 16V10a2 2 0 00-2-2h-3V5a1 1 0 00-1-1H9" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={plate}
                    onChange={(e) => handlePlateChange(e.target.value)}
                    placeholder={dictionary.platePlaceholder}
                    disabled={isLoading}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent focus:bg-white transition-all duration-200 font-mono tracking-wider"
                  />
                </div>
              </div>
            )}

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                {dictionary.password}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={dictionary.passwordPlaceholder}
                  disabled={isLoading}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent focus:bg-white transition-all duration-200"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3.5 px-4 text-white font-bold rounded-xl transition-all duration-200 shadow-lg ${isLoading
                  ? "bg-slate-400 cursor-not-allowed shadow-none"
                  : "bg-primary hover:bg-opacity-95 hover:shadow-xl active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                }`}
            >
              {isLoading ? dictionary.loggingIn : dictionary.loginButton}
            </button>
          </form>

          {/* Go back to home page */}
          <div className="mt-6 text-center">
            <a
              href="/"
              className="text-sm font-semibold text-slate-400 hover:text-primary transition-colors inline-flex items-center space-x-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>{dictionary.backToHome}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
