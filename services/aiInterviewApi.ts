import {
    apiRequest,
  } from "@/lib/app";
  
  import type {
    InterviewQuestion,
  } from "@/services/interviewApi";
  
  export type AIDifficulty =
    | "Easy"
    | "Medium"
    | "Hard";
  
  export interface GenerateQuestionsPayload {
    technology: string;
  
    topic?: string;
  
    difficulty: AIDifficulty;
  
    experience: string;
  
    questionCount: number;
  }
  
  export interface GenerateQuestionsResponse {
    success: boolean;
  
    message?: string;
  
    count: number;
  
    questions: InterviewQuestion[];
  }
  
  export const generateAIQuestions =
    async (
      data: GenerateQuestionsPayload
    ): Promise<GenerateQuestionsResponse> => {
      return apiRequest<GenerateQuestionsResponse>(
        "/ai-interview/generate",
        {
          method: "POST",
  
          body: JSON.stringify(data),
        }
      );
    };