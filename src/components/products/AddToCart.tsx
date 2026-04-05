'use client';

import { Button } from '@/components/ui/button';
import useCartStore from '@/store/cart.store';
import { Product } from '@/types/product.types';
import { getItemQuantity } from '@/utils/cart.utils';
import ProductQuantitySelector from '../shared/ProductQuantitySelector';

interface AddToCartProps {
	product: Product;
}

export default function AddToCart({ product }: AddToCartProps) {
	const { items, addItem } = useCartStore();
	const quantity = getItemQuantity(product.id, items);
	const { id, imageUrl, name, price, stock } = product;

	const handleAddItem = () => {
		const item = {
			product_id: id,
			name,
			image: imageUrl,
			price,
			quantity: 1,
			stock,
		};
		addItem(item);
	};

	if (quantity === 0) return <Button onClick={handleAddItem}>ADD</Button>;

	return <ProductQuantitySelector productId={id} quantity={quantity} stock={stock} />;
}
