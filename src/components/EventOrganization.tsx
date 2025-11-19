"use client";

import React from "react";

const EventOrganization = () => {
  return (
    <div className="min-h-screen bg-primary text-white">
      {/* Hero Section with Image */}
      <div className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 max-w-7xl mx-auto lg:items-center">
          {/* Left - Image */}
          <div className="mt-10 lg:mt-20 px-4 lg:px-0">
            <img
              src="/etkinlik-organizasyon.jpg"
              alt="Etkinlik ve Organizasyon Taşımacılığı"
              className="w-full h-full object-contain rounded-lg"
            />
          </div>

          {/* Right - Content */}
          <div className="bg-white p-8 lg:p-16 flex flex-col justify-center mt-8 lg:mt-25 mb-10 rounded-xl shadow-lg lg:shadow-none mx-4 lg:mx-0">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Etkinlik ve Organizasyon Taşımacılığı
            </h1>
            
            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p>
                Düğün, seminer, fuar, spor etkinlikleri veya özel davetleriniz... Aktur Turizm, her türlü etkinlik ve organizasyon için profesyonel ulaşım çözümleri sunar. Katılımcılarınızın konforlu ve zamanında etkinlik alanına ulaşmasını sağlayarak organizasyonunuzun başarısına katkıda bulunuyoruz.
              </p>

              <p>
                Geniş araç filomuz ve deneyimli operasyon ekibimizle, küçük gruplardan büyük kalabalıklara kadar her ölçekteki ihtiyaca cevap veriyoruz. Lojistik planlamayı bize bırakın, siz etkinliğinize odaklanın.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventOrganization;
