import { Product } from '@/types/product.types';
import { Card, CardContent } from '@/components/ui/card';
import AddToCart from './AddToCart';

interface ProductCardProps {
	product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
	return (
		<Card className="overflow-hidden">
			<CardContent className="p-3">
				<img
					src={product.image_url}
					alt={product.name}
					className="w-full h-40 object-cover rounded-md"
				/>

				<h2 className="mt-2 text-sm font-medium">{product.name}</h2>

				<div className="mt-2 flex items-center justify-between">
					<p className="text-sm text-muted-foreground">₹ {product.price}</p>

					<AddToCart product={product} stock={product.stock} />
				</div>
			</CardContent>
		</Card>
	);
}
