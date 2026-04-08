'use client';

import { Button } from '@/components/ui/button';
import useCartStore from '@/store/cart.store';
import { Product } from '@/types/product.types';
import ProductQuantitySelector from '../shared/ProductQuantitySelector';
import { useItemQuantity } from '@/store/cart.selectors';

interface AddToCartProps {
	product: Product;
}

export default function AddToCart({ product }: AddToCartProps) {
	const { addItem } = useCartStore();
	const quantity = useItemQuantity(product.id);
	const { id, imageUrl, name, price, stock } = product;

	const handleAddItem = () => {
		const item = {
			productId: id,
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
