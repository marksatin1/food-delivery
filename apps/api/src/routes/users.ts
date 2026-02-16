import { Request, Response, Router } from "express";
import { users } from "../data/seed.js";
import type { User } from "@food-delivery/shared";

const router = Router();

// Get all users
router.get('/', (_req: Request, res: Response) => {
  res.json(users);
});

// Get one user by id
router.get('/:id', (req: Request, res: Response) => {
  const user = users.find((u: User) => u.id === req.params.id);

  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  res.json(user);
});

export default router;