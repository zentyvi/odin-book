import { prisma_client } from "../../lib/prisma.js";
import { protectRoute } from "../../middlewares/auth.js";

async function $deleteMessage(req, res, next) {
  try {
    const userId = req?.user?.id;
    const { messageId } = req.params;

    const message = await prisma_client.message.findFirst({
      where: {
        id: messageId,
        chat: {
          users: { some: { id: userId } },
        },
      },
      select: {
        chatId: true,
        id: true,
      },
    });

    const companion = await prisma_client.user.findFirst({
      where: {
        id: {
          not: userId,
        },
        chats: {
          some: {
            users: { some: { id: userId } },
            messages: { some: { id: messageId } },
          },
        },
      },
      select: {
        username: true,
        id: true,
      },
    });

    if (!message) {
      return res.status(404).json({ message: "Not found message to delete" });
    }

    await prisma_client.message.delete({
      where: {
        id: message.id,
      },
    });

    res.json({ message: "Succeed" });

    const { io } = req;
    io.to(`user_${companion.id}`).emit("delete_message", {
      messageId: message.id,
      chatId: message.chatId,
    });
  } catch (err) {
    next(err);
  }
}

const deleteMessage = [protectRoute, $deleteMessage];

const messagesController = { deleteMessage };

export default messagesController;
