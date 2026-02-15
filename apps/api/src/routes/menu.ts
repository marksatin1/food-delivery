import { Request, Response, Router } from "express";
import { menuItems } from "../data/seed.js";

const router = Router();

// Get all menu items (with optional filters)
router.get('/', (req: Request, res: Response) => {
  let items = menuItems;

  // Filter by category: /api/menu?category=Entrees
  if (typeof req.query.category === 'string') {
    items = items.filter((i) => i.category === req.query.category);
  }

  // Filter by restaurant: /api/menu?restaurantId=abc-123
  if (typeof req.query.restaurantId === 'string') {
    items = items.filter((i) => i.restaurantId === req.query.restaurantId);
  }

  // Filter popular only: /api/menu?popular=true
  if (req.query.popular === 'true') {
    items = items.filter((i) => i.isPopular);
  }

  res.json(items);
});

// Get a single menu item by id
router.get('/:id', (req: Request, res: Response) => {
  const item = menuItems.find((i) => i.id === req.params.id);

  if (!item) {
    res.status(404).json({ error: 'Menu item not found' });
    return;
  }

  res.json(item);
});

export default router;