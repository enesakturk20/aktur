import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  VipVehicle,
  BankAccount,
  ReservationResponse,
} from "@/models/vipTransfer";

export const getDefaultDateTime = () => {
  const date = new Date();
  date.setHours(date.getHours() + 5);
  date.setMinutes(0, 0, 0);
  const pad = (num: number) => String(num).padStart(2, "0");
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export const getMinDateTime = () => {
  const date = new Date();
  date.setHours(date.getHours() + 4);
  date.setMinutes(date.getMinutes() + 1);
  const pad = (num: number) => String(num).padStart(2, "0");
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export interface PassengerDetail {
  fullName: string;
  dateOfBirth: string;
  nationality: string;
}

export interface VipTransferState {
  // Stepper
  step: number;

  // Search / Route
  fromValue: string;
  fromPlaceId: string | null;
  toValue: string;
  toPlaceId: string | null;
  dateValue: string;
  passengersValue: string;
  distanceKm: number | null;
  durationText: string | null;

  // Fleet & Selection
  vipVehicles: VipVehicle[];
  selectedVehicle: VipVehicle | null;
  expandedVehicleId: number | null;

  // Passenger Details & Contact
  passengerDetails: PassengerDetail[];
  contactFullName: string;
  contactNationality: string;
  contactEmail: string;
  contactPhone: string;
  dialCode: string;
  phoneLocal: string;
  contactLanguage: string;
  flightNumber: string;
  reservationNote: string;

  // Payment
  paymentMethod: "BankTransfer";
  activeBankAccounts: BankAccount[];
  bankTransferCurrency: string;

  // Confirmation
  reservationSuccess: ReservationResponse | null;

  // Actions
  setStep: (step: number) => void;
  setFrom: (value: string, placeId?: string | null) => void;
  setFromValue: (value: string) => void;
  setFromPlaceId: (placeId: string | null) => void;
  setTo: (value: string, placeId?: string | null) => void;
  setToValue: (value: string) => void;
  setToPlaceId: (placeId: string | null) => void;
  swapLocations: () => void;
  setDateValue: (date: string) => void;
  setPassengersValue: (passengers: string) => void;
  setDistanceKm: (km: number | null) => void;
  setDurationText: (text: string | null) => void;
  setDistanceAndDuration: (km: number | null, text: string | null) => void;
  setVipVehicles: (vehicles: VipVehicle[]) => void;
  setSelectedVehicle: (vehicle: VipVehicle | null) => void;
  setExpandedVehicleId: (id: number | null) => void;
  setPassengerDetails: (
    details: PassengerDetail[] | ((prev: PassengerDetail[]) => PassengerDetail[])
  ) => void;
  updatePassenger: (
    index: number,
    field: keyof PassengerDetail,
    value: string
  ) => void;
  setContactFullName: (name: string) => void;
  setContactNationality: (nationality: string) => void;
  setContactEmail: (email: string) => void;
  setContactPhone: (phone: string) => void;
  setDialCode: (code: string) => void;
  setPhoneLocal: (phone: string) => void;
  setContactLanguage: (lang: string) => void;
  setFlightNumber: (flight: string) => void;
  setReservationNote: (note: string) => void;
  setActiveBankAccounts: (accounts: BankAccount[]) => void;
  setBankTransferCurrency: (
    currency: string | ((prev: string) => string)
  ) => void;
  setReservationSuccess: (res: ReservationResponse | null) => void;
  resetBooking: () => void;
}

const initialState = {
  step: 1,
  fromValue: "",
  fromPlaceId: null,
  toValue: "",
  toPlaceId: null,
  dateValue: getDefaultDateTime(),
  passengersValue: "1",
  distanceKm: null,
  durationText: null,
  vipVehicles: [],
  selectedVehicle: null,
  expandedVehicleId: null,
  passengerDetails: [],
  contactFullName: "",
  contactNationality: "",
  contactEmail: "",
  contactPhone: "",
  dialCode: "+90",
  phoneLocal: "",
  contactLanguage: "tr",
  flightNumber: "",
  reservationNote: "",
  paymentMethod: "BankTransfer" as const,
  activeBankAccounts: [],
  bankTransferCurrency: "TRY",
  reservationSuccess: null,
};

export const useVipTransferStore = create<VipTransferState>()(
  persist(
    (set) => ({
      ...initialState,

      setStep: (step) => set({ step }),

      setFrom: (fromValue, fromPlaceId = null) =>
        set({ fromValue, fromPlaceId }),

      setFromValue: (fromValue) => set({ fromValue }),

      setFromPlaceId: (fromPlaceId) => set({ fromPlaceId }),

      setTo: (toValue, toPlaceId = null) =>
        set({ toValue, toPlaceId }),

      setToValue: (toValue) => set({ toValue }),

      setToPlaceId: (toPlaceId) => set({ toPlaceId }),

      swapLocations: () =>
        set((state) => ({
          fromValue: state.toValue,
          fromPlaceId: state.toPlaceId,
          toValue: state.fromValue,
          toPlaceId: state.fromPlaceId,
        })),

      setDateValue: (dateValue) => set({ dateValue }),

      setPassengersValue: (passengersValue) => set({ passengersValue }),

      setDistanceKm: (distanceKm) => set({ distanceKm }),

      setDurationText: (durationText) => set({ durationText }),

      setDistanceAndDuration: (distanceKm, durationText) =>
        set({ distanceKm, durationText }),

      setVipVehicles: (vipVehicles) => set({ vipVehicles }),

      setSelectedVehicle: (selectedVehicle) => set({ selectedVehicle }),

      setExpandedVehicleId: (expandedVehicleId) => set({ expandedVehicleId }),

      setPassengerDetails: (details) =>
        set((state) => ({
          passengerDetails:
            typeof details === "function"
              ? details(state.passengerDetails)
              : details,
        })),

      updatePassenger: (index, field, value) =>
        set((state) => {
          const updated = [...state.passengerDetails];
          if (updated[index]) {
            updated[index] = { ...updated[index], [field]: value };
          }
          return { passengerDetails: updated };
        }),

      setContactFullName: (contactFullName) => set({ contactFullName }),

      setContactNationality: (contactNationality) => set({ contactNationality }),

      setContactEmail: (contactEmail) => set({ contactEmail }),

      setContactPhone: (contactPhone) => set({ contactPhone }),

      setDialCode: (dialCode) => set({ dialCode }),

      setPhoneLocal: (phoneLocal) => set({ phoneLocal }),

      setContactLanguage: (contactLanguage) => set({ contactLanguage }),

      setFlightNumber: (flightNumber) => set({ flightNumber }),

      setReservationNote: (reservationNote) => set({ reservationNote }),

      setActiveBankAccounts: (activeBankAccounts) => set({ activeBankAccounts }),

      setBankTransferCurrency: (currency) =>
        set((state) => ({
          bankTransferCurrency:
            typeof currency === "function"
              ? currency(state.bankTransferCurrency)
              : currency,
        })),

      setReservationSuccess: (reservationSuccess) =>
        set({ reservationSuccess }),

      resetBooking: () =>
        set({
          ...initialState,
          dateValue: getDefaultDateTime(),
        }),
    }),
    {
      name: "vip_transfer_store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        step: state.step,
        fromValue: state.fromValue,
        fromPlaceId: state.fromPlaceId,
        toValue: state.toValue,
        toPlaceId: state.toPlaceId,
        dateValue: state.dateValue,
        passengersValue: state.passengersValue,
        distanceKm: state.distanceKm,
        durationText: state.durationText,
        selectedVehicle: state.selectedVehicle,
        passengerDetails: state.passengerDetails,
        contactFullName: state.contactFullName,
        contactNationality: state.contactNationality,
        contactEmail: state.contactEmail,
        contactPhone: state.contactPhone,
        dialCode: state.dialCode,
        phoneLocal: state.phoneLocal,
        contactLanguage: state.contactLanguage,
        flightNumber: state.flightNumber,
        reservationNote: state.reservationNote,
        bankTransferCurrency: state.bankTransferCurrency,
      }),
    }
  )
);
