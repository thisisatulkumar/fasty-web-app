import { useState } from 'react';
import useCartStore from '@/store/cart.store';
import { z } from 'zod';
import { ROOM_NUMBERS } from '@/lib/constants';

const formSchema = z.object({
	roomNo: z.enum(ROOM_NUMBERS),
});
type FormData = z.infer<typeof formSchema>;

const useSheetFlow = () => {
	const [sheetStatus, setSheetStatus] = useState<'cart' | 'checkout' | 'order_placed'>('cart');
	const [orderPlaced, setOrderPlaced] = useState(false);
	const [placedOrderId, setPlacedOrderId] = useState<string>('');
	const [pendingData, setPendingData] = useState<FormData | null>(null);
	const { items } = useCartStore();

	return {
		sheetStatus,
		setSheetStatus,
		orderPlaced,
		setOrderPlaced,
		placedOrderId,
		setPlacedOrderId,
		pendingData,
		setPendingData,
		items,
	};
};

export default useSheetFlow;
