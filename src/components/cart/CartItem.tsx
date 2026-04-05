import { Item, ItemContent } from '@/components/ui/item';
import { Item as _Item } from '@/types/cart.types';
import ProductQuantitySelector from '../shared/ProductQuantitySelector';

export default function CartItem({ product_id, image, name, price, quantity, stock }: _Item) {
	return (
		<Item variant="outline" className="w-90 p-4 rounded-xl bg-white" style={{ margin: '10px' }}>
			<ItemContent>
				<div className="flex items-center gap-5">
					<img src={image} alt={name} className="w-20 h-20 object-cover rounded-lg" />

					<div className="flex-1">
						<h3 className="text-base font-semibold">{name}</h3>
						<p className="text-sm text-gray-500">Price: ₹{price}</p>
					</div>

					<ProductQuantitySelector
						productId={product_id}
						quantity={quantity}
						stock={stock}
					/>
				</div>
			</ItemContent>
		</Item>
	);
}
