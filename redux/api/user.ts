import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  FollowData,
  FollowingData,
  IGuestData,
  IUSerData,
  Notifications,
} from "../../types/api";
import storage from "../storage";
import { followUser as followUserAction, unfollowUser as unfollowUserAction } from "../slice/user/followers"; // Add this import

interface loginResult {
  msg: string;
  token: string;
  data: IUSerData;
}

//RAGHAVI ADDED: Data structures to define follow type and response for get follow and following
export interface Follow {
  id: string;
  username: string;
  preferredUsername: string;
  displayName?: string;
  iconUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FollowResponse {
  status: "success";
  followData: Follow[];
  hasMore: boolean;
}

//follow and unfollow
export interface FollowActionResult {
  status: "success";
  message: string;
  isFollowing: boolean;
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
    // // 🚫 MVP: Add missing followers list functionality
    // getFollowersList: builder.query<{ followers: any[] }, { username: string }>({
    //   query: ({ username }) => `/actors/${username}/followers`, // Updated to match backend endpoint
    //   providesTags: ["user"],
    // }),
    // // 🚫 MVP: Add missing following list functionality
    // getFollowingList: builder.query<{ following: any[] }, { username: string }>({
    //   query: ({ username }) => `/user/${username}/following`, // Keep this as fallback until backend implements
    //   providesTags: ["user"],
    // }),

    //RAGHAVI ADDED: updating API calls for getFollowing & getFollowers
    //get followers list 
    getFollowersList: builder.query<FollowResponse, { username: string, page?: number; limit?: number }>({
      query: ({ username, page = 1, limit = 20 }) => {
        console.log("🌐 [DEBUG] getFollowersList query called with:", { page, limit });
        console.log(
          "🌐 [DEBUG] API URL:",
          `${process.env.EXPO_PUBLIC_API_URL}/api`
        );
        return {
          url: `/actors/${username}/followers`,
          method: "GET",
          params: { page, limit },
        };
      },
      providesTags: ["user"],
    }),

    getFollowingList: builder.query<FollowResponse, { username: string, page?: number; limit?: number }>({
      query: ({ username, page = 1, limit = 20 }) => {
        console.log("🌐 [DEBUG] getFollowingList query called with:", { page, limit });
        console.log(
          "🌐 [DEBUG] API URL:",
          `${process.env.EXPO_PUBLIC_API_URL}/api`
        );
        return {
          url: `/actors/${username}/following`,
          method: "GET",
          params: { page, limit },
        };
      },
      providesTags: ["user"],
    }),
    
    //RAGHAVI: CHANGE THIS!
    //Create a new interface for follow/unfollow response
    //Change API call to match POST's "post" call from posts.ts

      //STEP 2.2: API call to follow user and a dispatach to update state 
    // 🔧 MVP: Mock follow functionality (until backend implements follow endpoints)
    followUser: builder.mutation<FollowActionResult, {username: string}> ({
      query: ({ username }) => {
        console.log("🌐 [DEBUG] followUser query called with:", { username });
        console.log(
          "🌐 [DEBUG] API URL:",
          `${process.env.EXPO_PUBLIC_API_URL}/api`
        );
        return {
          url: `/actors/${username}/follow`,
          method: "POST",
        };
      },
      invalidatesTags: ["guest", "user"],
    }),

    //No longer needed 
    //async onQueryStarted({ id, username }, { dispatch, queryFulfilled }) {
    // // Update both states optimistically
    // const patchResult = dispatch(
    //   userApi.util.updateQueryData("getUser", null, (draft) => {
    //     draft.following.push(id);
    //   })
    // );
    // //dispatch(followUserAction(id)); // ← Also update followers.ts
    
    //     try {
    //       const result = await queryFulfilled;
    //       console.log("✅ [API] Follow user successful:", username, result.data);
          
    //       // Fetch updated followers list after successful follow
    //       try {
    //         console.log("📋 [API] Calling getFollowersList with username:", username);
    //         const followersListResult = await dispatch(userApi.endpoints.getFollowersList.initiate({ username }));
    //         console.log("📋 [API] getFollowersList full result:", followersListResult);
    //         console.log("📋 [API] getFollowersList data:", followersListResult.data);
    //         console.log("📋 [API] getFollowersList error:", followersListResult.error);
    //         console.log("📋 [API] getFollowersList isSuccess:", followersListResult.isSuccess);
    //         console.log("📋 [API] getFollowersList isError:", followersListResult.isError);
    //         console.log("📋 [API] Updated followers list after follow:", followersListResult.data);
    //       } catch (followersError) {
    //         console.error("❌ [API] Error fetching followers list:", followersError);
    //       }

    //     } catch (error) {
    //       console.error("❌ [API] Follow user failed:", username, error);
    //       patchResult.undo();
    //     }
    //   },
    //   invalidatesTags: ["guest", "user"],
    //followUser ends here

    // 🔧 MVP: Mock unfollow functionality (until backend implements follow endpoints)
    // unfollowUser: builder.mutation<
    //   { status: "success"; message: string },
    //   { id: string; username: string }
    // >({
    //   query: ({ username }) => {
    //     console.log("🔒 [API] Calling unfollowUser with username:", username);
    //     return {
    //       url: `/actors/${username}/follow`,
    //       method: "DELETE",
    //     };
    //   },
    //   async onQueryStarted({ id, username }, { dispatch, queryFulfilled }) {
    // // Update both states optimistically
    //   const patchResult = dispatch(
    //   userApi.util.updateQueryData("getUser", null, (draft) => {
    //     draft.following = draft.following.filter((userId) => userId !== id);
    //   })
    // );
    // //dispatch(unfollowUserAction(id)); // ← Also update followers.ts
    //     try {
    //       const result = await queryFulfilled;
    //       console.log("✅ [API] Unfollow user successful:", username, result.data);
    //     } catch (error) {
    //       console.error("❌ [API] Unfollow user failed:", username, error);
    //       patchResult.undo();
    //     }
    //   },
    //   invalidatesTags: ["guest", "user"],
    // }),
    unfollowUser: builder.mutation<FollowActionResult, {username: string}> ({
      query: ({ username }) => {
        console.log("🌐 [DEBUG] unfollowUser query called with:", { username });
        console.log(
          "🌐 [DEBUG] API URL:",
          `${process.env.EXPO_PUBLIC_API_URL}/api`
        );
        return {
          url: `/actors/${username}/follow`,
          method: "DELETE",
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
