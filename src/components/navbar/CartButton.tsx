import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function CartButton() {
	const itemCount = 0;

	return (
		<Button
			variant="ghost"
			size="icon"
			className="relative border border-gray-200 rounded-md hover:bg-gray-100"
		>
			<ShoppingCart className="h-5 w-5" />
			{itemCount > 0 && (
				<Badge className="absolute -top-1 -right-1 h-4 min-w-4 px-1 flex items-center justify-center rounded-full  text-[10px]">
					{itemCount}
				</Badge>
			)}
		</Button>
	);
}
