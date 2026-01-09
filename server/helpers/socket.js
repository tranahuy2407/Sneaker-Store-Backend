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

    socket.on("join_admin", () => {
      socket.join("admin_room");
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

export const emitNewOrderToAdmin = (payload) => {
  if (!io) return;

  io.to("admin_room").emit("admin_notification", payload);
};
