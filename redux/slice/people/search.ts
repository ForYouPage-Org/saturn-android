import { IPerson, IPost } from "./../../../types/api";
import { createSlice } from "@reduxjs/toolkit";
import { userApi } from "../../api/user";

export type personState = {
  data: IPerson[];
  error: any;
  loading: boolean;
};

const searchPeople = createSlice({
  name: "searchPeople",
  initialState: {
    data: [],
    error: null,
    loading: false,
  } as personState,
  reducers: {
    addPost: () => {},
    clearSearchResults: (state) => {
      state.data = [];
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    // Listen to userApi searchActors endpoint
    builder.addMatcher(
      userApi.endpoints.searchActors.matchFulfilled,
      (state, { payload }) => {
        console.log("🔍 Search actors fulfilled:", payload);
        // Transform backend data to match frontend expectations
        state.data = payload.data.map((actor: any) => ({
          id: actor.id,
          name: actor.preferredUsername || actor.username,
          userName: actor.username,
          imageUri: actor.iconUrl || undefined,
          verified: false, // Backend doesn't provide this yet
          isFollowed: false, // Backend doesn't provide this in search results
        }));
        state.error = null;
        state.loading = false;
      }
    );
    builder.addMatcher(userApi.endpoints.searchActors.matchPending, (state) => {
      console.log("🔍 Search actors pending");
      state.error = null;
      state.loading = true;
      // Don't clear data immediately to avoid flicker
    });
    builder.addMatcher(
      userApi.endpoints.searchActors.matchRejected,
      (state, { error }) => {
        console.error("🚨 Search actors rejected:", error);
        state.data = [];
        state.error = error;
        state.loading = false;
      }
    );
  },
});

export const { clearSearchResults } = searchPeople.actions;
export default searchPeople.reducer;
