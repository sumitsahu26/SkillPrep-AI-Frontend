import {
    apiRequest,
  } from "@/lib/app";
  
  export interface DashboardStats {
    resumes: number;
  
    interviewCompleted: number;
  
    assessmentsCompleted: number;
  
    mockInterviewsCompleted: number;
  }
  
  export interface CareerReadiness {
    score: number;
  
    interview: number;
  
    assessment: number;
  
    mockInterview: number;
  
    roadmap: number;
  }
  
  export interface DashboardInterview {
    completed: number;
  
    total: number;
  
    bookmarked: number;
  
    percentage: number;
  }
  
  export interface DashboardRoadmap {
    _id: string;
  
    targetRole: string;
  
    progress: number;
  
    status: string;
  }
  
  export interface SkillPerformance {
    technology: string;
  
    topic: string;
  
    percentage: number;
  
    skillLevel: string;
  }
  
  export interface DashboardResume {
    _id: string;
  
    title: string;
  
    updatedAt: string;
  
    status: string;
  }
  
  export interface DashboardActivity {
    id: string;
  
    type:
      | "assessment"
      | "mock"
      | "resume";
  
    title: string;
  
    description: string;
  
    date: string;
  
    href: string;
  }
  
  export interface DashboardData {
    stats:
      DashboardStats;
  
    careerReadiness:
      CareerReadiness;
  
    interview:
      DashboardInterview;
  
    roadmap:
      DashboardRoadmap | null;
  
    skillPerformance:
      SkillPerformance[];
  
    recentResumes:
      DashboardResume[];
  
    recentActivity:
      DashboardActivity[];
  }
  
  interface DashboardResponse {
    success: boolean;
  
    dashboard:
      DashboardData;
  }
  
  export const getDashboard =
    async (): Promise<DashboardResponse> => {
      return apiRequest<DashboardResponse>(
        "/dashboard"
      );
    };