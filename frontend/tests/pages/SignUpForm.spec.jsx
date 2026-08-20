// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import SignUpForm from "../../src/pages/SignUpForm";
import { signUp } from "../../src/api/functions/auth.js";

const mockLogin = vi.fn();

// Mock Auth context hook
vi.mock("../../src/contexts/AuthProvider.jsx", () => ({
  useAuth: () => ({
    login: mockLogin,
  }),
}));

// Mock API function
vi.mock("../../src/api/functions/auth.js", () => ({
  signUp: vi.fn(),
}));

// Mock OAuth buttons
vi.mock("../../src/components/GoogleLogInButton.jsx", () => ({
  default: () => <button>Mock Google Button</button>,
}));

vi.mock("../../src/components/GithubLogInButton.jsx", () => ({
  default: () => <button>Mock GitHub Button</button>,
}));

describe("SignUpForm component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render all form fields, submit button and social login buttons", () => {
    render(
      <MemoryRouter>
        <SignUpForm />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("heading", { name: /sign up/i }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
    expect(screen.getByText("Mock Google Button")).toBeInTheDocument();
    expect(screen.getByText("Mock GitHub Button")).toBeInTheDocument();
  });

  it("should fill inputs, call signUp API and trigger auth login on successful submit", async () => {
    const user = userEvent.setup();
    signUp.mockResolvedValueOnce({ token: "fake-jwt-token" });

    render(
      <MemoryRouter>
        <SignUpForm />
      </MemoryRouter>,
    );

    // Type into form fields
    await user.type(screen.getByLabelText(/first name/i), "John");
    await user.type(screen.getByLabelText(/last name/i), "Doe");
    await user.type(screen.getByLabelText(/username/i), "johndoe");
    await user.type(screen.getByLabelText(/password/i), "secret123");

    // Click submit
    await user.click(screen.getByRole("button", { name: /submit/i }));

    // Verify API was called with trimmed/formatted data
    expect(signUp).toHaveBeenCalledWith({
      firstName: "John",
      lastName: "Doe",
      username: "johndoe",
      password: "secret123",
    });

    // Verify context login function call
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("fake-jwt-token");
    });
  });

  it("should display server validation errors when signUp returns errors", async () => {
    const user = userEvent.setup();
    signUp.mockResolvedValueOnce({
      errors: {
        username: "Username is already taken",
      },
    });

    render(
      <MemoryRouter>
        <SignUpForm />
      </MemoryRouter>,
    );

    await user.type(screen.getByLabelText(/first name/i), "John");
    await user.type(screen.getByLabelText(/username/i), "existinguser");
    await user.type(screen.getByLabelText(/password/i), "secret123");

    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText("Username is already taken")).toBeInTheDocument();
    });

    expect(mockLogin).not.toHaveBeenCalled();
  });
});
