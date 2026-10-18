import {
    apiRequest,
  } from "@/lib/app";
  
  export interface CareerMetrics {
    resume: number;
  
    interviewPreparation: number;
  
    mockInterview: number;
  
    skillAssessment: number;
  
    roadmap: number;
  }
  
  export type CareerPriority =
    | "high"
    | "medium"
    | "low";
  
  export type CareerModule =
    | "resume-builder"
    | "interview-preparation"
    | "mock-interview"
    | "roadmap"
    | "skill-assessment"
    | "ai-mentor";
  
  export interface CareerRecommendation {
    title: string;
  
    description: string;
  
    priority:
      CareerPriority;
  
    module:
      CareerModule;
  }
  
  export interface CurrentCareerData {
    targetRole: string;
  
    readinessScore: number;
  
    metrics:
      CareerMetrics;
  
    strongSkills: string[];
  
    weakSkills: string[];
  
    recentAssessmentSummary:
      string;
  
    recentMockSummary:
      string;
  }
  
  export interface CareerAnalysis {
    _id: string;
  
    userId: string;
  
    targetRole: string;
  
    readinessScore: number;
  
    metrics:
      CareerMetrics;
  
    strongSkills: string[];
  
    weakSkills: string[];
  
    aiAnalysis: string;
  
    recommendations:
      CareerRecommendation[];
  
    generatedAt: string;
  
    createdAt: string;
  
    updatedAt: string;
  }
  
  interface CurrentResponse {
    success: boolean;
  
    data:
      CurrentCareerData;
  }
  
  interface AnalysisResponse {
    success: boolean;
  
    message?: string;
  
    analysis:
      CareerAnalysis;
  }
  
  interface HistoryResponse {
    success: boolean;
  
    count: number;
  
    history:
      CareerAnalysis[];
  }
  
  /* =========================================================
     CURRENT
  ========================================================= */
  
  export const getCurrentCareerMonitor =
    async (): Promise<CurrentResponse> => {
      return apiRequest<CurrentResponse>(
        "/career-monitor"
      );
    };
  
  /* =========================================================
     ANALYZE
  ========================================================= */
  
  export const generateCareerAnalysis =
    async (): Promise<AnalysisResponse> => {
      return apiRequest<AnalysisResponse>(
        "/career-monitor/analyze",
        {
          method:
            "POST",
        }
      );
    };
  
  /* =========================================================
     HISTORY
  ========================================================= */
  
  export const getCareerMonitorHistory =
    async (): Promise<HistoryResponse> => {
      return apiRequest<HistoryResponse>(
        "/career-monitor/history"
      );
    };
  
  /* =========================================================
     GET SNAPSHOT
  ========================================================= */
  
  export const getCareerAnalysis =
    async (
      id: string
    ): Promise<AnalysisResponse> => {
      return apiRequest<AnalysisResponse>(
        `/career-monitor/history/${id}`
      );
    };
  
  /* =========================================================
     DELETE
  ========================================================= */
  
  export const deleteCareerAnalysis =
    async (
      id: string
    ): Promise<{
      success: boolean;
      message: string;
    }> => {
      return apiRequest(
        `/career-monitor/history/${id}`,
        {
          method:
            "DELETE",
        }
      );
    };