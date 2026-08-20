// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import GithubLogInPage from "../../src/pages/GithubLogInPage";
import { githubLogIn } from "../../src/api/functions/auth";

const mockLogin = vi.fn();

// Mock Auth context hook
vi.mock("../../src/contexts/AuthProvider.jsx", () => ({
  useAuth: () => ({
    login: mockLogin,
  }),
}));

// Mock API function
vi.mock("../../src/api/functions/auth", () => ({
  githubLogIn: vi.fn(),
}));

// Mock Loader component for easy querying
vi.mock("../../src/components/Loader", () => ({
  default: () => <div data-testid="loader">Loading...</div>,
}));

describe("GithubLogInPage component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should show error screen immediately if code query parameter is missing", () => {
    render(
      <MemoryRouter initialEntries={["/auth/github"]}>
        <GithubLogInPage />
      </MemoryRouter>,
    );

    expect(screen.queryByTestId("loader")).not.toBeInTheDocument();
    expect(screen.getByText("Error has occured")).toBeInTheDocument();
    expect(githubLogIn).not.toHaveBeenCalled();
  });

  it('should show loader, call githubLogIn, and navigate to "/" on success', async () => {
    githubLogIn.mockResolvedValueOnce({ token: "token" });

    render(
      <MemoryRouter initialEntries={["/auth/github?code=valid-github-code"]}>
        <GithubLogInPage />
      </MemoryRouter>,
    );

    // Should initially show loader
    expect(screen.getByTestId("loader")).toBeInTheDocument();

    // Verify API call
    expect(githubLogIn).toHaveBeenCalledWith("valid-github-code");

    // Verify navigation
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith(expect.any(String));
    });
  });

  it("should hide loader and show error screen when githubLogIn fails", async () => {
    githubLogIn.mockRejectedValueOnce(new Error("Invalid code"));

    render(
      <MemoryRouter initialEntries={["/auth/github?code=invalid-code"]}>
        <GithubLogInPage />
      </MemoryRouter>,
    );

    expect(screen.getByTestId("loader")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByTestId("loader")).not.toBeInTheDocument();
      expect(screen.getByText("Error has occured")).toBeInTheDocument();
    });

    expect(mockLogin).not.toHaveBeenCalled();
  });
});
