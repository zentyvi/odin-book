import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import { prisma_client } from "../../lib/prisma.js";
import { protectRoute } from "../../middlewares/auth.js";
import { isCloudinaryUrl } from "../../utils/helpers.js";
import validateProfileUpdate from "../../middlewares/validators/validateProfileUpdate.js";
import validateAvatar from "../../middlewares/validators/validateAvatar.js";
import cloudinaryPublic from "../../utils/cloudinary.js";

async function $getMyInfo(req, res, next) {
  try {
    const userId = req.user?.id;
    const user = await prisma_client.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        id: true,
        type: true,
        avatarUrl: true,
        firstName: true,
        lastName: true,
        username: true,
        createdAt: true,
        settings: {
          select: {
            updatedAt: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ message: "Not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
}

const getMyInfo = [protectRoute, $getMyInfo];

async function $getMySettings(req, res, next) {
  try {
    const userId = req?.user?.id;
    const settings = await prisma_client.settings.findFirst({
      where: {
        userId,
      },
    });

    if (!settings) {
      return res.status(404).json({ mesage: "Settings not found" });
    }

    res.json(settings);
  } catch (err) {
    next(err);
  }
}

const getMySettings = [protectRoute, $getMySettings];

async function $getMyFriends(req, res, next) {
  try {
    const userId = req?.user?.id;

    const user = await prisma_client.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        friends: {
          select: {
            id: true,
            avatarUrl: true,
            firstName: true,
            lastName: true,
            username: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.friends);
  } catch (err) {
    next(err);
  }
}

const getMyFriends = [protectRoute, $getMyFriends];

async function $updateMySettings(req, res, next) {
  try {
    const userId = req?.user?.id;
    const { settings } = req.body;

    const existingsSettings = await prisma_client.settings.update({
      where: {
        userId,
      },
      data: {
        ...settings,
      },
      select: {
        id: true,
      },
    });

    if (!existingsSettings) {
      return res.status(404).json({ message: "Settings to update not found" });
    }

    res.json({ message: "Succeed" });
  } catch (err) {
    next(err);
  }
}

const updateMySettings = [protectRoute, $updateMySettings];

async function $updateMyProfile(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: false, errors: errors.mapped() });
    }

    const userId = req.user?.id;
    const { infoToUpdate, passwordConfirm } = req.body;
    const user = await prisma_client.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        type: true,
        password: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (infoToUpdate?.password !== undefined && user?.type === "USERNAME") {
      const passwordMatch = await bcrypt.compare(
        passwordConfirm,
        user.password,
      );
      if (passwordMatch) {
        if (infoToUpdate.password) {
          infoToUpdate.password = await bcrypt.hash(infoToUpdate.password, 10);
        }
        await prisma_client.user.update({
          where: {
            id: userId,
          },
          data: infoToUpdate,
        });
      } else {
        return res.status(400).json({
          errors: { confirmPassword: { msg: "Password is incorrect" } },
        });
      }
    } else if (
      infoToUpdate?.password !== undefined &&
      user?.type !== "USERNAME"
    ) {
      return res.status(400).json({
        message:
          "Failed to update password because another authentication method is in use",
      });
    } else {
      await prisma_client.user.update({
        where: {
          id: userId,
        },
        data: infoToUpdate,
      });
    }

    return res
      .status(200)
      .json({ data: infoToUpdate.password ? {} : infoToUpdate });
  } catch (err) {
    next(err);
  }
}

const updateMyProfile = [protectRoute, validateProfileUpdate, $updateMyProfile];

async function $uploadAvatarPut(req, res, next) {
  try {
    const userId = req.user?.id;
    const file = req.file;
    const fileString = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
    const cloudinaryResponse = await cloudinaryPublic.uploader.upload(
      fileString,
      {
        resource_type: "image",
      },
    );

    const existingUser = await prisma_client.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        avatarUrl: true,
      },
    });

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (isCloudinaryUrl(existingUser?.avatarUrl)) {
      const url = existingUser.avatarUrl;
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

    const user = await prisma_client.user.update({
      where: {
        id: userId,
      },
      data: {
        avatarUrl: cloudinaryResponse.secure_url,
      },
      select: {
        avatarUrl: true,
      },
    });

    return res
      .status(200)
      .json({ message: "Succeed", avatarUrl: user.avatarUrl });
  } catch (err) {
    next(err);
  }
}

const uploadAvatarPut = [protectRoute, validateAvatar, $uploadAvatarPut];

async function $deleteAvatar(req, res, next) {
  try {
    const userId = req.user?.id;

    const existingUser = await prisma_client.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        avatarUrl: true,
      },
    });

    if (!existingUser) {
      return res.status(404).json({ message: "Not found" });
    }

    await prisma_client.user.update({
      where: {
        id: userId,
      },

      data: {
        avatarUrl: null,
      },
    });

    if (isCloudinaryUrl(existingUser?.avatarUrl)) {
      const url = existingUser.avatarUrl;
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

    return res.status(200).json({ message: "Succeed" });
  } catch (err) {
    next(err);
  }
}

const deleteAvatar = [protectRoute, $deleteAvatar];

