import storage from "../redux/storage";
import { store } from "../redux/store";
import { isFeatureEnabled } from "../config/featureFlags";

// 🚫 MVP: Mock Socket.io implementation (package removed for MVP)
const io = () => ({
  on: () => {},
  off: () => {},
  emit: () => {},
  connect: () => {},
  disconnect: () => {},
  connected: false,
  id: "mock-socket-id",
});

const persistRoot = storage.getString("persist:root");
const userId = (): string | undefined => {
  if (persistRoot) {
    try {
      const routes = JSON.parse(persistRoot);
      if (routes) {
        const user = JSON.parse(routes.user);
        return user.token;
      }
    } catch (error) {
      console.error("Failed to parse persisted user data:", error);
      return undefined;
    }
    return undefined;
  }
  return undefined;
};
userId();

// 🚫 MVP: Create mock socket for MVP (Socket.io disabled)
const socket = {
  on: () => {},
  off: () => {},
  emit: () => {},
  connect: () => {},
  disconnect: () => {},
  connected: false,
  id: "mock-socket-id",
};

console.log("🚫 Socket.io disabled for MVP - using mock socket");

export default socket;
