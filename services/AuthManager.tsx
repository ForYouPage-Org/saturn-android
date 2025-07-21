import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks/hooks";
import { clearUserData, loginSuccess } from "../redux/slice/user";
import { setRoute } from "../redux/slice/routes";
import { isFeatureEnabled } from "../config/featureFlags";

/**
 * AuthManager is a headless component responsible for managing the application's
 * authentication lifecycle. It ensures that Redux Persist is rehydrated before
 * making any authentication decisions, checks for persisted user sessions,
 * validates tokens, and routes the user accordingly.
 *
 * It renders no UI and should be placed at the top of the component tree,
 * typically inside all providers.
 */
const AuthManager = () => {
  const dispatch = useAppDispatch();
  const userState = useAppSelector((state) => state.user);
  const persistedState = useAppSelector((state) => state._persist);
  const [authInitialized, setAuthInitialized] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      console.log("🔒 [AuthManager] Starting authentication initialization...");

      // Critical: Wait for Redux Persist to rehydrate
      if (!persistedState?.rehydrated) {
        console.log(
          "🔒 [AuthManager] Waiting for Redux Persist rehydration..."
        );
        return;
      }

      // Check for a persisted user session
      if (userState.token && userState.data) {
        console.log(
          "🔒 [AuthManager] Found persisted user data, checking token validity..."
        );

        try {
          const tokenPayload = JSON.parse(atob(userState.token.split(".")[1]));
          const isExpired = tokenPayload.exp * 1000 < Date.now();

          if (isExpired) {
            console.log(
              "🔒 [AuthManager] Token expired, clearing user data and routing to Auth."
            );
            dispatch(clearUserData());
            dispatch(setRoute({ route: "Auth" }));
          } else {
            console.log("🔒 [AuthManager] Token valid, routing to App.");
            dispatch(setRoute({ route: "App" }));
          }
        } catch (error) {
          console.log(
            "🔒 [AuthManager] Invalid token format, clearing user data."
          );
          dispatch(clearUserData());
          dispatch(setRoute({ route: "Auth" }));
        }
      } else {
        // No persisted data - route to authentication
        console.log("🔒 [AuthManager] No persisted data, routing to Auth.");
        dispatch(setRoute({ route: "Auth" }));
      }

      setAuthInitialized(true);
    };

    if (!authInitialized && persistedState?.rehydrated) {
      initializeAuth();
    }
  }, [
    authInitialized,
    persistedState?.rehydrated,
    userState.token,
    userState.data,
    dispatch,
  ]);

  // This component does not render anything.
  return null;
};

export default AuthManager;
