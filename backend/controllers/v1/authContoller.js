import { validationResult } from "express-validator";
import { OAuth2Client } from "google-auth-library";
import bcrypt from "bcryptjs";
import { prisma_client } from "../../lib/prisma.js";
import { createJWT, makeid } from "../../utils/helpers.js";
import validateSignUp from "../../middlewares/validators/validateSignUp.js";

const google_client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function $signUpPost(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.mapped() });
    }
    const { firstName, lastName, username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma_client.user.create({
      data: {
        type: "USERNAME",
        firstName,
        lastName,
        username,
        password: hashedPassword,
        settings: {
          create: {},
        },
      },
      select: {
        id: true,
        username: true,
      },
    });

    const token = createJWT(user, "7d");

    res.status(201).json({ token });
  } catch (err) {
    next(err);
  }
}

const signUpPost = [validateSignUp, $signUpPost];

async function logInPost(req, res, next) {
  try {
    const { username, password } = req.body;
    const user = await prisma_client.user.findFirst({
      where: {
        username,
      },
      select: {
        id: true,
        username: true,
        password: true,
      },
    });

    if (!user) {
      return res
        .status(400)
        .json({ errors: { username: { msg: "User doesn't exist" } } });
    }

    const passwrodMatch = await bcrypt.compare(password, user.password);
    if (!passwrodMatch) {
      return res
        .status(400)
        .json({ errors: { password: { msg: "Incorrect password" } } });
    }

    const token = createJWT(user, "7d");

    res.status(200).json({ token });
  } catch (err) {
    next(err);
  }
}

async function googleLogInPost(req, res, next) {
  try {
    const { token: googleToken } = req.body;
    if (!googleToken) {
      return res
        .status(400)
        .json({ message: "Authorization google id is required" });
    }

    const ticket = await google_client.verifyIdToken({
      idToken: googleToken,
      audience: process.env["GOOGLE_CLIENT_ID"],
    });
    const payload = ticket.getPayload();
    const { sub: googleId, given_name, family_name, picture } = payload;
    const username = `User-${makeid(10)}`;

    const user = await prisma_client.user.upsert({
      where: {
        googleId,
      },
      update: {},
      create: {
        type: "GOOGLE",
        googleId,
        avatarUrl: picture,
        firstName: given_name,
        lastName: family_name,
        username,
        settings: {
          create: {},
        },
      },
      select: {
        id: true,
        username: true,
      },
    });

    const token = createJWT(user, "7d");

    res.status(201).json({ token });
  } catch (err) {
    next(err);
  }
}

async function githubLogInPost(req, res, next) {
  try {
    const { code } = req.body;
    if (!code) {
      return res
        .status(400)
        .json({ message: "Authorization code is required" });
    }

    const tokenResponse = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
        }),
      },
    );

    const tokenData = await tokenResponse.json();

    const accessToken = tokenData.access_token;

    const userResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "User-Agent": "Node-App",
      },
    });

    const githubUser = await userResponse.json();
    const githubId = String(githubUser.id);

    const nameParts = (githubUser.name || githubUser.login).split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ") || null;

    const user = await prisma_client.user.upsert({
      where: { githubId },
      update: {},
      create: {
        type: "GITHUB",
        githubId,
        firstName,
        lastName,
        username: githubUser.login,
        avatarUrl: githubUser.avatar_url,
        settings: {
          create: {},
        },
      },
      select: {
        id: true,
        username: true,
      },
    });

    const token = createJWT(user, "7d");

    res.status(201).json({ token });
  } catch (err) {
    next(err);
  }
}

const authController = {
  signUpPost,
  logInPost,
  googleLogInPost,
  githubLogInPost,
};

export default authController;
