import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import GithubLogInButton from "../../src/components/GithubLogInButton";

describe("GithubLogInButton component", () => {
  const originalLocation = window.location;

  beforeEach(() => {
    // Mock window.location to capture redirect changes
    delete window.location;
    window.location = {
      ...originalLocation,
      origin: "http://localhost:3000",
      href: "",
    };

    // Set mock environment variable for Vitest
    vi.stubEnv("VITE_GITHUB_CLIENT_ID", "test-client-id");
  });

  afterEach(() => {
    window.location = originalLocation;
    vi.unstubAllEnvs();
  });

  it("should render the button with correct accessibility label and icon", () => {
    render(<GithubLogInButton />);

    const button = screen.getByRole("button", { name: "Log in via Github" });
    const image = screen.getByAltText("Github logo");

    expect(button).toBeInTheDocument();
    expect(image).toBeInTheDocument();
  });

  it("should redirect user to GitHub OAuth URL on button click", async () => {
    const user = userEvent.setup();
    render(<GithubLogInButton />);

    const button = screen.getByRole("button", { name: "Log in via Github" });
    await user.click(button);

    const expectedRedirectUri = encodeURIComponent(
      "http://localhost:3000/auth/github",
    );
    const expectedUrl = `https://github.com/login/oauth/authorize?client_id=test-client-id&redirect_uri=${expectedRedirectUri}&scope=read:user user:email`;

    expect(window.location.href).toBe(expectedUrl);
  });
});
