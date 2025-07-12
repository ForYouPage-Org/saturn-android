import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Post {
  id: string;
  content: string;
  author: {
    id: string;
    username: string;
    preferredUsername: string;
    displayName?: string;
    iconUrl?: string;
  };
  published: string;
  sensitive: boolean;
  summary?: string;
  attachments: Array<{
    id: string;
    type: "image" | "video" | "audio" | "document";
    url: string;
    name: string;
    size: number;
    mediaType: string;
    width?: number;
    height?: number;
  }>;
  likes: number;
  likedByUser: boolean;
  shares: number;
  sharedByUser: boolean;
  replyCount: number;
  visibility: "public" | "followers" | "unlisted" | "direct";
  url: string;
}

export interface FeedResponse {
  status: "success";
  posts: Post[];
  hasMore: boolean;
}

export interface CreatePostRequest {
  content: string;
  attachments?: Array<{
    id: string;
    type: string;
    url: string;
  }>;
  sensitive?: boolean;
  summary?: string;
  visibility?: "public" | "followers" | "unlisted" | "direct";
}

export interface CreatePostResponse {
  status: "success";
  id: string;
  content: string;
  author: {
    id: string;
    username: string;
    preferredUsername: string;
    displayName?: string;
    iconUrl?: string;
  };
  published: string;
  sensitive: boolean;
  summary?: string;
  attachments: Array<any>;
  likes: number;
  likedByUser: boolean;
  shares: number;
  sharedByUser: boolean;
  replyCount: number;
  visibility: string;
  url: string;
}

export const postsApi = createApi({
  reducerPath: "postsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.EXPO_PUBLIC_API_URL}/api`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).user.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Post"],
  endpoints: (builder) => ({
    getFeed: builder.query<FeedResponse, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 20 } = {}) => ({
        url: "/posts",
        method: "GET",
        params: { page, limit },
      }),
      providesTags: ["Post"],
    }),
    createPost: builder.mutation<CreatePostResponse, CreatePostRequest>({
      query: (body) => ({
        url: "/posts",
        method: "POST",
        body,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["Post"],
    }),
    likePost: builder.mutation<Post, { id: string }>({
      query: ({ id }) => ({
        url: `/posts/${id}/like`,
        method: "POST",
      }),
      invalidatesTags: ["Post"],
    }),
    unlikePost: builder.mutation<Post, { id: string }>({
      query: ({ id }) => ({
        url: `/posts/${id}/unlike`,
        method: "POST",
      }),
      invalidatesTags: ["Post"],
    }),
  }),
});

export const {
  useGetFeedQuery,
  useCreatePostMutation,
  useLikePostMutation,
  useUnlikePostMutation,
} = postsApi;
