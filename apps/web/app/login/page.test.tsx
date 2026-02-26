import { render, screen, fireEvent } from "@testing-library/react";
import LoginPage from "./page";
import { SessionContext } from "@/context/session-context";
import { ReactNode } from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";

// Mock login function
const mockLogin = vi.fn();

function renderWithSession(children: ReactNode) {
  return render(
    <SessionContext.Provider value={{
      user: null,
      loading: false,
      login: mockLogin,
      logout: vi.fn(),
    }}>
      {children}
    </SessionContext.Provider>
  );
}

describe("LoginPage", () => {
  beforeEach(() => {
    mockLogin.mockClear();
  });

  it("renders email and password fields", () => {
    renderWithSession(<LoginPage />);
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
  });

  it("calls login on form submit", () => {
    renderWithSession(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: "password" } });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));
    expect(mockLogin).toHaveBeenCalledWith("test@example.com", "password");
  });

  it("displays an error message when login fails", async () => {
    mockLogin.mockRejectedValueOnce(new Error("Invalid credentials"));
    renderWithSession(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: "fail@example.com" } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: "wrong" } });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    // Wait for error message to appear
    expect(await screen.findByText(/login unsuccessful/i)).toBeInTheDocument();
  });

  it("displays a success message on successful login", async () => {
    mockLogin.mockResolvedValueOnce(undefined);
    renderWithSession(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: "password" } });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    // Wait for success message to appear
    expect(await screen.findByText(/login successful/i)).toBeInTheDocument();
  });
});