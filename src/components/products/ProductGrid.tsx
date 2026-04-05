import NoProducts from './NoProducts';
import ProductCard from './ProductCard';
import { getProducts } from '@/services/product.service';

export default async function ProductGrid() {
	const products = await getProducts();

	if (products.length === 0) return <NoProducts />;

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
			{products.map((product) => (
				<ProductCard key={product.id} product={product} />
			))}
		</div>
	);
}
