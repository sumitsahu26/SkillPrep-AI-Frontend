import { apiRequest } from "@/lib/app";

export interface BackendResume {
  _id?: string;
  title: string;

  personalInfo: {
    fullName?: string;
    email?: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    github?: string;
    portfolio?: string;
  };

  summary?: string;

  skills: string[];

  experience: {
    company: string;
    position: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    currentlyWorking?: boolean;
    description?: string;
  }[];

  education: {
    institution: string;
    degree: string;
    fieldOfStudy?: string;
    startDate?: string;
    endDate?: string;
    grade?: string;
    description?: string;
  }[];

  projects: {
    title: string;
    description?: string;
    technologies: string[];
    projectUrl?: string;
    githubUrl?: string;
  }[];

  languages: string[];

  template?: string;

  createdAt?: string;
  updatedAt?: string;
}

export interface ResumeResponse {
  success: boolean;
  message?: string;
  resume: BackendResume;
}

export interface ResumeListResponse {
  success: boolean;
  count: number;
  resumes: BackendResume[];
}

export const createResume = async (
  resume: Omit<BackendResume, "_id">
): Promise<ResumeResponse> => {
  return apiRequest<ResumeResponse>("/resumes", {
    method: "POST",
    body: JSON.stringify(resume),
  });
};

export const getResumes = async (): Promise<ResumeListResponse> => {
  return apiRequest<ResumeListResponse>("/resumes");
};

export const getResume = async (
  id: string
): Promise<ResumeResponse> => {
  return apiRequest<ResumeResponse>(`/resumes/${id}`);
};

export const updateResume = async (
  id: string,
  resume: Partial<BackendResume>
): Promise<ResumeResponse> => {
  return apiRequest<ResumeResponse>(`/resumes/${id}`, {
    method: "PUT",
    body: JSON.stringify(resume),
  });
};

export const deleteResume = async (
  id: string
): Promise<{ success: boolean; message: string }> => {
  return apiRequest(`/resumes/${id}`, {
    method: "DELETE",
  });
};