import { prisma_client } from "../../lib/prisma.js";
import { protectRoute } from "../../middlewares/auth.js";

async function $startChat(req, res, next) {
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

    if (companion.settings.whoCanTextMe === "FRIENDS") {
      const areFriends = companion.friends.length > 0;
      if (!areFriends) {
        return res
          .status(403)
          .json({
            message: "This user only accepts messages from their friends",
          });
      }
    }

    const existingChat = await prisma_client.chat.findFirst({
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

    if (existingChat) {
      return res.json({ status: "FOUND_CHAT", chatId: existingChat.id });
    }

    const chat = await prisma_client.chat.create({
      data: {
        users: {
          connect: [{ id: userId }, { id: companion.id }],
        },
      },
      select: {
        id: true,
      },
    });

    res.json({ status: "CREATED_CHAT", chatId: chat.id });
  } catch (err) {
    next(err);
  }
}

const startChat = [protectRoute, $startChat];

const chatsController = {
  startChat,
};

export default chatsController;
