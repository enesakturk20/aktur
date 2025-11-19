"use client";

import React from "react";

const VipTransfer = () => {
  return (
    <div className="min-h-screen bg-primary text-white">
      {/* Hero Section with Image */}
      <div className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 max-w-7xl mx-auto lg:items-center">
          {/* Left - Image */}
          <div className="mt-10 lg:mt-40 px-4 lg:px-0">
            <img
              src="/vip-transfer.jpg"
              alt="VIP Transfer Hizmetleri"
              className="w-full h-full object-contain rounded-lg"
            />
          </div>

          {/* Right - Content */}
          <div className="bg-white p-8 lg:p-16 flex flex-col justify-center mt-8 lg:mt-40 mb-10 rounded-xl shadow-lg lg:shadow-none mx-4 lg:mx-0">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              VIP Transfer Hizmetleri
            </h1>
            
            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p>
                Aktur Turizm ile seyahatlerinizi ayrıcalıklı bir deneyime dönüştürün. VIP transfer hizmetlerimizle, lüks ve konforlu araçlarımızda, profesyonel şoförlerimiz eşliğinde size özel bir yolculuk sunuyoruz. Havaalanı transferleri, iş toplantıları veya özel günleriniz için prestijli bir ulaşım çözümü sağlıyoruz.
              </p>

              <p>
                Her detayın düşünüldüğü hizmet anlayışımızla, yolculuğunuzun başından sonuna kadar kendinizi özel hissetmenizi sağlıyoruz. Güvenlik, gizlilik ve konfor önceliklerimizdir.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VipTransfer;
