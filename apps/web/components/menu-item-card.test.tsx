import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MenuItemCard } from './menu-item-card';
import type { MenuItem } from '@food-delivery/shared';

const mockMenuItem: MenuItem = {
  id: '1',
  restaurantId: 'r1',
  name: 'Margherita Pizza',
  description: 'Fresh mozzarella, tomatoes, and basil',
  price: 12.99,
  image: 'https://example.com/pizza.jpg',
  category: 'Entrees',
  isPopular: true,
  isAvailable: true,
};

describe('MenuItemCard', () => {
  it('renders item name', () => {
    render(<MenuItemCard item={mockMenuItem} />);
    expect(screen.getByText('Margherita Pizza')).toBeInTheDocument();
  });

  it('displays description', () => {
    render(<MenuItemCard item={mockMenuItem} />);
    expect(screen.getByText('Fresh mozzarella, tomatoes, and basil')).toBeInTheDocument();
  });

  it('shows price', () => {
    render(<MenuItemCard item={mockMenuItem} />);
    expect(screen.getByText('$12.99')).toBeInTheDocument();
  });

  it('shows popular badge when item is popular', () => {
    render(<MenuItemCard item={mockMenuItem} />);
    expect(screen.getByText('Popular')).toBeInTheDocument();
  });

  it('does not show popular badge when not popular', () => {
    const unpopularItem = { ...mockMenuItem, isPopular: false };
    render(<MenuItemCard item={unpopularItem} />);
    expect(screen.queryByText('Popular')).not.toBeInTheDocument();
  });

  it('shows "Add to Cart" button when available', () => {
    render(<MenuItemCard item={mockMenuItem} />);
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('Add to Cart');
    expect(button).not.toBeDisabled();
  });

  it('shows "Unavailable" button when not available', () => {
    const unavailableItem = { ...mockMenuItem, isAvailable: false };
    render(<MenuItemCard item={unavailableItem} />);
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('Unavailable');
    expect(button).toBeDisabled();
  });

  it('applies opacity when unavailable', () => {
    const unavailableItem = { ...mockMenuItem, isAvailable: false };
    const { container } = render(<MenuItemCard item={unavailableItem} />);
    const card = container.querySelector('.opacity-50');
    expect(card).toBeInTheDocument();
  });
});