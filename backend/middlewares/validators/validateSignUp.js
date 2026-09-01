import { body } from "express-validator";
import { prisma_client } from "../../lib/prisma.js";

const validateSignUp = [
  body("firstName")
    .trim()
    .notEmpty()
    .withMessage("First name cannot be blank")
    .matches(/^[A-ZА-ЯЁ]+$/i)
    .withMessage("First name cannot contarin special characters and numbers")
    .isLength({ max: 20 })
    .withMessage("First name's length cannot exceed 20 characters"),

  body("lastName")
    .optional({ nullable: true })
    .trim()
    .notEmpty()
    .withMessage("Last name cannot be blank")
    .matches(/^[A-ZА-ЯЁ]+$/i)
    .withMessage("Last name cannot contarin special characters and numbers")
    .isLength({ max: 20 })
    .withMessage("Last name's length cannot exceed 20 characters"),

  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username cannot be blank")
    .isAlphanumeric()
    .withMessage("Invalid username")
    .isLength({ max: 20, min: 3 })
    .withMessage("Username must be between 3 and 20 characters")
    .not()
    .contains(" ")
    .withMessage("Usernmae cannot contain spaces")
    .custom(async (value) => {
      const user = await prisma_client.user.findFirst({
        where: {
          username: value,
        },
      });

      if (user) {
        throw new Error("User already exists");
      }

      return true;
    }),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password cannot be blank")
    .matches(/^[A-Za-z0-9!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]+$/)
    .withMessage(
      "Password can contain only letters, numbers and symbols without spaces",
    )
    .isLength({ min: 6 })
    .withMessage("Password must contain at least 6 characters"),
];

export default validateSignUp;
