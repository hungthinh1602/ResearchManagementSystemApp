import { apiSlice } from "../../features/api/apiSlice";
import { API_ENDPOINTS } from "../../config/api";

interface Notification {
  notificationId: number;
  createdAt: string;
  projectId: number | null;
  title: string;
  message: string;
  status: number;
  isRead: boolean;
  invitationId: number;
  userId: number;
}

interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

export const notificationApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<Notification[], number>({
      query: (userId: number) => ({
        url: API_ENDPOINTS.NOTIFICATIONS.GET_USER_NOTIFICATIONS(userId),
        method: 'GET',
      }),
      transformResponse: (response: ApiResponse<Notification[]>) => {
        if (!response.data) return [];
        return response.data;
      },
      providesTags: ['Notifications'],
    }),

    markAsRead: builder.mutation<void, number>({
      query: (notificationId: number) => ({
        url: API_ENDPOINTS.NOTIFICATIONS.MARK_AS_READ(notificationId),
        method: 'PUT',
      }),
      invalidatesTags: ['Notifications'],
    }),

    deleteNotification: builder.mutation<void, number>({
      query: (notificationId: number) => ({
        url: API_ENDPOINTS.NOTIFICATIONS.DELETE(notificationId),
        method: 'DELETE',
      }),
      invalidatesTags: ['Notifications'],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useMarkAsReadMutation,
  useDeleteNotificationMutation,
} = notificationApiSlice; 