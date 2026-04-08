import useCartStore from './cart.store';

export const useCartTotal = () =>
	useCartStore((state) => state.items.reduce((sum, item) => sum + item.price * item.quantity, 0));

export const useCartCount = () =>
	useCartStore((state) => state.items.reduce((sum, item) => sum + item.quantity, 0));

export const useItemQuantity = (productId: string) =>
	useCartStore(
		(state) => state.items.find((item) => item.productId === productId)?.quantity ?? 0
	);
