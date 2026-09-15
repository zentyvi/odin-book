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
    select: {
      lastSeen: true,
    },
  });
  if (!user) {
    throw new Error("User not found");
  }
  return user;
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

async function alertContacts(io, userId, data) {
  const contactIds = await _getContactsIds(userId);

  contactIds.forEach((id) => {
    io.to(`user_${id}`).emit("update_status", { userId, ...data });
  });
}

export const useSocket = (app) => {
  const origin = process.env["ORIGIN"];
  const server = createServer(app);
  const io = new Server(server, {
    cors: {
      origin: origin || "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    let currentUserId;
    socket.on("register_user", async (userId) => {
      currentUserId = userId;
      socket.join(`user_${userId}`);
      const data = await updateStatus(userId, true);
      alertContacts(io, userId, { ...data, isOnline: true });
    });

    socket.on("unserialize_user", (userId) => {
      socket.leave(`user_${userId}`);
    });

    socket.on("disconnect", async () => {
      if (currentUserId) {
        const data = await updateStatus(currentUserId, false);
        alertContacts(io, currentUserId, { ...data, isOnline: false });
      }
    });
  });

  return { io, server };
};
