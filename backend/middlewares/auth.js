import jwt from "jsonwebtoken";

function authorizeUser(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.SECRET || "supersecretkey12345",
    );
    req.user = decoded;
  } catch (err) {
    req.user = null;
  }

  next();
}

function protectRoute(req, res, next) {
  const user = req.user;
  if (!user) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }

  next();
}

export { authorizeUser, protectRoute };
