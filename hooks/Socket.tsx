import { useState, useEffect, useRef, useMemo } from "react";
import { useAppSelector } from "../redux/hooks/hooks";
import { isFeatureEnabled, MOCK_RESPONSES } from "../config/featureFlags";

// 🚫 MVP: Mock Socket.io implementation (package removed for MVP)
const io = () => ({
  on: () => {},
  off: () => {},
  emit: () => {},
  connect: () => {},
  disconnect: () => {},
  connected: false,
});

const Socket = class MockSocket {
  on() {}
  off() {}
  emit() {}
  connect() {}
  disconnect() {}
  connected = false;
};

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

    // 🚫 MVP: Socket.io functionality disabled - using mock
    console.log("🚫 Socket.io connections disabled for MVP");
  }, [token]);

  // 🚫 MVP: Return undefined when sockets are disabled
  if (!isFeatureEnabled("SOCKET_CONNECTIONS")) {
    return undefined;
  }

  return socketRef?.current;
};

export default useSocket;
