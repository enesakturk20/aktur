"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { studentService } from "@/services";
import {
  User,
  School,
  MapPin,
  Check,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  AlertCircle,
  Loader2,
  FileText,
  Building2
} from "lucide-react";

interface StudentRegisterFormProps {
  company: {
    id: number;
    name: string;
    email: string;
    domain?: string | null;
    logo?: string | null;
    schools?: { id: number; name: string }[];
  };
  dictionary: {
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
  hideBranding?: boolean;
}

const StudentRegisterForm = ({ company, dictionary, hideBranding = false }: StudentRegisterFormProps) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    school: "",
    schoolClass: "",
    branch: "",
    city: "",
    district: "",
    neighborhood: "",
    street: "",
    alley: "",
    buildingNo: "",
    apartmentNo: "",
    postalCode: ""
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // address lookup data
  const [provinces, setProvinces] = useState<Array<{ id: number; name: string }>>([]);
  const [districts, setDistricts] = useState<Array<{ id: number; name: string }>>([]);
  const [neighborhoods, setNeighborhoods] = useState<Array<{ id: number; name: string }>>([]);

  // Load provinces on component mount
  useEffect(() => {
    studentService.getProvinces()
      .then(setProvinces)
      .catch((err) => console.error('Failed to load provinces', err));
  }, []);

  // Load districts when a city (province) is selected
  useEffect(() => {
    if (!formData.city) {
      setDistricts([]);
      setNeighborhoods([]);
      return;
    }
    studentService.getDistricts(formData.city)
      .then(setDistricts)
      .catch((err) => console.error('Failed to load districts', err));
  }, [formData.city]);

  // Load neighborhoods when a district is selected
  useEffect(() => {
    if (!formData.district) {
      setNeighborhoods([]);
      return;
    }
    studentService.getNeighborhoods(formData.district)
      .then(setNeighborhoods)
      .catch((err) => console.error('Failed to load neighborhoods', err));
  }, [formData.district]);

