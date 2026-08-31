import { prisma_client } from "../../lib/prisma.js";
import { protectRoute } from "../../middlewares/auth.js";

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
      const user = await prisma_client.user.update({
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
      return res.json(user);
    }

    res.json({ message: "Succeed" });
  } catch (err) {
    next(err);
  }
}

const handleRequestAction = [protectRoute, $handleRequestAction];

const usersController = {
  getMyInfo,
  getUserPreview,
  friendRequestPost,
  getUserProfile,
  handleRequestAction,
};

export default usersController;
