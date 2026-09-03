import jwt from "jsonwebtoken";

export const isCloudinaryUrl = (url) => {
  const cloudinaryPattern =
    /https?:\/\/(?:res\.cloudinary\.com|([a-z0-9]+)\.cloudinary\.com)/i;
  return cloudinaryPattern.test(url);
};

export function makeid(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export const createJWT = (data, duration = "7d") => {
  const jwtToken = jwt.sign(
    {
      id: data.id,
      username: data.username,
    },
    process.env.SECRET || "supersecretkey12345",
    { expiresIn: duration },
  );
};
