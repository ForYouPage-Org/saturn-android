import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IUSerData } from "../../types/api";

interface LoginResult {
  status: "success";
  actor: IUSerData;
  token: string;
  // Legacy support
  data?: IUSerData;
  msg?: string;
}

interface LegacyLoginResult {
  msg: string;
  token: string;
  data: IUSerData;
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.EXPO_PUBLIC_API_URL}/api/auth`,
  }),
  tagTypes: ["user"],
  endpoints: (builder) => ({
    login: builder.mutation<
      LoginResult,
      {
        username: string;
        password: string;
      }
    >({
      query: (payload) => ({
        url: "/login",
        method: "POST",
        body: payload,
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }),
      extraOptions: { maxRetries: 0 },
    }),
    register: builder.mutation<
      LoginResult,
      {
        username: string;
        password: string;
        email: string;
      }
    >({
      query: (payload) => ({
        url: "/register",
        method: "POST",
        body: payload,
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }),
      extraOptions: { maxRetries: 0 },
    }),
  }),
});

export const { useLoginMutation ,useRegisterMutation} = authApi;
