import {
  PriceRange,
  VipVehicle,
  BankAccount,
  Country,
  PassengerPayload,
  CreateReservationPayload,
  ReservationResponse,
} from "@/models/vipTransfer";

export * from "@/models/vipTransfer";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

/**
 * Resolves image URL with environment API base url.
 */
export const getImageUrl = (url: string | null | undefined): string => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${API_BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
};

/**
 * Fetches all visible VIP vehicles for transfer booking.
 */
export const getVisibleVipVehicles = async (): Promise<VipVehicle[]> => {
  const res = await fetch(`${API_BASE_URL}/api/VipVehicles/visible`);
  if (!res.ok) {
    throw new Error(`Failed to fetch visible VIP vehicles: ${res.statusText}`);
  }
  return res.json();
};

/**
 * Fetches active bank accounts for Havale / EFT payment.
 */
export const getActiveBankAccounts = async (): Promise<BankAccount[]> => {
  const res = await fetch(`${API_BASE_URL}/api/BankAccounts/active`);
  if (!res.ok) {
    throw new Error(`Failed to fetch active bank accounts: ${res.statusText}`);
  }
  return res.json();
};

/**
 * Fetches country list for nationality selection.
 */
export const getCountries = async (): Promise<Country[]> => {
  const res = await fetch(`${API_BASE_URL}/api/countries`);
  if (!res.ok) {
    throw new Error(`Failed to fetch countries: ${res.statusText}`);
  }
  return res.json();
};

/**
 * Creates a new VIP transfer reservation.
 */
export const createVipReservation = async (
  payload: CreateReservationPayload
): Promise<ReservationResponse> => {
  const res = await fetch(`${API_BASE_URL}/api/VipVehicles/reservation`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let errorData;
    try {
      errorData = await res.json();
    } catch {
      errorData = { message: res.statusText };
    }
    const error: any = new Error("Reservation creation failed");
    error.data = errorData;
    error.status = res.status;
    throw error;
  }

  return res.json();
};
