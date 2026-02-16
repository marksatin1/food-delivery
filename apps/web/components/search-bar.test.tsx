import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchBar } from "./search-bar";

// Mock next/navigation
const mockPush = vi.fn();
const mockGet = vi.fn().mockReturnValue(null);

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () => ({ get: mockGet }),
}));

describe("SearchBar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders the search input", () => {
    render(<SearchBar />);
    expect(
      screen.getByPlaceholderText("Search restaurants or cuisines...")
    ).toBeInTheDocument();
  });

  it("initializes with empty value when no search param exists", () => {
    render(<SearchBar />);
    const input = screen.getByPlaceholderText("Search restaurants or cuisines...");
    expect(input).toHaveValue("");
  });

  it("initializes with existing query from search params", () => {
    mockGet.mockReturnValueOnce("pizza");
    render(<SearchBar />);
    const input = screen.getByPlaceholderText("Search restaurants or cuisines...");
    expect(input).toHaveValue("pizza");
  });

  it("updates input value when the user types", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<SearchBar />);
    const input = screen.getByPlaceholderText("Search restaurants or cuisines...");

    await user.type(input, "sushi");
    expect(input).toHaveValue("sushi");
  });

  it("does not navigate before the debounce delay", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<SearchBar />);
    const input = screen.getByPlaceholderText("Search restaurants or cuisines...");

    await user.type(input, "thai");

    // Advance only 200ms — not enough for the 400ms debounce
    vi.advanceTimersByTime(200);

    expect(mockPush).not.toHaveBeenCalled();
  });

  it("navigates to /?q= after the debounce delay", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<SearchBar />);
    const input = screen.getByPlaceholderText("Search restaurants or cuisines...");

    await user.type(input, "thai");

    // Advance past the 400ms debounce
    vi.advanceTimersByTime(450);

    expect(mockPush).toHaveBeenCalledWith("/?q=thai");
  });

  it("navigates to / when input is cleared and a search was active", async () => {
    // Simulate an active search param
    mockGet.mockReturnValue("pizza");
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<SearchBar />);
    const input = screen.getByPlaceholderText("Search restaurants or cuisines...");

    await user.clear(input);
    vi.advanceTimersByTime(450);

    expect(mockPush).toHaveBeenCalledWith("/");
  });

  it("does not navigate when input is cleared and no search was active", async () => {
    // No existing ?q= param
    mockGet.mockReturnValue(null);
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<SearchBar />);
    const input = screen.getByPlaceholderText("Search restaurants or cuisines...");

    // Type something, then clear — but the initial render had no ?q=
    // After clearing, query is "" and searchParams.get('q') is null
    // So neither branch should fire
    await user.type(input, "x");
    vi.advanceTimersByTime(450);
    mockPush.mockClear();

    await user.clear(input);
    vi.advanceTimersByTime(450);

    expect(mockPush).not.toHaveBeenCalled();
  });

  it("only navigates once when multiple characters are typed quickly", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<SearchBar />);
    const input = screen.getByPlaceholderText("Search restaurants or cuisines...");

    await user.type(input, "burger");
    vi.advanceTimersByTime(450);

    // Should only navigate with the final value, not once per keystroke
    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith("/?q=burger");
  });
});