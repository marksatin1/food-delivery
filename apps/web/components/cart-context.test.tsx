import { describe, it, expect, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CartProvider, useCart } from "./cart-context";
import type { MenuItem } from "@food-delivery/shared";

const pizza: MenuItem = {
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

const burger: MenuItem = {
  id: "burger-1",
  restaurantId: "r1",
  name: "Cheeseburger",
  description: "Juicy beef burger",
  price: 9.99,
  image: "https://example.com/burger.jpg",
  category: "Entrees",
  isPopular: false,
  isAvailable: true,
};

const salad: MenuItem = {
  id: "salad-1",
  restaurantId: "r2",
  name: "Salad",
  description: "Caesar salad",
  price: 11.99,
  image: "https://example.com/salad.jpg",
  category: "Appetizers",
  isPopular: false,
  isAvailable: true,
};

// Helper component that exposes cart actions as buttons
function CartConsumer() {
  const { items, addItem, removeItem, updateQuantity, clearCart, replaceCart, totalItems, subtotal } = useCart();

  return (
    <div>
      <p data-testid="total-items">{totalItems}</p>
      <p data-testid="subtotal">{subtotal.toFixed(2)}</p>
      <p data-testid="item-count">{items.length}</p>

      <button onClick={() => addItem(pizza)}>Add Pizza</button>
      <button onClick={() => addItem(burger)}>Add Burger</button>
      <button onClick={() => removeItem(pizza.id)}>Remove Pizza</button>
      <button onClick={() => updateQuantity(pizza.id, 5)}>Set Pizza Qty 5</button>
      <button onClick={() => updateQuantity(pizza.id, 0)}>Set Pizza Qty 0</button>
      <button onClick={() => clearCart()}>Clear</button>
      <button onClick={() => addItem(salad)}>Add Salad</button>
      <button onClick={() => replaceCart(salad)}>Replace With Salad</button>

      {items.map((i) => (
        <p key={i.menuItem.id} data-testid={`qty-${i.menuItem.id}`}>
          {i.quantity}
        </p>
      ))}
    </div>
  );
}

function renderWithProvider() {
  return render(
    <CartProvider>
      <CartConsumer />
    </CartProvider>
  );
}

describe("CartContext", () => {
  it("starts with an empty cart", () => {
    renderWithProvider();

    expect(screen.getByTestId("total-items")).toHaveTextContent("0");
    expect(screen.getByTestId("subtotal")).toHaveTextContent("0.00");
    expect(screen.getByTestId("item-count")).toHaveTextContent("0");
  });

  it("adds a new item to the cart", async () => {
    const user = userEvent.setup();
    renderWithProvider();

    await user.click(screen.getByText("Add Pizza"));

    expect(screen.getByTestId("total-items")).toHaveTextContent("1");
    expect(screen.getByTestId("subtotal")).toHaveTextContent("12.99");
    expect(screen.getByTestId("qty-pizza-1")).toHaveTextContent("1");
  });

  it("increments quantity when adding the same item twice", async () => {
    const user = userEvent.setup();
    renderWithProvider();

    await user.click(screen.getByText("Add Pizza"));
    await user.click(screen.getByText("Add Pizza"));

    expect(screen.getByTestId("total-items")).toHaveTextContent("2");
    expect(screen.getByTestId("qty-pizza-1")).toHaveTextContent("2");
    // Only 1 unique item in the cart
    expect(screen.getByTestId("item-count")).toHaveTextContent("1");
  });

  it("tracks multiple different items", async () => {
    const user = userEvent.setup();
    renderWithProvider();

    await user.click(screen.getByText("Add Pizza"));
    await user.click(screen.getByText("Add Burger"));

    expect(screen.getByTestId("total-items")).toHaveTextContent("2");
    expect(screen.getByTestId("item-count")).toHaveTextContent("2");
    expect(screen.getByTestId("subtotal")).toHaveTextContent("22.98");
  });

  it("removes an item from the cart", async () => {
    const user = userEvent.setup();
    renderWithProvider();

    await user.click(screen.getByText("Add Pizza"));
    await user.click(screen.getByText("Add Burger"));
    await user.click(screen.getByText("Remove Pizza"));

    expect(screen.getByTestId("total-items")).toHaveTextContent("1");
    expect(screen.getByTestId("item-count")).toHaveTextContent("1");
    expect(screen.queryByTestId("qty-pizza-1")).not.toBeInTheDocument();
  });

  it("updates quantity to a specific value", async () => {
    const user = userEvent.setup();
    renderWithProvider();

    await user.click(screen.getByText("Add Pizza"));
    await user.click(screen.getByText("Set Pizza Qty 5"));

    expect(screen.getByTestId("qty-pizza-1")).toHaveTextContent("5");
    expect(screen.getByTestId("total-items")).toHaveTextContent("5");
    expect(screen.getByTestId("subtotal")).toHaveTextContent("64.95");
  });

  it("removes item when quantity is set to 0", async () => {
    const user = userEvent.setup();
    renderWithProvider();

    await user.click(screen.getByText("Add Pizza"));
    await user.click(screen.getByText("Set Pizza Qty 0"));

    expect(screen.getByTestId("total-items")).toHaveTextContent("0");
    expect(screen.queryByTestId("qty-pizza-1")).not.toBeInTheDocument();
  });

  it("clears all items from the cart", async () => {
    const user = userEvent.setup();
    renderWithProvider();

    await user.click(screen.getByText("Add Pizza"));
    await user.click(screen.getByText("Add Burger"));
    await user.click(screen.getByText("Clear"));

    expect(screen.getByTestId("total-items")).toHaveTextContent("0");
    expect(screen.getByTestId("subtotal")).toHaveTextContent("0.00");
    expect(screen.getByTestId("item-count")).toHaveTextContent("0");
  });

  it("throws when useCart is called outside CartProvider", () => {
    // Suppress console.error for this test since React logs the error
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => render(<CartConsumer />)).toThrow(
      "useCart must be used within a CartProvider"
    );

    spy.mockRestore();
  });

  it("returns 'conflict' when adding item from a different restaurant", async () => {
    const user = userEvent.setup();
    renderWithProvider();

    await user.click(screen.getByText("Add Pizza"));     // restaurantId: "r1"
    await user.click(screen.getByText("Add Salad"));      // restaurantId: "r2" — blocked

    // Pizza should still be there, Other should not
    expect(screen.getByTestId("total-items")).toHaveTextContent("1");
    expect(screen.getByTestId("item-count")).toHaveTextContent("1");
  });

  it("replaces cart when replaceCart is called", async () => {
    const user = userEvent.setup();
    renderWithProvider();

    await user.click(screen.getByText("Add Pizza"));
    expect(screen.getByTestId("total-items")).toHaveTextContent("1");

    await user.click(screen.getByText("Replace With Salad"));

    expect(screen.getByTestId("total-items")).toHaveTextContent("1");
    expect(screen.queryByTestId("qty-pizza-1")).not.toBeInTheDocument();
    expect(screen.getByTestId("qty-salad-1")).toHaveTextContent("1");
  });
});