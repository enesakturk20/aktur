export interface PriceRange {
  id?: number;
  fromKm: number;
  toKm: number;
  price: number;
}

export interface VipVehicle {
  id: number;
  name: string;
  passengerCapacity: number;
  luggageCapacity: number;
  priceRanges?: PriceRange[];
  imageUrl?: string | null;
  isVisible: boolean;
}

export interface BankAccount {
  id: number;
  bankName: string;
  accountHolder: string;
  iban: string;
  currency?: string | null;
  isActive?: boolean;
}

export interface Country {
  code: string;
  nameTr: string;
  nameEn: string;
  phoneCode?: string;
}

export interface PassengerPayload {
  fullName: string;
  dateOfBirth?: string;
  nationality?: string;
}

export interface CreateReservationPayload {
  vipVehicleId: number;
  fromLocation: string;
  toLocation: string;
  transferDate: string;
  isReturn: boolean;
  returnDate: string | null;
  flightNumber: string | null;
  note: string;
  totalPrice: number;
  contactFullName: string;
  contactNationality: string;
  contactPhone: string;
  contactEmail: string;
  contactLanguage: string;
  paymentMethod: string;
  passengers: PassengerPayload[];
}

export interface ReservationResponse {
  id: number;
  vipVehicleId: number;
  fromLocation: string;
  toLocation: string;
  transferDate: string;
  isReturn: boolean;
  returnDate?: string | null;
  flightNumber?: string | null;
  note?: string;
  totalPrice: number;
  contactFullName: string;
  contactNationality: string;
  contactPhone: string;
  contactEmail: string;
  contactLanguage: string;
  paymentMethod: string;
  status?: string;
  passengers?: PassengerPayload[];
  createdAt?: string;
}
