import { describe, it, expect } from 'vitest';
import { faker } from '@faker-js/faker';
import { restaurants, menuItems, users, createRestaurant } from './seed.js';

describe('Seed Data', () => {
  // --- Quantity checks ---
  it('should generate 20 restaurants', () => {
    expect(restaurants).toHaveLength(20);
  });

  it('should generate 5 users', () => {
    expect(users).toHaveLength(5);
  });

  it('should generate 8-15 menu items per restaurant', () => {
    for (const restaurant of restaurants) {
      const items = menuItems.filter((m) => m.restaurantId === restaurant.id);
      expect(items.length).toBeGreaterThanOrEqual(8);
      expect(items.length).toBeLessThanOrEqual(15);
    }
  });

  // --- Relationship checks ---
  it('every menu item should belong to a valid restaurant', () => {
    const restaurantIds = restaurants.map((r) => r.id);
    for (const item of menuItems) {
      expect(restaurantIds).toContain(item.restaurantId);
    }
  });

  it('every restaurant should have at least one menu item', () => {
    const menuRestaurantIds = [...new Set(menuItems.map((m) => m.restaurantId))];
    for (const restaurant of restaurants) {
      expect(menuRestaurantIds).toContain(restaurant.id);
    }
  });

  // --- Field validation ---
  it('restaurants should have valid fields', () => {
    for (const restaurant of restaurants) {
      expect(restaurant.id).toBeTruthy();
      expect(restaurant.name).toBeTruthy();
      expect(restaurant.cuisine.length).toBeGreaterThan(0);
      expect(restaurant.rating).toBeGreaterThanOrEqual(3);
      expect(restaurant.rating).toBeLessThanOrEqual(5);
      expect(restaurant.deliveryFee).toBeGreaterThanOrEqual(0);
      expect(restaurant.minimumOrder).toBeGreaterThan(0);
      expect(typeof restaurant.isOpen).toBe('boolean');
    }
  });

  it('menu items should have valid fields', () => {
    for (const item of menuItems) {
      expect(item.id).toBeTruthy();
      expect(item.name).toBeTruthy();
      expect(item.price).toBeGreaterThanOrEqual(5.99);
      expect(item.price).toBeLessThanOrEqual(29.99);
      expect(['Appetizers', 'Entrees', 'Sides', 'Drinks', 'Desserts']).toContain(item.category);
      expect(typeof item.isPopular).toBe('boolean');
      expect(typeof item.isAvailable).toBe('boolean');
    }
  });

  it('users should have valid fields', () => {
    for (const user of users) {
      expect(user.id).toBeTruthy();
      expect(user.name).toBeTruthy();
      expect(user.email).toContain('@');
      expect(user.phone).toBeTruthy();
      expect(user.address).toBeTruthy();
    }
  });

  // --- Determinism check ---
  it('should generate consistent data with the same seed', () => {
    faker.seed(42);
    const restaurant1 = createRestaurant();
    faker.seed(42);
    const restaurant2 = createRestaurant();

    expect(restaurant1.name).toBe(restaurant2.name);
    expect(restaurant1.id).toBe(restaurant2.id);
    expect(restaurant1.rating).toBe(restaurant2.rating);
  });
});