import { io } from "socket.io-client";

const SOCKET_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:4000";

export const createSocket = (role) => {
  const token =
    role === "captain"
      ? localStorage.getItem(
          "captainToken"
        )
      : localStorage.getItem("token");

  console.log(
    "Socket role:",
    role
  );

  console.log(
    "Socket token exists:",
    !!token
  );

  return io(SOCKET_URL, {
    auth: {
      token,
      role,
    },

    withCredentials: true,

    reconnection: true,

    reconnectionAttempts: Infinity,

    reconnectionDelay: 1000,

    reconnectionDelayMax: 5000,
  });
};