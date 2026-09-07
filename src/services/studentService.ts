import { apiFetch, API_BASE_URL } from "./apiClient";
import {
  Province,
  District,
  Neighborhood,
  StudentRegistrationPayload,
  CompanyDetails,
} from "@/models";

export type {
  Province,
  District,
  Neighborhood,
  StudentRegistrationPayload,
  CompanyDetails,
};

/**
 * Service for public student registration, address lookup, and school transport details.
 */
export const studentService = {
  /**
   * Fetches company details and schools for registration (server or client).
   */
  async getCompanyDetails(companyId: string | number): Promise<CompanyDetails> {
    const url = `${API_BASE_URL}/api/students/company-details/${companyId}`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      throw new Error(`Failed to fetch company details: ${res.statusText}`);
    }
    return res.json();
  },

  /**
   * Fetches Turkish provinces for address selection.
   */
  async getProvinces(): Promise<Province[]> {
    return apiFetch<Province[]>("/api/address/provinces");
  },

  /**
   * Fetches districts for a specific province.
   */
  async getDistricts(provinceId: number | string): Promise<District[]> {
    return apiFetch<District[]>(`/api/address/provinces/${provinceId}/districts`);
  },

  /**
   * Fetches neighborhoods for a specific district.
   */
  async getNeighborhoods(districtId: number | string): Promise<Neighborhood[]> {
    return apiFetch<Neighborhood[]>(`/api/address/districts/${districtId}/neighborhoods`);
  },

  /**
   * Submits student registration form.
   */
  async registerStudent(payload: StudentRegistrationPayload): Promise<any> {
    return apiFetch("/api/students", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};
