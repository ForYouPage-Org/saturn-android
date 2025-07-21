import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IUSerData } from "../../../types/api";

export interface UserState {
  // 🔒 Allow for legacy fields until backend is updated
  data:
    | (IUSerData & {
        name?: string;
        imageUri?: string;
        iconUrl?: string;
        userName?: string;
      })
    | null;
  error: any;
  token: string | null;
  status: "idle" | "loading" | "authenticated" | "unauthenticated" | "error";
}
const user = createSlice({
  name: "user",
  initialState: {
    data: null,
    error: null,
    status: "unauthenticated",
    token: null,
  } as UserState,
  reducers: {
    loginSuccess: (
      state,
      action: PayloadAction<{ token: string; data: IUSerData }>
    ) => {
      state.token = action.payload.token;
      // 🔧 Ensure data shape is consistent for both new logins and rehydration
      const augmentedData = {
        ...action.payload.data,
        name:
          action.payload.data.preferredUsername || action.payload.data.username,
        userName: action.payload.data.username,
        imageUri:
          (action.payload.data as any).iconUrl ||
          `https://ui-avatars.com/api/?name=${action.payload.data.preferredUsername}&background=random`,
      };
      state.data = augmentedData;
      state.error = null;
      state.status = "authenticated";
    },
    signOut: (state) => {
      state.error = null;
      state.status = "unauthenticated";
      state.token = null;
      state.data = null;
      // Socket disconnect will be handled by middleware
    },
    clearUserData: (state) => {
      state.data = null;
      state.error = null;
      state.status = "unauthenticated";
      state.token = null;
    },
    setStatus: (state, action: PayloadAction<UserState["status"]>) => {
      state.status = action.payload;
    },
  },
  // Note: Extra reducers moved to avoid circular dependencies
  // API state management will be handled directly by RTK Query
});

export default user.reducer;

export const { loginSuccess, signOut, clearUserData, setStatus } = user.actions;
