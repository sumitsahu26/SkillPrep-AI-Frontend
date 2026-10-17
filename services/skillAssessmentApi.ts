import {
    apiRequest,
  } from "@/lib/app";
  
  export type AssessmentDifficulty =
    | "Easy"
    | "Medium"
    | "Hard";
  
  export type AssessmentStatus =
    | "in_progress"
    | "completed";
  
  export type SkillLevel =
    | "Beginner"
    | "Intermediate"
    | "Advanced"
    | "Expert";
  
  export interface AssessmentQuestion {
    _id: string;
  
    question: string;
  
    options: string[];
  
    topic: string;
  
    difficulty:
      AssessmentDifficulty;
  
    selectedAnswer?: string;
  
    correctAnswer?: string;
  
    explanation?: string;
  
    isCorrect?: boolean;
  }
  
  export interface TopicPerformance {
    topic: string;
  
    total: number;
  
    correct: number;
  
    percentage: number;
  }
  
  export interface SkillAssessment {
    _id: string;
  
    userId: string;
  
    technology: string;
  
    topic: string;
  
    difficulty:
      AssessmentDifficulty;
  
    questionCount: number;
  
    questions:
      AssessmentQuestion[];
  
    status:
      AssessmentStatus;
  
    score: number;
  
    percentage: number;
  
    skillLevel:
      SkillLevel;
  
    topicPerformance:
      TopicPerformance[];
  
    strongAreas: string[];
  
    improvementAreas:
      string[];
  
    startedAt: string;
  
    completedAt?: string;
  
    createdAt: string;
  
    updatedAt: string;
  }
  
  export interface StartAssessmentPayload {
    technology: string;
  
    topic?: string;
  
    difficulty:
      AssessmentDifficulty;
  
    questionCount: number;
  }
  
  export interface AssessmentAnswer {
    questionId: string;
  
    selectedAnswer: string;
  }
  
  interface AssessmentResponse {
    success: boolean;
  
    message?: string;
  
    requestedQuestionCount?: number;
  
    actualQuestionCount?: number;
  
    databaseQuestionCount?: number;
  
    generatedCount?: number;
  
    usedFallback?: boolean;
  
    assessment:
      SkillAssessment;
  }
  
  interface AssessmentsResponse {
    success: boolean;
  
    count: number;
  
    assessments:
      SkillAssessment[];
  }

  export interface AssessmentBankCategoriesResponse {
    success: boolean;
  
    categories: string[];
  }
  
  export interface AssessmentBankTopicsResponse {
    success: boolean;
  
    topics: string[];
  }
  
  export const getAssessmentBankCategories =
    async (): Promise<AssessmentBankCategoriesResponse> => {
      return apiRequest<AssessmentBankCategoriesResponse>(
        "/assessment-bank/categories"
      );
    };
  
  export const getAssessmentBankTopics =
    async (
      category: string
    ): Promise<AssessmentBankTopicsResponse> => {
      return apiRequest<AssessmentBankTopicsResponse>(
        `/assessment-bank/topics/${encodeURIComponent(
          category
        )}`
      );
    };
  
  /* =========================================================
     START
  ========================================================= */
  
  export const startSkillAssessment =
    async (
      data:
        StartAssessmentPayload
    ): Promise<AssessmentResponse> => {
      return apiRequest<AssessmentResponse>(
        "/skill-assessments/start",
        {
          method: "POST",
  
          body:
            JSON.stringify(
              data
            ),
        }
      );
    };
  
  /* =========================================================
     SUBMIT
  ========================================================= */
  
  export const submitSkillAssessment =
    async (
      assessmentId: string,
  
      answers:
        AssessmentAnswer[]
    ): Promise<AssessmentResponse> => {
      return apiRequest<AssessmentResponse>(
        `/skill-assessments/${assessmentId}/submit`,
        {
          method: "POST",
  
          body:
            JSON.stringify({
              answers,
            }),
        }
      );
    };
  
  /* =========================================================
     GET ALL
  ========================================================= */
  
  export const getSkillAssessments =
    async (): Promise<AssessmentsResponse> => {
      return apiRequest<AssessmentsResponse>(
        "/skill-assessments"
      );
    };
  
  /* =========================================================
     GET ONE
  ========================================================= */
  
  export const getSkillAssessment =
    async (
      id: string
    ): Promise<AssessmentResponse> => {
      return apiRequest<AssessmentResponse>(
        `/skill-assessments/${id}`
      );
    };
  
  /* =========================================================
     DELETE
  ========================================================= */
  
  export const deleteSkillAssessment =
    async (
      id: string
    ): Promise<{
      success: boolean;
      message: string;
    }> => {
      return apiRequest(
        `/skill-assessments/${id}`,
        {
          method:
            "DELETE",
        }
      );
    };