import { validationResult } from "express-validator";
import { prisma_client } from "../../lib/prisma.js";
import { protectRoute } from "../../middlewares/auth.js";
import validateComment from "../../middlewares/validators/validateComment.js";
import validatePost from "../../middlewares/validators/validatePost.js";
import validatePostImage from "../../middlewares/validators/validatePostImage.js";
import cloudinaryPublic from "../../utils/cloudinary.js";

async function getFeed(req, res, next) {
  try {
    const userId = req?.user?.id || "";

    const posts = await prisma_client.post.findMany({
      select: {
        id: true,
        imageUrl: true,
        content: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            avatarUrl: true,
            firstName: true,
            lastName: true,
            username: true,
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

async function getSinglePost(req, res, next) {
  try {
    const userId = req?.user?.id || "";
    const { postId } = req.params;

    const post = await prisma_client.post.findFirst({
      where: {
        id: postId,
      },
      select: {
        id: true,
        imageUrl: true,
        content: true,
        createdAt: true,
        author: {
          select: {
            id: true,
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
        comments: {
          select: {
            id: true,
            content: true,
            author: {
              select: {
                id: true,
                avatarUrl: true,
                firstName: true,
                lastName: true,
                username: true,
              },
            },
            createdAt: true,
            likedBy: {
              where: {
                id: userId,
              },
              select: {
                id: true,
              },
            },
            _count: {
              select: {
                likedBy: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!post) {
      return res.status(404).json({ message: "Not found" });
    }

    res.status(200).json(post);
  } catch (err) {
    next(err);
  }
}

async function $likePost(req, res, next) {
  try {
    const userId = req?.user?.id;
    const { postId } = req.params;

    const post = await prisma_client.post.findUnique({
      where: { id: postId },
      select: {
        id: true,
        likedBy: {
          where: { id: userId },
          select: { id: true },
        },
      },
    });

    if (!post) {
      return res.status(404).json({ message: "Not found" });
    }

    const isCurrentlyLiked = post.likedBy.length > 0;

    const updatedPost = await prisma_client.post.update({
      where: { id: postId },
      data: {
        likedBy: isCurrentlyLiked
          ? { disconnect: { id: userId } }
          : { connect: { id: userId } },
      },
      select: {
        _count: {
          select: { likedBy: true },
        },
      },
    });

    res.status(200).json({
      isLiked: !isCurrentlyLiked,
      likesCount: updatedPost._count.likedBy,
    });
  } catch (err) {
    next(err);
  }
}

const likePost = [protectRoute, $likePost];

async function $newCommentPost(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.mapped() });
    }
    const userId = req?.user?.id;
    const { postId } = req.params;
    const comment = req.body?.comment?.trim();

    const newComment = await prisma_client.comment.create({
      data: {
        content: comment,
        postId: postId,
        authorId: userId,
      },

      select: {
        id: true,
        author: {
          select: {
            id: true,
            avatarUrl: true,
            firstName: true,
            lastName: true,
            username: true,
          },
        },
        createdAt: true,
        likedBy: {
          where: {
            id: userId,
          },
          select: {
            id: true,
          },
        },
        _count: {
          select: {
            likedBy: true,
          },
        },
      },
    });

    if (!newComment) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json(newComment);
  } catch (err) {
    next(err);
  }
}

const newCommentPost = [protectRoute, validateComment, $newCommentPost];

async function $createPost(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.mapped() });
    }

    const userId = req?.user?.id;
    const content = req.body?.content?.trim();

    let imageUrl = null;
    const file = req?.file;
    if (file) {
      const fileString = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
      const cloudinaryResponse = await cloudinaryPublic.uploader.upload(
        fileString,
        {
          resource_type: "image",
        },
      );
      imageUrl = cloudinaryResponse.secure_url;
    }

    const post = await prisma_client.post.create({
      data: {
        content: content ? content : null,
        authorId: userId,
        imageUrl,
      },
      select: {
        id: true,
      },
    });

    res.json(post);
  } catch (err) {
    next(err);
  }
}

const createPost = [protectRoute, validatePost, validatePostImage, $createPost];

async function $deletePost(req, res, next) {
  try {
    const { postId } = req.params;
    const userId = req?.user?.id;

    const post = await prisma_client.post.delete({
      where: {
        id: postId,
        authorId: userId,
      },
      select: {
        imageUrl: true,
      },
    });

    if (!post) {
      return res.status(404).json({ message: "Not found" });
    }

    if (post.imageUrl) {
      const url = post.imageUrl;
      const splittedUrl = url.split("/");
      const lastSegment = splittedUrl[splittedUrl.length - 1];
      const publicId = lastSegment.split(".")[0];

      const cloudinaryResponse =
        await cloudinaryPublic.uploader.destroy(publicId);

      if (cloudinaryResponse.result !== "ok") {
        throw new Error(
          `Cloudinary deletion failed: ${cloudinaryResponse.result}`,
        );
      }
    }

    res.json({ message: "Succeed" });
  } catch (err) {
    next(err);
  }
}

const deletePost = [protectRoute, $deletePost];

const postsController = {
  getFeed,
  getSinglePost,
  likePost,
  newCommentPost,
  createPost,
  deletePost,
};

export default postsController;
