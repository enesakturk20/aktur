"use client";

import React from "react";

const SchoolTransport = () => {
  return (
    <div className="min-h-screen bg-primary text-white">
      {/* Hero Section with Image */}
      <div className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 max-w-7xl mx-auto lg:items-center">
          {/* Left - Image */}
          <div className="mt-10 lg:mt-40 px-4 lg:px-0">
            <img
              src="/ogrenci-tasimaciligi.jpg"
              alt="Okul Servisleri"
              className="w-full h-full object-contain rounded-lg"
            />
          </div>

          {/* Right - Content */}
          <div className="bg-white p-8 lg:p-16 flex flex-col justify-center mt-8 lg:mt-40 mb-10 rounded-xl shadow-lg lg:shadow-none mx-4 lg:mx-0">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Okul Servis Taşımacılığı
            </h1>
            
            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p>
                Aktur Turizm, öğrenci taşımacılığında güvenliği, konforu ve zamanında 
                ulaşımı ön planda tutarak, okul servis taşımacılığında sektördeki liderliğini 
                sürdürmektedir. Gelişmiş araç filomuz, deneyimli şoför kadromuz ve 
                öğrenci odaklı yaklaşımımızla, her gün binlerce öğrencinin güvenli ve rahat 
                bir şekilde okullarına ulaşmasını sağlıyoruz.
              </p>

              <p>
                Aktur Turizm olarak, eğitim hayatındaki her adımda öğrencilere en iyi 
                ulaşım deneyimini sağlamak için var gücümüzle çalışıyoruz.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolTransport;