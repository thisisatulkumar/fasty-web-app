import { Card, CardFooter } from '@/components/ui/card';
import { Skeleton } from '../ui/skeleton';

const CartSummarySkeleton = () => {
	return (
		<Card className="absolute bottom-0 left-0 w-full">
			<CardFooter className="p-2">
				<Skeleton className="w-full h-15 rounded-md" />
			</CardFooter>
		</Card>
	);
};

export default CartSummarySkeleton;
