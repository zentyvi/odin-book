// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import LogInForm from "../../src/pages/LogInForm";
import { logIn } from "../../src/api/functions/auth";

const mockLogin = vi.fn();

// Mock Auth Context
vi.mock("../../src/contexts/AuthProvider", () => ({
  useAuth: () => ({
    login: mockLogin,
  }),
}));

// Mock API function
vi.mock("../../src/api/functions/auth", () => ({
  logIn: vi.fn(),
}));

// Mock OAuth buttons
vi.mock("../../src/components/GoogleLogInButton", () => ({
  default: () => <button>Mock Google Button</button>,
}));

vi.mock("../../src/components/GithubLogInButton", () => ({
  default: () => <button>Mock GitHub Button</button>,
}));

describe("LogInForm component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render username, password inputs and submit button", () => {
    render(
      <MemoryRouter>
        <LogInForm />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("heading", { name: /log in/i }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
  });

  it("should submit credentials and trigger context login on success", async () => {
    const user = userEvent.setup();
    logIn.mockResolvedValueOnce({ token: "valid-app-jwt" });

    render(
      <MemoryRouter>
        <LogInForm />
      </MemoryRouter>,
    );

    await user.type(screen.getByLabelText(/username/i), "johndoe");
    await user.type(screen.getByLabelText(/password/i), "password123");

    await user.click(screen.getByRole("button", { name: /submit/i }));

    expect(logIn).toHaveBeenCalledWith({
      username: "johndoe",
      password: "password123",
    });

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("valid-app-jwt", null);
    });
  });

  it("should render validation errors from server response", async () => {
    const user = userEvent.setup();
    logIn.mockResolvedValueOnce({
      errors: {
        username: "User not found",
        password: "Password is invalid",
      },
    });

    render(
      <MemoryRouter>
        <LogInForm />
      </MemoryRouter>,
    );

    await user.type(screen.getByLabelText(/username/i), "wronguser");
    await user.type(screen.getByLabelText(/password/i), "wrongpass");

    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText("User not found")).toBeInTheDocument();
      expect(screen.getByText("Password is invalid")).toBeInTheDocument();
    });

    expect(mockLogin).not.toHaveBeenCalled();
  });

  it("should clear field error when user starts typing again", async () => {
    const user = userEvent.setup();
    logIn.mockResolvedValueOnce({
      errors: {
        username: "User not found",
      },
    });

    render(
      <MemoryRouter>
        <LogInForm />
      </MemoryRouter>,
    );
    const usernameInput = screen.getByLabelText(/username/i);

    await user.type(usernameInput, "wronguser");
    await user.type(screen.getByLabelText(/password/i), "wrongpass"); // idk why but when I remove this line the test fails

    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText("User not found")).toBeInTheDocument();
    });

    await user.type(usernameInput, "a");

    expect(screen.queryByText("User not found")).not.toBeInTheDocument();
  });
});
