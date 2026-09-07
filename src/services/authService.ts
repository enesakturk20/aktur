import { apiFetch, setAuthToken } from "./apiClient";
import { LoginResponse, AuthUser } from "@/models";

export type { LoginResponse, AuthUser };

/**
 * Authentication service for Portal logins and session lifecycle.
 */
export const authService = {
  /**
   * Logs in a company administrator or portal user.
   */
  async companyLogin(email: string, password: string): Promise<LoginResponse> {
    return apiFetch<LoginResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  /**
   * Logs in a driver/vehicle using plate number and password.
   */
  async vehicleLogin(plate: string, password: string): Promise<LoginResponse> {
    return apiFetch<LoginResponse>("/api/auth/vehicle-login", {
      method: "POST",
      body: JSON.stringify({ plate, password }),
    });
  },

  /**
   * Decodes role claim from JWT token.
   */
  decodeRole(token: string, fallbackRole = "company"): string {
    try {
      const payloadBase64 = token.split(".")[1];
      const decodedJson = atob(payloadBase64);
      const payload = JSON.parse(decodedJson);
      return (
        payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
        payload.role ||
        fallbackRole
      );
    } catch {
      return fallbackRole;
    }
  },

  /**
   * Stores authentication token and user session data in localStorage.
   */
  saveSession(token: string, user: AuthUser): void {
    setAuthToken(token);
    if (typeof window !== "undefined") {
      localStorage.setItem("aktur_user", JSON.stringify(user));
    }
  },

  /**
   * Clears session and reloads or redirects.
   */
  logout(): void {
    setAuthToken(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("aktur_user");
    }
  },

  /**
   * Gets current stored user session if available.
   */
  getCurrentUser(): AuthUser | null {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("aktur_user");
      if (userStr) {
        try {
          return JSON.parse(userStr);
        } catch {
          return null;
        }
      }
    }
    return null;
  },
};
