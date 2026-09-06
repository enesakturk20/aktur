"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image"

interface TransportServicesProps {
  dictionary: {
    title: string;
    description: string;
    serviceList: {
      title: string;
      alt: string;
    }[];
  };
  lang: string;
}

const TransportServices = ({ dictionary, lang }: TransportServicesProps) => {
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
    <section className="py-24 md:py-32 px-4 bg-slate-50 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-[100px]"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full bg-secondary/5 blur-[120px]"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-800 mb-4 tracking-tight">Hizmetlerimiz</h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full"></div>
          <p className="mt-6 text-slate-500 max-w-2xl mx-auto text-lg">Aktur Turizm olarak, konforlu, güvenli ve ayrıcalıklı yolculuk deneyimleri sunuyoruz.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {serviceData.map((service, index) => (
            <Link
              key={service.id}
              href={`/${lang}${service.href}` || "#"}
              className={`relative group overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 ease-out h-[320px] md:h-[400px] ${
                serviceData.length % 2 !== 0 && index === serviceData.length - 1
                  ? "md:col-span-2 lg:col-span-1 lg:w-full md:w-2/3 md:mx-auto"
                  : ""
              } animate-fade-in-up`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Resim */}
              <Image
                fill
                src={service.image}
                alt={dictionary.serviceList[index]?.alt || ""}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500"></div>

              {/* Content */}
              <div className="absolute inset-0 p-8 flex flex-col justify-end transform transition-transform duration-500">
                <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="text-white text-2xl md:text-3xl font-bold mb-3 tracking-tight drop-shadow-md">
                    {dictionary.serviceList[index]?.title || ""}
                  </h3>
                  <div className="w-12 h-1 bg-primary rounded-full group-hover:w-full transition-all duration-500 ease-out mb-4"></div>
                  
                  {/* Ekstra Detay - Hover'da görünür */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 flex items-center text-white/90 text-sm font-medium">
                    <span>Detayları İncele</span>
                    <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TransportServices;
