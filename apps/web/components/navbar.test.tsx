import { render, screen } from "@testing-library/react";
import Navbar from "./navbar";
import { describe, it, expect } from "vitest";
import { SessionProvider } from "@/context/session-context";

describe("Navbar", () => {
  it("renders the brand link", () => {
    render(
      <SessionProvider>
        <Navbar />
      </SessionProvider>);
    expect(screen.getByText("FoodFrenzy")).toBeInTheDocument();
  });

  it("renders login link when not authenticated", () => {
    render(
      <SessionProvider>
        <Navbar />
      </SessionProvider>);
    expect(screen.getByText("Login")).toBeInTheDocument();
  });

  // You can mock session context to test authenticated state and menu
});