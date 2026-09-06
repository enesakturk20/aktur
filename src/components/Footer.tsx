"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone, ArrowUpRight, Send } from "lucide-react";

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
  const serviceLinks = [
    { label: dictionary.header.schoolTransport, href: `/${lang}/school-transport` },
    { label: dictionary.header.staffTransport, href: `/${lang}/staff-transport` },
    { label: dictionary.header.vipTransfer, href: `/${lang}/vip-transfer` },
    { label: dictionary.header.carRental, href: `/${lang}/car-rental` },
    { label: dictionary.header.eventOrganization, href: `/${lang}/event-organization` },
    { label: dictionary.header.sustainability, href: `/${lang}/sustainability` },
  ];

  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute -bottom-60 -left-40 w-[400px] h-[400px] rounded-full bg-secondary/10 blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-primary/5 blur-[80px]" />
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Top Gradient Accent Line */}
      <div className="h-1 w-full bg-gradient-to-r from-primary via-secondary to-primary" />

      {/* Main Content */}
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 md:pt-20 md:pb-16">
        {/* Logo + Tagline Row */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14 md:mb-16">
          <div className="space-y-4 animate-fade-in-up">
            <p className="max-w-sm text-slate-400 text-sm leading-relaxed">
              {dictionary.footer.aboutDescription}
            </p>
          </div>

          {/* Social Icons — Desktop top-right */}
          <div className="flex gap-3 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            {[
              { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
              { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
              { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
              { icon: Send, href: 'mailto:info@akturtourism.com', label: 'E-mail' },
            ].map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                aria-label={label}
                className="group w-11 h-11 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:bg-primary hover:border-primary hover:text-white hover:scale-110 hover:shadow-lg hover:shadow-primary/25 transition-all duration-300"
              >
                <Icon className="w-[18px] h-[18px] group-hover:scale-110 transition-transform" />
              </a>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-12" />

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Column 1 — Quick Links (Home + About) */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0ms' }}>
            <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-primary-light mb-6">
              {dictionary.footer.quickLinksTitle}
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href={`/${lang}`}
                  className="group flex items-center gap-2 text-slate-300 hover:text-white transition-colors duration-300 text-sm"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/50 group-hover:bg-primary group-hover:shadow-[0_0_8px_rgba(79,70,229,0.6)] transition-all duration-300" />
                  {dictionary.header.home}
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2 — Services */}
          <div className="animate-fade-in-up" style={{ animationDelay: '80ms' }}>
            <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-primary-light mb-6">
              {dictionary.header.transportSolutions}
            </h4>
            <ul className="space-y-3">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-2 text-slate-300 hover:text-white transition-colors duration-300 text-sm"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/50 group-hover:bg-primary group-hover:shadow-[0_0_8px_rgba(79,70,229,0.6)] transition-all duration-300" />
                    {link.label}
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Contact */}
          <div className="animate-fade-in-up" style={{ animationDelay: '160ms' }}>
            <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-primary-light mb-6">
              {dictionary.footer.contactTitle}
            </h4>
            <div className="space-y-5">
              {/* Phone */}
              <a
                href="tel:05535042085"
                className="group flex items-start gap-3 p-3 -m-3 rounded-xl hover:bg-white/5 transition-all duration-300"
              >
                <div className="mt-0.5 w-9 h-9 flex items-center justify-center rounded-lg bg-primary/10 text-primary-light group-hover:bg-primary/20 transition-colors">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">{dictionary.footer.phoneTitle}</p>
                  <p className="text-sm text-slate-200 group-hover:text-white transition-colors">(+90) 553 504 20 85</p>
                </div>
              </a>

              {/* Email */}
              <a
                href="mailto:info@akturtourism.com"
                className="group flex items-start gap-3 p-3 -m-3 rounded-xl hover:bg-white/5 transition-all duration-300"
              >
                <div className="mt-0.5 w-9 h-9 flex items-center justify-center rounded-lg bg-primary/10 text-primary-light group-hover:bg-primary/20 transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">{dictionary.footer.emailTitle}</p>
                  <p className="text-sm text-slate-200 group-hover:text-white transition-colors break-all">info@akturtourism.com</p>
                </div>
              </a>

              {/* Address */}
              <a
                href="https://www.google.com/maps/search/?api=1&query=Hasanpaşa+Mah.+Ahmet+Rasim+Sk.+No:13/3+Kadiköy/İstanbul,+Türkiye"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-3 p-3 -m-3 rounded-xl hover:bg-white/5 transition-all duration-300"
              >
                <div className="mt-0.5 w-9 h-9 flex items-center justify-center rounded-lg bg-primary/10 text-primary-light group-hover:bg-primary/20 transition-colors">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">{dictionary.footer.addressTitle}</p>
                  <p className="text-sm text-slate-200 group-hover:text-white transition-colors leading-relaxed">
                    {dictionary.footer.addressValue}
                  </p>
                </div>
              </a>
            </div>
          </div>

          {/* Column 4 — Map / CTA */}
          <div className="animate-fade-in-up" style={{ animationDelay: '240ms' }}>
            <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-primary-light mb-6">
              Kadıköy, İstanbul
            </h4>
            <div className="rounded-2xl overflow-hidden border border-white/10 shadow-lg shadow-black/20">
              <iframe
                src="https://maps.google.com/maps?q=Hasanpa%C5%9Fa%20Mah.%20Ahmet%20Rasim%20Sk.%20No%3A13%2F3%20Kad%C4%B1k%C3%B6y%2F%C4%B0stanbul&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="160"
                style={{ border: 0, filter: 'grayscale(0.5) brightness(0.7)' }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Aktur Turizm Konum"
              />
            </div>
            <Link
              href={`/${lang}/portal`}
              className="mt-5 flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-300"
            >
              Portal Girişi
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative border-t border-white/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>
            {dictionary.footer.copyright.replace('{year}', new Date().getFullYear().toString())}
          </p>
          <div className="flex gap-6">
            <Link href={`/${lang}/privacy-policy`} className="hover:text-slate-300 transition-colors duration-300">
              {dictionary.footer.privacyPolicy}
            </Link>
            <Link href={`/${lang}/terms-of-use`} className="hover:text-slate-300 transition-colors duration-300">
              {dictionary.footer.termsOfUse}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}