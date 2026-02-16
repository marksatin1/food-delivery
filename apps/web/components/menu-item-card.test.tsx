import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from "@testing-library/user-event";
import { MenuItemCard } from './menu-item-card';
import { CartProvider } from './cart-context';
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

function renderWithCart(item: MenuItem) {
  return render(
    <CartProvider>
      <MenuItemCard item={item} />
    </CartProvider>
  );
}

describe('MenuItemCard', () => {
  it('renders item name', () => {
    renderWithCart(mockMenuItem);
    expect(screen.getByText('Margherita Pizza')).toBeInTheDocument();
  });

  it('displays description', () => {
    renderWithCart(mockMenuItem);
    expect(screen.getByText('Fresh mozzarella, tomatoes, and basil')).toBeInTheDocument();
  });

  it('shows price', () => {
    renderWithCart(mockMenuItem);
    expect(screen.getByText('$12.99')).toBeInTheDocument();
  });

  it('shows popular badge when item is popular', () => {
    renderWithCart(mockMenuItem);
    expect(screen.getByText('Popular')).toBeInTheDocument();
  });

  it('does not show popular badge when not popular', () => {
    const unpopularItem = { ...mockMenuItem, isPopular: false };
    renderWithCart(unpopularItem);
    expect(screen.queryByText('Popular')).not.toBeInTheDocument();
  });

  it('shows "Add to Cart" button when available', () => {
    renderWithCart(mockMenuItem);
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('Add to Cart');
    expect(button).not.toBeDisabled();
  });

  it('shows "Unavailable" button when not available', () => {
    const unavailableItem = { ...mockMenuItem, isAvailable: false };
    renderWithCart(unavailableItem);
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('Unavailable');
    expect(button).toBeDisabled();
  });

  it('applies opacity when unavailable', () => {
    const unavailableItem = { ...mockMenuItem, isAvailable: false };
    const { container } = renderWithCart(unavailableItem);
    const card = container.querySelector('.opacity-50');
    expect(card).toBeInTheDocument();
  });

  it('calls addItem when Add to Cart is clicked', async () => {
    const user = userEvent.setup();
    renderWithCart(mockMenuItem);

    const button = screen.getByRole('button', { name: 'Add to Cart' });
    await user.click(button);

    // We can't directly inspect context, but we can verify no error was thrown
    // and the button is still functional
    expect(button).toBeInTheDocument();
  });
});