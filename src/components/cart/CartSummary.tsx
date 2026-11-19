'use client';

import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/nextjs';
import { SignInButton } from '@clerk/nextjs';
import useCartStore from '@/store/cart.store';
import CartSummarySkeleton from './CartSummarySkeleton';

interface CartSummaryProps {
	setSheetStatus: (sheetStatus: 'checkout') => void;
}

export default function CartSummary({ setSheetStatus }: CartSummaryProps) {
	const { isSignedIn, isLoaded } = useUser();

	const total = useCartStore((state) =>
		state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
	);

	if (!isLoaded) return <CartSummarySkeleton />;

	return (
		<>
			{isSignedIn ? (
				<Button
					className="w-full h-15 flex items-center justify-between px-5"
					onClick={() => setSheetStatus('checkout')}
					disabled={total === 0}
				>
					<div className="flex flex-col text-white">
						<span className="text-xl font-bold">₹{total}</span>
						<span className="text-xs opacity-80">TOTAL</span>
					</div>
					<span className="text-lg font-semibold text-white">Proceed →</span>
				</Button>
			) : (
				<SignInButton mode="modal">
					<Button
						className="w-full h-12 md:h-15 flex items-center justify-between px-5"
						disabled={total === 0}
					>
						<div className="flex flex-col text-white">
							<span className="md:text-xl font-bold">₹{total}</span>
							<span className="text-xs opacity-80">TOTAL</span>
						</div>
						<span className="md:text-lg font-semibold text-white">Proceed →</span>
					</Button>
				</SignInButton>
			)}
		</>
	);
}
