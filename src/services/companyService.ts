import { apiFetch } from "./apiClient";
import { SchoolItem, VehicleItem, StudentItem } from "@/models";

export type { SchoolItem, VehicleItem, StudentItem };

/**
 * Service for Company Dashboard operations: Schools, Vehicles, Students, and Route Assignments.
 */
export const companyService = {
  // --- Schools ---
  async getSchools(): Promise<SchoolItem[]> {
    return apiFetch<SchoolItem[]>("/api/Schools");
  },

  async createSchool(payload: any): Promise<SchoolItem> {
    return apiFetch<SchoolItem>("/api/Schools", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async updateSchool(id: number, payload: any): Promise<SchoolItem> {
    return apiFetch<SchoolItem>(`/api/Schools/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  async deleteSchool(id: number): Promise<void> {
    return apiFetch<void>(`/api/Schools/${id}`, {
      method: "DELETE",
    });
  },

  // --- Vehicles ---
  async getVehicles(): Promise<VehicleItem[]> {
    return apiFetch<VehicleItem[]>("/api/Vehicles");
  },

  async createVehicle(payload: any): Promise<VehicleItem> {
    return apiFetch<VehicleItem>("/api/Vehicles", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async updateVehicle(id: number, payload: any): Promise<VehicleItem> {
    return apiFetch<VehicleItem>(`/api/Vehicles/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  async deleteVehicle(id: number): Promise<void> {
    return apiFetch<void>(`/api/Vehicles/${id}`, {
      method: "DELETE",
    });
  },

  async resetVehiclePassword(id: number, newPassword: string): Promise<any> {
    return apiFetch(`/api/Vehicles/${id}/reset-password`, {
      method: "PUT",
      body: JSON.stringify({ newPassword }),
    });
  },

  // --- Students ---
  async getStudents(): Promise<StudentItem[]> {
    return apiFetch<StudentItem[]>("/api/Students");
  },

  async createStudent(payload: any): Promise<StudentItem> {
    return apiFetch<StudentItem>("/api/Students", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async updateStudent(id: number, payload: any): Promise<StudentItem> {
    return apiFetch<StudentItem>(`/api/Students/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  async deleteStudent(id: number): Promise<void> {
    return apiFetch<void>(`/api/Students/${id}`, {
      method: "DELETE",
    });
  },

  async assignStudent(studentId: number, vehicleId: number): Promise<any> {
    return apiFetch("/api/Students/assign", {
      method: "POST",
      body: JSON.stringify({ studentId, vehicleId }),
    });
  },

  async unassignStudent(studentId: number): Promise<any> {
    return apiFetch(`/api/Students/${studentId}/unassign`, {
      method: "POST",
    });
  },
};
