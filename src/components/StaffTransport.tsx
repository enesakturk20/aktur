"use client";

import React from "react";

const StaffTransport = () => {
  return (
    <div className="min-h-screen bg-primary text-white">
      {/* Hero Section with Image */}
      <div className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 max-w-7xl mx-auto lg:items-center">
          {/* Left - Image */}
          <div className="mt-10 lg:mt-40 px-4 lg:px-0">
            <img
              src="/personel-tasima.jpg"
              alt="Personel Servisleri"
              className="w-full h-full object-contain rounded-lg"
            />
          </div>

          {/* Right - Content */}
          <div className="bg-white p-8 lg:p-16 flex flex-col justify-center mt-8 lg:mt-40 mb-10 rounded-xl shadow-lg lg:shadow-none mx-4 lg:mx-0">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Personel Taşımacılığı
            </h1>
            
            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p>
                Aktur Turizm, personel taşımacılığında güvenliği, konforu ve
                dakikliği ön planda tutarak, çalışanların işlerine zamanında ve
                sorunsuz bir şekilde ulaşmalarını hedefler. Gelişmiş araç
                filomuz, deneyimli şoför kadromuz ve müşteri odaklı
                yaklaşımımızla, her gün binlerce çalışanın güvenli ve konforlu
                bir şekilde iş yerlerine ulaşımını sağlıyoruz.
              </p>

              <p>
                Siz işinize odaklanırken, Aktur Turizm olarak biz,
                çalışanlarınızın ulaşımını güvenilir ve konforlu bir deneyime
                dönüştürerek şirketinize değer katıyoruz.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffTransport;