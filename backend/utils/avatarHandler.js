import multer from "multer";
import path from "path";

const avatarHandler = multer({
  limits: { fileSize: 3 * 1024 * 1024 }, // 3 mb
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
    ];
    const allowedExtensions = /jpeg|jpg|png|webp|gif/;

    const isMimeValid = allowedMimeTypes.includes(file.mimetype);
    const isExtValid = allowedExtensions.test(
      path.extname(file.originalname).toLowerCase(),
    );

    if (isMimeValid && isExtValid) {
      return cb(null, true);
    }

    cb(new Error("Only (JPEG, PNG, WEBP, GIF) types are allowed"));
  },
}).single("avatar");

export default avatarHandler;
