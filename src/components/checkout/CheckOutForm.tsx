'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';

import { ROOM_NUMBERS } from '@/lib/constants';
import { isRoomNoValid } from '@/utils/checkout.utils';
import { useUser } from '@clerk/nextjs';
import { profileIdFromClerkId, placeOrder, insertOrderItems } from '@/services/checkout.services';
import useCartStore from '@/store/cart.store';
import { useCartCount, useCartTotal } from '@/store/cart.selectors';
import useLocalStorage from '@/hooks/useLocalStorage';
import { LOCAL_STORAGE_KEYS } from '@/lib/constants';

const formSchema = z.object({
	roomNo: z.enum(ROOM_NUMBERS),
});

type FormData = z.infer<typeof formSchema>;

interface CheckoutFormProps {
	pendingData: FormData | null;
	setOrderPlaced: (orderPlaced: boolean) => void;
	setPlacedOrderId: (orderId: string) => void;
	setPendingData: (pendingData: FormData | null) => void;
	setSheetStatus: (sheetStatus: 'order_placed' | 'cart') => void;
}

export const CheckoutForm = ({
	pendingData,
	setOrderPlaced,
	setPlacedOrderId,
	setPendingData,
	setSheetStatus,
}: CheckoutFormProps) => {
	const { user } = useUser();
	const [error, setError] = useState<string>('');
	const [showConfirm, setShowConfirm] = useState(false);
	const [loading, setLoading] = useState(false);
	const { items } = useCartStore();
	const total = useCartTotal();
	const itemsCount = useCartCount();
	const { getItem, setItem } = useLocalStorage();
	const roomNumRef = useRef<HTMLInputElement | null>(null);

	useEffect(() => {
		const savedRoomNumber = getItem(LOCAL_STORAGE_KEYS.ROOM_NUMBER);
		const result = formSchema.shape.roomNo.safeParse(savedRoomNumber);

		if (result.success) {
			form.setValue('roomNo', result.data);
		}
	}, []);

	const form = useForm<FormData>({
		resolver: zodResolver(formSchema),
	});

	// Step 1 - validate and open confirm dialog
	const onSubmit = async (data: FormData) => {
		const { roomNo } = data;
		if (!user) {
			setError('You must be logged in');
			return;
		}
		if (!isRoomNoValid(roomNo)) {
			setError('Select a valid room');
			return;
		}
		setError('');
		setPendingData(data);
		setShowConfirm(true);
		setItem(LOCAL_STORAGE_KEYS.ROOM_NUMBER, roomNo);
	};

	// Step 2 - actually place the order
	const handleConfirmOrder = async () => {
		if (!pendingData || !user) return;
		setLoading(true);
		try {
			const id = await profileIdFromClerkId(user.id);
			const orderId = await placeOrder(pendingData.roomNo, id, total);
			await Promise.all(
				items.map(({ productId, quantity, price }) =>
					insertOrderItems(orderId, productId, quantity, price, quantity * price)
				)
			);
			setPlacedOrderId(orderId); // ← save orderId
			setShowConfirm(false);
			setOrderPlaced(true); // ← trigger success screen
			setSheetStatus('order_placed');
		} catch (err) {
			setError('Something went wrong. Please try again.');
			setShowConfirm(false);
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
					<FormField
						control={form.control}
						name="roomNo"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Room No.</FormLabel>
								<FormControl>
									<Input
										{...field}
										ref={roomNumRef}
										type="text"
										id="roomNo"
										placeholder="Enter room number"
										onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
											field.onChange(e);
											if (!isRoomNoValid(e.target.value)) {
												setError('Select a valid room');
												return;
											}
											setError('');
										}}
									/>
								</FormControl>
								{error && <p className="text-sm text-red-500">{error}</p>}
							</FormItem>
						)}
					/>

					<div className="space-y-2">
						<Button type="submit" className="w-full">
							Place Order
						</Button>
						<Button
							variant="outline"
							className="w-full"
							onClick={() => setSheetStatus('cart')}
						>
							Go Back
						</Button>
					</div>
				</form>
			</Form>

			{/* Confirmation Dialog */}
			<Dialog open={showConfirm} onOpenChange={setShowConfirm}>
				<DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-2xl border-0 shadow-2xl">
					{/* Header */}
					<div className="bg-black px-6 pt-6 pb-4">
						<DialogTitle className="text-white text-xl font-bold tracking-tight">
							Order Summary
						</DialogTitle>
						<DialogDescription className="text-zinc-400 text-sm mt-1">
							Room {pendingData?.roomNo} · {itemsCount} items
						</DialogDescription>
					</div>

					{/* Divider + Total */}
					<div className="px-6 py-4 bg-zinc-50 border-t border-zinc-100">
						<div className="flex justify-between items-center mt-2">
							<span className="text-base font-bold text-zinc-900">Total Payable</span>
							<span className="text-xl font-bold text-black">₹{total}</span>
						</div>
					</div>

					{/* Actions */}
					<div className="px-6 pb-6 pt-3 bg-zinc-50 flex flex-col gap-2">
						<Button
							onClick={handleConfirmOrder}
							disabled={loading}
							className="w-full bg-black hover:bg-zinc-800 text-white font-semibold rounded-xl h-12 text-base transition-all"
						>
							{loading ? (
								<span className="flex items-center gap-2">
									<svg
										className="animate-spin h-4 w-4"
										viewBox="0 0 24 24"
										fill="none"
									>
										<circle
											className="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											strokeWidth="4"
										/>
										<path
											className="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8v8z"
										/>
									</svg>
									Placing Order...
								</span>
							) : (
								'✓ Confirm Order'
							)}
						</Button>
						<Button
							variant="ghost"
							onClick={() => setShowConfirm(false)}
							disabled={loading}
							className="w-full text-zinc-500 hover:text-zinc-800 rounded-xl h-10"
						>
							Cancel
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
};
