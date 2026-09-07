import { apiFetch } from "./apiClient";
import { SystemStats } from "@/models";

export type { SystemStats };

/**
 * Service for Super Admin Dashboard: Platform statistics, company administration,
 * VIP vehicle management, and asset uploads.
 */
export const adminService = {
  // --- Stats ---
  async getSystemStats(): Promise<SystemStats> {
    return apiFetch<SystemStats>("/api/Admin/system-stats");
  },

  // --- Companies ---
  async getCompanies(): Promise<any[]> {
    return apiFetch<any[]>("/api/Admin/companies");
  },

  async createCompany(payload: any): Promise<any> {
    return apiFetch("/api/Admin/companies", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async updateCompany(id: number, payload: any): Promise<any> {
    return apiFetch(`/api/Admin/companies/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  async deleteCompany(id: number): Promise<void> {
    return apiFetch<void>(`/api/Admin/companies/${id}`, {
      method: "DELETE",
    });
  },

  async toggleAdmin(companyId: number): Promise<any> {
    return apiFetch(`/api/Admin/companies/${companyId}/toggle-admin`, {
      method: "PUT",
    });
  },

  // --- Global Vehicles & Students ---
  async getAllVehicles(): Promise<any[]> {
    return apiFetch<any[]>("/api/Admin/vehicles");
  },

  async getAllStudents(): Promise<any[]> {
    return apiFetch<any[]>("/api/Admin/students");
  },

  // --- VIP Vehicles ---
  async getVipVehicles(): Promise<any[]> {
    return apiFetch<any[]>("/api/VipVehicles");
  },

  async createVipVehicle(payload: any): Promise<any> {
    return apiFetch("/api/VipVehicles", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async updateVipVehicle(id: number, payload: any): Promise<any> {
    return apiFetch(`/api/VipVehicles/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  async deleteVipVehicle(id: number): Promise<void> {
    return apiFetch<void>(`/api/VipVehicles/${id}`, {
      method: "DELETE",
    });
  },

  // --- VIP Reservations ---
  async getVipReservations(): Promise<any[]> {
    return apiFetch<any[]>("/api/VipVehicles/reservations");
  },

  // --- Bank Accounts ---
  async getBankAccounts(): Promise<any[]> {
    return apiFetch<any[]>("/api/BankAccounts");
  },

  async createBankAccount(payload: any): Promise<any> {
    return apiFetch("/api/BankAccounts", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async updateBankAccount(id: number, payload: any): Promise<any> {
    return apiFetch(`/api/BankAccounts/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  async deleteBankAccount(id: number): Promise<void> {
    return apiFetch<void>(`/api/BankAccounts/${id}`, {
      method: "DELETE",
    });
  },

  // --- File Upload ---
  async uploadFile(file: File): Promise<{ url: string; [key: string]: any }> {
    const formData = new FormData();
    formData.append("file", file);
    return apiFetch("/api/Upload", {
      method: "POST",
      body: formData,
    });
  },
};
