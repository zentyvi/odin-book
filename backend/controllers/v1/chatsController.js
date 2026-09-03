import { prisma_client } from "../../lib/prisma.js";
import { protectRoute } from "../../middlewares/auth.js";

async function $getChat(req, res, next) {
  try {
    const userId = req?.user?.id;
    const companion_id_or_username = req.params?.user;

    const companion = await prisma_client.user.findFirst({
      where: {
        OR: [
          { id: companion_id_or_username },
          { username: companion_id_or_username },
        ],
      },
      select: {
        id: true,
        avatarUrl: true,
        firstName: true,
        lastName: true,
        username: true,
        settings: {
          select: {
            whoCanTextMe: true,
          },
        },
        friends: {
          where: {
            id: userId,
          },
          select: {
            id: true,
          },
        },
      },
    });

    if (!companion) {
      return (res.status(404), json({ message: "Companion not found" }));
    }

    const areFriends = companion.friends.length > 0;
    const whoCanText = companion.settings.whoCanTextMe;

    const chat = await prisma_client.chat.findFirst({
      where: {
        users: {
          some: { id: userId },
          some: { id: companion.id },
        },
      },
      select: {
        id: true,
        messages: {
          select: {
            content: true,
            imageUrl: true,
            createdAt: true,
            isRead: true,
            authorId: true,
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!chat) {
      const response = {
        status: "NOT_FOUND",
        areFriends,
        whoCanText,
      };
      return res.json(response);
    }

    delete companion.settings;
    delete companion.friends;
    const response = {
      status: "FOUND",
      areFriends,
      whoCanText,
      chat,
      companion,
    };
    res.json(response);
  } catch (err) {
    next(err);
  }
}

const getChat = [protectRoute, $getChat];

const chatsController = {
  getChat,
};

export default chatsController;
