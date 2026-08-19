import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router";
import { AuthProvider } from "../../src/contexts/AuthProvider";
import GuestRoute from "../../src/components/GuestRoute";

describe("GuestRoute with AuthProvider", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should redirect to '/' when user is authenticated", () => {
    localStorage.setItem("token", "fake-jwt");
    render(
      <AuthProvider>
        <MemoryRouter initialEntries={["/auth/log-in"]}>
          <Routes>
            <Route element={<GuestRoute />}>
              <Route path="/auth/log-in" element={<div>Login Page</div>} />
            </Route>
            <Route path="/" element={<div>Home Page</div>} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>,
    );

    expect(screen.getByText(/Home Page/i)).toBeInTheDocument();
    expect(screen.queryByText(/Login Page/i)).not.toBeInTheDocument();
  });

  it("shouldn't redirect to '/' when user isn't authenticated", () => {
    render(
      <AuthProvider>
        <MemoryRouter initialEntries={["/auth/log-in"]}>
          <Routes>
            <Route element={<GuestRoute />}>
              <Route path="/auth/log-in" element={<div>Login Page</div>} />
            </Route>
            <Route path="/" element={<div>Home Page</div>} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>,
    );

    expect(screen.getByText(/Login Page/i)).toBeInTheDocument();
    expect(screen.queryByText(/Home Page/i)).not.toBeInTheDocument();
  });
});
