import handleAvatar from "../utilis/handleAvatar.js";

async function validateAvatar(req, res, next) {
  const errors = {};

  // Execute multer manually to intercept its errors directly
  handleAvatar(req, res, (err) => {
    // Check if multer or fileFilter threw an error
    if (err) {
      let errorMessage = err.message;

      // Handle the specific built-in multer size limit error
      if (err.code === "LIMIT_FILE_SIZE") {
        errorMessage = "File size cannot exceed 3mb";
      }

      errors.avatar = { msg: errorMessage };
      return res.status(400).json({ errors });
    }

    // Check if the file wasn't uploaded at all
    if (!req.file) {
      errors.avatar = { msg: "No file has been provided" };
      return res.status(400).json({ errors });
    }

    // If file processing completed successfully with zero errors, move forward
    next();
  });
}

export default validateAvatar;