async function getUserPreview(req, res, next) {
  try {
    const { userId } = req.params;
    const requestAuthorId = req?.user?.id;

    const user = await prisma_client.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        id: true,
        avatarUrl: true,
        firstName: true,
        lastName: true,
        username: true,
        receivedRequests: {
          where: {
            senderId: requestAuthorId,
          },
          select: {
            id: true,
          },
        },
        friends: {
          where: {
            id: requestAuthorId,
          },
          select: {
            id: true,
          },
        },
        _count: {
          select: {
            comments: true,
            posts: true,
            friends: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json(user);
  } catch (err) {
    next(err);
  }
}

async function $deleteMyProfile(req, res, next) {
  try {
    const userId = req?.user?.id;
    const user = await prisma_client.user.delete({
      where: {
        id: userId,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "Not found user to delete" });
    }

    res.json({ message: "Succeed" });
  } catch (err) {
    next(err);
  }
}

const deleteMyProfile = [protectRoute, $deleteMyProfile];

async function getUserProfile(req, res, next) {
  try {
    const requestedUser = req?.params?.userId;
    const currentUser = req?.user;
    const requestAuthorId = currentUser?.id;
    const isMyProfile =
      requestedUser === currentUser?.id ||
      requestedUser === currentUser?.username;

    let user = await prisma_client.user.findFirst({
      where: {
        OR: [{ id: requestedUser }, { username: requestedUser }],
      },
      select: {
        id: true,
        avatarUrl: true,
        firstName: true,
        lastName: true,
        username: true,
        receivedRequests: isMyProfile
          ? {
              where: {
                receiverId: requestAuthorId,
              },
              select: {
                id: true,
                sender: {
                  select: {
                    id: true,
                    avatarUrl: true,
                    firstName: true,
                    lastName: true,
                    username: true,
                  },
                },
              },
            }
          : {
              where: {
                receiver: {
                  OR: [{ id: requestedUser }, { username: requestedUser }],
                  NOT: { id: requestAuthorId },
                },
                senderId: requestAuthorId,
              },
              select: {
                id: true,
              },
            },
        friends: {
          where: {
            id: requestAuthorId,
          },
          select: {
            id: true,
          },
        },
        posts: {
          include: {
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
                id: requestAuthorId,
              },
            },
          },
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                avatarUrl: true,
                firstName: true,
                lastName: true,
                username: true,
              },
            },
            likedBy: {
              where: {
                id: requestAuthorId,
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
        },
        _count: {
          select: {
            friends: true,
            posts: true,
            comments: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json(user);
  } catch (err) {
    next(err);
  }
}

async function $friendRequestPost(req, res, next) {
  try {
    const senderId = req?.user?.id;
    const receiverId = req?.params?.userId;

    if (senderId === receiverId) {
      return res
        .status(400)
        .json({ message: "Cannot send a friend request to yourself" });
    }

    const existingRequest = await prisma_client.friendRequest.findFirst({
      where: {
        senderId,
        receiverId,
      },
      select: {
        id: true,
      },
    });

    if (existingRequest) {
      return res.status(400).json({ message: "Friend request already exists" });
    }

    await prisma_client.friendRequest.create({
      data: {
        senderId,
        receiverId,
      },
    });

    res.json({ message: "Succeed" });
  } catch (err) {
    next(err);
  }
}

const friendRequestPost = [protectRoute, $friendRequestPost];

async function $handleRequestAction(req, res, next) {
  try {
    const userId = req?.user?.id;
    const { requestId } = req.params;
    const { action } = req.body;

    const request = await prisma_client.friendRequest.delete({
      where: {
        id: requestId,
        receiverId: userId,
      },
      select: {
        senderId: true,
      },
    });

    if (!request) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    if (action === "ACCEPT") {
      const reciver = await prisma_client.user.update({
        where: {
          id: userId,
        },
        data: {
          friends: {
            connect: { id: request.senderId },
          },
        },
        select: {
          _count: {
            select: { friends: true },
          },
        },
      });
      const sender = await prisma_client.user.update({
        where: {
          id: request.senderId,
        },
        data: {
          friends: {
            connect: { id: userId },
          },
        },
      });
      return res.json(reciver);
    }

    res.json({ message: "Succeed" });
  } catch (err) {
    next(err);
  }
}

const handleRequestAction = [protectRoute, $handleRequestAction];

async function $deleteFriend(req, res, next) {
  try {
    const userId = req?.user?.id;
    const { friendId } = req.params;

    const existingFriends = await prisma_client.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        friends: {
          where: {
            id: friendId,
          },
          select: {
            id: true,
          },
        },
      },
    });

    if (existingFriends.friends.length === 0) {
      return res.status(404).json({ message: "Friend not found" });
    }

    const user = await prisma_client.user.update({
      where: {
        id: userId,
      },
      data: {
        friends: {
          disconnect: { id: friendId },
        },
      },
      select: {
        friends: {
          where: { id: friendId },
          select: { id: true },
        },
      },
    });

    await prisma_client.user.update({
      where: {
        id: friendId,
      },
      data: {
        friends: {
          disconnect: { id: userId },
        },
      },
    });

    res.json({ message: "Succeed" });
  } catch (err) {
    next(err);
  }
}

const deleteFriend = [protectRoute, $deleteFriend];

const usersController = {
  getMyInfo,
  getMySettings,
  getMyFriends,
  updateMySettings,
  updateMyProfile,
  uploadAvatarPut,
  deleteAvatar,
  deleteMyProfile,
  getUserPreview,
  getUserProfile,
  friendRequestPost,
  handleRequestAction,
  deleteFriend,
};

export default usersController;
