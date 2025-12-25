import { Server } from "socket.io";

let io;

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    socket.on("join_order", (orderId) => {
      socket.join(`order_${orderId}`);
    });
  });
};

export const emitOrderStatus = (orderId, status) => {
  if (!io) return;
  io.to(`order_${orderId}`).emit("order_status", {
    orderId,
    status,
  });
};
