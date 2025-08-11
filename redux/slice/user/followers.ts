import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { userApi } from "../../api/user";

export interface FollowerState {
  following: number | null;
  followers: number | null;
  followedUserIds: string[];
}
const followsCount = createSlice({
  name: "followsCount",
  initialState: {
    followers: 0,
    following: 0,
    followedUserIds: [], // RAGHAVI ADDED
  } as FollowerState,
  reducers: {
    resetFollowers: (state) => {
      state.following = 0;
      state.followers = 0;
      state.followedUserIds = []; // RAGHAVI ADDED
    },
    updateFollowing: (state, action: PayloadAction<{ following: number }>) => {
      state.following = action.payload.following;
    },
    updateFollowers: (state, action: PayloadAction<{ followers: number }>) => {
      state.followers = action.payload.followers;
    },
    //STEP 2.1: Reducer explains what to do when follow/unfollow happen, we dispatch 
    // the action in UserContainer.tsx RAGHAVI ADDED
     followUser: (state, action: PayloadAction<string>) => {
      if (!state.followedUserIds.includes(action.payload)) {
        state.followedUserIds.push(action.payload);
        state.following = (state.following || 0) + 1; // Update count too
      }
    },
    unfollowUser: (state, action: PayloadAction<string>) => {
      state.followedUserIds = state.followedUserIds.filter(id => id !== action.payload);
      state.following = Math.max((state.following || 1) - 1, 0); // Update count too
    },
    setFollowedUsers: (state, action: PayloadAction<string[]>) => {
      state.followedUserIds = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      userApi.endpoints.getFollowDetails.matchFulfilled,
      (state, { payload }) => {
        state.followers = Number(payload.followers);
        state.following = Number(payload.following);
      }
    );
  },
});

export default followsCount.reducer;
export const { resetFollowers, updateFollowers, updateFollowing, followUser, unfollowUser, setFollowedUsers } =
  followsCount.actions;
