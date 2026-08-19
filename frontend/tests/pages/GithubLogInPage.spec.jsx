// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import GithubLogInPage from "../../src/pages/GithubLogInPage";
import { githubLogIn } from "../../src/api/functions/auth";

const mockNavigate = vi.fn();

// Mock react-router hooks
vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

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
    githubLogIn.mockResolvedValueOnce({ success: true });

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
      expect(mockNavigate).toHaveBeenCalledWith("/", { replace: true });
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

    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
