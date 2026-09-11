import { Connection } from "pg";
import { prisma_client } from "../../lib/prisma.js";
import { protectRoute } from "../../middlewares/auth.js";

async function _findChat(
  companion_id_or_username,
  userId,
  select = { id: true },
) {
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

    select: select,
  });
}

async function _findUser(user_id_or_username, select = { id: true }) {
  return await prisma_client.user.findFirst({
    where: {
      OR: [{ id: user_id_or_username }, { username: user_id_or_username }],
    },
    select: select,
  });
}

async function $getChat(req, res, next) {
  try {
    const userId = req?.user?.id;
    const companion_id_or_username = req.params?.user;

    const companion = await _findUser(companion_id_or_username, {
      id: true,
      avatarUrl: true,
      firstName: true,
      lastName: true,
      username: true,
      lastSeen: true,
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

    const companion = await _findUser(companion_id_or_username, {
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
    });

    if (!companion) {
      return res.status(404).json({ message: "Companion not found" });
    }

    if (companion.id === userId) {
      return res.status(400).json({ message: "Can't text yourself" });
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
    const hasChat = Boolean(chat);

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

    const { io } = req;

    if (hasChat) {
      io.to(`user_${companion.id}`).emit("new_message", {
        ...newMessage,
        authorId: userId,
        content: message,
      });
    } else {
      const me = await _findUser(userId, {
        id: true,
        avatarUrl: true,
        firstName: true,
        lastName: true,
        username: true,
        lastSeen: true,
        settings: {
          select: {
            whoCanTextMe: true,
          },
        },
        friends: {
          where: {
            id: companion.id,
          },
          select: {
            id: true,
          },
        },
      });

      const newChat = await _findChat(companion_id_or_username, userId, {
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
                NOT: { authorId: companion.id },
                isRead: false,
              },
            },
          },
        },
      });

      const areFriends = me.friends.length > 0;
      const whoCanText = me.settings.whoCanTextMe;
      delete me.settings;
      delete me.friends;

      const unreadMessages = newChat?._count?.messages || 0;
      delete newChat?._count;

      const formattedChatForRecipient = {
        ...newChat,
        companion: me,
        areFriends,
        whoCanText,
        unreadMessages,
      };

      io.to(`user_${companion.id}`).emit("new_message", {
        isNewChat: true,
        chat: formattedChatForRecipient,
      });
    }

    res.json(newMessage);
  } catch (err) {
    next(err);
  }
}

const sendMessage = [protectRoute, $sendMessage];

async function $deleteChat(req, res, next) {
  try {
    const userId = req?.user?.id;
    const myUsername = req?.user?.username;
    const companion_id_or_username = req.params?.user;

    const companion = await _findUser(companion_id_or_username);

    if (!companion) {
      return res.status(404).json({ message: "User not found" });
    }
    const chat = await _findChat(companion_id_or_username, userId);

    if (!chat) {
      res.status(404).json({ message: "Not found chat to delete" });
    }

    await prisma_client.chat.delete({
      where: {
        id: chat.id,
      },
    });

    const { io } = req;
    io.to(`user_${companion.id}`).emit("delete_chat", {
      username: myUsername,
      chatId: chat.id,
    });

    res.json({ message: "Succeed" });
  } catch (err) {
    next(err);
  }
}

const deleteChat = [protectRoute, $deleteChat];

async function $markChatAsRead(req, res, next) {
  try {
    const userId = req?.user?.id;
    const companion_id_or_username = req.params?.user;
    const chat = await _findChat(companion_id_or_username);

    const companion = await _findUser(companion_id_or_username);

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    await prisma_client.chat.update({
      where: {
        id: chat.id,
      },
      data: {
        messages: {
          updateMany: {
            where: {
              NOT: { authorId: userId },
            },
            data: {
              isRead: true,
            },
          },
        },
      },
    });

    const { io } = req;
    io.to(`user_${companion.id}`).emit("read_chat", {
      chatId: chat.id,
      userId,
    });

    res.json({ message: "Succeed" });
  } catch (err) {
    next(err);
  }
}

const markChatAsRead = [protectRoute, $markChatAsRead];

const chatsController = {
  getChat,
  sendMessage,
  deleteChat,
  markChatAsRead,
};

export default chatsController;
