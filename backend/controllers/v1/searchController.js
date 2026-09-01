import { prisma_client } from "../../lib/prisma.js";

async function searchUsers(req, res, next) {
  try {
    const { query } = req.query;
    const userId = req?.user?.id;
    const results = await prisma_client.user.findMany({
      where: {
        NOT: {
          id: userId,
        },
        OR: [
          {
            firstName: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            lastName: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            username: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            id: {
              contains: query,
              mode: "insensitive",
            },
          },
        ],
      },
      select: {
        id: true,
        avatarUrl: true,
        firstName: true,
        lastName: true,
        username: true,
      },
    });
    return res.status(200).json(results);
  } catch (err) {
    next(err);
  }
}

const searchController = {
  searchUsers,
};

export default searchController;
