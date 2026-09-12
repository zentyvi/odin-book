import postImageHandler from "../../utils/postImageHandler.js";

async function validatePostImage(req, res, next) {
  const errors = {};

  // Execute multer manually to intercept its errors directly
  postImageHandler(req, res, (err) => {
    // Check if multer or fileFilter threw an error
    if (err) {
      let errorMessage = err.message;

      // Handle the specific built-in multer size limit error
      if (err.code === "LIMIT_FILE_SIZE") {
        errorMessage = "File size cannot exceed 3mb";
      }

      errors.postImage = { msg: errorMessage };
      return res.status(400).json({ errors });
    }

    // If file processing completed successfully with zero errors, move forward
    next();
  });
}

export default validatePostImage;
