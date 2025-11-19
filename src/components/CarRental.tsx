"use client";

import React from "react";

const CarRental = () => {
  return (
    <div className="min-h-screen bg-primary text-white">
      {/* Hero Section with Image */}
      <div className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 max-w-7xl mx-auto lg:items-center">
          {/* Left - Image */}
          <div className="mt-10 lg:mt-40 px-4 lg:px-0">
            <img
              src="/arac-kiralama.jpg"
              alt="Araç Kiralama Hizmetleri"
              className="w-full h-full object-contain rounded-lg"
            />
          </div>

          {/* Right - Content */}
          <div className="bg-white p-8 lg:p-16 flex flex-col justify-center mt-8 lg:mt-40 mb-10 rounded-xl shadow-lg lg:shadow-none mx-4 lg:mx-0">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Araç Kiralama
            </h1>
            
            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p>
                Özgürlüğün tadını Aktur Turizm'in geniş araç filosuyla çıkarın. İster iş seyahatleriniz, ister tatil planlarınız için, her ihtiyaca uygun, modern ve bakımlı araçlarımızla hizmetinizdeyiz. Şoförlü veya şoförsüz kiralama seçenekleriyle esnek ve güvenilir çözümler sunuyoruz.
              </p>

              <p>
                Geniş araç yelpazemiz, rekabetçi fiyatlarımız ve müşteri odaklı hizmetimizle, yolculuk planlarınızı kolaylaştırıyoruz. İhtiyacınız olan aracı seçin ve gerisini bize bırakın.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarRental;
