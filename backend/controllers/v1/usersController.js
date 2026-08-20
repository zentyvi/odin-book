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

const usersController = { getMyInfo };

export default usersController;
