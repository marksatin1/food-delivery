import { fetchApi } from "@/lib/api";
import { OrderConfirmationDisplay } from "@/components/order-confirmation-display";
import type { Order } from "@food-delivery/shared";

export default async function OrderConfirmationPage({ searchParams }: { searchParams: { id?: string } }) {
  const orderId = searchParams.id;

  if (!orderId) {
    return <div className="p-8 text-center text-red-500">No order ID provided.</div>;
  }

  let order: Order | null = null;
  let error: string | null = null;

  try {
    order = await fetchApi<Order>(`/api/orders/${orderId}`);
  } catch (err: any) {
    error = err?.message || "Could not fetch order.";
  }

  return <OrderConfirmationDisplay order={order} error={error} />;
}