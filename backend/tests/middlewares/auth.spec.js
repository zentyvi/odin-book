import request from "supertest";
import express from "express";
import jwt from "jsonwebtoken";
import { describe, beforeEach, it, expect } from "vitest";
import { authorizeUser, protectRoute } from "../../middlewares/auth.js";

const SECRET = process.env.SECRET || "supersecretkey12345";

describe("Middleware Integration Tests with Supertest", () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());

    app.use(authorizeUser);

    app.get("/public", (req, res) => {
      res.status(200).json({ user: req.user || null });
    });

    app.get("/protected", protectRoute, (req, res) => {
      res.status(200).json({ message: "Success", user: req.user });
    });

    app.use((err, req, res, next) => {
      res.status(500).json({ error: err.message });
    });
  });

  describe("authorizeUser Middleware", () => {
    it("should allow public access and leave user as null when no token is present", async () => {
      const response = await request(app).get("/public");

      expect(response.status).toBe(200);
      expect(response.body.user).toBeNull();
    });

    it("should decode a valid token and append user payload to the request", async () => {
      const payload = { id: 1, name: "Alice" };
      const validToken = jwt.sign(payload, SECRET);

      const response = await request(app)
        .get("/public")
        .set("Authorization", `Bearer ${validToken}`);

      expect(response.status).toBe(200);
      expect(response.body.user).toMatchObject(payload);
    });
  });

  describe("protectRoute Middleware", () => {
    it("should deny access with a 403 status if no token is sent", async () => {
      const response = await request(app).get("/protected");

      expect(response.status).toBe(403);
      expect(response.body).toEqual({ message: "Invalid or expired token" });
    });

    it("should allow access to a protected route when a valid token is provided", async () => {
      const payload = { id: 2, name: "Bob" };
      const validToken = jwt.sign(payload, SECRET);

      const response = await request(app)
        .get("/protected")
        .set("Authorization", `Bearer ${validToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Success");
      expect(response.body.user).toMatchObject(payload);
    });
  });
});
