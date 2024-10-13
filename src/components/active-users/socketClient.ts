import { getSession } from "next-auth/react";

let socket: WebSocket | null = null;

export const initiateSocketConnection = async () => {
  // if (!socket) {
  //   const userSession = await getSession();
  //   socket = new WebSocket(
  //     `ws://localhost:3001?userId=${userSession?.user?.id || ""}`
  //   );
  //   console.log("Socket connection established");
  // }
};

export const getSocket = () => {
  return socket;
};

export const disconnectSocket = () => {
  // if (socket) {
  //   socket.close();
  //   console.log("Socket disconnected");
  // }
};
