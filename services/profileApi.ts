import {
    apiRequest,
  } from "@/lib/app";
import { ResumeResponse } from "./resumeApi";
  
  export interface Profile {
    _id?: string;
  
    userId?: {
      _id: string;
      name: string;
      email: string;
      profileImage: string;
    };
    name?:string;
  
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

  export interface User {
    name : string;
    email: string;
  }

  interface UserResponse {
    success: boolean;
    message: string;
    user: User;
  }

  export interface UpdateUserInput {
    email?: string;
    name?: string;
    currentPassword?: string;
    newPassword?: string;
    isDeleted?:boolean;
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

    export const updateUser = async (
        data: UpdateUserInput
      ): Promise<UserResponse> => {
        return apiRequest<UserResponse>("/profile/user", {
          method: "PUT",
          body: JSON.stringify(data),
        });
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

      export interface UpdateProfileImageResponse {
        success: boolean;
        message: string;
        profileImage: string;
      }
      
      export const updateProfileImage = async (
        formData: FormData
      ): Promise<UpdateProfileImageResponse> => {
        return apiRequest<UpdateProfileImageResponse>(
          `/profile/image`,
          {
            method: "PUT",
            body: formData,
          }
        );
      };

      export const uploadResume = async (
        formData: FormData
      ): Promise<ProfileResponse> => {
        return apiRequest<ProfileResponse>(
          "/profile/resume",
          {
            method: "POST",
            body: formData,
          }
        );
      };

      