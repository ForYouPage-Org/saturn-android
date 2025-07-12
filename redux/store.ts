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
} from "redux-persist";
import { userApi } from "./api/user";
import { servicesApi } from "./api/services";
import { postsApi } from "./api/posts";
import { mediaApi } from "./api/media";
import loadingModal, { LoadingModal } from "./slice/modal/loading";
import searchPeople, { personState } from "./slice/people/search";
import followers, { FollowerState } from "./slice/user/followers";
import followedPost from "./slice/post/followed";
import currentPage from "./slice/currentPage";
// 🚫 MVP: Removed chat imports to eliminate resource leakage
// import chatList, { ChatList } from "./slice/chat/chatlist";
// import { chatApi } from "./api/chat";
// import online from "./slice/chat/online";
// import audio from "./slice/post/audio"
const persistConfig: PersistConfig<
  CombinedState<{
    routes: Route;
    prefs: Prefs;
    bottomSheet: BottomSheet;
    post: postState;
    searchPost: postState;
    toast: ToastState;
    user: UserState;
    followers: FollowerState;
    searchPeople: personState;
    loadingModal: LoadingModal;
    followedPost: postState;
    currentPage: {
      page: string | null;
    };
    [authApi.reducerPath]: any;
    [userApi.reducerPath]: any;
    [servicesApi.reducerPath]: any;
    [postsApi.reducerPath]: any;
    [mediaApi.reducerPath]: any;
    // 🚫 MVP: Removed chat-related types to eliminate resource leakage
    // online: { ids: Array<string> };
    // audio: any;
    // chatlist: ChatList;
    // [chatApi.reducerPath]: any;
  }>
> = {
  key: "root",
  storage: reduxStorage,
  whitelist: ["routes", "prefs", "user"],
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
  [authApi.reducerPath]: authApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [servicesApi.reducerPath]: servicesApi.reducer,
  [postsApi.reducerPath]: postsApi.reducer,
  [mediaApi.reducerPath]: mediaApi.reducer,
  user,
  searchPeople,
  followedPost,
  currentPage,
  // 🚫 MVP: Removed chat reducers to eliminate resource leakage
  // chatlist: chatList,
  // online,
  // audio,
  // [chatApi.reducerPath]: chatApi.reducer,
});
const persistedReducer = persistReducer(persistConfig, reducer);

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
      .concat(authApi.middleware)
      .concat(userApi.middleware)
      .concat(servicesApi.middleware)
      .concat(postsApi.middleware)
      .concat(mediaApi.middleware),
      // 🚫 MVP: Removed chat middleware to eliminate resource leakage
      // .concat(chatApi.middleware),
});

// Export types after store creation to avoid circular dependencies
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
