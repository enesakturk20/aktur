'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    id: 1,
    type: "ogrenci",
    image: "/ogrenci-hero.png",
    badge: "ÖĞRENCİ TAŞIMACILIĞI",
    title: "Konforlu ve Güvenli",
    titleHighlight: "Ulaşım Hizmetleri",
    description:
      "Öğrenci transferleriniz için profesyonel çözümler sunuyoruz. Araçlarımız ve deneyimli personelimiz ile güvenli yolculuk.",
  },
  {
    id: 2,
    type: "personel",
    image: "/per.png",
    badge: "PERSONEL TAŞIMACILIĞI",
    title: "İş Gücünüz İçin",
    titleHighlight: "Güvenilir Çözüm",
    description:
      "Şirketinizin çalışanları için düzenli, güvenli ve konforlu servis hizmeti. Modern araç filomuzu ve profesyonel ekibimiz ile personel taşımacılığında uzman çözümler sunuyoruz.",
  },
  {
    id: 3,
    type: "vip",
    image: "/vip-transfer.png",
    badge: "VIP TRANSFER",
    title: "Lüks ve Konforlu",
    titleHighlight: "VIP Ulaşım",
    description:
      "Özel misafirleriniz ve üst düzey yöneticileriniz için lüks araçlarla VIP transfer hizmeti. Prestijli ve konforlu yolculuk deneyimi.",
  },
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 7000);

    return () => clearInterval(timer);
  }, [currentSlide]);

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const goToSlide = (index: number) => {
    if (isAnimating || index === currentSlide) return;
    setIsAnimating(true);
    setCurrentSlide(index);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const slide = slides[currentSlide];

  return (
    <section className="mt-100">
      {/* Arka plan görseli */}
      <div className="absolute inset-0">
        {slides.map((s, index) => (
          <div
            key={s.id}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={s.image}
              alt={s.badge}
              fill
              className="object-cover"
            />
            <div
              className={`absolute inset-0 ${
                s.type === "personel"
                  ? "bg-gradient-to-r from-black/70 via-black/50 to-transparent"
                  : "bg-black/40"
              }`}
            ></div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        disabled={isAnimating}
        className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-2 md:p-3 rounded-full transition-all disabled:opacity-50"
      >
        <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-white" />
      </button>
      <button
        onClick={nextSlide}
        disabled={isAnimating}
        className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-2 md:p-3 rounded-full transition-all disabled:opacity-50"
      >
        <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-white" />
      </button>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center md:text-left">
        <div
          className={`max-w-2xl transition-all duration-700 ${
            isAnimating ? "opacity-0 translate-x-4 md:translate-x-8" : "opacity-100 translate-x-0"
          }`}
        >
          {/* Badge */}
          <div className="inline-block mb-3 md:mb-4">
            <span className="bg-primary text-white px-3 py-1 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-semibold tracking-wide">
              {slide.badge}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6 leading-snug">
            {slide.title}
            <span className="block text-white">{slide.titleHighlight}</span>
          </h1>

          {/* Description */}
          <p className="text-sm md:text-lg text-gray-200 mb-6 md:mb-8 leading-relaxed">
            {slide.description}
          </p>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2 md:gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            disabled={isAnimating}
            className={`transition-all duration-300 rounded-full h-2 md:h-3 ${
              index === currentSlide
                ? "w-8 md:w-12 bg-primary"
                : "w-2 md:w-3 bg-white/50 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
