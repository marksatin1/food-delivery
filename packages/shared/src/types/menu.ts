export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;   // Appetizers, Entrees, etc.
  isPopular: boolean;
  isAvailable: boolean;
}