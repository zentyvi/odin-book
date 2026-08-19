import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import GoogleLogInButton from "../../src/components/GoogleLogInButton";
import { googleLogIn } from "../../src/api/functions/auth";

const mockNavigate = vi.fn();

// Mock react-router useNavigate
vi.mock("react-router", () => ({
  useNavigate: () => mockNavigate,
}));

// Mock API function
vi.mock("../../src/api/functions/auth", () => ({
  googleLogIn: vi.fn(),
}));

// Mock @react-oauth/google component to trigger onSuccess immediately
vi.mock("@react-oauth/google", () => ({
  GoogleLogin: ({ onSuccess }) => (
    <button
      data-testid="mock-google-button"
      onClick={() => onSuccess({ credential: "fake-google-credential" })}
    >
      Google Login
    </button>
  ),
}));

describe("GoogleLogInButton component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call googleLogIn API and navigate to "/" on success', async () => {
    googleLogIn.mockResolvedValue({ token: "fake-jwt-token" });

    render(<GoogleLogInButton />);

    const button = screen.getByTestId("mock-google-button");
    button.click();

    expect(googleLogIn).toHaveBeenCalledWith({
      credential: "fake-google-credential",
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  it("should not navigate if API response does not contain token", async () => {
    googleLogIn.mockResolvedValue({});

    render(<GoogleLogInButton />);

    const button = screen.getByTestId("mock-google-button");
    button.click();

    await waitFor(() => {
      expect(googleLogIn).toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });
});
