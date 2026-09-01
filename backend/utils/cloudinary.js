import * as cloudinary from "cloudinary";

const cloudinaryPublic = cloudinary.v2;

cloudinaryPublic.config({
  cloud_name: process.env.CLOUDINARY_NAME_PUBLIC,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

export default cloudinaryPublic;
