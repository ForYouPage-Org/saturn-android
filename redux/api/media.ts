import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface MediaUploadResponse {
  status: "success";
  id: string;
  url: string;
  type: string;
  size: number;
  mediaType: string;
  width?: number;
  height?: number;
}

export interface MediaUploadRequest extends FormData {
  // FormData with file field
}

export const mediaApi = createApi({
  reducerPath: "mediaApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.EXPO_PUBLIC_API_URL}/api/media`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).user.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Media"],
  endpoints: (builder) => ({
    uploadMedia: builder.mutation<MediaUploadResponse, FormData>({
      query: (formData) => ({
        url: "/upload",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Media"],
    }),
  }),
});

export const { useUploadMediaMutation } = mediaApi;