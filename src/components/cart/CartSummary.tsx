'use client';
import { Button } from '@/components/ui/button';
import { Card, CardFooter } from '@/components/ui/card';
import { useUser } from '@clerk/nextjs';
import { SignInButton } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import useCartStore from '@/store/cart.store';

interface CartSummaryProps {
	setSheetStatus: (sheetStatus: 'checkout') => void;
}

export default function CartSummary({ setSheetStatus }: CartSummaryProps) {
	const { isSignedIn, isLoaded } = useUser();
	const router = useRouter();
	const { items } = useCartStore();

	const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

	if (!isLoaded) return null;

	return (
		<Card className="absolute bottom-0 left-0 w-full">
			<CardFooter className="p-2">
				{isSignedIn ? (
					<Button
						className="w-full h-[60px] flex items-center justify-between px-5"
						onClick={() => setSheetStatus('checkout')}
					>
						<div className="flex flex-col text-white">
							<span className="text-xl font-bold">₹{total}</span>
							<span className="text-xs opacity-80">TOTAL</span>
						</div>
						<span className="text-lg font-semibold text-white">Proceed →</span>
					</Button>
				) : (
					<SignInButton mode="modal">
						<Button className="w-full h-[60px] flex items-center justify-between px-5">
							<div className="flex flex-col text-white">
								<span className="text-xl font-bold">₹{total}</span>
								<span className="text-xs opacity-80">TOTAL</span>
							</div>
							<span className="text-lg font-semibold text-white">Proceed →</span>
						</Button>
					</SignInButton>
				)}
			</CardFooter>
		</Card>
	);
}
