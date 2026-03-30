import { Server } from "socket.io";

let io;

export const initSocket = (httpServer) => {
  const allowedOrigins = [
    "http://localhost:5173",
    "https://sneaker-store-frontend-three.vercel.app",
    "https://sneaker-store-frontend-three.vercel.app/"
  ];

  if (process.env.FRONTEND_URL) {
    allowedOrigins.push(process.env.FRONTEND_URL);
    if (process.env.FRONTEND_URL.endsWith("/")) {
      allowedOrigins.push(process.env.FRONTEND_URL.slice(0, -1));
    }
  }

  io = new Server(httpServer, {
    cors: {
      origin: allowedOrigins,
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
