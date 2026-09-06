'use client';

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slideData = [
  { id: 1, type: "ogrenci", image: "/ogrenci-hero.png" },
  { id: 2, type: "personel", image: "/per.png" },
  { id: 3, type: "vip", image: "/vip-transfer.png" },
];

interface HeroSliderProps {
  dictionary: {
    slides: {
      badge: string;
      title: string;
      titleHighlight: string;
      description: string;
    }[];
  };
}

export default function HeroSlider({ dictionary }: HeroSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const nextSlide = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev + 1) % slideData.length);
    setTimeout(() => setIsAnimating(false), 700);
  }, [isAnimating]);

  const prevSlide = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev - 1 + slideData.length) % slideData.length);
    setTimeout(() => setIsAnimating(false), 700);
  }, [isAnimating]);

  const goToSlide = useCallback(
    (index: number) => {
      if (isAnimating || index === currentSlide) return;
      setIsAnimating(true);
      setCurrentSlide(index);
      setTimeout(() => setIsAnimating(false), 700);
    },
    [isAnimating, currentSlide]
  );

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 7000);

    return () => clearInterval(timer);
  }, [nextSlide]);

  const slideContent = dictionary.slides[currentSlide];

  return (
    <section className="relative h-screen min-h-[600px] w-full overflow-hidden">
      {/* Background images */}
      <div className="absolute inset-0">
        {slideData.map((s, index) => (
          <div
            key={s.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none"
            }`}
          >
            <Image
              src={s.image}
              alt={dictionary.slides[index].badge}
              fill
              className="object-cover"
              priority={index === 0}
            />
            {/* Premium Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          </div>
        ))}
      </div>

      {/* Navigation buttons */}
      <button
        onClick={prevSlide}
        disabled={isAnimating}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md p-3 md:p-4 rounded-full transition-all duration-300 disabled:opacity-0 hover:scale-110 group"
      >
        <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-white group-hover:-translate-x-1 transition-transform" />
      </button>

      <button
        onClick={nextSlide}
        disabled={isAnimating}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md p-3 md:p-4 rounded-full transition-all duration-300 disabled:opacity-0 hover:scale-110 group"
      >
        <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-white group-hover:translate-x-1 transition-transform" />
      </button>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center container mx-auto px-6 md:px-16 lg:px-24">
        <div
          key={currentSlide} // Force re-render for animation
          className="max-w-3xl animate-fade-in-up"
        >
          {/* Badge */}
          <div className="inline-block mb-6">
            <span className="glass-panel text-white px-5 py-2 rounded-full text-xs md:text-sm font-semibold tracking-wider uppercase border border-white/30 shadow-xl">
              {slideContent.badge}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight drop-shadow-2xl">
            {slideContent.title}
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-white/70 mt-2">
              {slideContent.titleHighlight}
            </span>
          </h1>

          {/* Description */}
          <p className="text-base md:text-xl text-slate-200 mb-10 leading-relaxed max-w-2xl font-light drop-shadow-md">
            {slideContent.description}
          </p>
          
          {/* Action Button (Optional placeholder if needed in the future) */}
          <div className="flex gap-4">
            <button className="px-8 py-3.5 bg-primary hover:bg-primary-dark text-white rounded-full font-semibold transition-all duration-300 shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:shadow-[0_0_30px_rgba(79,70,229,0.6)] hover:-translate-y-1">
              Daha Fazla Bilgi
            </button>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {slideData.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            disabled={isAnimating}
            className={`transition-all duration-500 rounded-full h-1.5 md:h-2 ${
              index === currentSlide
                ? "w-10 md:w-16 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                : "w-3 md:w-4 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
