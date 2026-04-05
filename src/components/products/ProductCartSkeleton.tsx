import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductCardSkeleton() {
	return (
		<Card className="overflow-hidden">
			<CardContent className="p-3">
				<Skeleton className="w-full h-40 rounded-md" />
				<Skeleton className="mt-2 h-4 w-3/4" />
				<div className="mt-2 flex items-center justify-between">
					<Skeleton className="h-4 w-12" />
					<Skeleton className="h-8 w-20 rounded-md" />
				</div>
			</CardContent>
		</Card>
	);
}
