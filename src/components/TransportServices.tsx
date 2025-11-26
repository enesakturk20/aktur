"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image"

interface TransportServicesProps {
  dictionary: {
    title: string; // Bu başlık henüz bileşende kullanılmıyor ama ileride eklenebilir.
    description: string;
    serviceList: {
      title: string;
      alt: string;
    }[];
  };
  lang: string;
}

const TransportServices = ({ dictionary, lang }: TransportServicesProps) => {
  // Metin dışındaki veriler (resim, link vb.) burada kalabilir.
  const serviceData = [
    {
      id: 1,
      image: "/ogrenci-tasimaciligi.jpg",
      href: "/school-transport",
    },
    {
      id: 2,
      image: "/personel-tasima.jpg",
      href: "/staff-transport",
    },
    {
      id: 3,
      image: "/vip-transfer.jpg",
      href: "/vip-transfer",
    },
    {
      id: 4,
      image: "/arac-kiralama.jpg",
      href: "/car-rental",
    },
    {
      id: 5,
      image: "/etkinlik-organizasyon.jpg",
      href: "/event-organization",
    },
  ];

  return (
    <section className="py-50 px-4 bg-primary">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-28">
          {serviceData.map((service, index) => (
              <Link
                key={service.id}
                href={`/${lang}${service.href}` || "#"}
                className={`relative group overflow-hidden rounded-lg shadow-lg cursor-pointer h-64 md:h-80 ${
                  serviceData.length % 2 !== 0 && index === serviceData.length - 1
                    ? "md:col-span-2 md:w-1/2 md:mx-auto"
                    : ""
                }`}
              >
                {/* Resim */}
                <Image
                  fill
                  src={service.image}
                  alt={dictionary.serviceList[index].alt} // Metni dictionary'den al
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-transparent"></div>

                {/* Başlık */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white text-2xl font-semibold mb-2">
                    {dictionary.serviceList[index].title} {/* Metni dictionary'den al */}
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
