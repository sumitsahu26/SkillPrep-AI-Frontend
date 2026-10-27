import {
    apiRequest,
    ApiResponse,
  } from "@/lib/app";
  
  export const forgotPassword = async (
    email: string
  ): Promise<ApiResponse> => {
    return apiRequest<ApiResponse>(
      "/auth/forgot-password",
      {
        method: "POST",
        body: JSON.stringify({
          email,
        }),
      }
    );
  };
  
  export const resetPassword = async (
    token: string,
    password: string
  ): Promise<ApiResponse> => {
    return apiRequest<ApiResponse>(
      "/auth/reset-password",
      {
        method: "POST",
        body: JSON.stringify({
          token,
          password,
        }),
      }
    );
  };