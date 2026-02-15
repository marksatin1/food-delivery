import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RestaurantCard } from './restaurant-card';
import type { Restaurant } from '@food-delivery/shared';

const mockRestaurant: Restaurant = {
  id: '1',
  name: 'Test Pizza',
  description: 'Best pizza in town',
  image: 'https://example.com/image.jpg',
  cuisine: ['Italian', 'Pizza'],
  rating: 4.5,
  reviewCount: 100,
  deliveryTime: '25-35 min',
  deliveryFee: 2.99,
  minimumOrder: 15,
  address: '123 Main St',
  isOpen: true,
};

describe('RestaurantCard', () => {
  it('renders restaurant name', () => {
    render(<RestaurantCard restaurant={mockRestaurant} />);
    expect(screen.getByText('Test Pizza')).toBeInTheDocument();
  });

  it('displays rating', () => {
    render(<RestaurantCard restaurant={mockRestaurant} />);
    expect(screen.getByText(/4.5/)).toBeInTheDocument();
  });

  it('shows cuisine badges', () => {
    render(<RestaurantCard restaurant={mockRestaurant} />);
    expect(screen.getByText('Italian')).toBeInTheDocument();
    expect(screen.getByText('Pizza')).toBeInTheDocument();
  });

  it('displays delivery info', () => {
    render(<RestaurantCard restaurant={mockRestaurant} />);
    expect(screen.getByText('25-35 min')).toBeInTheDocument();
    expect(screen.getByText('$2.99 delivery')).toBeInTheDocument();
  });

  it('shows free delivery when fee is 0', () => {
    const freeDeliveryRestaurant = { ...mockRestaurant, deliveryFee: 0 };
    render(<RestaurantCard restaurant={freeDeliveryRestaurant} />);
    expect(screen.getByText('Free delivery')).toBeInTheDocument();
  });

  it('shows closed status when restaurant is closed', () => {
    const closedRestaurant = { ...mockRestaurant, isOpen: false };
    render(<RestaurantCard restaurant={closedRestaurant} />);
    expect(screen.getByText('Currently closed')).toBeInTheDocument();
  });

  it('does not show closed status when open', () => {
    render(<RestaurantCard restaurant={mockRestaurant} />);
    expect(screen.queryByText('Currently closed')).not.toBeInTheDocument();
  });
});