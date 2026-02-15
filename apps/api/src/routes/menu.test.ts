import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app.js";
import { menuItems, restaurants } from "../data/seed.js";

describe("Menu Routes", () => {

  // Get all menu items (with optional filters)
  describe("GET /api/menu", () => {
    it("should return all menu items", async () => {
      const res = await request(app).get("/api/menu");

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(menuItems.length);
    });

    it("should filter by category", async () => {
      const res = await request(app).get("/api/menu?category=Entrees");

      expect(res.status).toBe(200);

      for (const item of res.body) {
        expect(item.category).toBe("Entrees");
      }
    });

    it("should filter by restaurantId", async () => {
      const restaurantId = restaurants[0].id;
      const res = await request(app).get(`/api/menu?restaurantId=${restaurantId}`);

      expect(res.status).toBe(200);

      for (const item of res.body) {
        expect(item.restaurantId).toBe(restaurantId);
      }
    });

    it("should filter by popular", async () => {
      const res = await request(app).get("/api/menu?popular=true");

      expect(res.status).toBe(200);

      for (const item of res.body) {
        expect(item.isPopular).toBe(true);
      }
    });

    it("should combine multiple filters", async () => {
      const restaurantId = restaurants[0].id;
      const res = await request(app).get(
        `/api/menu?restaurantId=${restaurantId}&category=Entrees`
      );

      expect(res.status).toBe(200);

      for (const item of res.body) {
        expect(item.restaurantId).toBe(restaurantId);
        expect(item.category).toBe("Entrees");
      }
    });

    it("should return empty array for no matches", async () => {
      const res = await request(app).get("/api/menu?category=NonexistentFood");

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(0);
    });
  });

  // Get a single menu item by ID
  describe("GET /api/menu/:id", () => {
    it("should return a single menu item by ID", async () => {
      const expected = menuItems[0];
      const res = await request(app).get(`/api/menu/${expected.id}`);

      expect(res.status).toBe(200);
      expect(res.body.id).toBe(expected.id);
      expect(res.body.name).toBe(expected.name);
      expect(res.body.price).toBe(expected.price);
    });

    it("should return 404 for a non-existent ID", async () => {
      const res = await request(app).get("/api/menu/fake-id-12345");

      expect(res.status).toBe(404);
      expect(res.body.error).toBe("Menu item not found");
    });
  });
});