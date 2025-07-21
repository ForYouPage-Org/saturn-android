import {
  CombinedState,
  combineReducers,
  configureStore,
} from "@reduxjs/toolkit";
import routes, { Route } from "./slice/routes";
import prefs, { Prefs } from "./slice/prefs";
import bottomSheet, { BottomSheet } from "./slice/bottomSheet";
import { reduxStorage } from "./storage.expoGo";
import post, { postState } from "./slice/post";
import searchPost from "./slice/post/search";
import toast, { ToastState } from "./slice/toast/toast";
import { authApi } from "./api/auth";

import user, { UserState } from "./slice/user";
import {
  persistReducer,
  REHYDRATE,
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  PersistConfig,
  createTransform,
} from "redux-persist";
import chatList, { ChatList } from "./slice/chat/chatlist";
import { userApi } from "./api/user";
import { servicesApi } from "./api/services";
import { postsApi } from "./api/posts";
import { mediaApi } from "./api/media";
import loadingModal, { LoadingModal } from "./slice/modal/loading";
import searchPeople, { personState } from "./slice/people/search";
import followers, { FollowerState } from "./slice/user/followers";
import followedPost from "./slice/post/followed";
import { chatApi } from "./api/chat";
import online from "./slice/chat/online";
import currentPage from "./slice/currentPage";
import audio from "./slice/post/audio";
import { isFeatureEnabled } from "../config/featureFlags";
import { IUSerData } from "../types/api";

// This transform will be applied to the user slice upon rehydration
const userTransform = createTransform(
  // We don't need to transform the state on the way in
  (inboundState: UserState) => {
    return inboundState;
  },
  // We transform the state on the way out (upon rehydration)
  (outboundState: UserState | undefined) => {
    if (outboundState && outboundState.data) {
      console.log(
        "🔧 [TRANSFORM] Augmenting rehydrated user data for UI compatibility."
      );
      const augmentedData = {
        ...outboundState.data,
        name:
          outboundState.data.preferredUsername || outboundState.data.username,
        userName: outboundState.data.username,
        imageUri:
          (outboundState.data as any).iconUrl ||
          `https://ui-avatars.com/api/?name=${outboundState.data.preferredUsername}&background=random`,
      };
      return { ...outboundState, data: augmentedData };
    }
    return outboundState;
  },
  { whitelist: ["user"] }
);

const whitelist = ["prefs", "user"];

console.log("🔍 [PERSIST] Whitelist configuration:", whitelist);

const persistConfig: PersistConfig<
  CombinedState<{
    routes: Route;
    prefs: Prefs;
    bottomSheet: BottomSheet;
    post: postState;
    searchPost: postState;
    toast: ToastState;
    user: UserState;
    online: { ids: Array<string> };
    followers: FollowerState;
    searchPeople: personState;
    loadingModal: LoadingModal;
    followedPost: postState;
    audio: any;
    chatlist: ChatList;
    currentPage: {
      page: string | null;
    };
    [chatApi.reducerPath]: any;
    [authApi.reducerPath]: any;
    [userApi.reducerPath]: any;
    [servicesApi.reducerPath]: any;
    [postsApi.reducerPath]: any;
    [mediaApi.reducerPath]: any;
  }>
> = {
  key: "root",
  storage: reduxStorage,
  whitelist, // 🔒 DYNAMIC: Don't persist user state in development
  transforms: [userTransform],
  debug: true, // Enable debug logging
};

const reducer = combineReducers({
  routes,
  prefs,
  bottomSheet,
  post,
  toast,

  loadingModal,
  searchPost,
  followers,
  chatlist: chatList,
  online,
  audio,
  [chatApi.reducerPath]: chatApi.reducer,
  [authApi.reducerPath]: authApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [servicesApi.reducerPath]: servicesApi.reducer,
  [postsApi.reducerPath]: postsApi.reducer,
  [mediaApi.reducerPath]: mediaApi.reducer,
  user,
  searchPeople,
  followedPost,
  currentPage,
});
const persistedReducer = persistReducer(persistConfig, reducer);

const rehydrationLogger = (store) => (next) => (action) => {
  if (action.type === REHYDRATE) {
    console.log(
      "✅ [REDUX-PERSIST VALIDATION] Rehydration complete. Payload:",
      action.payload
    );
  }
  return next(action);
};

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        immutableCheck: false,
        serializableCheck: false,
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    })
      .concat(rehydrationLogger)
      .concat(authApi.middleware)
      .concat(userApi.middleware)
      .concat(servicesApi.middleware)
      .concat(postsApi.middleware)
      .concat(mediaApi.middleware)
      .concat(chatApi.middleware),
});

// Export types after store creation to avoid circular dependencies
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
