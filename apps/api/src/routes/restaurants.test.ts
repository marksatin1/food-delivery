import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app.js";
import { restaurants, menuItems } from "../data/seed.js";

describe("Restaurant Routes", () => {

  // Get all restaurants
  describe("GET /api/restaurants", () => {
    it("should return all restaurants", async () => {
      const res = await request(app).get("/api/restaurants");

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(restaurants.length);
    });

    it("should return restaurants with correct shape", async () => {
      const res = await request(app).get("/api/restaurants");

      for (const restaurant of res.body) {
        expect(restaurant).toHaveProperty("id");
        expect(restaurant).toHaveProperty("name");
        expect(restaurant).toHaveProperty("cuisine");
        expect(restaurant).toHaveProperty("rating");
        expect(restaurant).toHaveProperty("deliveryTime");
      }
    });

    it("should filter restaurants by search query", async () => {
      // Grab the first cuisine from the first restaurant as our search term
      const cuisine = restaurants[0].cuisine[0];
      const res = await request(app).get(
        `/api/restaurants?q=${encodeURIComponent(cuisine)}`
      );

      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);

      // Every result should match the query in name, description, or cuisine
      for (const restaurant of res.body) {
        const q = cuisine.toLowerCase();
        const matches =
          restaurant.name.toLowerCase().includes(q) ||
          restaurant.description.toLowerCase().includes(q) ||
          restaurant.cuisine.some((c: string) => c.toLowerCase().includes(q));

        expect(matches).toBe(true);
      }
    });

    // An empty array is still a successful response
    it("should return an empty array when query matches nothing", async () => {
      const res = await request(app).get(
        "/api/restaurants?q=xyznonexistent999"
      );

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it("should return all restaurants when query is empty", async () => {
      const res = await request(app).get("/api/restaurants?q=");

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(restaurants.length);
    });
  });

  // Get one restaurant by ID
  describe("GET /api/restaurants/:id", () => {
    it("should return a single restaurant by ID", async () => {
      const expected = restaurants[0];
      const res = await request(app).get(`/api/restaurants/${expected.id}`);

      expect(res.status).toBe(200);
      expect(res.body.id).toBe(expected.id);
      expect(res.body.name).toBe(expected.name);
    });

    it("should return 404 for a non-existent ID", async () => {
      const res = await request(app).get("/api/restaurants/fake-id-12345");

      expect(res.status).toBe(404);
      expect(res.body.error).toBe("Restaurant not found");
    });
  });

  // Get menu items for a specific restaurant
  describe("GET /api/restaurants/:id/menu", () => {
    it("should return menu items for a valid restaurant", async () => {
      const restaurantId = restaurants[0].id;
      const expectedItems = menuItems.filter((i) => i.restaurantId === restaurantId);

      const res = await request(app).get(`/api/restaurants/${restaurantId}/menu`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(expectedItems.length);

      // Every returned item should belong to this restaurant
      for (const item of res.body) {
        expect(item.restaurantId).toBe(restaurantId);
      }
    });

    it("should return 404 for a restaurant with no menu", async () => {
      const res = await request(app).get("/api/restaurants/fake-id-12345/menu");

      expect(res.status).toBe(404);
      expect(res.body.error).toBe("Menu items not found");
    });
  });
});