import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app.js";

describe("Orders API", () => {

  // Post new order
  it("creates an order", async () => {
    const res = await request(app)
      .post("/api/orders")
      .send({
        userId: "u1",
        restaurantId: "r1",
        items: [{ item: { id: "12a28b19-4f7c-480a-9f9d-e3396de53c4d" }, quantity: 1 }],
        deliveryFee: 3.99,
        estimatedDelivery: "2026-02-18T18:00:00.000Z"
      });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
  });

  it("returns 400 for sending empty object", async () => {
    const res = await request(app)
      .post("/api/orders")
      .send({});
    expect(res.status).toBe(400);
  });

  it("returns 400 for invalid menu item id", async () => {
    const res = await request(app)
      .post("/api/orders")
      .send({
        userId: "u1",
        restaurantId: "r1",
        items: [{ item: { id: "not-a-real-id" }, quantity: 1 }],
        deliveryFee: 3.99,
        estimatedDelivery: "2026-02-18T18:00:00.000Z"
      });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/not found/);
  });

  it("returns 400 for invalid quantity", async () => {
    const res = await request(app)
      .post("/api/orders")
      .send({
        userId: "u1",
        restaurantId: "r1",
        items: [{ item: { id: "some-valid-id" }, quantity: 0 }],
        deliveryFee: 3.99,
        estimatedDelivery: "2026-02-18T18:00:00.000Z"
      });
    expect(res.status).toBe(400);
  });

  it("returns 400 for empty items array", async () => {
    const res = await request(app)
      .post("/api/orders")
      .send({
        userId: "u1",
        restaurantId: "r1",
        items: [],
        deliveryFee: 3.99,
        estimatedDelivery: "2026-02-18T18:00:00.000Z"
      });
    expect(res.status).toBe(400);
  });

  // Get order by ID
  it("returns correct order for valid id", async () => {
    // Create and post order first
    const postRes = await request(app)
      .post("/api/orders")
      .send({
        userId: "u1",
        restaurantId: "r1",
        items: [{ item: { id: "some-valid-id" }, quantity: 1 }],
        deliveryFee: 3.99,
        estimatedDelivery: "2026-02-18T18:00:00.000Z"
      });
    const orderId = postRes.body.id;
    const getRes = await request(app).get(`/api/orders/${orderId}`);
    expect(getRes.status).toBe(200);
    expect(getRes.body.id).toBe(orderId);
  });

  it("returns 404 for missing order", async () => {
    const res = await request(app)
      .get("/api/orders/does-not-exist");
    expect(res.status).toBe(404);
  });
});