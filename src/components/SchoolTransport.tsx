"use client";

import React from "react";
import Image from "next/image";
import StudentRegisterForm from "./StudentRegisterForm";
import ogrenciImg from "../../public/ogrenci-tasimaciligi.jpg";

interface SchoolTransportProps {
  dictionary: {
    title: string;
    paragraph1: string;
    paragraph2: string;
    imageAlt: string;
    fullName: string;
    school: string;
    schoolClass: string;
    branch: string;
    city: string;
    district: string;
    neighborhood: string;
    street: string;
    alley: string;
    buildingNo: string;
    apartmentNo: string;
    postalCode: string;
    submitButton: string;
    submittingButton: string;
    successMessage: string;
    errorMessage: string;
    confirmTitle: string;
    confirmCompany: string;
    confirmStudentInfo: string;
    confirmAddressInfo: string;
    backButton: string;
    nextButton: string;
    stepStudent: string;
    stepAddress: string;
    stepConfirm: string;
  };
  company: {
    id: number;
    name: string;
    email: string;
    domain?: string | null;
    logo?: string | null;
    schools?: { id: number; name: string }[];
  };
}

const SchoolTransport = ({ dictionary, company }: SchoolTransportProps) => {

  return (
    <div className="min-h-screen bg-white">
      {/* 
        ===========================================
        FORM SECTION (TOP)
        ===========================================
      */}
      <div className="relative pt-6 pb-12 lg:pt-5 lg:pb-20 overflow-hidden bg-white">
        {/* Abstract Blobs in background */}
        <div className="absolute top-0 right-0 w-[500px] lg:w-[800px] h-[500px] lg:h-[800px] bg-primary/5 rounded-full blur-[100px] pointer-events-none transform translate-x-1/3 -translate-y-1/4"></div>
        <div className="absolute top-1/4 left-0 w-[400px] lg:w-[600px] h-[400px] lg:h-[600px] bg-secondary/10 rounded-full blur-[90px] pointer-events-none transform -translate-x-1/3"></div>

        <div className="container mx-auto px-4 md:px-8 max-w-4xl relative z-10">

          <div className="text-center mb-10 animate-fade-in-up">
            <h1 className="text-3xl md:text-5xl font-bold text-slate-800 tracking-tight">
              Öğrenci Servis Kaydı
            </h1>
            <p className="text-slate-500 mt-4 text-lg">
              Öğrenci servis kaydı için lütfen aşağıdaki formu eksiksiz doldurun. İşleminiz güvenli bir şekilde alınacaktır.
            </p>
          </div>

          {/* The Form Card */}
          <div className="bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-4 md:p-8 border border-slate-100 relative overflow-hidden animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            {/* Form Decor */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-secondary to-primary"></div>
            <StudentRegisterForm
              company={company}
              dictionary={dictionary}
              hideBranding={true}
            />
          </div>

        </div>
      </div>

      {/* 
        ===========================================
        PROMOTIONAL CONTENT SECTION (BOTTOM)
        ===========================================
      */}
      <div className="bg-slate-50 py-16 lg:py-24 border-t border-slate-200">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Text Content */}
            <div className="order-2 lg:order-1 animate-fade-in-up">
              <div className="inline-block mb-4">
                <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide">
                  Hizmetlerimiz
                </span>
              </div>
              <h2 className="text-3xl lg:text-4xl xl:text-5xl font-extrabold text-slate-900 mb-6 leading-tight tracking-tight">
                {dictionary.title}
              </h2>

              <div className="space-y-6 text-slate-600 text-lg leading-relaxed">
                <p>{dictionary.paragraph1}</p>
                <p>{dictionary.paragraph2}</p>
              </div>

              <div className="mt-10 flex items-center gap-6">
                <div className="flex -space-x-4">
                  <div className="w-14 h-14 rounded-full border-2 border-white bg-blue-100 flex items-center justify-center text-primary font-bold shadow-md text-lg relative z-30">
                    10K+
                  </div>
                  <div className="w-14 h-14 rounded-full border-2 border-white bg-slate-200 shadow-md relative z-20"></div>
                  <div className="w-14 h-14 rounded-full border-2 border-white bg-slate-300 shadow-md relative z-10"></div>
                </div>
                <p className="text-base font-medium text-slate-500 text-left">Mutlu veli ve<br />öğrenci referansı</p>
              </div>
            </div>

            {/* Image Content */}
            <div className="order-1 lg:order-2 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              <div className="relative rounded-[2rem] overflow-hidden shadow-2xl group w-full">
                <Image
                  src={ogrenciImg}
                  alt={dictionary.imageAlt}
                  className="w-full h-auto transform transition-transform duration-700 group-hover:scale-105"
                  priority
                />
              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
};

export default SchoolTransport;