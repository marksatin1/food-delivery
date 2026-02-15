import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app.js";
import { users } from "../data/seed.js";

describe("User Routes", () => {

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
  describe("GET /api/users/:id", () => {
    it("should return a single user by ID", async () => {
      const expected = users[0];
      const res = await request(app).get(`/api/users/${expected.id}`);

      expect(res.status).toBe(200);
      expect(res.body.id).toBe(expected.id);
      expect(res.body.name).toBe(expected.name);
      expect(res.body.email).toBe(expected.email);
    });

    it("should return 404 for a non-existent ID", async () => {
      const res = await request(app).get("/api/users/fake-id-12345");

      expect(res.status).toBe(404);
      expect(res.body.error).toBe("User not found");
    });
  });
});