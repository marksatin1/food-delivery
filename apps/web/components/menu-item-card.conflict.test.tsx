// menu-item-card.conflict.test.tsx
vi.mock('../context/cart-context', () => ({
  useCart: () => ({
    addItem: vi.fn(() => 'conflict'),
    replaceCart: vi.fn(),
  }),
  CartProvider: ({ children }: any) => <div>{children}</div>,
}));

// Mock toast
vi.mock('sonner', () => ({
  toast: Object.assign(vi.fn(), {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
    loading: vi.fn(),
    dismiss: vi.fn(),
  }),
}));
const toastMock: any = toast;

import { describe, vi, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from "@testing-library/user-event";
import { MenuItemCard } from './menu-item-card';
import { toast } from 'sonner';
import { CartProvider } from '../context/cart-context';
import type { MenuItem } from '@food-delivery/shared';
// ...mockMenuItem definition...

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
  // Use the mocked CartProvider from your vi.mock
  return render(
    <CartProvider>
      <MenuItemCard item={item} />
    </CartProvider>
  );
}

describe('MenuItemCard conflict scenario', () => {
  it('shows conflict toast and handles new order', async () => {
    renderWithCart(mockMenuItem);
    const button = screen.getByRole('button', { name: 'Add to Cart' });
    await userEvent.click(button);

    const lastCall = toastMock.mock.calls[toastMock.mock.calls.length - 1];
    expect(lastCall[0]).toMatch(/another restaurant/);

    lastCall[1].action.onClick();
    expect(toast.success).toHaveBeenCalledWith('New order started!');
  });
});