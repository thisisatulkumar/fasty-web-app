import { cartItems } from '@/data/cart.data';
import { Item } from '@/types/cart.types';

export const billAmount =
	cartItems?.reduce((acc, item) => acc + item.price * item.quantity, 0) ?? 0;

export const getItemsCount = (items: any) =>
	items?.reduce((acc: any, item: any) => acc + item.quantity, 0) ?? 0;

export const getItemQuantity = (id: string, items: Item[]): number => {
	const item = items.find((item) => item.product_id === id);
	return item?.quantity ?? 0;
};
