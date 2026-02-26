import { render, screen, fireEvent } from "@testing-library/react";
import HamburgerMenu from "./hamburger-menu";
import { describe, it, expect, vi } from "vitest";
import { SessionProvider } from "@/context/session-context";

// Mock next/navigation for useRouter
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

describe("HamburgerMenu", () => {
  it("renders the menu icon", () => {
    render(
      <SessionProvider>
        <HamburgerMenu />
      </SessionProvider>);
    expect(screen.getByLabelText(/toggle menu/i)).toBeInTheDocument();
  });

  it("toggles menu open/close on click", () => {
    render(
      <SessionProvider>
        <HamburgerMenu />
      </SessionProvider>);
    const button = screen.getByLabelText(/toggle menu/i);
    fireEvent.click(button);

    // Check for dropdown content, e.g. Account or Logout
    expect(screen.queryByText(/account/i)).toBeInTheDocument();
    fireEvent.click(button);
    expect(screen.queryByText(/account/i)).not.toBeInTheDocument();
  });
});