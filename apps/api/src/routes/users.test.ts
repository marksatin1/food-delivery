import { describe, it, expect } from "vitest";
import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../app.js";
import 'dotenv/config';
import { users } from "../data/seed.js";

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

describe("User Routes", () => {
  // Login a user
  describe("POST /api/users/login", () => {
    it("should return a user and set a cookie for valid credentials", async () => {
      const user = users[0];
      const res = await request(app)
        .post("/api/users/login")
        .send({ email: user.email, password: "password" });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("user");
      expect(res.headers['set-cookie']).toBeDefined();
      expect(res.headers['set-cookie'][0]).toMatch(/token=.*HttpOnly/);
    });

    it("should return 401 for invalid credentials", async () => {
      const res = await request(app)
        .post("/api/users/login")
        .send({ email: "notfound@example.com", password: "wrong" });

      expect(res.status).toBe(401);
      expect(res.body.error).toBe("Invalid credentials");
    });
  });

  // Get all users
  describe("GET /api/users", () => {
    it("should return all users", async () => {
      const res = await request(app).get("/api/users");

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(users.length);
    });

    it("should return users with correct shape", async () => {
      const res = await request(app).get("/api/users");

      for (const user of res.body) {
        expect(user).toHaveProperty("id");
        expect(user).toHaveProperty("name");
        expect(user).toHaveProperty("email");
        expect(user).toHaveProperty("phone");
        expect(user).toHaveProperty("address");
      }
    });
  });

  // Get one user by ID
  describe("GET /api/users/:id (protected)", () => {
    it("should return 401 if no token is provided", async () => {
      const user = users[0];
      const res = await request(app).get(`/api/users/${user.id}`);
      expect(res.status).toBe(401);
      expect(res.body.error).toMatch(/token/i);
    });

    it("should return user if valid cookie is provided", async () => {
      const user = users[0];

      // First, login to get the cookie
      const loginRes = await request(app)
        .post("/api/users/login")
        .send({ email: user.email, password: "password" });

      const cookie = loginRes.headers["set-cookie"];
      const res = await request(app)
        .get(`/api/users/${user.id}`)
        .set("Cookie", cookie);

      expect(res.status).toBe(200);
      expect(res.body.id).toBe(user.id);
    });

    it("should return 401 for invalid token", async () => {
      const user = users[0];
      const res = await request(app)
        .get(`/api/users/${user.id}`)
        .set("Authorization", "Bearer invalidtoken");

      expect(res.status).toBe(401);
      expect(res.body.error).toMatch(/invalid/i);
    });
  });

  // Logout a user
  describe("POST /api/users/logout", () => {
    it("should clear the token cookie and return success", async () => {
      // First, login to get the cookie
      const user = users[0];
      const loginRes = await request(app)
        .post("/api/users/login")
        .send({ email: user.email, password: "password" });

      const cookie = loginRes.headers["set-cookie"];
      // Now logout
      const logoutRes = await request(app)
        .post("/api/users/logout")
        .set("Cookie", cookie);

      expect(logoutRes.status).toBe(200);
      expect(logoutRes.body.success).toBe(true);
      // Check that the token cookie is cleared
      expect(logoutRes.headers["set-cookie"][0]).toMatch(/token=;.*Expires=/);
    });
  });

  // Get current user
  describe("GET /api/users/me", () => {
    it("should return the current user if authenticated", async () => {
      const user = users[0];
      
      // Login to get cookie
      const loginRes = await request(app)
        .post("/api/users/login")
        .send({ email: user.email, password: "password" });
      const cookie = loginRes.headers["set-cookie"];
      
      // Fetch /me
      const meRes = await request(app)
        .get("/api/users/me")
        .set("Cookie", cookie);

      expect(meRes.status).toBe(200);
      expect(meRes.body.id).toBe(user.id);
      expect(meRes.body.email).toBe(user.email);
    });

    it("should return 401 if not authenticated", async () => {
      const meRes = await request(app).get("/api/users/me");
      expect(meRes.status).toBe(401);
      expect(meRes.body.error).toMatch(/token/i);
    });
  });
});