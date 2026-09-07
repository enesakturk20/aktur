import { apiFetch } from "./apiClient";
import { DriverPassenger } from "@/models";

export type { DriverPassenger };

/**
 * Service for Driver Dashboard operations.
 */
export const driverService = {
  /**
   * Fetches the assigned student passenger list for the authenticated vehicle.
   */
  async getMyPassengers(): Promise<DriverPassenger[]> {
    return apiFetch<DriverPassenger[]>("/api/Students/my-passengers");
  },
};
