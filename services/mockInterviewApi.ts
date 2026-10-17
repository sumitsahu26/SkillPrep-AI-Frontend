import { apiRequest } from "@/lib/app";

export type MockInterviewDifficulty =
  | "Easy"
  | "Medium"
  | "Hard";

export type MockInterviewStatus =
  | "in_progress"
  | "completed"
  | "abandoned";

export type MockQuestionSource =
  | "database"
  | "ai";

export interface MockInterviewQuestion {
  _id: string;

  questionId?: string;

  question: string;

  expectedAnswer?: string;

  userAnswer: string;

  category: string;

  topic: string;

  difficulty: MockInterviewDifficulty;

  source: MockQuestionSource;

  score?: number;

  feedback?: string;

  strengths?: string[];

  improvements?: string[];

  betterAnswer?: string;

  answeredAt?: string;
}

export interface MockInterview {
  _id: string;

  userId: string;

  title: string;

  technology: string;

  topic: string;

  difficulty: MockInterviewDifficulty;

  experience: string;

  questionCount: number;

  questions: MockInterviewQuestion[];

  currentQuestionIndex: number;

  status: MockInterviewStatus;

  totalScore: number;

  percentage: number;

  overallFeedback?: string;

  strengths: string[];

  improvements: string[];

  startedAt: string;

  completedAt?: string;

  createdAt: string;

  updatedAt: string;
}

/* =========================================================
   START
========================================================= */

export interface StartMockInterviewPayload {
  technology: string;

  topic?: string;

  difficulty: MockInterviewDifficulty;

  experience: string;

  questionCount: number;
}

export interface StartMockInterviewResponse {
  success: boolean;

  message: string;

  requestedQuestionCount?: number;

  actualQuestionCount?: number;

  usedFallback?: boolean;

  interview: MockInterview;
}

export const startMockInterview = async (
  data: StartMockInterviewPayload
): Promise<StartMockInterviewResponse> => {
  return apiRequest<StartMockInterviewResponse>(
    "/mock-interviews",
    {
      method: "POST",

      body: JSON.stringify(data),
    }
  );
};

/* =========================================================
   GET HISTORY
========================================================= */

export interface MockInterviewListResponse {
  success: boolean;

  count: number;

  interviews: MockInterview[];
}

export const getMockInterviews =
  async (): Promise<MockInterviewListResponse> => {
    return apiRequest<MockInterviewListResponse>(
      "/mock-interviews"
    );
  };

/* =========================================================
   GET SINGLE
========================================================= */

export interface MockInterviewResponse {
  success: boolean;

  message?: string;

  interview: MockInterview;
}

export const getMockInterview = async (
  id: string
): Promise<MockInterviewResponse> => {
  return apiRequest<MockInterviewResponse>(
    `/mock-interviews/${id}`
  );
};

/* =========================================================
   SUBMIT ANSWER
========================================================= */

export const submitMockAnswer = async (
    interviewId: string,
    questionId: string,
    answer: string
  ): Promise<SubmitMockAnswerResponse> => {
    return apiRequest<SubmitMockAnswerResponse>(
      `/mock-interviews/${interviewId}/answer`,
      {
        method: "POST",
  
        body: JSON.stringify({
          questionId,
          answer,
        }),
      }
    );
  };

// Evaluation with ai

export interface MockAnswerEvaluation {
    score: number;
  
    feedback: string;
  
    strengths: string[];
  
    improvements: string[];
  
    betterAnswer: string;
  }
  
  export interface SubmitMockAnswerResponse {
    success: boolean;
  
    message: string;
  
    evaluationSuccessful: boolean;
  
    evaluation:
      MockAnswerEvaluation;
  
    interview:
      MockInterview;
  }

/* =========================================================
   COMPLETE
========================================================= */

export const completeMockInterview = async (
  interviewId: string
): Promise<MockInterviewResponse> => {
  return apiRequest<MockInterviewResponse>(
    `/mock-interviews/${interviewId}/complete`,
    {
      method: "POST",
    }
  );
};

/* =========================================================
   ABANDON
========================================================= */

export const abandonMockInterview = async (
  interviewId: string
): Promise<MockInterviewResponse> => {
  return apiRequest<MockInterviewResponse>(
    `/mock-interviews/${interviewId}/abandon`,
    {
      method: "POST",
    }
  );
};

/* =========================================================
   DELETE
========================================================= */

export const deleteMockInterview = async (
  interviewId: string
): Promise<{
  success: boolean;
  message: string;
}> => {
  return apiRequest(
    `/mock-interviews/${interviewId}`,
    {
      method: "DELETE",
    }
  );
};