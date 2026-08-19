import jwt from "jsonwebtoken";

function authorizeUser(req, res, next) {
  try {
    const header = req.headers["authorization"] || "";
    const token = header.split(" ")[1];

    if (token) {
      const decodedPayload = jwt.verify(
        token,
        process.env.SECRET || "supersecretkey12345",
      );
      req.user = decodedPayload;
    }

    next();
  } catch (err) {
    next(err);
  }
}

function protectRoute(req, res, next) {
  const user = req.user;
  if (!user) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }

  next();
}

export { authorizeUser, protectRoute };
