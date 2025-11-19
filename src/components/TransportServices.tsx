"use client";

import React from "react";
import Link from "next/link";

const TransportServices = () => {
  const services = [
    {
      id: 1,
      title: "Öğrenci Taşımacılığı",
      image: "/ogrenci-tasimaciligi.jpg",
      alt: "Öğrenci Taşımacılığı",
      href: "/school-transport",
    },
    {
      id: 2,
      title: "Personel Taşımacılığı",
      image: "/personel-tasima.jpg",
      alt: "Personel Taşımacılığı",
      href: "/staff-transport",
    },
    {
      id: 3,
      title: "VIP Transfer Çözümleri",
      image: "/vip-transfer.jpg",
      alt: "VIP Transfer Çözümleri",
      href: "/vip-transfer",
    },
    {
      id: 4,
      title: "Araç Kiralama Hizmetleri",
      image: "/arac-kiralama.jpg",
      alt: "Araç Kiralama Hizmetleri",
      href: "/car-rental",
    },
    {
      id: 5,
      title: "Etkinlik ve Organizasyon Taşımacılığı",
      image: "/etkinlik-organizasyon.jpg",
      alt: "Etkinlik ve Organizasyon Taşımacılığı",
      href: "/event-organization",
    },
  ];

  return (
    <section className="py-50 px-4 bg-primary">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-28">
          {services.map((service, index) => (
              <Link
                key={service.id}
                href={service.href || "#"}
                className={`relative group overflow-hidden rounded-lg shadow-lg cursor-pointer h-64 md:h-80 ${
                  services.length % 2 !== 0 && index === services.length - 1
                    ? "md:col-span-2 md:w-1/2 md:mx-auto"
                    : ""
                }`}
              >
                {/* Resim */}
                <img
                  src={service.image}
                  alt={service.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-transparent"></div>

                {/* Başlık */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white text-2xl font-semibold mb-2">
                    {service.title}
                  </h3>
                  <div className="w-32 h-1 bg-white"></div>
                </div>

                {/* Hover Efekti */}
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors duration-300"></div>
              </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TransportServices;
