import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import express from "express";
import { validationResult } from "express-validator";

import { prisma_client } from "../../lib/prisma.js";
import validateSignUp from "../../middlewares/validateSignUp.js";

vi.mock("../../lib/prisma.js", () => ({
  prisma_client: {
    user: {
      findFirst: vi.fn(),
    },
  },
}));

const app = express();
app.use(express.json());

// Helper route that executes validation and returns mapped errors
app.post("/test-validation", validateSignUp, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.mapped() });
  }
  return res.status(200).json({ success: true });
});

describe("validateSignUp middleware", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("firstName validation", () => {
    it("should fail when firstName is blank", async () => {
      const response = await request(app)
        .post("/test-validation")
        .send({ firstName: "   " });

      expect(response.status).toBe(400);
      expect(response.body.errors.firstName.msg).toBe(
        "First name cannot be blank",
      );
    });

    it("should fail when firstName contains numbers or special characters", async () => {
      const response = await request(app)
        .post("/test-validation")
        .send({ firstName: "John123" });

      expect(response.status).toBe(400);
      expect(response.body.errors.firstName.msg).toBe(
        "First name cannot contarin special characters and numbers",
      );
    });

    it("should fail when firstName exceeds 20 characters", async () => {
      const response = await request(app)
        .post("/test-validation")
        .send({ firstName: "A".repeat(21) });

      expect(response.status).toBe(400);
      expect(response.body.errors.firstName.msg).toBe(
        "First name's length cannot exceed 20 characters",
      );
    });
  });

  describe("username validation", () => {
    it("should fail when username contains spaces", async () => {
      const response = await request(app)
        .post("/test-validation")
        .send({ username: "john doe" });

      expect(response.status).toBe(400);
      expect(response.body.errors.username.msg).toBe("Invalid username");
    });

    it("should fail when username is shorter than 3 characters", async () => {
      const response = await request(app)
        .post("/test-validation")
        .send({ username: "ab" });

      expect(response.status).toBe(400);
      expect(response.body.errors.username.msg).toBe(
        "Username must be between 3 and 20 characters",
      );
    });

    it("should fail when username already exists in database", async () => {
      prisma_client.user.findFirst.mockResolvedValue({ id: "existing-id" });

      const response = await request(app)
        .post("/test-validation")
        .send({ username: "existinguser" });

      expect(response.status).toBe(400);
      expect(response.body.errors.username.msg).toBe("User already exists");
      expect(prisma_client.user.findFirst).toHaveBeenCalledWith({
        where: { username: "existinguser" },
      });
    });
  });

  describe("password validation", () => {
    it("should fail when password is shorter than 6 characters", async () => {
      const response = await request(app)
        .post("/test-validation")
        .send({ password: "12345" });

      expect(response.status).toBe(400);
      expect(response.body.errors.password.msg).toBe(
        "Password must contain at least 6 characters",
      );
    });

    it("should fail when password contains spaces", async () => {
      const response = await request(app)
        .post("/test-validation")
        .send({ password: "pass word123" });

      expect(response.status).toBe(400);
      expect(response.body.errors.password.msg).toBe(
        "Password can contain only letters, numbers and symbols without spaces",
      );
    });
  });

  describe("successful validation", () => {
    it("should pass validation with valid required and optional fields", async () => {
      prisma_client.user.findFirst.mockResolvedValue(null);

      const response = await request(app).post("/test-validation").send({
        firstName: "John",
        lastName: "Doe",
        username: "johndoe",
        password: "Password123!",
      });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ success: true });
    });
  });
});
