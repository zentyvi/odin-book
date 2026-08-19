// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router";
import { AuthProvider } from "../../src/contexts/AuthProvider";
import ProtectedRoute from "../../src/components/ProtectedRoute";

describe("GuestRoute with AuthProvider", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("shouldn't redirect to '/auth/log-in' when user is authenticated", () => {
    localStorage.setItem("token", "fake-jwt");
    render(
      <AuthProvider>
        <MemoryRouter initialEntries={["/"]}>
          <Routes>
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<div>Home Page</div>} />
            </Route>
            <Route path="/login" element={<div>Login Page</div>} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>,
    );

    expect(screen.getByText(/Home Page/i)).toBeInTheDocument();
    expect(screen.queryByText(/Login Page/i)).not.toBeInTheDocument();
  });

  it("should redirect to '/auth/log-in' when user isn't authenticated", () => {
    render(
      <AuthProvider>
        <MemoryRouter initialEntries={["/"]}>
          <Routes>
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<div>Home Page</div>} />
            </Route>
            <Route path="/auth/log-in" element={<div>Login Page</div>} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>,
    );

    expect(screen.getByText(/Login Page/i)).toBeInTheDocument();
    expect(screen.queryByText(/Home Page/i)).not.toBeInTheDocument();
  });
});
