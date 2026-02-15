import { faker } from "@faker-js/faker";
import type { Restaurant, MenuItem, User } from '@food-delivery/shared';

// Seed faker so data is consistent between restarts
// Same random number creates same random results across seeds
faker.seed(42);

const CUISINES = [
  "American", "Italian", "Chinese", "Japanese", "Mexican",
  "Indian", "Thai", "Mediterranean", "Korean", "Vietnamese",
];

const MENU_CATEGORIES = ["Appetizers", "Entrees", "Sides", "Drinks", "Desserts"];

export function createRestaurant(): Restaurant {
  return {
    id: faker.string.uuid(),
    name: faker.company.name() + " " + faker.helpers.arrayElement(["Grill", "Kitchen", "Bistro", "Café", "Deli"]),
    description: faker.lorem.sentence(),
    image: faker.image.url(),
    cuisine: faker.helpers.arrayElements(CUISINES, { min: 1, max: 3 }),
    rating: parseFloat(faker.number.float({ min: 3.0, max: 5.0, fractionDigits: 1 }).toFixed(1)),
    reviewCount: faker.number.int({ min: 10, max: 500 }),
    deliveryTime: `${faker.number.int({ min: 15, max: 30 })}-${faker.number.int({ min: 31, max: 60 })} min`,
    deliveryFee: parseFloat(faker.number.float({ min: 0, max: 5.99, fractionDigits: 2 }).toFixed(2)),
    minimumOrder: faker.helpers.arrayElement([10, 15, 20, 25]),
    address: faker.location.streetAddress(),
    isOpen: faker.datatype.boolean({ probability: 0.85 }),
  };
}

function createMenuItem(restaurantId: string): MenuItem {
  return {
    id: faker.string.uuid(),
    restaurantId,
    name: faker.food.dish(),
    description: faker.food.description(),
    price: parseFloat(faker.number.float({ min: 5.99, max: 29.99, fractionDigits: 2 }).toFixed(2)),
    image: faker.image.url(),
    category: faker.helpers.arrayElement(MENU_CATEGORIES),
    isPopular: faker.datatype.boolean({ probability: 0.3 }),
    isAvailable: faker.datatype.boolean({ probability: 0.95 }),
  };
}

function createUser(): User {
  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    address: faker.location.streetAddress(true),
    avatar: faker.image.avatar(),
  };
}

// Generate the data
export const restaurants: Restaurant[] = Array.from({ length: 20 }, createRestaurant);

export const menuItems: MenuItem[] = restaurants.flatMap((restaurant) =>
  Array.from({ length: faker.number.int({ min: 8, max: 15 }) }, () =>
    createMenuItem(restaurant.id)
  )
);

export const users: User[] = Array.from({ length: 5 }, createUser);