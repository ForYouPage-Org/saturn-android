import storage from "../redux/storage";
import { store } from "../redux/store";
import { isFeatureEnabled } from "../config/featureFlags";

// 🚫 MVP: Optional Socket.io import with fallback
let io: any = null;
try {
  const socketIO = require("socket.io-client");
  io = socketIO.io || socketIO.default || socketIO;
} catch (error) {
  // Socket.io not available - use mock implementation
  io = () => ({
    on: () => {},
    off: () => {},
    emit: () => {},
    connect: () => {},
    disconnect: () => {},
    connected: false,
    id: "mock-socket-id",
  });
}

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

// 🚫 MVP: Create mock socket when feature is disabled
let socket: any;

if (!isFeatureEnabled("SOCKET_CONNECTIONS")) {
  // Return mock socket for MVP
  socket = {
    on: () => {},
    off: () => {},
    emit: () => {},
    connect: () => {},
    disconnect: () => {},
    connected: false,
    id: "mock-socket-id",
  };
  console.log("🚫 Socket.io disabled for MVP - using mock socket");
} else {
  // Create real socket connection
  try {
    socket = io(process.env.EXPO_PUBLIC_API_URL as string, {
      autoConnect: true,
      auth: {
        token: userId(),
      },
    });
  } catch (error) {
    console.log("⚠️ Socket.io connection failed, using mock:", error);
    socket = {
      on: () => {},
      off: () => {},
      emit: () => {},
      connect: () => {},
      disconnect: () => {},
      connected: false,
      id: "mock-socket-id",
    };
  }
}

export default socket;
