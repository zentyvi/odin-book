import { body } from "express-validator";

const validateComment = [
  body("comment")
    .trim()
    .notEmpty()
    .withMessage("Comment cannot be blank")
    .isLength({ min: 1, max: 250 })
    .withMessage("Comment must be between 1 and 250 characters"),
];

export default validateComment;
