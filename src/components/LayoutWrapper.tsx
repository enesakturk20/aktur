"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "../../public/icons/WhatsAppButton";
import { ReactNode } from "react";

interface LayoutWrapperProps {
  children: ReactNode;
  dictionary: any;
  lang: string;
}

export default function LayoutWrapper({ children, dictionary, lang }: LayoutWrapperProps) {
  const pathname = usePathname() || "";
  const isRegisterPage = pathname.includes("/student-register/");
  const isPortalPage = pathname.includes("/portal");

  // If we are on these pages, do not render header and footer.
  if (isRegisterPage || isPortalPage) {
    return (
      <div className="bg-slate-50 min-h-screen animate-fade-in-up">
        <main>{children}</main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header dictionary={dictionary.header} lang={lang} />
      <main className="flex-grow pt-[88px] lg:pt-[96px] animate-fade-in-up">
        {children}
      </main>
      <WhatsAppButton />
      <Footer dictionary={{ header: dictionary.header, footer: dictionary.footer }} lang={lang} />
    </div>
  );
}
