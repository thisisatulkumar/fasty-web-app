import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { Cart, Item } from '../types/cart.types';

const useCartStore = create<Cart>()(
	persist(
		(set) => ({
			items: [],

			addItem: (item: Item) =>
				set((state) => ({
					items: [...state.items, item],
				})),

			removeItem: (id: string) =>
				set((state) => ({
					items: state.items.filter((i) => i.product_id !== id),
				})),

			updateQuantity: (id: string, quantity: number) =>
				set((state) => ({
					items: state.items.map((i) => (i.product_id === id ? { ...i, quantity } : i)),
				})),
		}),
		{
			name: 'cart-storage',
		}
	)
);

export default useCartStore;
