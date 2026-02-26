import { NextFunction, Request, Response, Router } from "express";
import { users } from "../data/seed.js";
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import type { User } from "@food-delivery/shared";

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

interface AuthRequest extends Request {
  user?: any;
}

const router = Router();

// JWT Auth middleware
function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader?.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ error: 'Missing or invalid token' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;     // payload contains { id, email }
    next();
  } catch (error: any) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// Login a user
router.post('/login', (req: Request, res: Response,) => {
  // Check for existing token (user is already logged in)
  let existingToken;
  const authHeader = req.headers.authorization;

  if (authHeader?.startsWith('Bearer ')) {
    existingToken = authHeader.split(' ')[1];
  } else if (req.cookies?.token) {
    existingToken = req.cookies.token;
  }

  if (existingToken) {
    try {
      jwt.verify(existingToken, JWT_SECRET);
      return res.status(400).json({ error: 'User is already logged in' });
    } catch (error: any) {
      return res.status(401).json({ error: 'Invalid or expired token' })
    }
  }

  const { email, password } = req.body;

  // Demo: password is always 'password'
  const user = users.find((u) => u.email === email);
  if (!user || password !== 'password') {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Sign JWT
  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

  // Attach cookie to response
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 1000,     // 1 hour
  });

  // Send user (cookie is attached)
  res.json({ user });
})

// Get current user
router.get('/me', requireAuth, (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const user = users.find((u) => u.id === userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json(user);
});

// Get all users
router.get('/', requireAuth, (_req: Request, res: Response) => {
  res.json(users);
});

// Get one user by id
router.get('/:id', requireAuth, (req: Request, res: Response) => {
  const user = users.find((u: User) => u.id === req.params.id);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json(user);
});

// Logout a user
router.post('/logout', requireAuth, (_req: Request, res: Response) => {
  // Set the token to an empty string that expires immediately
  res.cookie('token', "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: new Date(0),   // Expire immediately
  });
  res.json({ success: true });
});

export default router;