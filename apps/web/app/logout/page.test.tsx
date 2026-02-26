import { render, screen } from "@testing-library/react";
import LogoutPage from "./page";
import { describe, it, expect } from "vitest";

describe("LogoutPage", () => {
  it("renders logout message", () => {
    render(<LogoutPage />);
    expect(screen.getByText(/successfully logged out/i)).toBeInTheDocument();
  });

  it("renders the image", () => {
    const { container } = render(<LogoutPage />);
    const img = container.querySelector("img");
    expect(img).toBeTruthy();
  });
});