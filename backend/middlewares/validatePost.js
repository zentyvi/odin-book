import { body } from "express-validator";

const validatePost = [
  body("content")
    .trim()
    .notEmpty()
    .withMessage("Content cannot be blank")
    .isLength({ max: 1000 })
    .withMessage("Content cannot exceed 1000 characters"),
];

export default validatePost;
