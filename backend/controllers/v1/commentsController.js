import { prisma_client } from "../../lib/prisma.js";
import { protectRoute } from "../../middlewares/auth.js";

async function $likeComment(req, res, next) {
  try {
    const userId = req?.user?.id;
    const { commentId } = req.params;

    const comment = await prisma_client.comment.findUnique({
      where: { id: commentId },
      select: {
        id: true,
        likedBy: {
          where: { id: userId },
          select: { id: true },
        },
      },
    });

    if (!comment) {
      return res.status(404).json({ message: "Not found" });
    }

    const isCurrentlyLiked = comment.likedBy.length > 0;

    const updatedComment = await prisma_client.comment.update({
      where: { id: commentId },
      data: {
        likedBy: isCurrentlyLiked
          ? { disconnect: { id: userId } }
          : { connect: { id: userId } },
      },
      select: {
        _count: {
          select: { likedBy: true },
        },
        postId: true,
      },
    });

    res.status(200).json({
      isLiked: !isCurrentlyLiked,
      likesCount: updatedComment._count.likedBy,
      postId: updatedComment.postId,
    });
  } catch (err) {
    next(err);
  }
}

const likeComment = [protectRoute, $likeComment];

async function $deleteComment(req, res, next) {
  try {
    const userId = req?.user?.id;
    const { commentId } = req.params;

    const comment = await prisma_client.comment.delete({
      where: {
        id: commentId,
        OR: [
          { authorId: userId },
          {
            post: {
              authorId: userId,
            },
          },
        ],
      },
      select: {
        id: true,
      },
    });

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    res.json({ message: "Deletion succeed" });
  } catch (err) {
    next(err);
  }
}

const deleteComment = [protectRoute, $deleteComment];

const commentsController = { likeComment, deleteComment };

export default commentsController;
