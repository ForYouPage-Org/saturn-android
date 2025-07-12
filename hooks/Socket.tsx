import { useState, useEffect, useRef, useMemo } from "react";
import { useAppSelector } from "../redux/hooks/hooks";
import { isFeatureEnabled, MOCK_RESPONSES } from "../config/featureFlags";

// 🚫 MVP: Optional Socket.io import with fallback
let io: any = null;
let Socket: any = null;
try {
  const socketIO = require("socket.io-client");
  io = socketIO.default || socketIO;
  Socket = socketIO.Socket;
} catch (error) {
  // Socket.io not available - use mock implementation
  io = () => ({
    on: () => {},
    off: () => {},
    emit: () => {},
    connect: () => {},
    disconnect: () => {},
    connected: false,
  });
  Socket = class MockSocket {
    on() {}
    off() {}
    emit() {}
    connect() {}
    disconnect() {}
    connected = false;
  };
}

const useSocket = (): typeof Socket | undefined => {
  const [socket, setSocket] = useState<typeof Socket | null>(null);
  const token = useAppSelector((state) => state.user.token);
  const socketRef = useRef<typeof Socket>(null);

  useMemo(() => {
    // 🚫 MVP: Disable Socket.io connections
    if (!isFeatureEnabled("SOCKET_CONNECTIONS")) {
      console.log("🚫 Socket.io disabled for MVP");
      return;
    }

    if (token && io) {
      try {
        socketRef.current = io(process.env.EXPO_PUBLIC_API_URL as string, {
          autoConnect: true,
          auth: {
            token,
          },
        });
      } catch (error) {
        console.log("⚠️ Socket.io connection failed:", error);
      }
    }
  }, [token]);

  // 🚫 MVP: Return null when sockets are disabled
  if (!isFeatureEnabled("SOCKET_CONNECTIONS")) {
    return undefined;
  }

  return socketRef?.current;
};

export default useSocket;
