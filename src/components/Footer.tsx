"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

interface FooterProps {
  dictionary: {
    header: {
      home: string;
      transportSolutions: string;
      schoolTransport: string;
      staffTransport: string;
      vipTransfer: string;
      carRental: string;
      eventOrganization: string;
      sustainability: string;
    };
    footer: {
      aboutTitle: string;
      aboutDescription: string;
      quickLinksTitle: string;
      contactTitle: string;
      phoneTitle: string;
      emailTitle: string;
      addressTitle: string;
      addressValue: string;
      copyright: string;
      privacyPolicy: string;
      termsOfUse: string;
    };
  };
  lang: string;
}

export default function Footer({ dictionary, lang }: FooterProps) {
  return (
    <footer className="bg-white text-primary">
      {/* Ana Footer İçeriği */}
      <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {/* Hakkımızda Bölümü */}
          <div className="space-y-4">
            <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">{dictionary.footer.aboutTitle}</h3>
            <p className="text-primary/80 text-sm md:text-base leading-relaxed">
              {dictionary.footer.aboutDescription}
            </p>

            {/* Sosyal Medya İkonları */}
            <div className="flex gap-3 pt-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border-2 border-primary hover:border-primary flex items-center justify-center transition-all duration-300 hover:bg-primary hover:text-white hover:scale-110"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border-2 border-primary hover:border-primary flex items-center justify-center transition-all duration-300 hover:bg-primary hover:text-white hover:scale-110"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border-2 border-primary hover:border-primary flex items-center justify-center transition-all duration-300 hover:bg-primary hover:text-white hover:scale-110"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="mailto:info@kayalarturizm.com"
                className="w-10 h-10 rounded-full border-2 border-primary hover:border-primary flex items-center justify-center transition-all duration-300 hover:bg-primary hover:text-white hover:scale-110"
                aria-label="E-posta"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Hızlı Bağlantılar */}
          <div className="space-y-4">
            <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">{dictionary.footer.quickLinksTitle}</h3>
            <nav className="flex flex-col space-y-3">
              <Link
                href={`/${lang}`}
                className="text-primary hover:text-primary/70 transition-colors duration-300 text-sm md:text-base hover:translate-x-2 inline-block"
              >
                {dictionary.header.home}
              </Link>
              {/*<Link
                href="/kurumsal"
                className="text-primary hover:text-primary/70 transition-colors duration-300 text-sm md:text-base hover:translate-x-2 inline-block"
              >
                KURUMSAL
              </Link>*/}
              <div className="space-y-2 pl-4">
                <p className="text-primary/70 text-sm md:text-base font-semibold">
                  {dictionary.header.transportSolutions}
                </p>
                <Link
                  href={`/${lang}/school-transport`}
                  className="block text-primary hover:text-primary/70 transition-colors duration-300 text-sm hover:translate-x-2"
                >
                  • {dictionary.header.schoolTransport}
                </Link>
                <Link
                  href={`/${lang}/staff-transport`}
                  className="block text-primary hover:text-primary/70 transition-colors duration-300 text-sm hover:translate-x-2"
                >
                  • {dictionary.header.staffTransport}
                </Link>
                <Link
                  href={`/${lang}/vip-transfer`}
                  className="block text-primary hover:text-primary/70 transition-colors duration-300 text-sm hover:translate-x-2"
                >
                  • {dictionary.header.vipTransfer}
                </Link>
                <Link
                  href={`/${lang}/car-rental`}
                  className="block text-primary hover:text-primary/70 transition-colors duration-300 text-sm hover:translate-x-2"
                >
                  • {dictionary.header.carRental}
                </Link>
                <Link
                  href={`/${lang}/event-organization`}
                  className="block text-primary hover:text-primary/70 transition-colors duration-300 text-sm hover:translate-x-2"
                >
                  • {dictionary.header.eventOrganization}
                </Link>
              </div>
              <Link
                href={`/${lang}/sustainability`}
                className="text-primary hover:text-primary/70 transition-colors duration-300 text-sm md:text-base hover:translate-x-2 inline-block"
              >
                {dictionary.header.sustainability}
              </Link>
              {/*<Link
                href="/bize-ulasin"
                className="text-primary hover:text-primary/70 transition-colors duration-300 text-sm md:text-base hover:translate-x-2 inline-block"
              >
                BİZE ULAŞIN
              </Link>*/}
            </nav>
          </div>

          {/* İletişim Bilgileri ve Logo */}
          <div className="space-y-6">
            {/* Logo */}
            <div className="mb-6">
              <Image
                src="/logo.png"
                alt="Aktur Turizm Logo"
                width={250}
                height={50}
                priority
              />
            </div>

            <h3 className="text-xl md:text-2xl font-bold">{dictionary.footer.contactTitle}</h3>

            <div className="space-y-4 text-sm md:text-base">
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-primary">{dictionary.footer.phoneTitle}</p>
                  <a
                    href="tel:05535042085"
                    className="text-primary/80 hover:text-primary transition-colors"
                  >
                    (+90) 553 504 20 85
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-primary">{dictionary.footer.emailTitle}</p>
                  <a
                    href="mailto:info@akturtourism.com"
                    className="text-primary/80 hover:text-primary transition-colors break-all"
                  >
                    info@akturtourism.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-primary">{dictionary.footer.addressTitle}</p>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Hasanpaşa+Mah.+Ahmet+Rasim+Sk.+No:13/3+Kadiköy/İstanbul,+Türkiye"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary/80 leading-relaxed hover:text-primary transition-colors"
                  >
                    {dictionary.footer.addressValue}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alt Footer - Copyright */}
      <div className="border-t border-primary/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-primary/70">
            <p className="text-center md:text-left">
              {dictionary.footer.copyright.replace('{year}', new Date().getFullYear().toString())}
            </p>
            <div className="flex gap-6">
              <Link
                href={`/${lang}/privacy-policy`}
                className="hover:text-primary transition-colors"
              >
                {dictionary.footer.privacyPolicy}
              </Link>
              <Link
                href={`/${lang}/terms-of-use`}
                className="hover:text-primary transition-colors"
              >
                {dictionary.footer.termsOfUse}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}