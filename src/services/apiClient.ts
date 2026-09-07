/**
 * Centralized API Client and Base Configuration
 * Single source of truth for backend endpoints, authentication tokens, and asset URLs.
 */

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://api.akturtourism.com";

/**
 * Retrieves the stored JWT authentication token from localStorage.
 */
export const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("aktur_token");
  }
  return null;
};

/**
 * Sets or removes the stored JWT token.
 */
export const setAuthToken = (token: string | null): void => {
  if (typeof window !== "undefined") {
    if (token) {
      localStorage.setItem("aktur_token", token);
    } else {
      localStorage.removeItem("aktur_token");
    }
  }
};

/**
 * Resolves uploaded media URLs with the active backend base url.
 */
export const getImageUrl = (url: string | null | undefined): string => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${API_BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
};

export interface ApiError extends Error {
  status?: number;
  data?: any;
}

/**
 * Core fetch wrapper that automatically appends base url, JWT headers, and parses responses.
 */
export async function apiFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  const headers = new Headers(options.headers || {});

  // Add Authorization token if present in client
  const token = getAuthToken();
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  // Set Content-Type to application/json only if body is not FormData
  if (!(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorData: any;
    try {
      errorData = await response.json();
    } catch {
      errorData = { message: response.statusText };
    }
    const error: ApiError = new Error(
      errorData?.message || `Request failed with status ${response.status}`
    );
    error.status = response.status;
    error.data = errorData;
    throw error;
  }

  // Handle empty 204 or non-JSON responses
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }
  return {} as T;
}
