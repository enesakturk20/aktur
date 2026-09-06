import "./globals.css";
import type { ReactNode } from "react";
import { getDictionary } from "./get-dictionary";
import { Locale } from "./i18n-config";
import { Outfit } from "next/font/google";

const outfit = Outfit({ 
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const lang = resolvedParams.lang as Locale;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.akturturizm.com";

  return {
    metadataBase: new URL(siteUrl),
    title: {
      template: "%s | Aktur Turizm",
      default: "Aktur Turizm",
    },
    description: "Kurumsal Turizm Çözümleri",
    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon.ico",
      apple: "/apple-touch-icon.png",
    },
    alternates: {
      languages: {
        tr: "/tr",
        en: "/en",
      },
    },
    openGraph: {
      title: "Aktur Turizm",
      description: "Kurumsal Turizm Çözümleri",
      url: `${siteUrl}/${lang}`,
      siteName: "Aktur Turizm",
      locale: lang === "tr" ? "tr_TR" : "en_US",
      type: "website",
      images: [
        {
          url: "/logo.png",
          width: 800,
          height: 600,
          alt: "Aktur Turizm",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Aktur Turizm",
      description: "Kurumsal Turizm Çözümleri",
      images: ["/logo.png"],
    },
  };
}

import LayoutWrapper from "@/components/LayoutWrapper";

export default async function RootLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const resolvedParams = await params;
  const dictionary = await getDictionary(resolvedParams.lang as Locale);

  return (
    <html lang={resolvedParams.lang} className={`${outfit.variable} font-sans`}>
      <body className="antialiased font-sans bg-background text-foreground transition-colors duration-300">
        <LayoutWrapper dictionary={dictionary} lang={resolvedParams.lang as Locale}>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  );
}
