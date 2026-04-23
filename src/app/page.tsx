import { Suspense } from 'react';
import ProductGrid from '@/components/products/ProductGrid';
import ProductGridSkeleton from '@/components/products/ProductSkeletonGrid';
import { ErrorBoundary } from 'react-error-boundary';
import ProductError from '@/components/products/ProductError';

export default function HomePage() {
	return (
		<ErrorBoundary FallbackComponent={ProductError}>
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid />
			</Suspense>
		</ErrorBoundary>
	);
}
