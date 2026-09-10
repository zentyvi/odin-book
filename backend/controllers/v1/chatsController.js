import { Connection } from "pg";
import { prisma_client } from "../../lib/prisma.js";
import { protectRoute } from "../../middlewares/auth.js";

async function _findChat(companion_id_or_username, userId) {
  return await prisma_client.chat.findFirst({
    where: {
      AND: [
        { users: { some: { id: userId } } },
        {
          users: {
            some: {
              OR: [
                { id: companion_id_or_username },
                { username: companion_id_or_username },
              ],
            },
          },
        },
      ],
    },

    select: {
      id: true,
    },
  });
}

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
      return res.status(404).json({ message: "Companion not found" });
    }

    const areFriends = companion.friends.length > 0;
    const whoCanText = companion.settings.whoCanTextMe;
    delete companion.settings;
    delete companion.friends;

    const chat = await prisma_client.chat.findFirst({
      where: {
        AND: [
          { users: { some: { id: userId } } },
          { users: { some: { id: companion.id } } },
        ],
      },
      select: {
        id: true,
        messages: {
          select: {
            id: true,
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
        _count: {
          select: {
            messages: {
              where: {
                NOT: { authorId: userId },
                isRead: false,
              },
            },
          },
        },
      },
    });

    const unreadMessages = chat?._count?.messages;
    delete chat?._count;
    res.json({
      ...chat,
      companion,
      areFriends,
      whoCanText,
      unreadMessages,
    });
  } catch (err) {
    next(err);
  }
}

const getChat = [protectRoute, $getChat];

async function $sendMessage(req, res, next) {
  try {
    const userId = req?.user?.id;
    const companion_id_or_username = req.params?.user;
    const { message } = req.body;

    const companion = await prisma_client.user.findFirst({
      where: {
        OR: [
          { id: companion_id_or_username },
          { username: companion_id_or_username },
        ],
      },
      select: {
        id: true,
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
      return res.status(404).json({ message: "Companion not found" });
    }

    const areFriends = companion.friends.length > 0;
    const whoCanText = companion.settings.whoCanTextMe;
    const canTextThem = whoCanText === "EVERYONE" || areFriends;

    if (!canTextThem) {
      return req.status(403).json({
        message: "This user has restricted who can send them messages",
      });
    }

    let chat = await _findChat(companion_id_or_username, userId);

    if (!chat) {
      chat = await prisma_client.chat.create({
        data: {
          users: {
            connect: [{ id: userId }, { id: companion.id }],
          },
        },
        select: {
          id: true,
        },
      });
    }

    await prisma_client.chat.update({
      where: {
        id: chat.id,
      },
      data: {
        lastUpdate: new Date(),
      },
    });

    const newMessage = await prisma_client.message.create({
      data: {
        content: message,
        authorId: userId,
        chatId: chat.id,
      },
      select: {
        id: true,
        createdAt: true,
        chatId: true,
      },
    });

    res.json(newMessage);
  } catch (err) {
    next(err);
  }
}

const sendMessage = [protectRoute, $sendMessage];

async function $deleteChat(req, res, next) {
  try {
    const userId = req?.user?.id;
    const companion_id_or_username = req.params?.user;
    const chat = await _findChat(companion_id_or_username, userId);

    if (!chat) {
      res.status(404).json({ message: "Not found chat to delete" });
    }

    await prisma_client.chat.delete({
      where: {
        id: chat.id,
      },
    });

    res.json({ message: "Succeed" });
  } catch (err) {
    next(err);
  }
}

const deleteChat = [protectRoute, $deleteChat];

const chatsController = {
  getChat,
  sendMessage,
  deleteChat,
};

export default chatsController;
