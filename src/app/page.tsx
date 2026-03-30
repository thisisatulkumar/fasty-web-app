import { Suspense } from 'react';
import { getProducts } from '@/services/product.service';
import ProductGrid from '@/components/products/ProductGrid';
import SheetSide from '@/components/cart/CartSheet';

export default async function HomePage() {
	const products = await getProducts();

	return (
		<Suspense fallback={<div>Loading...</div>}>
			<div className="p-10 flex flex-col items-center gap-10">
				<SheetSide />
			</div>

			<ProductGrid products={products} />
		</Suspense>
	);
}
