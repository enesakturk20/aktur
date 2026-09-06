"use client";

import React from "react";
import Image from "next/image";

interface EventOrganizationProps {
  dictionary: {
    title: string;
    paragraph1: string;
    paragraph2: string;
    imageAlt: string;
  };
}

const EventOrganization = ({ dictionary }: EventOrganizationProps) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <div className="relative py-16 md:py-24 overflow-hidden">
        {/* Background Decor */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none transform translate-x-1/3 -translate-y-1/4"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[100px] pointer-events-none transform -translate-x-1/3 translate-y-1/4"></div>

        <div className="container mx-auto px-4 md:px-8 max-w-7xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Content */}
            <div className="order-2 lg:order-1 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              <div className="inline-block mb-4">
                <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide">
                  Hizmetlerimiz
                </span>
              </div>
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-extrabold text-slate-900 mb-6 leading-tight tracking-tight">
                {dictionary.title}
              </h1>
              
              <div className="space-y-6 text-slate-600 text-lg leading-relaxed">
                <p>{dictionary.paragraph1}</p>
                <p>{dictionary.paragraph2}</p>
              </div>
            </div>

            {/* Image */}
            <div className="order-1 lg:order-2 animate-fade-in-up">
              <div className="relative rounded-[2rem] overflow-hidden shadow-premium group">
                <Image
                  width={1000}
                  height={800}
                  src="/etkinlik-organizasyon.jpg"
                  alt={dictionary.imageAlt}
                  className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventOrganization;
