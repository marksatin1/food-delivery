"use client";
import type { Order } from "@food-delivery/shared";

export function OrderConfirmationDisplay({
  order,
  error,
  noId,
}: {
  order?: Order | null;
  error?: string | null;
  noId?: boolean;
}) {
  if (noId) {
    return <div className="p-8 text-center text-red-500">No order ID provided.</div>;
  }
  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }
  if (!order) {
    return <div className="p-8 text-center">Order not found.</div>;
  }

  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Order Confirmation</h1>
      <p className="mb-2">Order ID: <span className="font-mono">{order.id}</span></p>
      <p className="mb-2">Status: <span className="font-semibold">{order.status}</span></p>
      <p className="mb-2">Estimated Delivery: {new Date(order.estimatedDelivery).toLocaleString()}</p>
      <div className="my-4 border-t pt-4">
        <h2 className="font-semibold mb-2">Items:</h2>
        <ul>
          {order.items.map((item) => (
            <li key={item.menuItem.id} className="mb-1">
              {item.quantity} × {item.menuItem.name}
            </li>
          ))}
        </ul>
      </div>
      <div className="border-t pt-4 space-y-1">
        <div className="flex justify-between"><span>Subtotal:</span><span>${order.subtotal.toFixed(2)}</span></div>
        <div className="flex justify-between"><span>Delivery Fee:</span><span>${order.deliveryFee.toFixed(2)}</span></div>
        <div className="flex justify-between"><span>Tax:</span><span>${order.tax.toFixed(2)}</span></div>
        <div className="flex justify-between font-bold"><span>Total:</span><span>${order.total.toFixed(2)}</span></div>
      </div>
    </div>
  );
}