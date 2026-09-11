import { tr } from "@faker-js/faker";
import { prisma_client } from "../lib/prisma.js";
import { createServer } from "node:http";
import { Server } from "socket.io";

async function updateLastSeen(userId) {
  try {
    const user = await prisma_client.user.update({
      where: {
        id: userId,
      },
      data: {
        lastSeen: new Date(),
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }
  } catch (err) {
    throw new Error(`Failed to update last seen row: ${err.message}`);
  }
}

const useSocket = (app) => {
  const server = createServer(app);
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    let currentUserId;
    let updateIntervalId;
    socket.on("register_user", (userId) => {
      socket.join(`user_${userId}`);
      updateLastSeen(userId);
      currentUserId = userId;
      updateIntervalId = setInterval(
        () => {
          updateLastSeen(userId);
        },
        3 * 60 * 1000,
      );
    });

    socket.on("disconnect", () => {
      if (currentUserId) {
        updateLastSeen(currentUserId);
      }
      clearInterval(updateIntervalId);
    });
  });

  return { io, server };
};

export { useSocket };
