import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../../lib/prisma.js", () => ({
  prisma_client: {
    user: {
      findFirst: vi.fn(),
    },
  },
}));

import request from "supertest";
import express, { response } from "express";
import { prisma_client } from "../../../lib/prisma.js";
import usersConroller from "../../../controllers/v1/usersController.js";
import { protectRoute } from "../../../middlewares/auth.js";

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  req.user = { id: "id123" };
  next();
});
app.get("/users/me", usersConroller.getMyInfo);
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

describe("GET /users/me controller", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 200 OK and user's info", async () => {
    const expectedObj = {
      username: "user",
      type: "USERNAME",
      id: "id123",
      firstName: "name",
      lastName: null,
      avatarUrl: null,
    };

    prisma_client.user.findFirst.mockResolvedValueOnce(expectedObj);

    const response = await request(app).get("/users/me");

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(expectedObj);
  });

  it("should return 404 Not Found", async () => {
    prisma_client.user.findFirst.mockResolvedValueOnce(null);

    const response = await request(app).get("/users/me");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Not found" });
  });

  it("should forward database errors to error-handling middleware", async () => {
    prisma_client.user.findFirst.mockRejectedValue(
      new Error("Database Connection Failed"),
    );

    const response = await request(app).get("/users/me");

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: "Database Connection Failed" });
  });
});
