import { apiRequest } from "@/lib/app";

/* =========================================================
   NOTIFICATION TYPES
========================================================= */

export type NotificationType =
  | "interview"
  | "mock_interview"
  | "resume"
  | "ai_mentor"
  | "roadmap"
  | "skill_assessment"
  | "system";

/* =========================================================
   NOTIFICATION
========================================================= */

export interface Notification {
  _id: string;
  userId: string;
  title: string;
  description: string;
  type: NotificationType;
  isRead: boolean;
  link?: string;
  createdAt: string;
  updatedAt: string;
}

/* =========================================================
   NOTIFICATION PREFERENCES
========================================================= */

export interface NotificationPreferences {
  interviewReminders: boolean;
  mockInterviewResults: boolean;
  resumeUpdates: boolean;
  aiMentor: boolean;
  roadmapUpdates: boolean;
  skillAssessmentResults: boolean;
  emailNotifications: boolean;
}

/* =========================================================
   RESPONSE TYPES
========================================================= */

export interface NotificationsResponse {
  success: boolean;
  notifications: Notification[];
}

export interface UnreadCountResponse {
  success: boolean;
  count: number;
}

export interface NotificationResponse {
  success: boolean;
  message: string;
  notification?: Notification;
}

export interface NotificationPreferencesResponse {
  success: boolean;
  message?: string;
  preferences: NotificationPreferences;
}

/* =========================================================
   GET NOTIFICATIONS
========================================================= */

export const getNotifications = async (
  limit = 20
): Promise<NotificationsResponse> => {
  return apiRequest<NotificationsResponse>(
    `/notifications?limit=${limit}`,
    {
      method: "GET",
    }
  );
};

/* =========================================================
   GET UNREAD COUNT
========================================================= */

export const getUnreadNotificationCount =
  async (): Promise<UnreadCountResponse> => {
    return apiRequest<UnreadCountResponse>(
      "/notifications/unread-count",
      {
        method: "GET",
      }
    );
  };

/* =========================================================
   MARK SINGLE NOTIFICATION AS READ
========================================================= */

export const markNotificationAsRead = async (
  id: string
): Promise<NotificationResponse> => {
  return apiRequest<NotificationResponse>(
    `/notifications/${id}/read`,
    {
      method: "PATCH",
    }
  );
};

/* =========================================================
   MARK ALL AS READ
========================================================= */

export const markAllNotificationsAsRead =
  async () => {
    return apiRequest<{
      success: boolean;
      message: string;
      updatedCount: number;
    }>("/notifications/read-all", {
      method: "PATCH",
    });
  };

/* =========================================================
   DELETE SINGLE NOTIFICATION
========================================================= */

export const deleteNotification = async (
  id: string
) => {
  return apiRequest<{
    success: boolean;
    message: string;
  }>(`/notifications/${id}`, {
    method: "DELETE",
  });
};

/* =========================================================
   DELETE ALL NOTIFICATIONS
========================================================= */

export const deleteAllNotifications =
  async () => {
    return apiRequest<{
      success: boolean;
      message: string;
      deletedCount: number;
    }>("/notifications", {
      method: "DELETE",
    });
  };

/* =========================================================
   GET NOTIFICATION PREFERENCES
========================================================= */

export const getNotificationPreferences =
  async (): Promise<NotificationPreferencesResponse> => {
    return apiRequest<NotificationPreferencesResponse>(
      "/notifications/preferences",
      {
        method: "GET",
      }
    );
  };

/* =========================================================
   UPDATE NOTIFICATION PREFERENCES
========================================================= */

export const updateNotificationPreferences =
  async (
    data: Partial<NotificationPreferences>
  ): Promise<NotificationPreferencesResponse> => {
    return apiRequest<NotificationPreferencesResponse>(
      "/notifications/preferences",
      {
        method: "PUT",
        body: JSON.stringify(data),
      }
    );
  };