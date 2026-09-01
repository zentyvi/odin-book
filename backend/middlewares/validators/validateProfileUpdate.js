import { body } from "express-validator";
import { prisma_client } from "../../lib/prisma.js";

const validateProfileUpdate = [
  body("infoToUpdate.name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Name cannot be blank")
    .matches(/^[A-ZА-ЯЁ]+$/i)
    .withMessage("Name cannot contarin special characters and numbers")
    .isLength({ max: 20 })
    .withMessage("Name's length cannot exceed 20 characters"),

  body("infoToUpdate.lastName")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Last name cannot be blank")
    .matches(/^[A-ZА-ЯЁ]+$/i)
    .withMessage("Last name cannot contarin special characters and numbers")
    .isLength({ max: 20 })
    .withMessage("Last name's length cannot exceed 20 characters"),

  body("infoToUpdate.username")
    .optional()
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
      const user = await prisma_client.user.findUnique({
        where: {
          username: value,
        },
      });

      if (user) {
        throw new Error("User already exists");
      }

      return true;
    }),
  body("infoToUpdate.password")
    .optional()
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

export default validateProfileUpdate;
