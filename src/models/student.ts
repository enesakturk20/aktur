export interface Province {
  id: number;
  name: string;
}

export interface District {
  id: number;
  name: string;
}

export interface Neighborhood {
  id: number;
  name: string;
}

export interface StudentRegistrationPayload {
  fullName: string;
  school: string;
  schoolClass: string;
  branch?: string | null;
  city: string;
  district: string;
  neighborhood: string;
  street: string;
  buildingNo: string;
  apartmentNo?: string | null;
  latitude: number | null;
  longitude: number | null;
  parentFullName: string;
  parentPhone: string;
  parentEmail?: string | null;
  secondParentFullName?: string | null;
  secondParentPhone?: string | null;
  secondParentEmail?: string | null;
  notes?: string | null;
  companyId: number;
  isMorningTrip: boolean;
  isEveningTrip: boolean;
  returnStreet?: string | null;
  returnBuildingNo?: string | null;
  returnApartmentNo?: string | null;
  returnLatitude?: number | null;
  returnLongitude?: number | null;
  returnCity?: string | null;
  returnDistrict?: string | null;
  returnNeighborhood?: string | null;
}

export interface CompanyDetails {
  id: number;
  name: string;
  email: string;
  schools: any[];
  [key: string]: any;
}
