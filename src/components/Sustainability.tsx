"use client";

import React from "react";

const Sustainability = () => {
  return (
    <div className="min-h-screen bg-primary text-white">
      {/* Hero Section with Image */}
      <div className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 max-w-7xl mx-auto lg:items-center">
          {/* Left - Image */}
          <div className="mt-10 lg:mt-20 px-4 lg:px-0">
            <img
              src="/sürdürülebilirlik.png"
              alt="Sürdürülebilirlik"
              className="w-full h-full object-contain rounded-lg"
            />
          </div>

          {/* Right - Content */}
          <div className="bg-white p-8 lg:p-16 flex flex-col justify-center mt-4 lg:mt-20 mb-10 rounded-xl shadow-lg lg:shadow-none mx-4 lg:mx-0">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Sürdürülebilirlik
            </h1>

            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p>
                Aktur Turizm olarak, çevreye duyarlı ve sürdürülebilir ulaşım
                çözümleri sunma konusunda güçlü bir sorumluluk taşıyoruz.
                Faaliyetlerimizi çevre dostu bir yaklaşım benimseyerek
                sürdürmekte, ekolojik ayak izimizi azaltmak için sürekli olarak
                yenilikçi çözümler arıyoruz.
              </p>

              <p>
                Modern araç filomuz, düşük emisyonlu ve yakıt verimliliği yüksek
                araçlarla güçlendirilmiştir. Bu sayede, hem çevremizi koruyor
                hem de müşterilerimize daha az karbon salınımıyla seyahat etme
                imkanı sunuyoruz.
              </p>

              <p>
                Sürdürülebilirlik, yalnızca çevreyle sınırlı kalmıyor. Aktur
                Turizm olarak, sosyal sorumluluk projelerinde yer alıyor, yerel
                ekonomilere katkı sağlıyor ve çalışanlarımızın refahını da ön
                planda tutuyoruz. Gelecek nesillere daha yaşanabilir bir dünya
                bırakmak için, tüm hizmetlerimizi çevresel ve toplumsal
                sorumluluk bilinciyle sunmaya devam edeceğiz.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sustainability;
