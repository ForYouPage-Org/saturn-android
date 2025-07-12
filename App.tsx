import "react-native-get-random-values";

// Polyfill for setImmediate on web
if (typeof setImmediate === "undefined") {
  global.setImmediate = (callback, ...args) => {
    return setTimeout(callback, 0, ...args);
  };
  global.clearImmediate = (id) => {
    return clearTimeout(id);
  };
}

import React, { useEffect, useState, useCallback } from "react";
import { StatusBar } from "expo-status-bar";
import { View, Platform, Text } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { Provider } from "react-redux";
import { store } from "./redux/store";

import { useAppDispatch, useAppSelector } from "./redux/hooks/hooks";
import { loginSuccess } from "./redux/slice/user";
import { setRoute } from "./redux/slice/routes";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

// 🚫 MVP: Mock components to prevent module loading issues
const Main = () => (
  <View
    style={{
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#000",
    }}
  >
    <Text style={{ color: "#fff", fontSize: 20, fontFamily: "jakaraBold" }}>
      Saturn MVP
    </Text>
    <Text style={{ color: "#ccc", fontSize: 16, marginTop: 10 }}>
      Loading...
    </Text>
  </View>
);

const OnboardNavigation = () => (
  <View
    style={{
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#000",
    }}
  >
    <Text style={{ color: "#fff", fontSize: 20 }}>Welcome to Saturn</Text>
  </View>
);

const Auth = () => (
  <View
    style={{
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#000",
    }}
  >
    <Text style={{ color: "#fff", fontSize: 20 }}>Authentication</Text>
  </View>
);

// 🚫 MVP: Mock all external services
const CustomToast = () => null;
const LoadingModal = () => null;

// Skip Sentry and other services
try {
  SplashScreen.preventAutoHideAsync();
} catch (error) {
  console.warn("SplashScreen.preventAutoHideAsync failed:", error);
}

const persistor = persistStore(store);

const Navigation = () => {
  const dispatch = useAppDispatch();
  const { route } = useAppSelector((state) => state.routes);

  // SIMPLIFIED: Direct auto-login for MVP testing
  useEffect(() => {
    if (route === "onBoard") {
      // Skip onboarding and auth - go straight to app
      const testUserData = {
        _id: "6872b97082b9e189bf982804",
        id: "6872b97082b9e189bf982804",
        username: "testuser",
        preferredUsername: "testuser",
        followers: [],
        following: [],
        email: "testuser@example.com",
        createdAt: "2025-07-12T19:37:20.231Z",
        updatedAt: "2025-07-12T19:37:20.231Z",
      };

      const testToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NzJiOTcwODJiOWUxODliZjk4MjgwNCIsInVzZXJuYW1lIjoidGVzdHVzZXIiLCJpYXQiOjE3NTIzNTAwMDUsImV4cCI6MTc1MjQzNjQwNX0.Q6Rr56qcCVGdLYUWqdDeKa8d-LYmBzNZbN9Fykdnz9Q";

      dispatch(loginSuccess({ token: testToken, data: testUserData }));
      dispatch(setRoute({ route: "App" }));
    }
  }, [route]);

  const renderRoute = () => {
    if (route === "onBoard") {
      return <OnboardNavigation />;
    } else if (route === "App") {
      return <Main />;
    } else if (route === "Auth") {
      return <Auth />;
    }
  };

  const [fontsLoaded] = useFonts({
    jakaraBold: require("./assets/fonts/PlusJakartaSans-ExtraBold.ttf"),
    jakara: require("./assets/fonts/PlusJakartaSans-Medium.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <StatusBar style="light" backgroundColor="transparent" />
      <NavigationContainer>{renderRoute()}</NavigationContainer>
    </View>
  );
};

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Provider store={store}>
          <PersistGate persistor={persistor}>
            <CustomToast />
            <LoadingModal />
            <Navigation />
          </PersistGate>
        </Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
