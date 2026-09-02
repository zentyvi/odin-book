import { body } from "express-validator";

const validatePost = [
  body("content")
    .trim()
    .optional()
    .isLength({ max: 1000 })
    .withMessage("Content cannot exceed 1000 characters"),
];

export default validatePost;
