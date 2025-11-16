"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="Kayalar Turizm Logo"
            width={250}
            height={50}
            priority
          />
        </Link>

        {/* Menü (masaüstü) */}
        <nav className="hidden md:flex space-x-8 items-center">
          <Link
            href="/"
            className="text-gray-700 hover:text-primary transition-colors font-medium"
          >
            ANA SAYFA
          </Link>
          <Link
            href="/kurumsal"
            className="text-gray-700 hover:text-primary transition-colors font-medium"
          >
            KURUMSAL
          </Link>

          {/* Dropdown */}
          <div className="relative group">
            <button className="text-gray-700 hover:text-primary transition-colors font-medium flex items-center">
              ULAŞIM ÇÖZÜMLERİ
              <svg
                className="w-4 h-4 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </button>

            <ul className="absolute left-0 mt-2 w-64 bg-white rounded-md shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <li>
                <Link
                  href="/ulasim-cozumleri/okul-servis-tasimaciligi"
                  className="block px-4 py-2 text-gray-800 hover:bg-primary hover:text-white"
                >
                  Okul Servis Taşımacılığı
                </Link>
              </li>
              <li>
                <Link
                  href="/ulasim-cozumleri/personel-tasimaciligi"
                  className="block px-4 py-2 text-gray-800 hover:bg-primary hover:text-white"
                >
                  Personel Taşımacılığı
                </Link>
              </li>
              <li>
                <Link
                  href="/ulasim-cozumleri/ozel-transfer-hizmetleri"
                  className="block px-4 py-2 text-gray-800 hover:bg-primary hover:text-white"
                >
                  Özel Transfer Hizmetleri
                </Link>
              </li>
              <li>
                <Link
                  href="/ulasim-cozumleri/arac-kiralama"
                  className="block px-4 py-2 text-gray-800 hover:bg-primary hover:text-white"
                >
                  Araç Kiralama
                </Link>
              </li>
            </ul>
          </div>

          <Link
            href="/bize-ulasin"
            className="text-gray-700 hover:text-primary transition-colors font-medium"
          >
            BİZE ULAŞIN
          </Link>
        </nav>

        {/* Mobil menü butonu */}
        <button
          className="md:hidden text-gray-700 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobil menü */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-lg border-t border-gray-100">
          <nav className="flex flex-col items-center space-y-4 py-4">
            <Link
              href="/"
              className="text-gray-700 hover:text-primary font-medium"
              onClick={() => setMenuOpen(false)}
            >
              ANA SAYFA
            </Link>
            <Link
              href="/kurumsal"
              className="text-gray-700 hover:text-primary font-medium"
              onClick={() => setMenuOpen(false)}
            >
              KURUMSAL
            </Link>

            {/* Mobil Dropdown */}
            <div className="flex flex-col items-center space-y-2">
              <span className="text-gray-700 font-medium">
                ULAŞIM ÇÖZÜMLERİ
              </span>
              <Link
                href="/ulasim-cozumleri/okul-servis-tasimaciligi"
                className="text-gray-700 hover:text-primary font-medium"
                onClick={() => setMenuOpen(false)}
              >
                Okul Servis Taşımacılığı
              </Link>
              <Link
                href="/ulasim-cozumleri/personel-tasimaciligi"
                className="text-gray-700 hover:text-primary font-medium"
                onClick={() => setMenuOpen(false)}
              >
                Personel Taşımacılığı
              </Link>
              <Link
                href="/ulasim-cozumleri/ozel-transfer-hizmetleri"
                className="text-gray-700 hover:text-primary font-medium"
                onClick={() => setMenuOpen(false)}
              >
                Özel Transfer Hizmetleri
              </Link>
              <Link
                href="/ulasim-cozumleri/arac-kiralama"
                className="text-gray-700 hover:text-primary font-medium"
                onClick={() => setMenuOpen(false)}
              >
                Araç Kiralama
              </Link>
            </div>

            <Link
              href="/bize-ulasin"
              className="text-gray-700 hover:text-primary font-medium"
              onClick={() => setMenuOpen(false)}
            >
              BİZE ULAŞIN
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
