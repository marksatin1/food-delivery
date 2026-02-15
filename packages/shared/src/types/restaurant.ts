export interface Restaurant {
  id: string;
  name: string;
  description: string;
  image: string;
  cuisine: string[];
  rating: number;
  reviewCount: number;
  deliveryTime: string;
  deliveryFee: number;
  minimumOrder: number;
  address: string;
  isOpen: boolean;
}