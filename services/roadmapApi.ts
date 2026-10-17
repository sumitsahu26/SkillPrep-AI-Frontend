import {
    apiRequest,
  } from "@/lib/app";
  
  export type RoadmapStatus =
    | "not_started"
    | "in_progress"
    | "completed";
  
  export type RoadmapResourceType =
    | "documentation"
    | "practice"
    | "project"
    | "video"
    | "other";
  
  export interface RoadmapResource {
    title: string;
  
    type:
      RoadmapResourceType;
  
    url?: string;
  }
  
  export interface RoadmapTopic {
    _id: string;
  
    title: string;
  
    description: string;
  
    completed: boolean;
  
    completedAt?: string;
  }
  
  export interface RoadmapStep {
    _id: string;
  
    week: number;
  
    title: string;
  
    description: string;
  
    topics: RoadmapTopic[];
  
    resources: RoadmapResource[];
  
    completed: boolean;
  
    completedAt?: string;
  }
  
  export interface Roadmap {
    _id: string;
  
    userId: string;
  
    title: string;
  
    targetRole: string;
  
    experience: string;
  
    durationWeeks: number;
  
    currentSkills: string[];
  
    targetSkills: string[];
  
    steps: RoadmapStep[];
  
    status: RoadmapStatus;
  
    progress: number;
  
    source:
      | "ai"
      | "manual";
  
    createdAt: string;
  
    updatedAt: string;
  }
  
  export interface GenerateRoadmapPayload {
    targetRole: string;
  
    experience: string;
  
    durationWeeks: number;
  
    currentSkills: string[];
  
    targetSkills?: string[];
  }
  
  interface RoadmapResponse {
    success: boolean;
  
    message?: string;
  
    roadmap: Roadmap;
  }
  
  interface RoadmapsResponse {
    success: boolean;
  
    count: number;
  
    roadmaps: Roadmap[];
  }
  
  /* =========================================================
     GENERATE
  ========================================================= */
  
  export const generateRoadmap =
    async (
      data: GenerateRoadmapPayload
    ): Promise<RoadmapResponse> => {
      return apiRequest<RoadmapResponse>(
        "/roadmaps/generate",
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
     GET ALL
  ========================================================= */
  
  export const getRoadmaps =
    async (): Promise<RoadmapsResponse> => {
      return apiRequest<RoadmapsResponse>(
        "/roadmaps"
      );
    };
  
  /* =========================================================
     GET ONE
  ========================================================= */
  
  export const getRoadmap =
    async (
      id: string
    ): Promise<RoadmapResponse> => {
      return apiRequest<RoadmapResponse>(
        `/roadmaps/${id}`
      );
    };
  
  /* =========================================================
     TOGGLE TOPIC
  ========================================================= */
  
  export const toggleRoadmapTopic =
    async (
      roadmapId: string,
      topicId: string
    ): Promise<RoadmapResponse> => {
      return apiRequest<RoadmapResponse>(
        `/roadmaps/${roadmapId}/topics/${topicId}`,
        {
          method: "PATCH",
        }
      );
    };
  
  /* =========================================================
     DELETE
  ========================================================= */
  
  export const deleteRoadmap =
    async (
      id: string
    ): Promise<{
      success: boolean;
      message: string;
    }> => {
      return apiRequest(
        `/roadmaps/${id}`,
        {
          method: "DELETE",
        }
      );
    };