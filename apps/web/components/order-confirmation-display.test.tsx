import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { OrderConfirmationDisplay } from "./order-confirmation-display.js";
import type { Order } from "@food-delivery/shared";

const mockOrder: Order = {
  id: "123",
  userId: "u1",
  restaurantId: "r1",
  items: [{
    menuItem: {
      id: "pizza-1",
      restaurantId: "r1",
      name: "Margherita Pizza",
      description: "Classic pizza",
      price: 12.99,
      image: "https://example.com/pizza.jpg",
      category: "Entrees",
      isPopular: true,
      isAvailable: true,
    },
    quantity: 2
  }],
  status: "pending",
  subtotal: 20,
  deliveryFee: 3.99,
  tax: 1.92,
  total: 25.91,
  createdAt: "2026-02-18T12:00:00.000Z",
  estimatedDelivery: "2026-02-18T13:00:00.000Z",
};

describe("OrderConfirmationDisplay", () => {
  it("renders order details", () => {
    render(<OrderConfirmationDisplay order={mockOrder} />);
    expect(screen.getByText(/Order Confirmation/i)).toBeInTheDocument();
    expect(screen.getByText(/Order ID:/)).toHaveTextContent("123");
    expect(screen.getByText("$20.00")).toBeInTheDocument();
    expect(screen.getByText("$25.91")).toBeInTheDocument();
  });

  it("shows error if fetch fails", () => {
    render(<OrderConfirmationDisplay error="Could not fetch order." />);
    expect(screen.getByText(/Could not fetch order/i)).toBeInTheDocument();
  });

  it("shows message if no id provided", () => {
    render(<OrderConfirmationDisplay noId />);
    expect(screen.getByText(/No order ID provided/i)).toBeInTheDocument();
  });
});