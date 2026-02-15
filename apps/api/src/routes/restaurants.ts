import { Request, Response, Router } from "express";
import { restaurants, menuItems } from "../data/seed.js";

const router = Router();

// Get all restaurants
router.get('/', (_req: Request, res: Response) => {
  res.json(restaurants);
});

// Get one restaurant by ID
router.get('/:id', (req: Request, res: Response) => {
  const restaurant = restaurants.find((r) => r.id === req.params.id);

  if (!restaurant) {
    res.status(404).json({ error: 'Restaurant not found' });
    return;
  }

  res.json(restaurant);
});

// Get menu items for a specific restaurant
router.get('/:id/menu', (req: Request, res: Response) => {
  const restaurantMenuItems = menuItems.filter((i) => i.restaurantId === req.params.id);

  if (restaurantMenuItems.length === 0) {
    res.status(404).json({ error: 'Menu items not found' });
    return;
  }

  res.json(restaurantMenuItems);
});

export default router;