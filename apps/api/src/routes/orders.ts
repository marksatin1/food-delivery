import { Request, Response, Router } from "express";
import { menuItems } from "../data/seed.js";
import type { OrderItem, Order } from "@food-delivery/shared";

const orders: Order[] = [];

const router = Router();

router.post('/', (req: Request, res: Response) => {
  const { userId, restaurantId, items, deliveryFee, estimatedDelivery } = req.body;

  // Data checks
  if (!userId) {
    return res.status(400).json({ error: 'User ID is invalid' });
  }

  if (!restaurantId) {
    return res.status(400).json({ error: 'Restaurant ID is invalid' });
  }

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Menu Items fields are invalid' });
  }

  if (!deliveryFee) {
    return res.status(400).json({ error: 'Delivery Fee field is invalid' });
  }

  if (!estimatedDelivery) {
    return res.status(400).json({ error: 'Estimated Delivery field is invalid' });
  }

  // Determine final prices
  let subtotal = 0;
  for (const { item, quantity } of items) {
    // Find the latest menu item by ID
    const menuData = menuItems.find((m) => m.id === item.id);
    if (!menuData) {
      return res.status(400).json({ error: `Menu item ${item.id} not found` });
    }
    subtotal += menuData.price * quantity;
  }

  const tax = subtotal * 0.08875;
  const total = subtotal + deliveryFee + tax;

  const orderItems: OrderItem[] = items.map(({ item, quantity }) => {
    const menuData = menuItems.find((m) => m.id === item.id)!;
    return { menuItem: menuData, quantity };
  });

  const order: Order = {
    id: Date.now().toString(),
    userId,
    restaurantId,
    items: orderItems,
    status: 'pending',
    subtotal: Number(subtotal.toFixed(2)),
    deliveryFee,
    tax: Number(tax.toFixed(2)),
    total: Number(total.toFixed(2)),
    createdAt: new Date().toISOString(),
    estimatedDelivery,
  }

  orders.push(order);
  return res.status(201).json(order);
});

router.get('/:id', (req: Request, res: Response) => {
  const { id } = req.params;

  const foundOrder = orders.find((o) => o.id === id);

  if (!foundOrder) {
    return res.status(404).json({ error: `Order with ID ${id} was not found` });
  }

  return res.status(200).json(foundOrder);
})

export default router;