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

export default function Footer() {
  return (
    <footer className="bg-white text-primary">
      {/* Ana Footer İçeriği */}
      <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {/* Hakkımızda Bölümü */}
          <div className="space-y-4">
            <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">
              HAKKIMIZDA
            </h3>
            <p className="text-primary/80 text-sm md:text-base leading-relaxed">
              Aktur Turizm, yıllarin verdiği deneyim ve güvenle ulaşım
              sektöründe lider konumda olan bir firmadır. Okul servis
              taşımacılığından personel taşımacılığına, özel transfer
              hizmetlerinden araç kiralamaya kadar geniş bir hizmet yelpazesi
              sunmaktayız.
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
            <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">
              HIZLI BAĞLANTILAR
            </h3>
            <nav className="flex flex-col space-y-3">
              <Link
                href="/"
                className="text-primary hover:text-primary/70 transition-colors duration-300 text-sm md:text-base hover:translate-x-2 inline-block"
              >
                ANA SAYFA
              </Link>
              {/*<Link
                href="/kurumsal"
                className="text-primary hover:text-primary/70 transition-colors duration-300 text-sm md:text-base hover:translate-x-2 inline-block"
              >
                KURUMSAL
              </Link>*/}
              <div className="space-y-2 pl-4">
                <p className="text-primary/70 text-sm md:text-base font-semibold">
                  ULAŞIM ÇÖZÜMLERİ
                </p>
                <Link
                  href="/school-transport"
                  className="block text-primary hover:text-primary/70 transition-colors duration-300 text-sm hover:translate-x-2"
                >
                  • Okul Servis Taşımacılığı
                </Link>
                <Link
                  href="/staff-transport"
                  className="block text-primary hover:text-primary/70 transition-colors duration-300 text-sm hover:translate-x-2"
                >
                  • Personel Taşımacılığı
                </Link>
                <Link
                  href="/vip-transfer"
                  className="block text-primary hover:text-primary/70 transition-colors duration-300 text-sm hover:translate-x-2"
                >
                  • VIP Transfer Hizmetleri
                </Link>
                <Link
                  href="/car-rental"
                  className="block text-primary hover:text-primary/70 transition-colors duration-300 text-sm hover:translate-x-2"
                >
                  • Araç Kiralama
                </Link>
                <Link
                  href="/event-organization"
                  className="block text-primary hover:text-primary/70 transition-colors duration-300 text-sm hover:translate-x-2"
                >
                  • Etkinlik ve Organizasyon
                </Link>
              </div>
              <Link
                href="/sustainability"
                className="text-primary hover:text-primary/70 transition-colors duration-300 text-sm md:text-base hover:translate-x-2 inline-block"
              >
                SÜRDÜRÜLEBİLİRLİK
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

            <h3 className="text-xl md:text-2xl font-bold">İLETİŞİM</h3>

            <div className="space-y-4 text-sm md:text-base">
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-primary">Telefon</p>
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
                  <p className="font-semibold text-primary">E-posta</p>
                  <a
                    href="mailto:info@aktur.org"
                    className="text-primary/80 hover:text-primary transition-colors break-all"
                  >
                    info@aktur.org
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-primary">Adres</p>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Hasanpaşa+Mah.+Ahmet+Rasim+Sk.+No:13/3+Kadiköy/İstanbul,+Türkiye"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary/80 leading-relaxed hover:text-primary transition-colors"
                  >
                    Hasanpaşa Mah. Ahmet Rasim Sk. No:13/3 Kadiköy/İstanbul, Türkiye
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
              © {new Date().getFullYear()} Aktur Turizm. Tüm hakları saklıdır.
            </p>
            <div className="flex gap-6">
              <Link
                href="/gizlilik-politikasi"
                className="hover:text-primary transition-colors"
              >
                Gizlilik Politikası
              </Link>
              <Link
                href="/kullanim-kosullari"
                className="hover:text-primary transition-colors"
              >
                Kullanım Koşulları
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}