import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CartSidebar } from "./cart-sidebar";
import { CartProvider, useCart } from "./cart-context";
import { toast } from "sonner";
import type { MenuItem } from "@food-delivery/shared";

const mockPizza: MenuItem = {
  id: "pizza-1",
  restaurantId: "r1",
  name: "Margherita Pizza",
  description: "Classic pizza",
  price: 12.99,
  image: "https://example.com/pizza.jpg",
  category: "Entrees",
  isPopular: true,
  isAvailable: true,
};

// Mock Sonner (toast library)
vi.mock('sonner', () => ({
  toast: Object.assign(vi.fn(), {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
    loading: vi.fn(),
    dismiss: vi.fn(),
  }),
}));

// Mock useRouter
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

const toastMock: any = toast;

// Helper: render sidebar with items already in the cart
function renderSidebar(isOpen: boolean, onClose = vi.fn()) {
  // We'll add items by rendering a button that adds them
  function Wrapper() {
    return (
      <CartProvider>
        <AddItemHelper />
        <CartSidebar isOpen={isOpen} onClose={onClose} />
      </CartProvider>
    );
  }

  return { ...render(<Wrapper />), onClose };
}

// Helper to add items to cart from within the provider
function AddItemHelper() {
  const { addItem } = useCart();
  return <button onClick={() => addItem(mockPizza)}>Test Add</button>;
}

describe("CartSidebar", () => {
  it("shows toast and removes item when decreasing quantity to 0", async () => {
    const user = userEvent.setup();
    renderSidebar(true);

    await user.click(screen.getByText("Test Add"));
    expect(screen.getByText("Margherita Pizza")).toBeInTheDocument();

    // Click the minus button to decrease quantity to 0 (should trigger toast)
    await user.click(screen.getByText("−"));

    // Simulate toast action confirmation
    const lastCall = toastMock.mock.calls[toastMock.mock.calls.length - 1];
    const toastOptions = lastCall[1];
    toastOptions.action.onClick();

    expect(toastMock.success).toHaveBeenCalledWith("Margherita Pizza removed from cart!");
  });

  it("shows toast confirmation when clearing cart", async () => {
    const user = userEvent.setup();
    renderSidebar(true);

    await user.click(screen.getByText("Test Add"));
    expect(screen.getByText("Margherita Pizza")).toBeInTheDocument();

    await user.click(screen.getByText("Clear Cart"));

    // The toast should be called with the confirmation dialog
    const lastCall = toastMock.mock.calls[toastMock.mock.calls.length - 1];
    expect(lastCall[0]).toBe("Are you sure you want to clear your cart?");
    expect(lastCall[1].action.label).toBe("Yes, clear cart");
  });

  it("shows 'Your cart is empty' when cart has no items", () => {
    if (global.localStorage?.clear) global.localStorage.clear();
    
    renderSidebar(true);
    expect(screen.getByText("Your cart is empty")).toBeInTheDocument();
  });

  it("displays the cart title", () => {
    renderSidebar(true);
    expect(screen.getByText("Your Cart")).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderSidebar(true, onClose);

    await user.click(screen.getByText("✕"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when backdrop is clicked", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const { container } = renderSidebar(true, onClose);

    // The backdrop is the div with bg-black/50
    const backdrop = container.querySelector(".bg-black\\/50");
    if (backdrop) {
      await user.click(backdrop);
      expect(onClose).toHaveBeenCalledTimes(1);
    }
  });

  it("does not render backdrop when closed", () => {
    const { container } = renderSidebar(false);
    const backdrop = container.querySelector(".bg-black\\/50");
    expect(backdrop).not.toBeInTheDocument();
  });

  it("shows item details after adding an item", async () => {
    const user = userEvent.setup();
    renderSidebar(true);

    await user.click(screen.getByText("Test Add"));

    expect(screen.getByText("Margherita Pizza")).toBeInTheDocument();
    expect(screen.getAllByText("$12.99").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Subtotal")).toBeInTheDocument();
  });

  it("shows checkout button with subtotal after adding items", async () => {
    const user = userEvent.setup();
    renderSidebar(true);

    await user.click(screen.getByText("Test Add"));

    expect(screen.getByText(/Checkout/)).toBeInTheDocument();
  });

  it("clears cart when Clear Cart is clicked", async () => {
    const user = userEvent.setup();
    renderSidebar(true);

    await user.click(screen.getByText("Test Add"));
    expect(screen.getByText("Margherita Pizza")).toBeInTheDocument();

    await user.click(screen.getByText("Clear Cart"));

    const lastCall = toastMock.mock.calls[toastMock.mock.calls.length - 1];
    const toastOptions = lastCall[1];
    toastOptions.action.onClick();

    // Assert that toast.success was called with the correct message
    expect(toastMock.success).toHaveBeenCalledWith("Cart cleared!");
  });

  it("removes item when Remove is clicked", async () => {
    const user = userEvent.setup();
    renderSidebar(true);

    await user.click(screen.getByText("Test Add"));
    expect(screen.getByText("Margherita Pizza")).toBeInTheDocument();

    await user.click(screen.getByText("Remove"));

    // Always use the toastMock type assertion
    const lastCall = toastMock.mock.calls[toastMock.mock.calls.length - 1];
    const toastOptions = lastCall[1];
    toastOptions.action.onClick();

    // Assert that toast.success was called with the correct message
    expect(toastMock.success).toHaveBeenCalledWith("Margherita Pizza removed from cart!");
  });
});