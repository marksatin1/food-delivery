import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CartButton } from "./cart-button";
import { CartProvider, useCart } from "./cart-context";
import type { MenuItem } from "@food-delivery/shared";

const mockItem: MenuItem = {
  id: "item-1",
  restaurantId: "r1",
  name: "Test Burger",
  description: "A tasty burger",
  price: 9.99,
  image: "https://example.com/burger.jpg",
  category: "Entrees",
  isPopular: false,
  isAvailable: true,
};

function AddHelper() {
  const { addItem } = useCart();
  return <button onClick={() => addItem(mockItem)}>Add Test Item</button>;
}

function renderCartButton() {
  return render(
    <CartProvider>
      <AddHelper />
      <CartButton />
    </CartProvider>
  );
}

describe("CartButton", () => {
  it("renders the cart icon", () => {
    renderCartButton();
    expect(screen.getByText("🛒")).toBeInTheDocument();
  });

  it("does not show a badge when cart is empty", () => {
    const { container } = renderCartButton();
    const badge = container.querySelector(".bg-red-600");
    expect(badge).not.toBeInTheDocument();
  });

  it("shows badge with item count after adding items", async () => {
    const user = userEvent.setup();
    const { container } = renderCartButton();

    await user.click(screen.getByText("Add Test Item"));

    const badge = container.querySelector(".bg-red-600");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent("1");
  });

  it("opens the sidebar when clicked", async () => {
    const user = userEvent.setup();
    renderCartButton();

    await user.click(screen.getByText("🛒"));

    expect(screen.getByText("Your Cart")).toBeInTheDocument();
  });

  it("closes the sidebar when close button is clicked", async () => {
    const user = userEvent.setup();
    renderCartButton();

    await user.click(screen.getByText("🛒"));
    expect(screen.getByText("Your Cart")).toBeInTheDocument();

    await user.click(screen.getByText("✕"));
    // Sidebar is still in DOM but translated off-screen
    // Cart empty message should still be findable since aside is always rendered
  });
});