'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';

import { ROOM_NUMBERS } from '@/constants/allowedRooms';
import { checkRoom } from '@/utils/checkout.utils';
import { useUser } from '@clerk/nextjs';
import { profileIdFromClerkId, PlaceOrder, insertOrderItems } from '@/services/checkout.services';
import { billAmount, getItemsCount } from '@/utils/cart.utils';
import useCartStore from '@/store/cart.store';

const formSchema = z.object({
	roomNo: z.enum(ROOM_NUMBERS),
});

type FormData = z.infer<typeof formSchema>;

interface CheckoutFormProps {
	pendingData: FormData | null;
	setOrderPlaced: (orderPlaced: boolean) => void;
	setPlacedOrderId: (orderId: string) => void;
	setPendingData: (pendingData: FormData | null) => void;
	setSheetStatus: (sheetStatus: 'order_placed') => void;
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
		if (!checkRoom(roomNo)) {
			setError('Select a valid room');
			return;
		}
		setError('');
		setPendingData(data);
		setShowConfirm(true);
	};

	// Step 2 - actually place the order
	const handleConfirmOrder = async () => {
		if (!pendingData || !user) return;
		setLoading(true);
		try {
			const id = await profileIdFromClerkId(user.id);
			const orderId = await PlaceOrder(pendingData.roomNo, id, billAmount(items));
			await Promise.all(
				items.map(({ product_id, quantity, price }) =>
					insertOrderItems(orderId, product_id, quantity, price, quantity * price)
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
										type="text"
										id="roomNo"
										placeholder="Enter room number"
										onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
											field.onChange(e);
											if (!checkRoom(e.target.value)) {
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

					<Button type="submit" className="w-full">
						Place Order
					</Button>
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
							Room {pendingData?.roomNo} · {getItemsCount(items)} items
						</DialogDescription>
					</div>

					{/* Divider + Total */}
					<div className="px-6 py-4 bg-zinc-50 border-t border-zinc-100">
						<div className="flex justify-between items-center mt-2">
							<span className="text-base font-bold text-zinc-900">Total Payable</span>
							<span className="text-xl font-bold text-black">
								₹{billAmount(items)}
							</span>
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
