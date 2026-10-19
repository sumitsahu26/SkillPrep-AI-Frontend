import {
    apiRequest,
  } from "@/lib/app";
  
  export interface Profile {
    _id?: string;
  
    userId?: {
      _id: string;
      name: string;
      email: string;
    };
  
    phone?: string;
    location?: string;
    headline?: string;
    bio?: string;
    currentRole?: string;
    experience?: number;
    skills?: string[];
    github?: string;
    linkedin?: string;
    portfolio?: string;
  }
  
  interface ProfileResponse {
    success: boolean;
    profile: Profile;
  }
  
  export interface UpdateProfileInput {
    phone?: string;
    location?: string;
    headline?: string;
    bio?: string;
    currentRole?: string;
    experience?: number;
    skills?: string[];
    github?: string;
    linkedin?: string;
    portfolio?: string;
  }

  export interface Skill {
    userId?:string,
    skill?:string
  }
  
  export const getProfile =
    async (): Promise<ProfileResponse> => {
      return apiRequest<ProfileResponse>(
        "/profile"
      );
    };
  
  export const updateProfile =
    async (
      data: UpdateProfileInput
    ): Promise<ProfileResponse> => {
      return apiRequest<ProfileResponse>(
        "/profile",
        {
          method: "PUT",
  
          body:
            JSON.stringify(
              data
            ),
        }
      );
    };

    export interface AddSkillResponse {
        success: boolean;
        profile: Profile;
      }
      
      export const addProfileSkill = async (
        skill: string
      ): Promise<AddSkillResponse> => {
        return apiRequest<AddSkillResponse>(
          "/profile/skills",
          {
            method: "POST",
            body: JSON.stringify({
              skill,
            }),
          }
        );
      };

      export interface RemoveSkillResponse {
        success: boolean;
        profile: Profile;
      }
      
      export const removeProfileSkill = async (
        skill: string
      ): Promise<RemoveSkillResponse> => {
        return apiRequest<RemoveSkillResponse>(
          `/profile/skills/${encodeURIComponent(skill)}`,
          {
            method: "DELETE",
          }
        );
      };