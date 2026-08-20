import { prisma_client } from "../../lib/prisma.js";
import { protectRoute } from "../../middlewares/auth.js";

async function getFeed(req, res, next) {
  try {
    const userId = req?.user?.id;

    const posts = await prisma_client.post.findMany({
      where: {
        NOT: {
          authorId: userId,
        },
      },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        author: {
          select: {
            avatarUrl: true,
            firstName: true,
            lastName: true,
          },
        },
        _count: {
          select: {
            comments: true,
            likedBy: true,
          },
        },
        likedBy: {
          select: {
            id: true,
          },
          where: {
            id: userId,
          },
        },
      },
    });

    res.status(200).json(posts);
  } catch (err) {
    next(err);
  }
}

async function $likePost(req, res, next) {
  try {
    const userId = req?.user?.id;
    const { postId } = req.params;
    const post = await prisma_client.post.findFirst({
      where: {
        id: postId,
      },
      select: {
        id: true,
        likedBy: {
          where: {
            id: userId,
          },
          select: {
            id: true,
          },
        },
      },
    });

    if (!post) {
      return res.status(404).json({ message: "Not found" });
    }

    const isLiked = post.likedBy.length > 0;

    if (isLiked) {
      await prisma_client.post.update({
        where: {
          id: postId,
        },
        data: {
          likedBy: {
            disconnect: {
              id: userId,
            },
          },
        },
      });
    } else {
      await prisma_client.post.update({
        where: {
          id: postId,
        },
        data: {
          likedBy: {
            connect: {
              id: userId,
            },
          },
        },
      });
    }

    res.status(200).json({ message: "Succeed" });
  } catch (err) {
    next(err);
  }
}

const likePost = [protectRoute, $likePost];

const postsController = { getFeed, likePost };

export default postsController;
