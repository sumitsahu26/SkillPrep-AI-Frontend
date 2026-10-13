import { apiRequest } from "@/lib/app";

export type Difficulty = "Easy" | "Medium" | "Hard";

export interface InterviewQuestion {
  _id: string;
  category: string;
  topic: string;
  question: string;
  answer: string;
  difficulty: Difficulty;
  tags: string[];
  isActive: boolean;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface QuestionListResponse {
  success: boolean;
  count: number;
  questions: InterviewQuestion[];
}

export interface QuestionResponse {
  success: boolean;
  message?: string;
  question: InterviewQuestion;
}

export interface CategoryResponse {
  success: boolean;
  categories: string[];
}

export interface TopicResponse {
  success: boolean;
  category: string;
  topics: string[];
}

export interface QuestionFilters {
  category?: string;
  topic?: string;
  difficulty?: Difficulty;
}

//    GET ALL QUESTIONS

export const getInterviewQuestions = async (
  filters?: QuestionFilters
): Promise<QuestionListResponse> => {
  const params = new URLSearchParams();

  if (filters?.category) {
    params.append("category", filters.category);
  }

  if (filters?.topic) {
    params.append("topic", filters.topic);
  }

  if (filters?.difficulty) {
    params.append("difficulty", filters.difficulty);
  }

  const query = params.toString();

  return apiRequest<QuestionListResponse>(
    `/interview/questions${query ? `?${query}` : ""}`
  );
};

//    GET SINGLE QUESTION

export const getInterviewQuestion = async (
  id: string
): Promise<QuestionResponse> => {
  return apiRequest<QuestionResponse>(
    `/interview/questions/${id}`
  );
};

//    GET CATEGORIES

export const getInterviewCategories =
  async (): Promise<CategoryResponse> => {
    return apiRequest<CategoryResponse>(
      "/interview/categories"
    );
  };

//    GET TOPICS

export const getInterviewTopics = async (
  category: string
): Promise<TopicResponse> => {
  return apiRequest<TopicResponse>(
    `/interview/topics/${encodeURIComponent(category)}`
  );
};

//    CREATE QUESTION

export const createInterviewQuestion = async (
  data: Omit<
    InterviewQuestion,
    "_id" | "createdAt" | "updatedAt" | "createdBy"
  >
): Promise<QuestionResponse> => {
  return apiRequest<QuestionResponse>(
    "/interview/questions",
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
};

//  UPDATE QUESTION

export const updateInterviewQuestion = async (
  id: string,
  data: Partial<InterviewQuestion>
): Promise<QuestionResponse> => {
  return apiRequest<QuestionResponse>(
    `/interview/questions/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(data),
    }
  );
};

//    DELETE QUESTION

export const deleteInterviewQuestion = async (
  id: string
): Promise<{
  success: boolean;
  message: string;
}> => {
  return apiRequest(
    `/interview/questions/${id}`,
    {
      method: "DELETE",
    }
  );
};