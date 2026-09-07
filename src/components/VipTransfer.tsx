"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Calendar, MapPin, Users, Navigation, CheckCircle2, AlertCircle, Search, Globe, ArrowLeftRight } from "lucide-react";
import { useJsApiLoader } from "@react-google-maps/api";
import {
  VipVehicle,
  BankAccount,
  Country,
  CreateReservationPayload,
  ReservationResponse,
} from "@/models/vipTransfer";
import {
  getImageUrl,
  getVisibleVipVehicles,
  getActiveBankAccounts,
  getCountries,
  createVipReservation,
} from "@/services/vipTransferService";
import { useVipTransferStore } from "@/store/useVipTransferStore";

const libraries: ("places")[] = ["places"];

interface VipTransferProps {
  dictionary: Record<string, any>;
}

const getDefaultDateTime = () => {
  const date = new Date();
  date.setHours(date.getHours() + 5);
  date.setMinutes(0, 0, 0);
  const pad = (num: number) => String(num).padStart(2, '0');
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const getMinDateTime = () => {
  const date = new Date();
  date.setHours(date.getHours() + 4);
  date.setMinutes(date.getMinutes() + 1);
  const pad = (num: number) => String(num).padStart(2, '0');
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const countriesTr = [
  { value: "TR", label: "Türkiye", phoneCode: "+90" }
];

const countriesEn = [
  { value: "TR", label: "Turkey", phoneCode: "+90" }
];

const VipTransfer = ({ dictionary }: VipTransferProps) => {
  const params = useParams();
  const lang = (params?.lang as string) || "tr";

  const [countriesList, setCountriesList] = useState<Country[]>([]);
  const countries = countriesList.length > 0
    ? countriesList.map(c => ({
        value: c.code,
        label: lang === "tr" ? c.nameTr : c.nameEn,
        phoneCode: c.phoneCode
      }))
    : (lang === "tr" ? countriesTr : countriesEn);

  const dialCodes = countries
    .filter(c => c.phoneCode)
    .map(c => ({
      code: c.phoneCode,
      label: `${c.value} (${c.phoneCode})`,
      country: c.label,
      isoCode: c.value
    }));

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    step, setStep,
    fromValue, fromPlaceId, setFromValue, setFromPlaceId,
    toValue, toPlaceId, setToValue, setToPlaceId,
    dateValue, setDateValue,
    passengersValue, setPassengersValue,
    distanceKm, setDistanceKm,
    durationText, setDurationText,
    vipVehicles, setVipVehicles,
    selectedVehicle, setSelectedVehicle,
    expandedVehicleId, setExpandedVehicleId,
    passengerDetails, setPassengerDetails,
    contactFullName, setContactFullName,
    contactNationality, setContactNationality,
    contactEmail, setContactEmail,
    contactPhone, setContactPhone,
    dialCode, setDialCode,
    phoneLocal, setPhoneLocal,
    contactLanguage, setContactLanguage,
    flightNumber, setFlightNumber,
    reservationNote, setReservationNote,
    paymentMethod,
    activeBankAccounts, setActiveBankAccounts,
    bankTransferCurrency, setBankTransferCurrency,
    reservationSuccess, setReservationSuccess,
    resetBooking,
  } = useVipTransferStore();

  const [hasHydrated, setHasHydrated] = useState(false);
  useEffect(() => {
    setHasHydrated(true);
    // If the stored date is in the past or less than 4 hours ahead, reset to a valid default
    if (dateValue) {
      const selected = new Date(dateValue).getTime();
      const minAllowed = Date.now() + 4 * 60 * 60 * 1000;
      if (isNaN(selected) || selected < minAllowed) {
        setDateValue(getDefaultDateTime());
      }
    } else {
      setDateValue(getDefaultDateTime());
    }
  }, []);

  useEffect(() => {
    setContactPhone(phoneLocal.trim() ? `${dialCode} ${phoneLocal.trim()}` : "");
  }, [dialCode, phoneLocal, setContactPhone]);
  const [isReserving, setIsReserving] = useState(false);

  useEffect(() => {
    const fetchActiveBanks = async () => {
      try {
        const data = await getActiveBankAccounts();
        setActiveBankAccounts(data);
        if (Array.isArray(data) && data.length > 0) {
          const available = Array.from(
            new Set(
              data
                .map((a) => a.currency?.trim()?.toUpperCase())
                .filter(Boolean)
            )
          ) as string[];
          if (available.length > 0) {
            setBankTransferCurrency((prev) => (available.includes(prev) ? prev : available[0]));
          }
        }
      } catch (err) {
        console.error("Error fetching active banks:", err);
      }
    };
    fetchActiveBanks();
  }, [step]);

  const availableBankCurrencies = useMemo(() => {
    if (!activeBankAccounts || activeBankAccounts.length === 0) return [];
    return Array.from(
      new Set(
        activeBankAccounts
          .map((a) => a.currency?.trim()?.toUpperCase())
          .filter(Boolean)
      )
    ) as string[];
  }, [activeBankAccounts]);

  const getCurrencySymbol = (curr: string) => {
    switch (curr?.toUpperCase()) {
      case "TRY": return "₺";
      case "USD": return "$";
      case "EUR": return "€";
      case "GBP": return "£";
      default: return "";
    }
  };

  const handleGoToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(6);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Synchronize passengerDetails array size with parsed passengersValue
  useEffect(() => {
    const num = parseInt(passengersValue) || 1;
    setPassengerDetails(prev => {
      // If length already matches, return as is to avoid wiping loaded data
      if (prev.length === num) return prev;

      const newDetails = [...prev];
      if (newDetails.length < num) {
        while (newDetails.length < num) {
          newDetails.push({ fullName: "", dateOfBirth: "", nationality: "" });
        }
      } else {
        newDetails.length = num;
      }
      return newDetails;
    });
  }, [passengersValue, lang]);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const data = await getVisibleVipVehicles();
        setVipVehicles(data);
      } catch (err) {
        console.error("Error fetching visible VIP vehicles:", err);
      }
    };
    fetchVehicles();
  }, []);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const data = await getCountries();
        setCountriesList(data);
      } catch (err) {
        console.error("Error fetching countries from backend:", err);
      }
    };
    fetchCountries();
  }, []);

  // Listen to hash changes to support browser back button navigation between search form and results list
  useEffect(() => {
    if (!hasHydrated) return;

    const handleHashChange = () => {
      if (window.location.hash === "#results") {
        setStep(2);
      } else {
        setStep(1);
      }
    };

    // Sync step with hash ONLY if the step is 1 or 2 to avoid resetting steps 4 or 6 on refresh
    if (step === 1 || step === 2) {
      if (window.location.hash === "#results" && step === 1) {
        setStep(2);
      } else if (window.location.hash !== "#results" && step === 2) {
        setStep(1);
      }
    }

    window.addEventListener("hashchange", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [hasHydrated, step, setStep]);

  const fromInputRef = useRef<HTMLInputElement>(null);
  const getCleanPlaceName = (place: google.maps.places.PlaceResult) => {
    if (!place) return "";

    if (place.name) {
      const isHouseNumber = /^\d+[a-zA-Z]?$/.test(place.name.trim());
      if (!isHouseNumber) {
        return place.name;
      }
    }

    let address = place.formatted_address || place.name || "";
    address = address.replace(", Türkiye", "").replace(", Turkey", "");
    return address;
  };

  const toInputRef = useRef<HTMLInputElement>(null);
  const fromAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const toAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const handleSwapLocations = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    const tempValue = fromValue;
    const tempPlaceId = fromPlaceId;

    setFromValue(toValue);
    setFromPlaceId(toPlaceId);

    setToValue(tempValue);
    setToPlaceId(tempPlaceId);

    if (fromInputRef.current) fromInputRef.current.value = toValue;
    if (toInputRef.current) toInputRef.current.value = tempValue;
  };

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  useEffect(() => {
    if (isLoaded && fromInputRef.current && step === 1) {
      const autocomplete = new window.google.maps.places.Autocomplete(fromInputRef.current, {
        types: ["geocode", "establishment"],
        fields: ["name", "formatted_address", "place_id", "geometry", "types"]
      });

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        const address = getCleanPlaceName(place) || place.name || "";
        setFromValue(address);
        setFromPlaceId(place.place_id || null);
        if (fromInputRef.current) {
          fromInputRef.current.value = address;
        }
      });

      fromAutocompleteRef.current = autocomplete;

      return () => {
        if (window.google && fromAutocompleteRef.current) {
          window.google.maps.event.clearInstanceListeners(fromAutocompleteRef.current);
        }
        fromAutocompleteRef.current = null;
      };
    }
  }, [isLoaded, step]);

  useEffect(() => {
    if (isLoaded && toInputRef.current && step === 1) {
      const autocomplete = new window.google.maps.places.Autocomplete(toInputRef.current, {
        types: ["geocode", "establishment"],
        fields: ["name", "formatted_address", "place_id", "geometry", "types"]
      });

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        const address = getCleanPlaceName(place) || place.name || "";
        setToValue(address);
        setToPlaceId(place.place_id || null);
        if (toInputRef.current) {
          toInputRef.current.value = address;
        }
      });

      toAutocompleteRef.current = autocomplete;

      return () => {
        if (window.google && toAutocompleteRef.current) {
          window.google.maps.event.clearInstanceListeners(toAutocompleteRef.current);
        }
        toAutocompleteRef.current = null;
      };
    }
  }, [isLoaded, step]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!window.google) {
      setError(dictionary.errorCalculateDistance || "Harita servisi yüklenemedi. Lütfen sayfayı yenileyin.");
      setIsSubmitting(false);
      return;
    }

    const origin = fromPlaceId ? { placeId: fromPlaceId } : fromValue;
    const destination = toPlaceId ? { placeId: toPlaceId } : toValue;

    const service = new window.google.maps.DistanceMatrixService();
    service.getDistanceMatrix(
      {
        origins: [origin],
        destinations: [destination],
        travelMode: window.google.maps.TravelMode.DRIVING,
        unitSystem: window.google.maps.UnitSystem.METRIC,
      },
      (response, status) => {
        setIsSubmitting(false);

        if (status === "OK" && response && response.rows[0].elements[0].status === "OK") {
          const element = response.rows[0].elements[0];
          const distanceValue = element.distance.value / 1000; // convert meters to km
          const durationStr = element.duration.text;

          setDistanceKm(distanceValue);
          setDurationText(durationStr);
          window.location.hash = "results"; // Go to results step using hash

          window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          const elementStatus = response?.rows?.[0]?.elements?.[0]?.status;
          const detailMsg = elementStatus ? `, Status: ${elementStatus}` : "";
          setError(
            dictionary.errorCalculateDistance
              ? `${dictionary.errorCalculateDistance} (Code: ${status}${detailMsg})`
              : `Belirtilen adresler arası mesafe hesaplanamadı (Hata Kodu: ${status}${detailMsg}). Lütfen daha belirgin adresler giriniz veya Google Maps API anahtar yetkilerini kontrol edin.`
          );
        }
      }
    );
  };

  const getVehiclePrice = (vehicle: any): number | null => {
    if (distanceKm === null || !vehicle.priceRanges || vehicle.priceRanges.length === 0) return null;
    const range = vehicle.priceRanges.find((r: any) => distanceKm >= r.fromKm && distanceKm <= r.toKm);
    return range ? range.price : null;
  };

  const handleSelectVehicle = (vehicle: any) => {
    setSelectedVehicle(vehicle);
    setStep(4); // Go directly to passengers form (skipping extras)
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isAirportTransfer = () => {
    const keywords = ["havalimanı", "havalimani", "airport", "saw", "ist", "ayt", "esb", "adb"];
    const fromLower = fromValue.toLowerCase();
    const toLower = toValue.toLowerCase();
    return keywords.some(kw => fromLower.includes(kw) || toLower.includes(kw));
  };

  const handleCreateReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVehicle) {
      setError(dictionary.noVehiclesFoundTitle || "Lütfen bir araç seçin.");
      return;
    }
    setIsReserving(true);
    setError(null);

    const price = getVehiclePrice(selectedVehicle) || 0;

    const finalNote = paymentMethod === "BankTransfer"
      ? (reservationNote ? `${reservationNote} | Havale Para Birimi: ${bankTransferCurrency}` : `Havale Para Birimi: ${bankTransferCurrency}`)
      : reservationNote;

    const payload: CreateReservationPayload = {
      vipVehicleId: selectedVehicle.id,
      fromLocation: fromValue,
      toLocation: toValue,
      transferDate: dateValue,
      isReturn: false,
      returnDate: null,
      flightNumber: isAirportTransfer() ? flightNumber : null,
      note: finalNote,
      totalPrice: price,
      contactFullName,
      contactNationality,
      contactPhone,
      contactEmail,
      contactLanguage,
      paymentMethod,
      passengers: passengerDetails.map(p => ({
        fullName: p.fullName,
        dateOfBirth: p.dateOfBirth ? new Date(p.dateOfBirth).toISOString() : new Date().toISOString(),
        nationality: p.nationality
      }))
    };

    try {
      const data = await createVipReservation(payload);
      setReservationSuccess(data);
      setStep(5); // Go to success/confirmation step
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      console.error("Reservation error:", err);
      let errorMsg = dictionary.errorConnection || "Rezervasyon oluşturulurken bir hata oluştu. Lütfen bilgileri kontrol edip tekrar deneyin.";
      const errData = err?.data;

      if (errData && Array.isArray(errData.errors)) {
        errorMsg = errData.errors.map((e: any) => e.errorMessage).join(" ");
      } else if (errData && errData.message) {
        errorMsg = errData.message;
      } else if (errData && errData.errors && typeof errData.errors === "object") {
        const errorList = [];
        for (const key in errData.errors) {
          if (Array.isArray(errData.errors[key])) {
            errorList.push(...errData.errors[key]);
          }
        }
        if (errorList.length > 0) {
          errorMsg = errorList.join(" ");
        }
      }
      setError(errorMsg);
    } finally {
      setIsReserving(false);
    }
  };

  const renderStepper = (currentStep: number) => {
    const steps = [
      { num: 1, label: dictionary.step1 || "Araç Seçimi" },
      { num: 2, label: dictionary.step2 || "Yolcu Bilgileri" },
      { num: 3, label: dictionary.step3 || "Ödeme" }
    ];

    return (
      <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-4 sm:p-5 md:p-6 mb-6 md:mb-8 border border-slate-100">
        {/* Mobile View (< sm) */}
        <div className="sm:hidden">
          <div className="relative flex items-center justify-between">
            {/* Background connecting track line */}
            <div className="absolute top-[18px] left-[16%] right-[16%] h-[2px] bg-slate-100 -z-0">
              <div
                className="h-full bg-green-500 transition-all duration-500"
                style={{
                  width: currentStep <= 1 ? "0%" : currentStep === 2 ? "50%" : "100%"
                }}
              />
            </div>

            {steps.map((s) => {
              const isCompleted = currentStep > s.num;
              const isActive = currentStep === s.num;

              return (
                <div key={s.num} className="relative z-10 flex flex-col items-center flex-1">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ring-4 ring-white ${
                      isActive
                        ? "bg-primary text-white shadow-md shadow-primary/30 scale-105"
                        : isCompleted
                        ? "bg-green-500 text-white shadow-sm"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {isCompleted ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      s.num
                    )}
                  </div>
                  <span
                    className={`mt-2 text-[11px] font-bold tracking-tight text-center transition-colors duration-200 ${
                      isActive
                        ? "text-primary"
                        : isCompleted
                        ? "text-slate-800"
                        : "text-slate-400"
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Desktop View (>= sm) */}
        <div className="hidden sm:flex items-center justify-between">
          {steps.map((s, idx) => {
            const isCompleted = currentStep > s.num;
            const isActive = currentStep === s.num;

            return (
              <React.Fragment key={s.num}>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm md:text-base font-bold transition-all duration-300 ${
                      isActive
                        ? "bg-primary text-white shadow-md shadow-primary/25 ring-4 ring-primary/10"
                        : isCompleted
                        ? "bg-green-500 text-white shadow-sm ring-4 ring-green-500/10"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {isCompleted ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      s.num
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span
                      className={`text-sm md:text-base font-bold tracking-wide transition-colors duration-200 ${
                        isActive
                          ? "text-primary"
                          : isCompleted
                          ? "text-slate-800"
                          : "text-slate-400"
                      }`}
                    >
                      {s.label}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {isCompleted ? (dictionary.completed || "Tamamlandı") : isActive ? (dictionary.currentStep || "Mevcut adım") : (dictionary.nextStep || "Sıradaki adım")}
                    </span>
                  </div>
                </div>

                {idx < steps.length - 1 && (
                  <div className="flex-1 mx-4 h-[2px] bg-slate-100 relative overflow-hidden rounded-full">
                    <div
                      className={`h-full transition-all duration-500 rounded-full ${
                        isCompleted ? "bg-green-500 w-full" : "w-0"
                      }`}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {step === 1 && (
        <div className="animate-fade-in">
          {/* 
        ===========================================
        HERO & FORM SECTION
        ===========================================
      */}
          <div className="relative pt-24 pb-20 lg:pt-32 lg:pb-32 overflow-hidden bg-white">
            {/* Abstract Blobs in background (similar to requested image) */}
            <div className="absolute top-0 right-0 w-[500px] lg:w-[800px] h-[500px] lg:h-[800px] bg-primary/5 rounded-full blur-[100px] pointer-events-none transform translate-x-1/3 -translate-y-1/4"></div>
            <div className="absolute top-1/4 right-1/4 w-[400px] lg:w-[600px] h-[400px] lg:h-[600px] bg-secondary/10 rounded-full blur-[90px] pointer-events-none transform translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary-light/5 rounded-full blur-[100px] pointer-events-none transform -translate-x-1/2 translate-y-1/4"></div>

            <div className="container mx-auto px-4 md:px-8 max-w-7xl relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

                {/* Left Column: Title + Form */}
                <div className="lg:col-span-7 xl:col-span-8 z-20 animate-fade-in-up">

                  {/* Titles */}
                  <div className="mb-8">
                    <h2 className="font-handwriting text-5xl md:text-7xl text-primary mb-2 transform -rotate-2 origin-left tracking-wider">
                      {dictionary.heroTitleHighlight || "Seyahat Başlasın."}
                    </h2>
                    <h1 className="text-3xl md:text-5xl font-bold text-slate-500 tracking-tight">
                      {dictionary.heroTitle || "Online Hızlı Rezervasyon"}
                    </h1>
                  </div>

                  {/* The Form Card */}
                  <div className="bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-6 md:p-8 border border-slate-100 relative">
                    <form onSubmit={handleSubmit}>
                      {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 flex items-center gap-3 animate-fade-in">
                          <AlertCircle className="w-5 h-5 shrink-0" />
                          <p className="text-sm font-medium">{error}</p>
                        </div>
                      )}

                      {/* Checkbox */}
                      <div className="flex items-center gap-2 mb-6">
                        <input
                          type="checkbox"
                          id="return-trip"
                          className="w-4 h-4 text-primary rounded border-slate-300 focus:ring-primary cursor-pointer"
                        />
                        <label htmlFor="return-trip" className="text-sm text-slate-600 font-medium cursor-pointer">
                          {dictionary.returnTrip || "Dönüş transferi istiyorum."}
                        </label>
                      </div>

                      {/* Row 1: Nereden / Nereye */}
                      <div className="relative mb-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
                          {/* Nereden */}
                          <div className="space-y-1 relative">
                            <label htmlFor="from" className="block text-xs font-bold text-slate-800 tracking-wide">
                              {dictionary.from}
                            </label>
                            <div className="relative">
                              <input
                                type="text"
                                id="from"
                                ref={fromInputRef}
                                value={fromValue}
                                onChange={(e) => {
                                  setFromValue(e.target.value);
                                  setFromPlaceId(null);
                                }}
                                required
                                className="w-full pl-4 pr-10 py-3 bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-slate-700 text-sm"
                                placeholder={isLoaded ? (dictionary.fromPlaceholder || "Alış yeri (Havalimanı, otel, adres...)") : (dictionary.loading || "Yükleniyor...")}
                                disabled={!isLoaded}
                              />
                              <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                            </div>
                          </div>

                          {/* Desktop Swap Button */}
                          <div className="absolute z-10 left-1/2 top-[41px] -translate-x-1/2 -translate-y-1/2 hidden md:flex">
                            <button
                              type="button"
                              onClick={handleSwapLocations}
                              title={dictionary.swapTooltip || "Güzergahı Değiştir (Nereden ⇄ Nereye)"}
                              aria-label={dictionary.swapTooltip || "Güzergahı Değiştir"}
                              className="w-8 h-8 rounded-full bg-white border border-slate-300 shadow-sm hover:shadow-md flex items-center justify-center text-slate-500 hover:text-primary hover:border-primary hover:scale-110 active:scale-95 transition-all cursor-pointer group"
                            >
                              <ArrowLeftRight className="h-4 w-4 transition-transform group-hover:rotate-180 duration-300 text-slate-600 group-hover:text-primary" />
                            </button>
                          </div>

                          {/* Nereye */}
                          <div className="space-y-1 relative">
                            <div className="flex items-center justify-between">
                              <label htmlFor="to" className="block text-xs font-bold text-slate-800 tracking-wide">
                                {dictionary.to}
                              </label>
                              {/* Mobile Swap Shortcut */}
                              <button
                                type="button"
                                onClick={handleSwapLocations}
                                className="md:hidden flex items-center gap-1 text-[11px] font-semibold text-primary hover:text-primary-dark transition-colors cursor-pointer"
                              >
                                <ArrowLeftRight className="h-3 w-3" />
                                <span>{dictionary.swap || "Değiştir"}</span>
                              </button>
                            </div>
                            <div className="relative">
                              <input
                                type="text"
                                id="to"
                                ref={toInputRef}
                                value={toValue}
                                onChange={(e) => {
                                  setToValue(e.target.value);
                                  setToPlaceId(null);
                                }}
                                required
                                className="w-full pl-4 pr-10 py-3 bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-slate-700 text-sm"
                                placeholder={isLoaded ? (dictionary.toPlaceholder || "Varış yeri (İlçe, otel, adres...)") : (dictionary.loading || "Yükleniyor...")}
                                disabled={!isLoaded}
                              />
                              <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Row 2: Tarih / Kişi Sayısı / Submit */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Tarih */}
                        <div className="space-y-1">
                          <label htmlFor="date" className="block text-xs font-bold text-slate-800 tracking-wide">
                            {dictionary.pickupDate || "Alış Tarihi"}
                          </label>
                          <div className="relative">
                            <input
                              type="datetime-local"
                              id="date"
                              value={dateValue}
                              min={getMinDateTime()}
                              onChange={(e) => setDateValue(e.target.value)}
                              required
                              className="w-full pl-4 pr-10 py-3 bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-slate-700 text-sm appearance-none"
                            />
                            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                          </div>
                        </div>

                        {/* Kişi Sayısı */}
                        <div className="space-y-1">
                          <label htmlFor="passengers" className="block text-xs font-bold text-slate-800 tracking-wide">
                            {dictionary.passengers || "Kişi Sayısı"}
                          </label>
                          <div className="relative">
                            <select
                              id="passengers"
                              value={passengersValue}
                              onChange={(e) => setPassengersValue(e.target.value)}
                              required
                              className="w-full pl-4 pr-10 py-3 bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-slate-700 text-sm appearance-none"
                            >
                              <option value="1">1 {dictionary.personUnit || "Kişi"}</option>
                              <option value="2">2 {dictionary.personUnit || "Kişi"}</option>
                              <option value="3">3 {dictionary.personUnit || "Kişi"}</option>
                              <option value="4">4 {dictionary.personUnit || "Kişi"}</option>
                              <option value="5">5 {dictionary.personUnit || "Kişi"}</option>
                              <option value="6">6 {dictionary.personUnit || "Kişi"}</option>
                              <option value="7+">7+ {dictionary.personUnit || "Kişi"}</option>
                            </select>
                            <Users className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                          </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex items-end">
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full h-[46px] bg-primary hover:bg-primary-dark text-white rounded-md font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                          >
                            {isSubmitting ? (dictionary.submittingButton || "Gönderiliyor...") : (dictionary.search || "Ara")}
                            {!isSubmitting && <Search className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>

                {/* Right Column: Image */}
                <div className="lg:col-span-5 xl:col-span-4 hidden lg:block relative z-10 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl h-[400px] w-full transform rotate-2 hover:rotate-0 transition-transform duration-500">
                    <Image
                      src="/vip-transfer.jpg"
                      alt={dictionary.imageAlt}
                      fill
                      className="object-cover"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* 
        ===========================================
        PROMOTIONAL CONTENT SECTION
        ===========================================
      */}
          <div className="bg-slate-50 py-20 lg:py-28 border-t border-slate-200">
            <div className="container mx-auto px-4 md:px-8 max-w-5xl text-center">
              <div className="inline-block mb-4 animate-fade-in-up">
                <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide">
                  {dictionary.ourServices || "Hizmetlerimiz"}
                </span>
              </div>
              <h2 className="text-3xl lg:text-5xl font-extrabold text-slate-900 mb-8 tracking-tight animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                {dictionary.title}
              </h2>

              <div className="space-y-6 text-slate-600 text-lg leading-relaxed max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                <p>{dictionary.paragraph1}</p>
                <p>{dictionary.paragraph2}</p>
              </div>
            </div>
          </div>

          {/* 
        ===========================================
        VIP FLEET SECTION
        ===========================================
      */}
          {vipVehicles.length > 0 && (
            <div className="bg-white py-20 border-t border-slate-100">
              <div className="container mx-auto px-4 md:px-8 max-w-7xl">
                <div className="text-center mb-16 animate-fade-in-up">
                  <div className="inline-block mb-4">
                    <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide">
                      {dictionary.vipFleet || "VIP Araç Filomuz"}
                    </span>
                  </div>
                  <h2 className="text-3xl lg:text-5xl font-extrabold text-slate-900 mt-2 tracking-tight">
                    {dictionary.vipFleetTitle || "Ayrıcalıklı Yolculuk Deneyimi İçin Geniş Filomuz"}
                  </h2>
                  <p className="text-slate-500 mt-4 text-lg max-w-2xl mx-auto">
                    {dictionary.vipFleetSubtitle || "Konforunuz ve güvenliğiniz için tasarlanmış lüks VIP araçlarımızla seyahatlerinizi unutulmaz kılın."}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {vipVehicles.map((vehicle, index) => (
                    <div
                      key={vehicle.id}
                      className="bg-white rounded-3xl border border-slate-100 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group animate-fade-in-up"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div>
                        {/* Image */}
                        <div className="relative aspect-[16/10] w-full bg-slate-50 overflow-hidden">
                          {vehicle.imageUrl ? (
                            <img
                              src={getImageUrl(vehicle.imageUrl)}
                              alt={vehicle.name}
                              className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                              <svg className="w-16 h-16 mb-2" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124l-.324-5.184a3.375 3.375 0 00-3.37-3.166h-4.88m-6 0h11.25m-11.25 0V5.625c0-.621.504-1.125 1.125-1.125h9.75c.621 0 1.125.504 1.125 1.125V9.75M3.375 14.25h17.25m-17.25 0a3.375 3.375 0 003 3.375h11.25a3.375 3.375 0 003-3.375" />
                              </svg>
                              <span className="text-sm font-medium">{dictionary.noImage || "Görsel Yüklenmedi"}</span>
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="p-6">
                          <h3 className="text-xl font-bold text-slate-800 mb-4 group-hover:text-primary transition-colors duration-200">{vehicle.name}</h3>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 bg-slate-50 px-4 py-3 rounded-2xl border border-slate-100/50">
                              <Users className="w-5 h-5 text-primary" />
                              <div>
                                <span className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{dictionary.capacity || "Kapasite"}</span>
                                <span className="font-bold text-slate-700 text-sm">{vehicle.passengerCapacity} {dictionary.personUnit || "Kişi"}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 bg-slate-50 px-4 py-3 rounded-2xl border border-slate-100/50">
                              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                              </svg>
                              <div>
                                <span className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{dictionary.luggage || "Bagaj"}</span>
                                <span className="font-bold text-slate-700 text-sm">{vehicle.luggageCapacity} {dictionary.bagsUnit || "Adet"}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {step === 2 && (
        <div className="bg-slate-50 min-h-screen pt-8 pb-20 animate-fade-in-up">
          <div className="container mx-auto px-4 md:px-8 max-w-6xl">
            {/* Stepper */}
            {renderStepper(1)}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Sidebar */}
              <div className="lg:col-span-4">
                <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 p-6 lg:sticky lg:top-24">
                  <h3 className="text-xl font-extrabold text-slate-800 mb-6 pb-4 border-b border-slate-100">{dictionary.bookingDetails || "Rezervasyon detayları"}</h3>

                  <div className="space-y-6">
                    <div>
                      <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">{dictionary.from || "Nereden"}</span>
                      <div className="flex items-start gap-3 bg-slate-50 p-3 rounded-xl">
                        <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-slate-700 font-medium text-sm leading-snug">{fromValue}</span>
                      </div>
                    </div>

                    <div>
                      <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">{dictionary.to || "Nereye"}</span>
                      <div className="flex items-start gap-3 bg-slate-50 p-3 rounded-xl">
                        <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-slate-700 font-medium text-sm leading-snug">{toValue}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                      <div>
                        <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">{dictionary.pickupDate || "Alış Tarihi"}</span>
                        <div className="flex items-center gap-2 text-slate-700 font-semibold text-sm">
                          <Calendar className="w-4 h-4 text-primary" />
                          <span>{dateValue ? new Date(dateValue).toLocaleDateString(lang === "en" ? "en-US" : "tr-TR") : "-"}</span>
                        </div>
                      </div>
                      <div>
                        <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">{dictionary.passengers || "Kişi Sayısı"}</span>
                        <div className="flex items-center gap-2 text-slate-700 font-semibold text-sm">
                          <Users className="w-4 h-4 text-primary" />
                          <span>{passengersValue} {dictionary.personUnit || "Kişi"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 bg-slate-50/80 p-4 rounded-xl mt-2">
                      <div>
                        <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">{dictionary.distance || "Mesafe"}</span>
                        <span className="text-slate-900 font-extrabold text-lg">{distanceKm?.toFixed(1)} <span className="text-sm font-medium text-slate-500">km</span></span>
                      </div>
                      <div>
                        <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">{dictionary.estimatedDuration || "Tahmini Süre"}</span>
                        <span className="text-slate-900 font-extrabold text-lg">{durationText}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => { window.location.hash = ""; }}
                      className="w-full py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold text-sm transition-colors mt-6 border border-slate-200"
                    >
                      {dictionary.editSearch || "Aramayı Düzenle"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-8 space-y-6">
                <div className="bg-green-50/80 border border-green-200 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="text-green-800 font-semibold text-sm">{dictionary.freeCancelBanner || "Tüm araçlarda ücretsiz iptal seçeneği bulunmaktadır."}</span>
                </div>

                {[...vipVehicles]
                  .sort((a, b) => {
                    const priceA = getVehiclePrice(a);
                    const priceB = getVehiclePrice(b);
                    if (priceA === null && priceB === null) return 0;
                    if (priceA === null) return 1;
                    if (priceB === null) return -1;
                    return priceA - priceB;
                  })
                  .map((vehicle, idx) => {
                    const price = getVehiclePrice(vehicle);
                    return (
                      <div id={`vehicle-card-${vehicle.id}`} key={vehicle.id} className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 hover:shadow-lg transition-all duration-300 p-6 lg:p-8 animate-fade-in-up" style={{ animationDelay: `${idx * 100}ms` }}>
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                          {/* Image */}
                          <div className="md:col-span-4 h-48 bg-slate-50 rounded-xl overflow-hidden relative shadow-inner">
                            {vehicle.imageUrl ? (
                              <img src={getImageUrl(vehicle.imageUrl)} alt={vehicle.name} className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500" />
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                                <svg className="w-10 h-10 mb-2 opacity-50" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124l-.324-5.184a3.375 3.375 0 00-3.37-3.166h-4.88m-6 0h11.25m-11.25 0V5.625c0-.621.504-1.125 1.125-1.125h9.75c.621 0 1.125.504 1.125 1.125V9.75M3.375 14.25h17.25m-17.25 0a3.375 3.375 0 003 3.375h11.25a3.375 3.375 0 003-3.375" />
                                </svg>
                                <span className="text-xs font-medium">{dictionary.noImageShort || "Görsel Yok"}</span>
                              </div>
                            )}
                          </div>

                          {/* Details */}
                          <div className="md:col-span-5 space-y-4">
                            <h4 className="text-2xl font-extrabold text-slate-800 tracking-tight">{vehicle.name}</h4>
                            <div className="flex gap-4">
                              <div className="flex items-center gap-2 text-sm text-slate-700 font-semibold bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                                <Users className="w-4 h-4 text-primary" /> {vehicle.passengerCapacity} {dictionary.personUnit || "Kişi"}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-slate-700 font-semibold bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>
                                {vehicle.luggageCapacity} {dictionary.luggage || "Bagaj"}
                              </div>
                            </div>
                            <ul className="text-sm text-slate-500 space-y-2 pt-2">
                              <li className="flex items-center gap-2.5 font-medium"><CheckCircle2 className="w-4 h-4 text-green-500" /> {dictionary.doorToDoor || "Kapıdan kapıya transfer"}</li>
                              <li className="flex items-center gap-2.5 font-medium"><CheckCircle2 className="w-4 h-4 text-green-500" /> {dictionary.meetAndGreet || "Tanışma ve Karşılama dahil"}</li>
                            </ul>
                            <button
                              onClick={() => setExpandedVehicleId(expandedVehicleId === vehicle.id ? null : vehicle.id)}
                              className="text-primary font-bold text-sm hover:underline flex items-center gap-1 mt-2"
                            >
                              {expandedVehicleId === vehicle.id ? (dictionary.showLessInfo || "Daha az bilgi göster") : (dictionary.showMoreInfo || "Daha fazla bilgi göster")}
                              <svg className={`w-4 h-4 transform transition-transform duration-300 ${expandedVehicleId === vehicle.id ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                              </svg>
                            </button>
                          </div>

                          {/* Price & Action */}
                          <div className="md:col-span-3 flex flex-col items-end md:border-l md:border-slate-100 md:pl-6 h-full justify-between">
                            <div className="text-right w-full">
                              <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">{dictionary.oneWay || "Tek Yön"}</span>
                              {price !== null ? (
                                <div className="mb-4">
                                  <span className="text-3xl font-extrabold text-slate-900 tracking-tight">{price.toLocaleString(lang === "en" ? "en-US" : "tr-TR")} ₺</span>
                                </div>
                              ) : (
                                <div className="mb-4 mt-2">
                                  <span className="text-lg font-extrabold text-orange-500 bg-orange-50 px-3 py-1.5 rounded-lg">{dictionary.askPrice || "Fiyat Sorunuz"}</span>
                                </div>
                              )}
                              <ul className="text-xs text-green-700 font-semibold space-y-1.5 w-full text-right mb-6">
                                <li className="flex items-center justify-end gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> {dictionary.freeCancellation || "Ücretsiz iptal"}</li>
                                <li className="flex items-center justify-end gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> {dictionary.noHiddenCosts || "Gizli maliyet yok"}</li>
                              </ul>
                            </div>
                            <button
                              onClick={() => handleSelectVehicle(vehicle)}
                              className="w-full py-3.5 bg-[#22c55e] hover:bg-[#16a34a] text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-green-500/30 hover:shadow-green-500/40 active:scale-[0.98]"
                            >
                              {dictionary.selectThisVehicle || "BU ARACI SEÇ"}
                            </button>
                          </div>
                        </div>

                        {/* Expanded Details Section */}
                        {expandedVehicleId === vehicle.id && (
                          <div className="mt-8 pt-8 border-t border-slate-100 grid grid-cols-1 md:grid-cols-12 gap-8 animate-fade-in-up">
                            {/* Left Column: Key Features */}
                            <div className="md:col-span-8 space-y-6">
                              <div className="flex gap-4 items-start">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                  <span className="text-primary font-bold text-lg">★</span>
                                </div>
                                <div>
                                  <h5 className="font-extrabold text-slate-800 text-sm mb-1">{dictionary.meetGreetTitle || "Karşılama ve Selamlama"}</h5>
                                  <p className="text-slate-500 text-xs leading-relaxed">
                                    {dictionary.meetGreetDesc || "Şoförünüzün, seyahat programınızdaki değişikliklerden bağımsız olarak, varışta sizinle buluşacağını bekleyeceğinden emin olun."}
                                  </p>
                                </div>
                              </div>

                              <div className="flex gap-4 items-start">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>
                                </div>
                                <div>
                                  <h5 className="font-extrabold text-slate-800 text-sm mb-1">{dictionary.privateServiceTitle || "Özel Servis"}</h5>
                                  <p className="text-slate-500 text-xs leading-relaxed">
                                    {dictionary.privateServiceDesc || "Yolculuğunuz yalnızca sizin için planlanmıştır."}
                                  </p>
                                </div>
                              </div>

                              <div className="flex gap-4 items-start">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </div>
                                <div>
                                  <h5 className="font-extrabold text-slate-800 text-sm mb-1">{dictionary.supportTitle || "7/24 Müşteri Hizmetleri"}</h5>
                                  <p className="text-slate-500 text-xs leading-relaxed">
                                    {dictionary.supportDesc || "Seyahat öncesinde ve seyahat esnasında 7/24 yardım Hattı."}
                                  </p>
                                </div>
                              </div>

                              <div className="flex gap-4 items-start">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124l-.324-5.184a3.375 3.375 0 00-3.37-3.166h-4.88m-6 0h11.25m-11.25 0V5.625c0-.621.504-1.125 1.125-1.125h9.75c.621 0 1.125.504 1.125 1.125V9.75M3.375 14.25h17.25m-17.25 0a3.375 3.375 0 003 3.375h11.25a3.375 3.375 0 003-3.375" /></svg>
                                </div>
                                <div>
                                  <h5 className="font-extrabold text-slate-800 text-sm mb-1">{dictionary.vehicleUpgradeTitle || "Araç Resimden Farklı Olabilir"}</h5>
                                  <p className="text-slate-500 text-xs leading-relaxed">
                                    {dictionary.vehicleUpgradeDesc || "Bu araç müsaitlik durumuna bağlı olarak daha yüksek kapasiteli bir araçla yükseltilebilir."}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Right Column: "Neden Biz?" Card */}
                            <div className="md:col-span-4">
                              <div className="bg-primary rounded-2xl p-6 text-white shadow-lg shadow-primary/20 relative overflow-hidden h-full flex flex-col justify-between">
                                {/* Background highlights */}
                                <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
                                <div className="absolute -left-6 -top-6 w-20 h-20 bg-white/5 rounded-full blur-lg pointer-events-none"></div>

                                <div>
                                  <h5 className="text-lg font-extrabold mb-4 pb-3 border-b border-white/20 tracking-wide">{dictionary.whyUs || "Neden Biz?"}</h5>
                                  <ul className="space-y-3.5 text-sm font-semibold">
                                    <li className="flex items-center gap-3"><span className="text-base">👍</span> {dictionary.whyUsAgency || "Turizm Seyahat Acentası"}</li>
                                    <li className="flex items-center gap-3"><span className="text-base">👤</span> {dictionary.whyUsDrivers || "Profesyonel sürücüler"}</li>
                                    <li className="flex items-center gap-3"><span className="text-base">✓</span> {dictionary.whyUsFreeCancel || "Ücretsiz iptal"}</li>
                                    <li className="flex items-center gap-3"><span className="text-base">⇄</span> {dictionary.whyUsNoHidden || "Gizli maliyet yok"}</li>
                                    <li className="flex items-center gap-3"><span className="text-base">💳</span> {dictionary.whyUsNoCardFee || "Kredi kartı ücreti yok"}</li>
                                  </ul>
                                </div>
                              </div>
                            </div>

                            {/* Bottom Collapse Button */}
                            <div className="col-span-12 flex justify-center pt-2">
                              <button
                                onClick={() => {
                                  setExpandedVehicleId(null);
                                  // Scroll slightly back to the parent card top
                                  const cardEl = document.getElementById(`vehicle-card-${vehicle.id}`);
                                  cardEl?.scrollIntoView({ behavior: "smooth", block: "start" });
                                }}
                                className="text-primary font-bold text-sm hover:underline flex items-center gap-1.5 transition-colors"
                              >
                                {dictionary.showLessInfo || "Daha az bilgi göster"}
                                <svg className="w-4 h-4 transform rotate-180" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}

                {vipVehicles.length === 0 && (
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">{dictionary.noVehiclesFoundTitle || "Uygun Araç Bulunamadı"}</h3>
                    <p className="text-slate-500 mb-6">{dictionary.noVehiclesFoundDesc || "Seçtiğiniz kriterlere uygun araç şu an için bulunmamaktadır. Lütfen farklı tarihler veya güzergahlar deneyin."}</p>
                    <button onClick={() => { window.location.hash = ""; }} className="px-6 py-2.5 bg-primary text-white rounded-xl font-bold transition-colors hover:bg-primary-dark">
                      {dictionary.editSearch || "Aramayı Düzenle"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 4 && selectedVehicle && (
        <div className="bg-slate-50 min-h-screen pt-8 pb-20 animate-fade-in-up">
          <div className="container mx-auto px-4 md:px-8 max-w-6xl">
            {/* Stepper */}
            {renderStepper(2)}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Sidebar */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 p-6 lg:sticky lg:top-24 space-y-6">
                  <h3 className="text-xl font-extrabold text-slate-800 pb-4 border-b border-slate-100">{dictionary.bookingDetails || "Rezervasyon Detayları"}</h3>

                  <div className="space-y-4">
                    <div>
                      <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">{dictionary.from || "Nereden"}</span>
                      <div className="flex items-start gap-2 bg-slate-50 p-3 rounded-xl">
                        <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <span className="text-slate-700 font-medium text-xs leading-snug">{fromValue}</span>
                      </div>
                    </div>

                    <div>
                      <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">{dictionary.to || "Nereye"}</span>
                      <div className="flex items-start gap-2 bg-slate-50 p-3 rounded-xl">
                        <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <span className="text-slate-700 font-medium text-xs leading-snug">{toValue}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
                      <div>
                        <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">{dictionary.pickupDate || "Alış Tarihi"}</span>
                        <div className="flex items-center gap-1.5 text-slate-700 font-semibold text-xs">
                          <Calendar className="w-3.5 h-3.5 text-primary" />
                          <span>{dateValue ? new Date(dateValue).toLocaleString(lang === "en" ? "en-US" : "tr-TR") : "-"}</span>
                        </div>
                      </div>
                      <div>
                        <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">{dictionary.passengers || "Kişi Sayısı"}</span>
                        <div className="flex items-center gap-1.5 text-slate-700 font-semibold text-xs">
                          <Users className="w-3.5 h-3.5 text-primary" />
                          <span>{passengersValue} {dictionary.personUnit || "Kişi"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
                      <div>
                        <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">{dictionary.distance || "Mesafe"}</span>
                        <span className="text-slate-900 font-extrabold text-sm">{distanceKm?.toFixed(1)} <span className="text-xs font-medium text-slate-500">km</span></span>
                      </div>
                      <div>
                        <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">{dictionary.duration || "Süre"}</span>
                        <span className="text-slate-900 font-extrabold text-sm">{durationText}</span>
                      </div>
                    </div>
                  </div>

                  {/* Selected Vehicle details */}
                  <div className="pt-6 border-t border-slate-100 space-y-4">
                    <h4 className="text-sm font-bold text-slate-800">{dictionary.selectedVehicle || "Seçilen Araç"}</h4>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
                      <div className="relative aspect-[16/10] w-full rounded-lg overflow-hidden bg-slate-200">
                        {selectedVehicle.imageUrl ? (
                          <img src={getImageUrl(selectedVehicle.imageUrl)} alt={selectedVehicle.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">{dictionary.noImageShort || "Görsel Yok"}</div>
                        )}
                      </div>
                      <div>
                        <h5 className="font-extrabold text-slate-800 text-sm">{selectedVehicle.name}</h5>
                        <div className="flex gap-3 mt-1.5">
                          <span className="text-[10px] text-slate-500 font-bold bg-white px-2 py-0.5 rounded border border-slate-200/50 flex items-center gap-1">
                            <Users className="w-3 h-3 text-primary" /> {selectedVehicle.passengerCapacity} {dictionary.personUnit || "Kişi"}
                          </span>
                          <span className="text-[10px] text-slate-500 font-bold bg-white px-2 py-0.5 rounded border border-slate-200/50 flex items-center gap-1">
                            <svg className="w-3 h-3 text-primary" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>
                            {selectedVehicle.luggageCapacity} {dictionary.luggage || "Bagaj"}
                          </span>
                        </div>
                      </div>
                      <div className="pt-3 border-t border-slate-200/50 flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-500 uppercase">{dictionary.totalAmount || "Toplam Tutar"}</span>
                        <span className="text-lg font-black text-primary">
                          {getVehiclePrice(selectedVehicle)?.toLocaleString(lang === "en" ? "en-US" : "tr-TR")} ₺
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Passenger & Contact Details Summary (Dynamic) */}
                  {(contactFullName || contactEmail || contactPhone || passengerDetails.some(p => p.fullName)) && (
                    <div className="pt-6 border-t border-slate-100 space-y-4">
                      <h4 className="text-sm font-bold text-slate-800">{dictionary.passengerAndContactInfo || "Yolcu ve İletişim Bilgileri"}</h4>

                      {/* Contact Person */}
                      {(contactFullName || contactEmail || contactPhone) && (
                        <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-100 space-y-2">
                          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">{dictionary.contactPerson || "İrtibat Kişisi"}</span>
                          <div className="text-xs text-slate-700 space-y-1 font-medium">
                            {contactFullName && <p className="font-bold text-slate-800 text-sm">{contactFullName}</p>}
                            {(contactEmail || contactPhone) && (
                              <p className="text-slate-500">
                                {contactEmail}{contactEmail && contactPhone ? " • " : ""}{contactPhone}
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Passenger List */}
                      {passengerDetails.some(p => p.fullName) && (
                        <div className="space-y-2">
                          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">{dictionary.passengersHeading || "Yolcular"}</span>
                          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                            {passengerDetails.filter(p => p.fullName).map((p, idx) => (
                              <div key={idx} className="bg-slate-50/50 p-2.5 rounded-lg border border-slate-100 text-xs flex justify-between items-center animate-fade-in">
                                <div>
                                  <span className="font-semibold text-slate-700 block">{p.fullName}</span>
                                  <span className="text-[10px] text-slate-400 font-medium">{dictionary.nationality || "Uyruk"}: {p.nationality || "-"}</span>
                                </div>
                                <span className="text-slate-400 font-medium">
                                  {p.dateOfBirth ? new Date(p.dateOfBirth).toLocaleDateString(lang === "en" ? "en-US" : "tr-TR") : "-"}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <button
                    onClick={() => { setStep(2); }}
                    className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold text-sm transition-colors border border-slate-200"
                  >
                    {dictionary.changeVehicle || "Aracı Değiştir"}
                  </button>
                </div>
              </div>

              {/* Passenger Form */}
              <div className="lg:col-span-8">
                <form onSubmit={handleGoToPayment} className="space-y-6">
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-4 rounded-xl flex items-center gap-3 shadow-sm">
                      <AlertCircle className="w-5 h-5 shrink-0" />
                      <p className="text-sm font-semibold">{error}</p>
                    </div>
                  )}

                  {/* Passenger Information Card */}
                  <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 p-6 md:p-8 space-y-6">
                    <div className="border-b border-slate-100 pb-4">
                      <h3 className="text-xl font-extrabold text-slate-800">{dictionary.passengerInfoTitle || "Yolcu Bilgileri"}</h3>
                      <p className="text-slate-400 text-xs mt-1">{dictionary.passengerInfoSubtitle || "Lütfen tüm yolcuların bilgilerini kimliklerinde yazıldığı şekilde giriniz."}</p>
                    </div>

                    <div className="space-y-6">
                      {passengerDetails.map((passenger, index) => (
                        <div key={index} className="p-4 rounded-xl bg-slate-50/50 border border-slate-100 space-y-4">
                          <h4 className="text-xs font-bold text-primary uppercase tracking-wider">{index + 1}. {dictionary.passengerNumber || "Yolcu"}</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-1">
                              <label className="block text-xs font-bold text-slate-700">{dictionary.fullName || "Ad Soyad"}</label>
                              <input
                                type="text"
                                required
                                value={passenger.fullName}
                                onChange={(e) => {
                                  const updated = [...passengerDetails];
                                  updated[index].fullName = e.target.value;
                                  setPassengerDetails(updated);
                                }}
                                placeholder={dictionary.fullNamePlaceholder || "Örn: Ahmet Yılmaz"}
                                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-slate-700 text-sm"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="block text-xs font-bold text-slate-700">{dictionary.dateOfBirth || "Doğum Tarihi"}</label>
                              <input
                                type="date"
                                required
                                value={passenger.dateOfBirth}
                                onChange={(e) => {
                                  const updated = [...passengerDetails];
                                  updated[index].dateOfBirth = e.target.value;
                                  setPassengerDetails(updated);
                                }}
                                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-slate-700 text-sm"
                              />
                            </div>
                            <div className="space-y-2">
                              <div className="space-y-1">
                                <label className="block text-xs font-bold text-slate-700">{dictionary.nationality || "Uyruk"}</label>
                                <div className="relative">
                                  <select
                                    required
                                    value={
                                      !passenger.nationality
                                        ? ""
                                        : countries.some(c => c.label === passenger.nationality)
                                          ? passenger.nationality
                                          : "OTHER"
                                    }
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      const updated = [...passengerDetails];
                                      updated[index].nationality = val;
                                      setPassengerDetails(updated);
                                    }}
                                    className="w-full pl-4 pr-10 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-slate-700 text-sm appearance-none"
                                  >
                                    <option value="">{dictionary.selectOption || (lang === "tr" ? "Seçiniz..." : "Select...")}</option>
                                    {countries.map((c) => (
                                      <option key={c.value} value={c.label}>{c.label}</option>
                                    ))}
                                    <option value="OTHER">{dictionary.otherOption || (lang === "tr" ? "Diğer..." : "Other...")}</option>
                                  </select>
                                  <Globe className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                                </div>
                              </div>

                              {passenger.nationality && !countries.some(c => c.label === passenger.nationality) && (
                                <div className="space-y-1">
                                  <input
                                    type="text"
                                    required
                                    value={passenger.nationality === "OTHER" ? "" : passenger.nationality}
                                    onChange={(e) => {
                                      const updated = [...passengerDetails];
                                      updated[index].nationality = e.target.value || "OTHER";
                                      setPassengerDetails(updated);
                                    }}
                                    placeholder={dictionary.nationalityCustomPlaceholder || (lang === "tr" ? "Lütfen uyruğunuzu yazın" : "Please write your nationality")}
                                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-slate-700 text-sm"
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Flight Info Card (Conditional) */}
                  {isAirportTransfer() && (
                    <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 p-6 md:p-8 space-y-4">
                      <div className="border-b border-slate-100 pb-4">
                        <h3 className="text-xl font-extrabold text-slate-800">{dictionary.flightInfoTitle || "Uçuş Bilgileri"}</h3>
                        <p className="text-slate-400 text-xs mt-1">{dictionary.flightInfoSubtitle || "Uçuşunuzun rötar yapması durumunda şoförümüzün sizi bekleyebilmesi için gereklidir."}</p>
                      </div>
                      <div className="space-y-1 max-w-md">
                        <label className="block text-xs font-bold text-slate-700">{dictionary.flightNumber || "Uçuş Numarası"}</label>
                        <input
                          type="text"
                          required
                          value={flightNumber}
                          onChange={(e) => setFlightNumber(e.target.value)}
                          placeholder={dictionary.flightNumberPlaceholder || "Örn: TK1920 veya PC2024"}
                          className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-slate-700 text-sm uppercase"
                        />
                      </div>
                    </div>
                  )}
                  <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 p-6 md:p-8 space-y-6">
                    <div className="border-b border-slate-100 pb-4">
                      <h3 className="text-xl font-extrabold text-slate-800">{dictionary.contactInfoTitle || "İletişim Bilgileri & Notlar"}</h3>
                      <p className="text-slate-400 text-xs mt-1">{dictionary.contactInfoSubtitle || "Rezervasyon onayınız bu iletişim bilgilerine gönderilecektir."}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-slate-700">{dictionary.fullName || "Ad Soyad"}</label>
                        <input
                          type="text"
                          required
                          value={contactFullName}
                          onChange={(e) => setContactFullName(e.target.value)}
                          placeholder={dictionary.fullNamePlaceholder || "Örn: Ahmet Yılmaz"}
                          className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-slate-700 text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="space-y-1">
                          <label className="block text-xs font-bold text-slate-700">{dictionary.nationality || "Uyruk"}</label>
                          <div className="relative">
                            <select
                              required
                              value={
                                !contactNationality
                                  ? ""
                                  : countries.some(c => c.label === contactNationality)
                                    ? contactNationality
                                    : "OTHER"
                              }
                              onChange={(e) => setContactNationality(e.target.value)}
                              className="w-full pl-4 pr-10 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-slate-700 text-sm appearance-none"
                            >
                              <option value="">{dictionary.selectOption || (lang === "tr" ? "Seçiniz..." : "Select...")}</option>
                              {countries.map((c) => (
                                <option key={c.value} value={c.label}>{c.label}</option>
                              ))}
                              <option value="OTHER">{dictionary.otherOption || (lang === "tr" ? "Diğer..." : "Other...")}</option>
                            </select>
                            <Globe className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                          </div>
                        </div>

                        {contactNationality && !countries.some(c => c.label === contactNationality) && (
                          <div className="space-y-1">
                            <input
                              type="text"
                              required
                              value={contactNationality === "OTHER" ? "" : contactNationality}
                              onChange={(e) => setContactNationality(e.target.value || "OTHER")}
                              placeholder={dictionary.nationalityCustomPlaceholder || (lang === "tr" ? "Lütfen uyruğunuzu yazın" : "Please write your nationality")}
                              className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-slate-700 text-sm"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-slate-700">{dictionary.email || "E-posta Adresi"}</label>
                        <input
                          type="email"
                          required
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          placeholder="yolcu@email.com"
                          className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-slate-700 text-sm"
                        />
                      </div>
                       <div className="space-y-1">
                        <label className="block text-xs font-bold text-slate-700">{dictionary.phone || "Telefon Numarası"}</label>
                        <div className="flex gap-2">
                          <div className="relative w-[110px] shrink-0">
                            <select
                              value={dialCode}
                              onChange={(e) => setDialCode(e.target.value)}
                              className="w-full pl-3 pr-8 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-slate-700 text-sm appearance-none font-semibold"
                            >
                              {dialCodes.map((d) => (
                                <option key={`${d.isoCode}-${d.code}`} value={d.code}>
                                  {d.label}
                                </option>
                              ))}
                            </select>
                            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[10px] text-slate-400">
                              ▼
                            </div>
                          </div>
                          <input
                            type="tel"
                            required
                            value={phoneLocal}
                            onChange={(e) => {
                              // Sadece rakamlar, boşluklar ve kısa çizgilere izin verir
                              const val = e.target.value.replace(/[^0-9\s-]/g, "");
                              setPhoneLocal(val);
                            }}
                            placeholder="555 123 45 67"
                            className="flex-1 px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-slate-700 text-sm"
                          />
                        </div>
                        <p className="text-[10px] text-slate-400 font-semibold mt-1">{dictionary.phoneNotice || "Lütfen alan kodunu seçip telefon numaranızı girin."}</p>
                      </div>
                    </div>

                    <div className="space-y-1 pt-2 max-w-md">
                      <label className="block text-xs font-bold text-slate-700">{dictionary.contactLanguage || "Tercih Edilen İletişim Dili"}</label>
                      <div className="flex gap-4 mt-1">
                        <label className="flex items-center gap-2 text-sm text-slate-700 font-medium cursor-pointer">
                          <input
                            type="radio"
                            name="contactLanguage"
                            value="tr"
                            checked={contactLanguage === "tr"}
                            onChange={() => setContactLanguage("tr")}
                            className="w-4 h-4 text-primary focus:ring-primary border-slate-300"
                          />
                          Türkçe
                        </label>
                        <label className="flex items-center gap-2 text-sm text-slate-700 font-medium cursor-pointer">
                          <input
                            type="radio"
                            name="contactLanguage"
                            value="en"
                            checked={contactLanguage === "en"}
                            onChange={() => setContactLanguage("en")}
                            className="w-4 h-4 text-primary focus:ring-primary border-slate-300"
                          />
                          English
                        </label>
                      </div>
                    </div>

                    <div className="space-y-1 pt-2">
                      <label className="block text-xs font-bold text-slate-700 font-semibold">{dictionary.driverNote || "Sürücüye Not (İsteğe Bağlı)"}</label>
                      <textarea
                        value={reservationNote}
                        onChange={(e) => setReservationNote(e.target.value)}
                        placeholder={dictionary.driverNotePlaceholder || "Özel isteklerinizi, bagaj detaylarını veya çocuk koltuğu talebinizi belirtebilirsiniz."}
                        rows={3}
                        className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-slate-700 text-sm resize-none"
                      />
                    </div>
                  </div>

                  {/* Form Submission */}
                  <div className="flex justify-end pt-4">
                    <button
                      type="submit"
                      className="px-8 py-4 bg-[#22c55e] hover:bg-[#16a34a] text-white rounded-xl font-bold text-base transition-all shadow-lg shadow-green-500/20 hover:shadow-green-500/30 flex items-center justify-center gap-3 active:scale-[0.98]"
                    >
                      {dictionary.goToPayment || "Ödeme Adımına Geç"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}


      {step === 6 && selectedVehicle && (
        <div className="bg-slate-50 min-h-screen pt-8 pb-20 animate-fade-in-up">
          <div className="container mx-auto px-4 md:px-8 max-w-6xl">
            {/* Stepper */}
            {renderStepper(3)}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Sidebar */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 p-6 lg:sticky lg:top-24 space-y-6">
                  <h3 className="text-xl font-extrabold text-slate-800 pb-4 border-b border-slate-100">
                    {dictionary.bookingDetails || "Rezervasyon Özeti"}
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        {dictionary.from || "Nereden"}
                      </span>
                      <div className="flex items-start gap-2 bg-slate-50 p-3 rounded-xl">
                        <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <span className="text-slate-700 font-medium text-xs leading-snug">{fromValue}</span>
                      </div>
                    </div>

                    <div>
                      <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        {dictionary.to || "Nereye"}
                      </span>
                      <div className="flex items-start gap-2 bg-slate-50 p-3 rounded-xl">
                        <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <span className="text-slate-700 font-medium text-xs leading-snug">{toValue}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
                      <div>
                        <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                          {dictionary.pickupDate || "Alış Tarihi"}
                        </span>
                        <div className="flex items-center gap-1.5 text-slate-700 font-semibold text-xs">
                          <Calendar className="w-3.5 h-3.5 text-primary" />
                          <span>{dateValue ? new Date(dateValue).toLocaleString(lang === "en" ? "en-US" : "tr-TR") : "-"}</span>
                        </div>
                      </div>
                      <div>
                        <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                          {dictionary.passengers || "Kişi Sayısı"}
                        </span>
                        <div className="flex items-center gap-1.5 text-slate-700 font-semibold text-xs">
                          <Users className="w-3.5 h-3.5 text-primary" />
                          <span>{passengersValue} {dictionary.personUnit || "Kişi"}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Selected Vehicle details */}
                  <div className="pt-6 border-t border-slate-100 space-y-4">
                    <h4 className="text-sm font-bold text-slate-800">
                      {dictionary.selectedVehicle || "Seçilen Araç"}
                    </h4>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
                      <div className="relative aspect-[16/10] w-full rounded-lg overflow-hidden bg-slate-200">
                        {selectedVehicle.imageUrl ? (
                          <img src={getImageUrl(selectedVehicle.imageUrl)} alt={selectedVehicle.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                            {dictionary.noImage || "Görsel Yok"}
                          </div>
                        )}
                      </div>
                      <div>
                        <h5 className="font-extrabold text-slate-800 text-sm">{selectedVehicle.name}</h5>
                      </div>
                      <div className="pt-3 border-t border-slate-200/50 flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-500 uppercase">
                          {dictionary.totalAmount || "Toplam Tutar"}
                        </span>
                        <span className="text-lg font-black text-primary">
                          {getVehiclePrice(selectedVehicle)?.toLocaleString(lang === "en" ? "en-US" : "tr-TR")} ₺
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Passenger & Contact Details Summary */}
                  <div className="pt-6 border-t border-slate-100 space-y-4">
                    <h4 className="text-sm font-bold text-slate-800">
                      {dictionary.passengerAndContactInfo || "Yolcu ve İletişim Bilgileri"}
                    </h4>

                    {/* Contact Person */}
                    <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-100 space-y-2">
                      <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {dictionary.contactPerson || "İrtibat Kişisi"}
                      </span>
                      <div className="text-xs text-slate-700 space-y-1 font-medium">
                        <p className="font-bold text-slate-800 text-sm">{contactFullName}</p>
                        <p className="text-slate-500">{contactEmail} • {contactPhone}</p>
                        <p className="text-[11px] text-slate-500">
                          {dictionary.nationality || "Uyruk"}: <span className="text-slate-700 font-semibold">{contactNationality}</span> • {dictionary.preferredLang || "Dil"}: <span className="text-slate-700 font-semibold">{contactLanguage === "tr" ? "Türkçe" : "English"}</span>
                        </p>
                      </div>
                    </div>

                    {/* Passenger List */}
                    {passengerDetails.length > 0 && (
                      <div className="space-y-2">
                        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          {dictionary.passengersHeading || "Yolcular"}
                        </span>
                        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                          {passengerDetails.map((p, idx) => (
                            <div key={idx} className="bg-slate-50/50 p-2.5 rounded-lg border border-slate-100 text-xs flex justify-between items-center">
                              <div>
                                <span className="font-semibold text-slate-700 block">{p.fullName || `${idx + 1}. ${dictionary.passengerNumber || "Yolcu"}`}</span>
                                <span className="text-[10px] text-slate-400 font-medium">
                                  {dictionary.nationality || "Uyruk"}: {p.nationality || "-"}
                                </span>
                              </div>
                              <span className="text-slate-400 font-medium">
                                {p.dateOfBirth ? new Date(p.dateOfBirth).toLocaleDateString(lang === "en" ? "en-US" : "tr-TR") : "-"}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment Card Form */}
              <div className="lg:col-span-8">
                <form onSubmit={handleCreateReservation} className="space-y-6">
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-4 rounded-xl flex items-center gap-3 shadow-sm">
                      <AlertCircle className="w-5 h-5 shrink-0" />
                      <p className="text-sm font-semibold">{error}</p>
                    </div>
                  )}

                  <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 p-6 md:p-8 space-y-6">
                    <div className="border-b border-slate-100 pb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary">
                          {dictionary.bankTransferBadge || "Havale / EFT"}
                        </span>
                      </div>
                      <h3 className="text-xl font-extrabold text-slate-800">
                        {dictionary.paymentInfo || "Ödeme Bilgileri"}
                      </h3>
                      <p className="text-slate-400 text-xs mt-1">
                        {dictionary.paymentInfoSubtitle || "Lütfen ödeme para biriminizi seçerek rezervasyonunuzu tamamlayın."}
                      </p>
                    </div>

                    <div className="space-y-6 animate-fade-in">
                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-slate-700">
                          {dictionary.preferredCurrency || "Ödeme Yapmak İstediğiniz Para Birimi"}
                        </label>
                        <select
                          value={bankTransferCurrency}
                          onChange={(e) => setBankTransferCurrency(e.target.value)}
                          className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-slate-700 text-sm cursor-pointer"
                        >
                          {availableBankCurrencies.length > 0 ? (
                            availableBankCurrencies.map((curr) => {
                              const symbol = getCurrencySymbol(curr);
                              return (
                                <option key={curr} value={curr}>
                                  {curr} {symbol ? `(${symbol})` : ""}
                                </option>
                              );
                            })
                          ) : (
                            <option value="TRY">TRY (₺)</option>
                          )}
                        </select>
                      </div>

                      {activeBankAccounts && activeBankAccounts.length > 0 && (
                        <div className="space-y-3 pt-2">
                          <label className="block text-xs font-bold text-slate-700">
                            {dictionary.ourBankAccounts || "Banka Hesaplarımız"}
                          </label>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {(() => {
                              const matchingAccounts = activeBankAccounts.filter(
                                (account) => (account.currency?.trim()?.toUpperCase() || "TRY") === bankTransferCurrency
                              );
                              const accountsToDisplay = matchingAccounts.length > 0 ? matchingAccounts : activeBankAccounts;

                              return accountsToDisplay.map((account) => (
                                <div key={account.id} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-1.5">
                                  <div className="flex justify-between items-center">
                                    <span className="text-xs font-extrabold text-slate-800">{account.bankName}</span>
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-primary/10 text-primary">
                                      {account.currency || "TRY"}
                                    </span>
                                  </div>
                                  <div className="text-[11px] text-slate-600">
                                    <span className="text-slate-400">{dictionary.accountHolder || "Hesap Sahibi"}:</span> <span className="font-semibold">{account.accountHolder}</span>
                                  </div>
                                  <div className="text-[11px] text-slate-700 font-mono bg-white p-2 rounded border border-slate-200 select-all">
                                    {account.iban}
                                  </div>
                                </div>
                              ));
                            })()}
                          </div>
                        </div>
                      )}

                      <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex items-start gap-3">
                        <svg className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg>
                        <div className="text-sm text-indigo-900 leading-relaxed">
                          {dictionary.paymentNotice || "Ödeme ve IBAN bilgileri, rezervasyonunuz tamamlandıktan sonra e-posta adresinize ve telefon numaranıza iletilecektir."}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex justify-between items-center pt-4">
                    <button
                      type="button"
                      onClick={() => setStep(4)}
                      className="px-6 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold text-base transition-all border border-slate-200"
                    >
                      {dictionary.back || "Geri Dön"}
                    </button>

                    <button
                      type="submit"
                      disabled={isReserving}
                      className="px-8 py-4 bg-[#22c55e] hover:bg-[#16a34a] text-white rounded-xl font-bold text-base transition-all shadow-lg shadow-green-500/20 hover:shadow-green-500/30 flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-75 disabled:cursor-not-allowed"
                    >
                      {isReserving ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          {dictionary.processing || "İşleniyor..."}
                        </>
                      ) : (
                        dictionary.completeReservation || "Rezervasyonu Tamamla"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 5 && reservationSuccess && (
        <div className="bg-slate-50 min-h-screen pt-8 pb-20 animate-fade-in-up">
          <div className="container mx-auto px-4 md:px-8 max-w-3xl">
            {/* Stepper */}
            {renderStepper(4)}

            {/* Success Card */}
            <div className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 p-8 md:p-12 text-center space-y-8 relative overflow-hidden">
              {/* Decorative top bar */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-green-500"></div>

              {/* Big Success Checkmark */}
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto shadow-inner animate-bounce">
                <CheckCircle2 className="w-12 h-12 text-green-600" />
              </div>

              <div className="space-y-3">
                <h2 className="text-3xl font-black text-slate-800 tracking-tight">
                  {dictionary.successTitle || "Rezervasyonunuz Başarıyla Alındı!"}
                </h2>
                <p className="text-slate-500 text-sm max-w-md mx-auto">
                  {dictionary.successSubtitle || "VIP Transfer talebiniz başarıyla kaydedilmiştir. Detaylar aşağıda listelenmiştir ve ayrıca e-posta adresinize gönderilmiştir."}
                </p>
              </div>

              {/* Reference Code Card */}
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 inline-flex flex-col items-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  {dictionary.reservationCode || "Rezervasyon Kodu"}
                </span>
                <span className="text-2xl font-black text-primary">#VIP-{reservationSuccess.id}</span>
              </div>

              {/* Bank Transfer Info Alert */}
              {reservationSuccess.paymentMethod === "BankTransfer" && (
                <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-5 text-left space-y-2 animate-fade-in max-w-xl mx-auto">
                  <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
                    <svg className="w-5 h-5 text-amber-600 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>{dictionary.bankTransferAlertTitle || "Havale / EFT Ödeme Bilgilendirmesi"}</span>
                  </div>
                  <p className="text-xs text-amber-700 leading-relaxed font-medium">
                    {dictionary.bankTransferAlertDesc || "Rezervasyonunuza ait banka hesap bilgileri ve ödeme detayları e-posta adresinize ve telefon numaranıza iletilmiştir. Transferinizin sorunsuz gerçekleşmesi için ödeme işleminin transfer saatinizden en az 2 saat önce tamamlanmış olması gerekmektedir."}
                  </p>
                </div>
              )}

              {/* Summary Details */}
              <div className="border-t border-b border-slate-100 py-6 text-left space-y-6">
                <h3 className="font-bold text-slate-800 text-base">
                  {dictionary.transferDetails || "Transfer Detayları"}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        {dictionary.from || "Nereden"}
                      </span>
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <span className="text-slate-700 font-semibold text-xs leading-snug">{reservationSuccess.fromLocation}</span>
                      </div>
                    </div>

                    <div>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        {dictionary.to || "Nereye"}
                      </span>
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <span className="text-slate-700 font-semibold text-xs leading-snug">{reservationSuccess.toLocation}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                          {dictionary.dateTime || "Tarih & Saat"}
                        </span>
                        <div className="flex items-center gap-1.5 text-slate-700 font-bold text-xs">
                          <Calendar className="w-3.5 h-3.5 text-primary" />
                          <span>{reservationSuccess.transferDate ? new Date(reservationSuccess.transferDate.replace(/Z$/, "")).toLocaleString(lang === "en" ? "en-US" : "tr-TR", { dateStyle: "short", timeStyle: "short" }) : "-"}</span>
                        </div>
                      </div>
                      <div>
                        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                          {dictionary.passengers || "Kişi Sayısı"}
                        </span>
                        <div className="flex items-center gap-1.5 text-slate-700 font-bold text-xs">
                          <Users className="w-3.5 h-3.5 text-primary" />
                          <span>{passengersValue} {dictionary.personUnit || "Kişi"}</span>
                        </div>
                      </div>
                    </div>

                    {reservationSuccess.flightNumber && (
                      <div>
                        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                          {dictionary.flightNumber || "Uçuş Numarası"}
                        </span>
                        <span className="text-slate-700 font-bold text-xs uppercase bg-slate-100 px-2 py-1 rounded border border-slate-200/50 inline-block">{reservationSuccess.flightNumber}</span>
                      </div>
                    )}

                    <div>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        {dictionary.totalPrice || "Toplam Fiyat"}
                      </span>
                      <span className="text-xl font-extrabold text-[#22c55e]">
                        {reservationSuccess.totalPrice?.toLocaleString(lang === "en" ? "en-US" : "tr-TR")} ₺
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {dictionary.contactInfo || "İletişim Bilgileri"}
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs">
                    <div>
                      <span className="text-slate-400 block mb-0.5">{dictionary.fullName || "Ad Soyad"}</span>
                      <span className="font-semibold text-slate-700">{reservationSuccess.contactFullName}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-0.5">{dictionary.nationality || "Uyruk"}</span>
                      <span className="font-semibold text-slate-700">{reservationSuccess.contactNationality}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-0.5">{dictionary.phone || "Telefon"}</span>
                      <span className="font-semibold text-slate-700">{reservationSuccess.contactPhone}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-0.5">{dictionary.email || "E-posta"}</span>
                      <span className="font-semibold text-slate-700">{reservationSuccess.contactEmail}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-0.5">{dictionary.contactLanguage || "Tercih Edilen Dil"}</span>
                      <span className="font-semibold text-slate-700 uppercase">{reservationSuccess.contactLanguage === "tr" ? "Türkçe" : "English"}</span>
                    </div>
                  </div>
                </div>

                {reservationSuccess.passengers && reservationSuccess.passengers.length > 0 && (
                  <div className="pt-4 border-t border-slate-100">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                      {dictionary.passengerList || "Yolcu Listesi"}
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {reservationSuccess.passengers.map((p: any, idx: number) => (
                        <div key={idx} className="bg-slate-50 px-3 py-2 rounded-lg border border-slate-100 flex justify-between items-center text-xs">
                          <div>
                            <span className="font-semibold text-slate-700 block">{p.fullName}</span>
                            <span className="text-[10px] text-slate-400 font-medium">
                              {dictionary.nationality || "Uyruk"}: {p.nationality}
                            </span>
                          </div>
                          <span className="text-slate-400 font-medium">
                            {p.dateOfBirth ? new Date(p.dateOfBirth).toLocaleDateString(lang === "en" ? "en-US" : "tr-TR") : ""}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Reset Form */}
              <div className="pt-4">
                <button
                  onClick={() => {
                    resetBooking();
                    setError(null);
                    window.location.hash = "";
                  }}
                  className="px-8 py-3.5 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold text-sm transition-all shadow-md shadow-primary/20 hover:shadow-primary/30"
                >
                  {dictionary.newReservation || "Yeni Rezervasyon Yap"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default VipTransfer;
