import { Button } from '@/components/ui/button';
import { ButtonGroup } from '../ui/button-group';
import useCartStore from '@/store/cart.store';

interface ProductQuantitySelectorProps {
	quantity: number;
	stock: number;
	productId: string;
}

const ProductQuantitySelector = ({ quantity, stock, productId }: ProductQuantitySelectorProps) => {
	const { updateQuantity, removeItem } = useCartStore();

	return (
		<ButtonGroup className="h-10 rounded-lg">
			<Button
				variant="outline"
				disabled={quantity === 0}
				onClick={() =>
					quantity === 1 ? removeItem(productId) : updateQuantity(productId, quantity - 1)
				}
			>
				-
			</Button>
			<Button variant="outline">{quantity}</Button>
			<Button
				variant="outline"
				disabled={quantity >= stock}
				onClick={() => updateQuantity(productId, quantity + 1)}
			>
				+
			</Button>
		</ButtonGroup>
	);
};

export default ProductQuantitySelector;
