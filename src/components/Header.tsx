"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import LanguageSwitcher from "../app/[lang]/LanguageSwitcher";

interface HeaderProps {
  dictionary: {
    home: string;
    transportSolutions: string;
    schoolTransport: string;
    staffTransport: string;
    vipTransfer: string;
    carRental: string;
    eventOrganization: string;
    sustainability: string;
    portal: string;
  };
  lang: string;
}

export default function Header({ dictionary, lang }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Detailed Solutions Menu Data for Premium Mega Dropdown
  const solutionsData = [
    {
      href: `/${lang}/school-transport`,
      title: dictionary.schoolTransport,
      desc: lang === "tr" ? "Güvenli ve konforlu öğrenci taşımacılığı" : "Safe and comfortable student transport",
      iconColor: "bg-primary/10 text-primary border border-primary/20 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8)]",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
        </svg>
      )
    },
    {
      href: `/${lang}/staff-transport`,
      title: dictionary.staffTransport,
      desc: lang === "tr" ? "Dakik ve verimli personel servis çözümleri" : "Punctual and efficient staff shuttle solutions",
      iconColor: "bg-primary/10 text-primary border border-primary/20 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8)]",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
        </svg>
      )
    },
    {
      href: `/${lang}/vip-transfer`,
      title: dictionary.vipTransfer,
      desc: lang === "tr" ? "Lüks araçlarla ultra konforlu seyahat deneyimi" : "Ultra-comfortable travel experience with luxury fleet",
      iconColor: "bg-primary/10 text-primary border border-primary/20 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8)]",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-1.82.456l1.257 5.273c.114.48-.392.85-.805.607l-4.783-2.825a.562.562 0 00-.58 0l-4.783 2.825c-.413.243-.92-.127-.805-.607l1.257-5.273a.563.563 0 00-.182-.456l-4.204-3.602c-.38-.325-.178-.948.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
        </svg>
      )
    },
    {
      href: `/${lang}/car-rental`,
      title: dictionary.carRental,
      desc: lang === "tr" ? "Esnek vadeli kurumsal filo kiralama seçenekleri" : "Flexible corporate fleet rental solutions",
      iconColor: "bg-primary/10 text-primary border border-primary/20 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8)]",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375M8.25 9.75H16.5m-8.25 0V7.5A2.25 2.25 0 0110.5 5.25h3a2.25 2.25 0 012.25 2.25v2.5" />
        </svg>
      )
    },
    {
      href: `/${lang}/event-organization`,
      title: dictionary.eventOrganization,
      desc: lang === "tr" ? "Kongre, zirve ve toplantı ulaşım organizasyonları" : "Transportation management for summits and congresses",
      iconColor: "bg-primary/10 text-primary border border-primary/20 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8)]",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </svg>
      )
    }
  ];

  return (
    <header
      className={`fixed left-1/2 -translate-x-1/2 z-50 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        scrolled
          ? "top-4 w-[96%] max-w-7xl bg-white/70 backdrop-blur-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border border-white/60 rounded-[2rem] py-2.5"
          : "top-0 w-full bg-white/20 backdrop-blur-md border-b border-white/30 py-5"
      }`}
    >
      <div className="container mx-auto px-6 lg:px-8 flex justify-between items-center">
        {/* Logo */}
        <Link href={`/${lang}`} className="flex items-center group">
          <div className={`relative transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03] ${
            scrolled ? "w-[150px] h-[45px] md:w-[180px] md:h-[50px]" : "w-[170px] h-[50px] md:w-[210px] md:h-[58px]"
          }`}>
            <Image
              src="/logo.png"
              alt="Aktur Turizm Logo"
              fill
              style={{ objectFit: "contain" }}
              priority
            />
          </div>
        </Link>

        {/* Menü (masaüstü) */}
        <nav className="hidden lg:flex items-center">
          <div className="flex space-x-1.5 items-center bg-white/40 backdrop-blur-md px-2 py-1.5 rounded-full border border-white/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] mr-6">
            <Link
              href={`/${lang}`}
              className="group relative px-4 py-2 text-slate-600 hover:text-slate-900 transition-all duration-300 font-medium text-[14px]"
            >
              <span className="relative z-10">{dictionary.home}</span>
              <span className="absolute inset-0 bg-white/80 rounded-full scale-50 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 ease-out shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-white z-0"></span>
            </Link>

            {/* Dropdown */}
            <div className="relative group">
              <button className="group/btn relative px-4 py-2 text-slate-600 hover:text-slate-900 transition-all duration-300 font-medium text-[14px] flex items-center gap-1.5">
                <span className="relative z-10">{dictionary.transportSolutions}</span>
                <svg
                  className="w-4 h-4 relative z-10 transform transition-transform duration-300 group-hover:rotate-180 text-slate-400 group-hover:text-slate-700"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
                <span className="absolute inset-0 bg-white/80 rounded-full scale-50 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 ease-out shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-white z-0"></span>
              </button>

              {/* Premium Dropdown Card (Solid & Primary Icons) */}
              <div className="absolute left-1/2 -translate-x-1/2 mt-5 w-[380px] bg-white rounded-2xl shadow-[0_20px_50px_-10px_rgba(0,0,0,0.1)] border border-slate-100 p-3 opacity-0 invisible translate-y-4 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 ease-out z-50 before:absolute before:-top-5 before:left-0 before:w-full before:h-5">
                <div className="relative space-y-1">
                  {solutionsData.map((item, idx) => (
                    <Link
                      key={idx}
                      href={item.href}
                      className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-50 border border-transparent transition-all duration-200 group/item"
                    >
                      <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ease-out ${item.iconColor} group-hover/item:bg-primary group-hover/item:text-white group-hover/item:scale-105`}>
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <span className="block text-sm font-bold text-slate-800 group-hover/item:text-primary transition-colors mb-1">
                          {item.title}
                        </span>
                        <span className="block text-xs text-slate-500 font-medium leading-relaxed">
                          {item.desc}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <Link
              href={`/${lang}/sustainability`}
              className="group relative px-4 py-2 text-slate-600 hover:text-slate-900 transition-all duration-300 font-medium text-[14px]"
            >
              <span className="relative z-10">{dictionary.sustainability}</span>
              <span className="absolute inset-0 bg-white/80 rounded-full scale-50 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 ease-out shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-white z-0"></span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <LanguageSwitcher />

            <Link
              href={`/${lang}/portal`}
              className="relative overflow-hidden group px-6 py-2.5 bg-slate-900 text-white rounded-full shadow-[0_8px_20px_rgba(15,23,42,0.2)] hover:shadow-[0_10px_25px_rgba(15,23,42,0.3)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-300 font-bold text-xs tracking-widest uppercase flex items-center gap-2 border border-slate-700/50"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary-light opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <svg className="w-4 h-4 text-white/80 group-hover:text-white relative z-10 transition-colors" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
              <span className="relative z-10">{dictionary.portal}</span>
            </Link>
          </div>
        </nav>

        {/* Mobil menü butonu */}
        <button
          className="lg:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobil menü */}
      <div
        className={`lg:hidden absolute left-0 right-0 top-[calc(100%+8px)] bg-white/95 backdrop-blur-xl shadow-2xl border border-slate-200/60 rounded-2xl transition-all duration-300 origin-top ${
          menuOpen ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0 pointer-events-none"
        }`}
      >
        <nav className="flex flex-col px-6 py-6 space-y-4 max-h-[calc(100vh-80px)] overflow-y-auto">
          <Link
            href={`/${lang}`}
            className="text-base text-slate-800 hover:text-primary font-bold transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            {dictionary.home}
          </Link>

          <div className="w-full">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="text-base text-slate-800 hover:text-primary font-bold flex items-center justify-between w-full transition-colors"
            >
              {dictionary.transportSolutions}
              <svg
                className={`w-5 h-5 transform transition-transform duration-300 ${dropdownOpen ? "rotate-180 text-primary" : "text-slate-400"}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>

            <div className={`flex flex-col space-y-3 mt-3 ml-4 overflow-hidden transition-all duration-300 ${dropdownOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"}`}>
              {solutionsData.map((item, idx) => (
                <Link
                  key={idx}
                  href={item.href}
                  className="text-slate-600 hover:text-primary flex items-center gap-3 text-sm font-semibold py-1 transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                  {item.title}
                </Link>
              ))}
            </div>
          </div>

          <Link
            href={`/${lang}/sustainability`}
            className="text-base text-slate-800 hover:text-primary font-bold transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            {dictionary.sustainability}
          </Link>

          <div className="h-px w-full bg-slate-100 my-2"></div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500 text-sm font-semibold">Dil Seçimi</span>
            <LanguageSwitcher />
          </div>

          <Link
            href={`/${lang}/portal`}
            className="mt-4 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-center font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98]"
            onClick={() => setMenuOpen(false)}
          >
            <svg className="w-4 h-4 text-primary-light" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
            {dictionary.portal}
          </Link>
        </nav>
      </div>
    </header>
  );
}
