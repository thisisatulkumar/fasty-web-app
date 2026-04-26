'use client';

import { useIsMobile } from '@/hooks/use-mobile';
import { useCartCount, useCartTotal } from '@/store/cart.selectors';
import { ShoppingCart, ArrowRight } from 'lucide-react';
import { useSheet } from '@/context/SheetContext';

const FloatingCartButton = () => {
	const isMobile = useIsMobile();
	const total = useCartTotal();
	const itemsCount = useCartCount();
	const { openCart } = useSheet();

	if (isMobile && itemsCount > 0) {
		return (
			<div className="fixed bottom-2 left-1/2 -translate-x-1/2 flex justify-between items-center w-[95%] max-w-lg bg-black border border-white/10 rounded-xl px-4 py-3 shadow-[0_4px_32px_rgba(0,0,0,0.6)] z-50">
				<div className="flex items-center gap-3">
					<div className="bg-white/10 rounded-lg p-2 flex items-center justify-center">
						<ShoppingCart className="text-white" size={18} strokeWidth={2} />
					</div>

					<div className="flex flex-col gap-0.5">
						<span className="text-white/50 text-[11px] font-medium uppercase tracking-wider">
							{itemsCount} {itemsCount === 1 ? 'item' : 'items'}
						</span>
						<span className="text-white text-base font-bold tracking-tight">
							₹ {total}
						</span>
					</div>
				</div>

				<button
					className="flex items-center gap-2 bg-white text-black px-4 py-2.5 rounded-lg text-sm font-bold"
					onClick={openCart}
				>
					View Cart
					<ArrowRight size={15} strokeWidth={2.5} />
				</button>
			</div>
		);
	}
};

export default FloatingCartButton;
