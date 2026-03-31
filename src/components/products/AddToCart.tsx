'use client';

import { Button } from '@/components/ui/button';
import useCartStore from '@/store/cart.store';
import { Product } from '@/types/product.types';
import { getItemQuantity } from '@/utils/cart.utils';

interface AddToCartProps {
	product: Product;
	stock: number;
}

export default function AddToCart({ product, stock }: AddToCartProps) {
	const { items, addItem, updateQuantity, removeItem } = useCartStore();
	const quantity = getItemQuantity(product.id, items);

	const handleAddItem = () => {
		const { id, image_url, name, price, stock } = product;
		const item = {
			product_id: id,
			name,
			image: image_url,
			price,
			quantity: 1,
			stock,
		};
		addItem(item);
	};

	const increase = () => {
		if (quantity < stock) {
			const { id } = product;
			updateQuantity(id, quantity + 1);
		}
	};

	const decrease = () => {
		const { id } = product;

		if (quantity === 1) {
			removeItem(id);
		} else {
			updateQuantity(id, quantity - 1);
		}
	};

	if (quantity === 0) {
		return <Button onClick={handleAddItem}>ADD</Button>;
	}

	return (
		<div className="flex items-center gap-2">
			<Button onClick={decrease} variant="outline">
				-
			</Button>

			<span className="w-6 text-center">{quantity}</span>

			<Button onClick={increase} variant="outline" disabled={quantity >= stock}>
				+
			</Button>
		</div>
	);
}
