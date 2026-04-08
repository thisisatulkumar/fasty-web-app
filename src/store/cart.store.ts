import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { Cart, CartItem } from '../types/cart.types';

const useCartStore = create<Cart>()(
	persist(
		(set) => ({
			items: [],

			addItem: (item: CartItem) =>
				set((state) => ({
					items: [...state.items, item],
				})),

			removeItem: (id: string) =>
				set((state) => ({
					items: state.items.filter((item) => item.productId !== id),
				})),

			updateQuantity: (id: string, quantity: number) =>
				set((state) => ({
					items: state.items.map((item) =>
						item.productId === id ? { ...item, quantity } : item
					),
				})),

			clearCart: () =>
				set(() => ({
					items: [],
				})),
		}),
		{
			name: 'cart-storage',
		}
	)
);

export default useCartStore;
