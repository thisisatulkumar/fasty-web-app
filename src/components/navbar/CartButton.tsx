'use client';

import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import useCartStore from '@/store/cart.store';
import { ComponentProps } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

export default function CartButton({ ...props }: ComponentProps<typeof Button>) {
	const isMobile = useIsMobile();

	const itemCount = useCartStore((state) =>
		state.items.reduce((sum, item) => sum + item.quantity, 0)
	);

	return (
		<Button
			variant="ghost"
			size={isMobile ? 'sm' : 'icon'}
			className="relative border border-gray-200 rounded-md hover:bg-gray-100"
			{...props}
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
