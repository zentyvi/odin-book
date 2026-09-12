import { tr } from "@faker-js/faker";
import { prisma_client } from "../lib/prisma.js";
import { createServer } from "node:http";
import { Server } from "socket.io";

async function updateStatus(userId, isOnline) {
  const user = await prisma_client.user.update({
    where: {
      id: userId,
    },
    data: {
      isOnline: isOnline,
      lastSeen: new Date(),
    },
  });
  if (!user) {
    throw new Error("User not found");
  }
}

async function _getContactsIds(userId) {
  const idsSet = new Set();
  const friends = await prisma_client.user.findMany({
    where: {
      friends: {
        some: { id: userId },
      },
    },
    select: {
      id: true,
    },
  });
  const activeChats = await prisma_client.chat.findMany({
    where: {
      users: {
        some: { id: userId },
      },
    },
    select: {
      users: {
        where: {
          id: { not: userId },
        },
        select: {
          id: true,
        },
      },
    },
  });

  friends.forEach((friend) => {
    idsSet.add(friend.id);
  });
  activeChats.forEach((chat) => {
    const companion = chat.users[0];
    idsSet.add(companion.id);
  });

  return [...idsSet];
}

async function alertContacts(io, userId, isOnline) {
  const contactIds = await _getContactsIds(userId);

  contactIds.forEach((id) => {
    io.to(`user_${id}`).emit("update_status", { userId, isOnline });
  });
}

export const useSocket = (app) => {
  const server = createServer(app);
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    let currentUserId;
    socket.on("register_user", (userId) => {
      currentUserId = userId;
      socket.join(`user_${userId}`);
      updateStatus(userId, true);
      alertContacts(io, userId, true);
    });

    socket.on("disconnect", () => {
      if (currentUserId) {
        updateStatus(currentUserId, false);
        alertContacts(io, currentUserId, false);
      }
    });
  });

  return { io, server };
};
