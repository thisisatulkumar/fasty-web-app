'use client';
import useCartStore from '@/store/cart.store';
import CartItem from './CartItem';
import CartEmpty from './CartEmpty';

export default function CartItemsGrid() {
	const { items } = useCartStore();

	if (items.length === 0) return <CartEmpty />;

	return (
		<div className="flex flex-col overflow-y-auto">
			{items.map((item) => (
				<CartItem key={item.productId} {...item} />
			))}
		</div>
	);
}
