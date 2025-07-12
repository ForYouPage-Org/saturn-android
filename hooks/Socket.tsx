import { useState, useEffect, useRef, useMemo } from "react";
import io, { Socket } from "socket.io-client";
import { useAppSelector } from "../redux/hooks/hooks";
import { isFeatureEnabled, MOCK_RESPONSES } from "../config/featureFlags";

const useSocket = (): Socket | undefined => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const token = useAppSelector((state) => state.user.token);
  const socketRef = useRef<Socket>(null);

  useMemo(() => {
    // 🚫 MVP: Disable Socket.io connections
    if (!isFeatureEnabled("SOCKET_CONNECTIONS")) {
      console.log("🚫 Socket.io disabled for MVP");
      return;
    }

    if (token) {
      socketRef.current = io(process.env.EXPO_PUBLIC_API_URL as string, {
        autoConnect: true,
        auth: {
          token,
        },
      });
    }
  }, [token]);

  // 🚫 MVP: Return null when sockets are disabled
  if (!isFeatureEnabled("SOCKET_CONNECTIONS")) {
    return undefined;
  }

  return socketRef?.current;
};

export default useSocket;
