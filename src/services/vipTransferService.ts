import {
  PriceRange,
  VipVehicle,
  BankAccount,
  Country,
  PassengerPayload,
  CreateReservationPayload,
  ReservationResponse,
} from "@/models/vipTransfer";
import { apiFetch, getImageUrl } from "./apiClient";

export * from "@/models/vipTransfer";
export { getImageUrl };

/**
 * Fetches all visible VIP vehicles for transfer booking.
 */
export const getVisibleVipVehicles = async (): Promise<VipVehicle[]> => {
  return apiFetch<VipVehicle[]>("/api/VipVehicles/visible");
};

/**
 * Fetches active bank accounts for Havale / EFT payment.
 */
export const getActiveBankAccounts = async (): Promise<BankAccount[]> => {
  return apiFetch<BankAccount[]>("/api/BankAccounts/active");
};

/**
 * Fetches country list for nationality selection.
 */
export const getCountries = async (): Promise<Country[]> => {
  return apiFetch<Country[]>("/api/countries");
};

/**
 * Creates a new VIP transfer reservation.
 */
export const createVipReservation = async (
  payload: CreateReservationPayload
): Promise<ReservationResponse> => {
  return apiFetch<ReservationResponse>("/api/VipVehicles/reservation", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};
