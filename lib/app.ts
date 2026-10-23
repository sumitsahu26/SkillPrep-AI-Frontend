const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5002/api";

export interface ApiResponse {
success: boolean;
message?: string;
accessToken?: string;
user?: {
    id: string;
    name: string;
    email: string;
    isAdmin: boolean;
};
}

const getAccessToken = (): string | null => {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem("accessToken");
};

const saveAccessToken = (token: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("accessToken", token);
  }
};

const clearAuth = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
  }
};

const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const response = await fetch(
      `${API_URL}/auth/refresh`,
      {
        method: "POST",
        credentials: "include",
      }
    );

    if (!response.ok) {
      return null;
    }

    const data: ApiResponse = await response.json();

    if (!data.accessToken) {
      return null;
    }

    saveAccessToken(data.accessToken);

    return data.accessToken;
  } catch {
    return null;
  }
};

export const apiRequest = async <T = ApiResponse>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  let token = getAccessToken();

  const makeRequest = async (
    accessToken: string | null
  ) => {
    const headers = new Headers(options.headers);

    // Check if body is FormData
    const isFormData =
      typeof FormData !== "undefined" &&
      options.body instanceof FormData;

    // Only set JSON content type when body is NOT FormData
    if (
      options.body &&
      !isFormData &&
      !headers.has("Content-Type")
    ) {
      headers.set(
        "Content-Type",
        "application/json"
      );
    }

    // IMPORTANT:
    // Do not manually set Content-Type for FormData.
    // Browser will automatically set:
    // multipart/form-data; boundary=...

    if (accessToken) {
      headers.set(
        "Authorization",
        `Bearer ${accessToken}`
      );
    }

    return fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: "include",
    });
  };

  let response = await makeRequest(token);

  /*
   * Access token expired.
   * Try refresh token.
   */
  if (response.status === 401) {
    token = await refreshAccessToken();

    if (token) {
      response = await makeRequest(token);
    } else {
      clearAuth();

      if (
        typeof window !== "undefined" &&
        window.location.pathname !== "/login"
      ) {
        window.location.href = "/login";
      }

      throw new Error(
        "Session expired. Please login again."
      );
    }
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Something went wrong"
    );
  }

  return data as T;
};

export const logout = async () => {
  try {
    await apiRequest("/auth/logout", {
      method: "POST",
    });
  } finally {
    clearAuth();

    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }
};

export const isAuthenticated = (): boolean => {
  return Boolean(getAccessToken());
};