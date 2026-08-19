// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  signUp,
  logIn,
  googleLogIn,
  githubLogIn,
} from "../../src/api/functions/auth.js";
import { api_url } from "../../src/api/config.js";

describe("Auth API functions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    global.fetch = vi.fn();
  });

  describe("signUp", () => {
    it("should send POST request and save token on success", async () => {
      const mockResponse = { token: "jwt-signup-token" };
      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse,
      });

      const userData = { username: "john", password: "password123" };
      const result = await signUp(userData);

      expect(global.fetch).toHaveBeenCalledWith(`${api_url}/auth/sign-up`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(userData),
      });

      expect(localStorage.getItem("token")).toBe("jwt-signup-token");
      expect(result).toEqual(mockResponse);
    });

    it("should throw an error if response status is 500", async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(signUp({ username: "john" })).rejects.toThrow(
        "Sign up failed",
      );
      expect(localStorage.getItem("token")).toBeNull();
    });
  });

  describe("logIn", () => {
    it("should send POST request, save token on success and return user data", async () => {
      const mockResponse = {
        token: "jwt-login-token",
        user: { id: "1", username: "john" },
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse,
      });

      const credentials = { username: "john", password: "password123" };
      const result = await logIn(credentials);

      expect(global.fetch).toHaveBeenCalledWith(`${api_url}/auth/log-in`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(credentials),
      });

      expect(localStorage.getItem("token")).toBe("jwt-login-token");
      expect(result).toEqual(mockResponse);
    });

    it("should return errors and NOT save token if credentials are invalid (status 400)", async () => {
      const mockResponse = { errors: [{ msg: "Invalid credentials" }] };

      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => mockResponse,
      });

      const result = await logIn({
        username: "john",
        password: "wrongpassword",
      });

      expect(localStorage.getItem("token")).toBeNull();
      expect(result).toEqual(mockResponse);
    });

    it("should throw error if server returns status 500", async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(
        logIn({ username: "john", password: "password123" }),
      ).rejects.toThrow("Log in failed");
      expect(localStorage.getItem("token")).toBeNull();
    });
  });

  describe("googleLogIn", () => {
    it("should send credential token and save returned app token", async () => {
      const mockResponse = { token: "google-app-jwt" };
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const credentialResponse = { credential: "google-id-token-123" };
      const result = await googleLogIn(credentialResponse);

      expect(global.fetch).toHaveBeenCalledWith(
        `${api_url}/auth/log-in/google`,
        {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({ token: "google-id-token-123" }),
        },
      );

      expect(localStorage.getItem("token")).toBe("google-app-jwt");
      expect(result).toEqual(mockResponse);
    });
  });

  describe("githubLogIn", () => {
    it("should send code and save returned app token", async () => {
      const mockResponse = { token: "github-app-jwt" };
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await githubLogIn("github-code-123");

      expect(global.fetch).toHaveBeenCalledWith(
        `${api_url}/auth/log-in/github`,
        {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({ code: "github-code-123" }),
        },
      );

      expect(localStorage.getItem("token")).toBe("github-app-jwt");
      expect(result).toEqual(mockResponse);
    });
  });
});
