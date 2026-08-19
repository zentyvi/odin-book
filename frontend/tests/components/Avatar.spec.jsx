// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import Avatar from "../../src/components/Avatar";

describe("Avatar component", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should render fallback when user object is not provided", () => {
    render(<Avatar user={null} />);

    expect(screen.getByLabelText("Unknown user")).toBeInTheDocument();
    expect(screen.getByText("?")).toBeInTheDocument();
  });

  it("should render image when user has avatarUrl", () => {
    const mockUser = {
      firstName: "John",
      avatarUrl: "https://example.com/avatar.jpg",
    };

    render(<Avatar user={mockUser} />);

    const image = screen.getByRole("img");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "https://example.com/avatar.jpg");
    expect(image).toHaveAttribute("alt", "John's avatar");
  });

  it("should render custom alt text when alt prop is provided", () => {
    const mockUser = {
      firstName: "John",
      avatarUrl: "https://example.com/avatar.jpg",
    };

    render(<Avatar user={mockUser} alt="Custom Alt Text" />);

    expect(screen.getByAltText("Custom Alt Text")).toBeInTheDocument();
  });

  it("should render initial letter and gradient attribute when avatarUrl is missing", () => {
    const mockUser = {
      firstName: "alice",
      avatarUrl: null,
    };

    render(<Avatar user={mockUser} />);

    expect(screen.getByText("A")).toBeInTheDocument();

    const placeholder = screen.getByLabelText("No custom avatar uploaded");
    expect(placeholder).toHaveAttribute("data-gradient-id");
  });

  it("should render online status dot when user was active less than 3.5 minutes ago", () => {
    const now = new Date("2026-08-19T12:00:00Z");
    vi.setSystemTime(now);

    const mockUser = {
      firstName: "John",
      lastSeen: new Date(now.getTime() - 2 * 60 * 1000).toISOString(), // 2 minutes ago
    };

    render(<Avatar user={mockUser} showStatus={true} />);

    const statusDot = screen.getByTitle("Online");
    expect(statusDot).toBeInTheDocument();
  });

  it("should render offline status dot when user was active more than 3.5 minutes ago", () => {
    const now = new Date("2026-08-19T12:00:00Z");
    vi.setSystemTime(now);

    const mockUser = {
      firstName: "John",
      lastSeen: new Date(now.getTime() - 4 * 60 * 1000).toISOString(), // 4 minutes ago
    };

    render(<Avatar user={mockUser} showStatus={true} />);

    const statusDot = screen.getByTitle("Offline");
    expect(statusDot).toBeInTheDocument();
  });
});
