import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../../lib/prisma.js", () => ({
  prisma_client: {
    user: {
      create: vi.fn(),
      findFirst: vi.fn(),
      upsert: vi.fn(),
    },
  },
}));

vi.mock("bcryptjs", () => {
  const mockHash = vi.fn().mockResolvedValue("hashed-password");
  const mockCompare = vi.fn().mockResolvedValue(true);

  return {
    default: {
      hash: mockHash,
      compare: mockCompare,
    },
    hash: mockHash,
    compare: mockCompare,
  };
});

vi.mock("google-auth-library", () => {
  const mockVerifyIdToken = vi.fn().mockResolvedValue({
    getPayload: () => ({
      email: "googleuser@example.com",
      given_name: "John",
      family_name: "Doe",
      sub: "google-uid-12345",
    }),
  });

  return {
    OAuth2Client: vi.fn().mockImplementation(function () {
      return {
        verifyIdToken: mockVerifyIdToken,
      };
    }),
  };
});

import request from "supertest";
import express, { response } from "express";
import { OAuth2Client } from "google-auth-library";
import bcrypt, { hash } from "bcryptjs";
import { prisma_client } from "../../../lib/prisma.js";
import authContoller from "../../../controllers/v1/authContoller.js";

const app = express();
app.use(express.json());
app.post("/sign-up", authContoller.signUpPost);
app.post("/log-in", authContoller.logInPost);
app.post("/log-in/google", authContoller.googleLogInPost);
app.post("/log-in/github", authContoller.githubLogInPost);

app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

describe("POST /sign-up controller", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 400 Bad Request when validation fails", async () => {
    const response = await request(app).post("/sign-up").send({
      firstName: "",
      lastName: "",
      username: "invalid",
      password: "123",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(prisma_client.user.create).not.toHaveBeenCalled();
  });

  it("should return 201 Created and JWT token on valid input", async () => {
    prisma_client.user.findFirst.mockResolvedValue(null);
    prisma_client.user.create.mockResolvedValue({
      id: "user-123",
      firstName: "John",
      lastName: "Doe",
      username: "johndoe",
    });

    const validPayload = {
      firstName: "John",
      lastName: "Doe",
      username: "johndoe",
      password: "password123",
    };

    const response = await request(app).post("/sign-up").send(validPayload);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("token");
    expect(prisma_client.user.create).toHaveBeenCalledWith({
      data: {
        firstName: validPayload.firstName,
        lastName: validPayload.lastName,
        username: validPayload.username,
        password: "hashed-password", // This will now perfectly match!
      },
      select: {
        id: true,
        username: true,
      },
    });
  });

  it("should forward database errors to error-handling middleware", async () => {
    prisma_client.user.findFirst.mockResolvedValue(null);
    prisma_client.user.create.mockRejectedValue(
      new Error("Database Connection Failed"),
    );

    const validPayload = {
      firstName: "John",
      lastName: "Doe",
      username: "p423223",
      password: "StrongPassword123!",
    };

    const response = await request(app).post("/sign-up").send(validPayload);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: "Database Connection Failed" });
  });
});

describe("POST /log-in controller", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 400 Bad Request when requested username doesn't exist", async () => {
    prisma_client.user.findFirst.mockResolvedValue(null);

    const response = await request(app).post("/log-in").send({
      username: "nonexistent",
      password: "password123",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toHaveProperty("username");
  });

  it("should return 400 Bad Request when passwords don't match", async () => {
    // Force the mock password matching to fail for this test
    vi.mocked(bcrypt.compare).mockResolvedValueOnce(false);

    prisma_client.user.findFirst.mockResolvedValue({
      id: "user-123",
      username: "pepe",
      password: "password123",
    });

    const response = await request(app).post("/log-in").send({
      username: "pepe",
      password: "wrongpassword",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toHaveProperty("password");
  });

  it("should return 200 OK and JWT token on valid credentials", async () => {
    prisma_client.user.findFirst.mockResolvedValue({
      id: "user-123",
      firstName: "pepe",
      lastName: null,
      username: "pepe",
      password: "password123",
    });

    const response = await request(app).post("/log-in").send({
      username: "pepe",
      password: "password123",
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
  });

  it("should forward database errors to error-handling middleware", async () => {
    prisma_client.user.findFirst.mockRejectedValue(
      new Error("Database Connection Failed"),
    );

    const response = await request(app).post("/log-in").send({
      username: "pepe",
      password: "password123",
    });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: "Database Connection Failed" });
  });
});

describe("POST /log-in/google controller", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Should return 400 Bad Request if a google token hasn't been provided", async () => {
    const response = await request(app).post("/log-in/google").send({});

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: expect.any(String) });
  });

  it("Should return 201 Created and JWT token on valid input", async () => {
    prisma_client.user.upsert.mockResolvedValue({
      id: "id-123",
      username: "pepe",
    });

    const response = await request(app)
      .post("/log-in/google")
      .send({ token: "123" });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("token");
  });

  it("Should forward database errors to error-handling middleware", async () => {
    prisma_client.user.upsert.mockRejectedValue(
      new Error("Database Connection Failed"),
    );

    const response = await request(app)
      .post("/log-in/google")
      .send({ token: "123" });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: "Database Connection Failed",
    });
  });
});

describe("POST /log-in/github controller", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Should return 400 Bad Request if a code hasn't been provided", async () => {
    const response = await request(app).post("/log-in/github").send({});

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: expect.any(String) });
  });

  it("Should return 201 Created and JWT token on valid input", async () => {
    const mockResponse = { login: "pepe", avatar_url: "url", id: "id123" };
    prisma_client.user.upsert.mockResolvedValueOnce({
      id: "123id",
      username: "username",
    });

    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockResponse,
    });

    const response = await request(app)
      .post("/log-in/github")
      .send({ code: "123code" });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("token");
  });

  it("Should forward database errors to error-handling middleware", async () => {
    const mockResponse = { login: "pepe", avatar_url: "url", id: "id123" };
    prisma_client.user.upsert.mockRejectedValue(
      new Error("Database Connection Failed"),
    );

    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockResponse,
    });

    const response = await request(app)
      .post("/log-in/github")
      .send({ code: "123code" });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: "Database Connection Failed",
    });
  });
});