  // Helper to get name by id from a list
  const getName = (list: Array<{ id: number; name: string }>, id: string) => {
    const num = Number(id);
    return list.find((item) => item.id === num)?.name || '';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateStep = (currentStep: number) => {
    const stepErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.fullName.trim()) stepErrors.fullName = "Öğrenci adı soyadı zorunludur.";
      if (!formData.school.trim()) stepErrors.school = "Okul adı zorunludur.";
      if (!formData.schoolClass.trim()) stepErrors.schoolClass = "Sınıf bilgisi zorunludur.";
    } else if (currentStep === 2) {
      if (!formData.city.trim()) stepErrors.city = "İl zorunludur.";
      if (!formData.district.trim()) stepErrors.district = "İlçe zorunludur.";
      if (!formData.neighborhood.trim()) stepErrors.neighborhood = "Mahalle zorunludur.";
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      handleNext();
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");
    const payload = {
      fullName: formData.fullName,
      school: formData.school,
      schoolClass: formData.schoolClass,
      branch: formData.branch || null,
      city: provinces.find((p) => String(p.id) === String(formData.city))?.name || formData.city,
      district: districts.find((d) => String(d.id) === String(formData.district))?.name || formData.district,
      neighborhood: neighborhoods.find((n) => String(n.id) === String(formData.neighborhood))?.name || formData.neighborhood,
      street: formData.street,
      alley: formData.alley,
      buildingNo: formData.buildingNo,
      apartmentNo: formData.apartmentNo,
      postalCode: formData.postalCode || null,
      companyId: company.id
    };

    try {
      await studentService.registerStudent(payload as any);

      setSubmitSuccess(true);
      setFormData({
        fullName: "",
        school: "",
        schoolClass: "",
        branch: "",
        city: "İstanbul",
        district: "",
        neighborhood: "",
        street: "",
        alley: "",
        buildingNo: "",
        apartmentNo: "",
        postalCode: ""
      });
      setStep(1);
    } catch (err) {
      const error = err as Error;
      setSubmitError(error.message || dictionary.errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={hideBranding ? "w-full" : "min-h-screen bg-gradient-to-tr from-slate-100 to-indigo-50/50 py-16 px-4 flex flex-col justify-center items-center"}>
      <div className={hideBranding ? "w-full" : "w-full max-w-2xl"}>
        {/* Company Branding Header */}
        {!hideBranding && (
          <div className="flex flex-col items-center mb-10 text-center">
            {company.logo ? (
              <div className="relative w-24 h-24 bg-white rounded-2xl shadow-md flex items-center justify-center p-3 border border-slate-100 mb-4 hover:scale-105 transition-transform duration-300">
                <img
                  src={company.logo}
                  alt={`${company.name} Logo`}
                  className="max-w-full max-h-full object-contain rounded-xl"
                  onError={(e) => {
                    // Fallback if image fails to load
                    e.currentTarget.style.display = "none";
                    const fallback = e.currentTarget.parentElement?.querySelector(".fallback-avatar");
                    if (fallback) fallback.classList.remove("hidden");
                  }}
                />
                <div className="fallback-avatar hidden w-full h-full flex items-center justify-center bg-gradient-to-tr from-indigo-500 to-purple-600 text-white rounded-xl font-bold text-2xl">
                  {company.name.charAt(0)}
                </div>
              </div>
            ) : (
              <div className="w-20 h-20 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-2xl shadow-lg flex items-center justify-center text-white mb-4 hover:scale-105 transition-transform duration-300">
                <Building2 className="w-10 h-10" />
              </div>
            )}
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
              {company.name}
            </h1>
            <p className="text-slate-500 text-sm mt-1">Öğrenci Servis Kayıt Başvuru Ekranı</p>
          </div>
        )}

        {/* Premium Form Panel */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100/80">
          {/* Step Indicators */}
          <div className="bg-slate-900 px-8 py-5 text-white border-b border-slate-800">
            <div className="flex items-center justify-between max-w-md mx-auto">
              {/* Step 1 */}
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${step >= 1 ? "bg-indigo-600 text-white scale-110 ring-4 ring-indigo-500/20" : "bg-slate-700 text-slate-400"
                  }`}>
                  {step > 1 ? <Check className="w-4.5 h-4.5" /> : "1"}
                </div>
                <span className="text-[10px] mt-1.5 font-medium text-slate-300">{dictionary.stepStudent}</span>
              </div>

              <div className={`flex-1 h-[2px] mx-3 rounded-full transition-all duration-300 ${step > 1 ? "bg-indigo-600" : "bg-slate-700"}`} />

              {/* Step 2 */}
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${step >= 2 ? "bg-indigo-600 text-white scale-110 ring-4 ring-indigo-500/20" : "bg-slate-700 text-slate-400"
                  }`}>
                  {step > 2 ? <Check className="w-4.5 h-4.5" /> : "2"}
                </div>
                <span className="text-[10px] mt-1.5 font-medium text-slate-300">{dictionary.stepAddress}</span>
              </div>

              <div className={`flex-1 h-[2px] mx-3 rounded-full transition-all duration-300 ${step > 2 ? "bg-indigo-600" : "bg-slate-700"}`} />

              {/* Step 3 */}
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${step === 3 ? "bg-indigo-600 text-white scale-110 ring-4 ring-indigo-500/20" : "bg-slate-700 text-slate-400"
                  }`}>
                  3
                </div>
                <span className="text-[10px] mt-1.5 font-medium text-slate-300">{dictionary.stepConfirm}</span>
              </div>
            </div>
          </div>

          {/* Notification Alerts */}
          {submitSuccess && (
            <div className="m-6 p-5 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-2xl flex items-start space-x-3.5 animate-fadeIn">
              <div className="bg-emerald-500 text-white rounded-full p-1.5 mt-0.5">
                <Check className="w-4.5 h-4.5" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-emerald-900">Başvurunuz Alındı!</h4>
                <p className="text-sm mt-1 leading-relaxed">{dictionary.successMessage}</p>
                <button
                  type="button"
                  onClick={() => setSubmitSuccess(false)}
                  className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
                >
                  Yeni Kayıt Ekle
                </button>
              </div>
            </div>
          )}

          {submitError && (
            <div className="m-6 p-4 bg-rose-50 border border-rose-100 text-rose-800 rounded-2xl flex items-start space-x-3 animate-fadeIn">
              <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-rose-900">Hata!</h4>
                <p className="text-sm mt-0.5 leading-relaxed">{submitError}</p>
              </div>
            </div>
          )}

          {/* Form */}
          {!submitSuccess && (
            <form onSubmit={handleSubmit} className="p-8 md:p-10">
              {/* STEP 1: Student Information */}
              {step === 1 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="flex items-center space-x-2 border-b border-slate-100 pb-3 mb-5">
                    <User className="w-5 h-5 text-indigo-600" />
                    <h3 className="text-lg font-bold text-slate-800">Öğrenci ve Okul Bilgileri</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Full Name */}
                    <div className="flex flex-col">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{dictionary.fullName}</label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-xl border bg-slate-50 text-slate-800 placeholder:text-slate-400 transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${errors.fullName ? "border-rose-300 focus:ring-rose-200 focus:border-rose-400" : "border-slate-200 focus:border-indigo-500"
                          }`}
                        placeholder="Örn: Mert Aktürk"
                      />
                      {errors.fullName && <span className="text-xs text-rose-500 mt-1">{errors.fullName}</span>}
                    </div>

                    {/* School Name */}
                    <div className="flex flex-col">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{dictionary.school}</label>
                      {company.schools && company.schools.length > 0 ? (
                        <div className="relative">
                          <select
                            name="school"
                            value={formData.school}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 pr-12 rounded-xl border bg-slate-50 text-slate-800 appearance-none transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${errors.school ? "border-rose-300 focus:ring-rose-200 focus:border-rose-400" : "border-slate-200 focus:border-indigo-500"
                              }`}
                          >
                            <option value="" disabled>Seçiniz</option>
                            {company.schools.map((s) => (
                              <option key={s.id} value={s.name}>{s.name}</option>
                            ))}
                          </select>
                          <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                            <ChevronDown className="w-5 h-5 text-slate-400" />
                          </div>
                        </div>
                      ) : (
                        <input
                          type="text"
                          name="school"
                          value={formData.school}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 rounded-xl border bg-slate-50 text-slate-800 placeholder:text-slate-400 transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${errors.school ? "border-rose-300 focus:ring-rose-200 focus:border-rose-400" : "border-slate-200 focus:border-indigo-500"
                            }`}
                          placeholder="Örn: Bilfen Koleji"
                        />
                      )}
                      {errors.school && <span className="text-xs text-rose-500 mt-1">{errors.school}</span>}
                    </div>

                    {/* School Class */}
                    <div className="flex flex-col">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{dictionary.schoolClass}</label>
                      <div className="relative">
                        <select
                          name="schoolClass"
                          value={formData.schoolClass}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 pr-12 rounded-xl border bg-slate-50 text-slate-800 appearance-none transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${errors.schoolClass ? "border-rose-300 focus:ring-rose-200 focus:border-rose-400" : "border-slate-200 focus:border-indigo-500"
                            }`}
                        >
                          <option value="" disabled>Seçiniz</option>
                          {["Anasınıfı", "1", "2", "3", "4", "5", "6", "7", "8", "Lise Hazırlık", "9", "10", "11", "12"].map((cls) => (
                            <option key={cls} value={cls}>{cls}</option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                          <ChevronDown className="w-5 h-5 text-slate-400" />
                        </div>
                      </div>
                      {errors.schoolClass && <span className="text-xs text-rose-500 mt-1">{errors.schoolClass}</span>}
                    </div>

                    {/* Branch */}
                    <div className="flex flex-col">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{dictionary.branch}</label>
                      <div className="relative">
                        <select
                          name="branch"
                          value={formData.branch}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 pr-12 rounded-xl border bg-slate-50 text-slate-800 appearance-none focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${errors.branch ? "border-rose-300 focus:ring-rose-200 focus:border-rose-400" : "border-slate-200 focus:border-indigo-500"
                            }`}
                        >
                          <option value="" disabled>Seçiniz</option>
                          <option value="A">A</option>
                          <option value="B">B</option>
                          <option value="C">C</option>
                          <option value="D">D</option>
                          <option value="E">E</option>
                          <option value="F">F</option>
                          <option value="G">G</option>
                          <option value="H">H</option>
                          <option value="I">I</option>
                          <option value="J">J</option>
                          <option value="K">K</option>
                          <option value="L">L</option>
                          <option value="M">M</option>
                          <option value="N">N</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                          <ChevronDown className="w-5 h-5 text-slate-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Address Information */}
              {step === 2 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="flex items-center space-x-2 border-b border-slate-100 pb-3 mb-5">
                    <MapPin className="w-5 h-5 text-indigo-600" />
                    <h3 className="text-lg font-bold text-slate-800">Adres Bilgileri</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* City */}
                    <div className="flex flex-col">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{dictionary.city}</label>
                      <div className="relative">
                        <select
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 pr-12 rounded-xl border bg-slate-50 text-slate-800 appearance-none focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${errors.city ? "border-rose-300 focus:ring-rose-200 focus:border-rose-400" : "border-slate-200 focus:border-indigo-500"
                            }`}
                        >
                          <option value="" disabled>Seçiniz</option>
                          {provinces.map((p) => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                          <ChevronDown className="w-5 h-5 text-slate-400" />
                        </div>
                      </div>
                      {errors.city && <span className="text-xs text-rose-500 mt-1">{errors.city}</span>}
                    </div>

                    {/* District */}
                    <div className="flex flex-col">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{dictionary.district}</label>
                      <div className="relative">
                        <select
                          name="district"
                          value={formData.district}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 pr-12 rounded-xl border bg-slate-50 text-slate-800 appearance-none focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${errors.district ? "border-rose-300 focus:ring-rose-200 focus:border-rose-400" : "border-slate-200 focus:border-indigo-500"
                            }`}
                        >
                          <option value="" disabled>Seçiniz</option>
                          {districts.map((d) => (
                            <option key={d.id} value={d.id}>{d.name}</option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                          <ChevronDown className="w-5 h-5 text-slate-400" />
                        </div>
                      </div>
                      {errors.district && <span className="text-xs text-rose-500 mt-1">{errors.district}</span>}
                    </div>

                    {/* Neighborhood */}
                    <div className="flex flex-col">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{dictionary.neighborhood}</label>
                      <div className="relative">
                        <select
                          name="neighborhood"
                          value={formData.neighborhood}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 pr-12 rounded-xl border bg-slate-50 text-slate-800 appearance-none focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${errors.neighborhood ? "border-rose-300 focus:ring-rose-200 focus:border-rose-400" : "border-slate-200 focus:border-indigo-500"
                            }`}
                        >
                          <option value="" disabled>Seçiniz</option>
                          {neighborhoods.map((n) => (
                            <option key={n.id} value={n.id}>{n.name}</option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                          <ChevronDown className="w-5 h-5 text-slate-400" />
                        </div>
                      </div>
                      {errors.neighborhood && <span className="text-xs text-rose-500 mt-1">{errors.neighborhood}</span>}
                    </div>

                    {/* Street */}
                    <div className="flex flex-col md:col-span-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{dictionary.street}</label>
                      <input
                        type="text"
                        name="street"
                        value={formData.street}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-xl border bg-slate-50 text-slate-800 placeholder:text-slate-400 transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${errors.street ? "border-rose-300 focus:ring-rose-200 focus:border-rose-400" : "border-slate-200 focus:border-indigo-500"
                          }`}
                        placeholder="Örn: Sarayardı Cd."
                      />
                      {errors.street && <span className="text-xs text-rose-500 mt-1">{errors.street}</span>}
                    </div>

                    {/* Alley */}
                    <div className="flex flex-col">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{dictionary.alley}</label>
                      <input
                        type="text"
                        name="alley"
                        value={formData.alley}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-xl border bg-slate-50 text-slate-800 placeholder:text-slate-400 transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${errors.alley ? "border-rose-300 focus:ring-rose-200 focus:border-rose-400" : "border-slate-200 focus:border-indigo-500"
                          }`}
                        placeholder="Örn: Gül Çıkmazı"
                      />
                      {errors.alley && <span className="text-xs text-rose-500 mt-1">{errors.alley}</span>}
                    </div>

                    {/* Building No */}
                    <div className="flex flex-col">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{dictionary.buildingNo}</label>
                      <input
                        type="text"
                        name="buildingNo"
                        value={formData.buildingNo}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-xl border bg-slate-50 text-slate-800 placeholder:text-slate-400 transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${errors.buildingNo ? "border-rose-300 focus:ring-rose-200 focus:border-rose-400" : "border-slate-200 focus:border-indigo-500"
                          }`}
                        placeholder="Örn: 24"
                      />
                      {errors.buildingNo && <span className="text-xs text-rose-500 mt-1">{errors.buildingNo}</span>}
                    </div>

                    {/* Apartment No */}
                    <div className="flex flex-col">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{dictionary.apartmentNo}</label>
                      <input
                        type="text"
                        name="apartmentNo"
                        value={formData.apartmentNo}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-xl border bg-slate-50 text-slate-800 placeholder:text-slate-400 transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${errors.apartmentNo ? "border-rose-300 focus:ring-rose-200 focus:border-rose-400" : "border-slate-200 focus:border-indigo-500"
                          }`}
                        placeholder="Örn: 12"
                      />
                      {errors.apartmentNo && <span className="text-xs text-rose-500 mt-1">{errors.apartmentNo}</span>}
                    </div>

                    {/* Postal Code */}
                    <div className="flex flex-col">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{dictionary.postalCode}</label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 placeholder:text-slate-400 transition-all focus:bg-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        placeholder="Örn: 34718"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Preview & Confirmation */}
              {step === 3 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="flex items-center space-x-2 border-b border-slate-100 pb-3 mb-5">
                    <FileText className="w-5 h-5 text-indigo-600" />
                    <h3 className="text-lg font-bold text-slate-800">{dictionary.confirmTitle}</h3>
                  </div>

                  <div className="p-4 bg-indigo-50/50 border border-indigo-100/50 text-indigo-900 rounded-2xl flex items-start space-x-3 mb-6">
                    <Check className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5 bg-white p-1 rounded-full shadow-sm" />
                    <div className="text-sm">
                      <span className="font-semibold text-slate-800 block">{dictionary.confirmCompany}</span>
                      <span className="font-medium mt-0.5 block text-indigo-900">{company.name}</span>
                    </div>
                  </div>

                  {/* Summary Box */}
                  <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-4 text-xs text-slate-600">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="font-bold text-slate-400 uppercase tracking-wider block mb-1">{dictionary.fullName}</span>
                        <span className="text-sm font-semibold text-slate-800">{formData.fullName}</span>
                      </div>
                      <div>
                        <span className="font-bold text-slate-400 uppercase tracking-wider block mb-1">{dictionary.confirmStudentInfo}</span>
                        <span className="text-sm font-semibold text-slate-800">
                          {formData.school} ({formData.schoolClass}{formData.branch ? `, ${formData.branch}` : ""})
                        </span>
                      </div>
                      <div className="md:col-span-2">
                        <span className="font-bold text-slate-400 uppercase tracking-wider block mb-1">{dictionary.confirmAddressInfo}</span>
                        <span className="text-sm font-semibold text-slate-800 leading-relaxed block">
                          {getName(neighborhoods, formData.neighborhood)} Mah. {formData.street} No: {formData.buildingNo} Daire: {formData.apartmentNo} {getName(districts, formData.district)}/{getName(provinces, formData.city)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Action Buttons */}
              <div className="flex items-center justify-between border-t border-slate-100 pt-6 mt-10">
                {step > 1 ? (
                  <button
                    key="back-btn"
                    type="button"
                    onClick={(e) => { e.preventDefault(); handleBack(); }}
                    className="flex items-center space-x-1.5 px-5 py-2.5 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors text-sm font-semibold"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>{dictionary.backButton}</span>
                  </button>
                ) : (
                  <div />
                )}

                {step < 3 ? (
                  <button
                    key="next-btn"
                    type="button"
                    onClick={(e) => { e.preventDefault(); handleNext(); }}
                    className="flex items-center space-x-1.5 px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-600/10 text-sm font-bold"
                  >
                    <span>{dictionary.nextButton}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    key="submit-btn"
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center justify-center space-x-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all shadow-lg shadow-indigo-600/20 text-sm font-bold disabled:bg-indigo-400"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>{dictionary.submittingButton}</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        <span>{dictionary.submitButton}</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentRegisterForm;
