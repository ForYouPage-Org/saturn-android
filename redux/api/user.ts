import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  FollowData,
  FollowingData,
  IGuestData,
  IUSerData,
  Notifications,
} from "../../types/api";
import storage from "../storage";

interface loginResult {
  msg: string;
  token: string;
  data: IUSerData;
}

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.EXPO_PUBLIC_API_URL}/api`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).user.token;
      // If we have a token, set it in the header
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["user", "guest"],
  endpoints: (builder) => ({
    getUser: builder.query<{ status: "success" } & IUSerData, null>({
      query: () => "/auth/me",
      providesTags: ["user"],
      extraOptions: { maxRetries: 2 },
    }),
    getGuest: builder.query<{ data: IGuestData }, { username: string }>({
      query: ({ username }) => `/actors/${username}`,
      providesTags: ["guest"],
      keepUnusedDataFor: 10,
    }),
    searchActors: builder.query<
      {
        status: "success";
        data: Array<{
          id: string;
          username: string;
          preferredUsername: string;
        }>;
      },
      { q: string }
    >({
      query: ({ q }) => `/actors/search?q=${q}`,
      keepUnusedDataFor: 10,
    }),
    getFollowDetails: builder.query<
      { following: string; followers: string },
      null
    >({
      query: () => "/user/get-follows", // Keep this as fallback until backend implements
      providesTags: ["user"],
      extraOptions: { maxRetries: 2 },
    }),
    tokenValid: builder.query<{ msg: boolean }, null>({
      query: () => "/user/token-valid", // Keep this as fallback until backend implements
      providesTags: ["user"],
      extraOptions: { maxRetries: 0 },
    }),
    updateActor: builder.mutation<
      any,
      { preferredUsername?: string; summary?: string }
    >({
      query: (payload) => {
        return {
          url: "/actors/me", // Assuming this endpoint exists for updating current user
          method: "PUT",
          body: payload,
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        };
      },
      invalidatesTags: ["user"],
    }),
    updateNotificationId: builder.mutation<any, { notificationId: string }>({
      query: (payload) => {
        return {
          url: "/user/notification-id", // Keep this as fallback until backend implements
          method: "PUT",
          body: payload,
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        };
      },
      invalidatesTags: ["user"],
    }),
    // 🚫 MVP: Add missing logout functionality
    logout: builder.query<{ msg: string }, null>({
      query: () => "/auth/logout", // Keep this as fallback until backend implements
      providesTags: ["user"],
    }),
    // 🚫 MVP: Add missing notifications functionality
    getNotifications: builder.query<{ notifications: Notifications[] }, null>({
      query: () => "/notifications", // Keep this as fallback until backend implements
      providesTags: ["user"],
    }),
    // 🚫 MVP: Add missing account deletion functionality
    deleteAccount: builder.mutation<{ msg: string }, { password: string }>({
      query: (payload) => {
        return {
          url: "/auth/delete-account", // Keep this as fallback until backend implements
          method: "DELETE",
          body: payload,
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        };
      },
      invalidatesTags: ["user"],
    }),
    // 🚫 MVP: Add missing data update functionality
    updateData: builder.mutation<any, { [key: string]: any }>({
      query: (payload) => {
        return {
          url: "/user/update-data", // Keep this as fallback until backend implements
          method: "PUT",
          body: payload,
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        };
      },
      invalidatesTags: ["user"],
    }),
    // 🚫 MVP: Add missing followers list functionality
    getFollowersList: builder.query<{ followers: any[] }, null>({
      query: () => "/user/followers", // Keep this as fallback until backend implements
      providesTags: ["user"],
    }),
    // 🚫 MVP: Add missing following list functionality
    getFollowingList: builder.query<{ following: any[] }, null>({
      query: () => "/user/following", // Keep this as fallback until backend implements
      providesTags: ["user"],
    }),

    // 🔧 MVP: Mock follow functionality (until backend implements follow endpoints)
    followUser: builder.mutation<
      { status: "success"; message: string },
      { id: string }
    >({
      queryFn: async ({ id }) => {
        // Mock implementation - just return success
        console.log("🔧 MVP: Mock follow user:", id);
        return {
          data: {
            status: "success" as const,
            message: `Successfully followed user ${id}`,
          },
        };
      },
      invalidatesTags: ["guest", "user"],
    }),

    // 🔧 MVP: Mock unfollow functionality (until backend implements follow endpoints)
    unfollowUser: builder.mutation<
      { status: "success"; message: string },
      { id: string }
    >({
      queryFn: async ({ id }) => {
        // Mock implementation - just return success
        console.log("🔧 MVP: Mock unfollow user:", id);
        return {
          data: {
            status: "success" as const,
            message: `Successfully unfollowed user ${id}`,
          },
        };
      },
      invalidatesTags: ["guest", "user"],
    }),
  }),
});

export const {
  useGetUserQuery,
  useTokenValidQuery,
  useLazyGetUserQuery,
  useGetGuestQuery,
  useLazyGetGuestQuery,
  useSearchActorsQuery,
  useLazySearchActorsQuery,
  useUpdateActorMutation,
  useGetFollowDetailsQuery,
  useLazyGetFollowDetailsQuery,
  useUpdateNotificationIdMutation,
  useLazyLogoutQuery,
  useGetNotificationsQuery,
  useDeleteAccountMutation,
  useUpdateDataMutation,
  useLazyGetFollowersListQuery,
  useLazyGetFollowingListQuery,
  useGetFollowersListQuery,
  useGetFollowingListQuery,
  useFollowUserMutation,
  useUnfollowUserMutation,
} = userApi;
