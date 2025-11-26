"use client";

import React from "react";
import Image from "next/image";

interface StaffTransportProps {
  dictionary: {
    title: string;
    paragraph1: string;
    paragraph2: string;
    imageAlt: string;
  };
}

const StaffTransport = ({ dictionary }: StaffTransportProps) => {
  return (
    <div className="min-h-screen bg-primary text-white">
      {/* Hero Section with Image */}
      <div className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 max-w-7xl mx-auto lg:items-center">
          {/* Left - Image */}
          <div className="mt-10 lg:mt-40 px-4 lg:px-0">
            <Image
              width={2000}
              height={2000}
              src="/personel-tasima.jpg"
              alt={dictionary.imageAlt}
              className="w-full h-full object-contain rounded-lg"
            />
          </div>

          {/* Right - Content */}
          <div className="bg-white p-8 lg:p-16 flex flex-col justify-center mt-8 lg:mt-40 mb-10 rounded-xl shadow-lg lg:shadow-none mx-4 lg:mx-0">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              {dictionary.title}
            </h1>

            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p>{dictionary.paragraph1}</p>

              <p>{dictionary.paragraph2}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffTransport;
