import { cartItems } from '@/data/cart.data';
export const billAmount =
	cartItems?.reduce((acc, item) => acc + item.price * item.quantity, 0) ?? 0;
