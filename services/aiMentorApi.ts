import {
    apiRequest,
  } from "@/lib/app";
  
  export type MentorRole =
    | "user"
    | "assistant";
  
  export interface MentorMessage {
    _id?: string;
  
    role: MentorRole;
  
    content: string;
  
    createdAt?: string;
  }
  
  interface ChatResponse {
    success: boolean;
  
    message: string;
  
    chatId?: string;
  }
  
  interface HistoryResponse {
    success: boolean;
  
    messages:
      MentorMessage[];
  }
  
  /* =========================================================
     SEND
  ========================================================= */
  
  export const sendMentorMessage =
    async (
      message: string
    ): Promise<ChatResponse> => {
      return apiRequest<ChatResponse>(
        "/ai-mentor/chat",
        {
          method: "POST",
  
          body:
            JSON.stringify({
              message,
            }),
        }
      );
    };
  
  /* =========================================================
     HISTORY
  ========================================================= */
  
  export const getMentorHistory =
    async (): Promise<HistoryResponse> => {
      return apiRequest<HistoryResponse>(
        "/ai-mentor/history"
      );
    };
  
  /* =========================================================
     CLEAR
  ========================================================= */
  
  export const clearMentorHistory =
    async (): Promise<{
      success: boolean;
      message: string;
    }> => {
      return apiRequest<{
        success: boolean;
        message: string;
      }>(
        "/ai-mentor/history",
        {
          method:
            "DELETE",
        }
      );
    };