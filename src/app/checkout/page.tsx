'use client';

import { SummaryTable } from '@/components/checkout/OrderSummary';
import { NoRefundNotice } from '@/components/checkout/NoRefundNotice';
import { CheckoutForm } from '@/components/checkout/CheckOutForm';
import { useState } from 'react';
import { OrderPlaced } from '@/components/OrderPlaced';
import { billAmount } from '@/utils/cart.utils';
import { cartItems } from '@/data/cart.data';
import { z } from 'zod';
import { ROOM_NUMBERS } from '@/constants/allowedRooms';

const formSchema = z.object({
	roomNo: z.enum(ROOM_NUMBERS),
});

type FormData = z.infer<typeof formSchema>;

const Page = () => {
	const [orderPlaced, setOrderPlaced] = useState(false);
	const [placedOrderId, setPlacedOrderId] = useState<string>('');
	const [pendingData, setPendingData] = useState<FormData | null>(null);

	if (orderPlaced) {
		return (
			<OrderPlaced
				orderId={placedOrderId}
				roomNo={pendingData?.roomNo ?? ''}
				totalAmount={billAmount}
				itemCount={cartItems.length}
			/>
		);
	}
	return (
		<div>
			<SummaryTable />
			<NoRefundNotice />
			<CheckoutForm
				pendingData={pendingData}
				setOrderPlaced={setOrderPlaced}
				setPendingData={setPendingData}
				setPlacedOrderId={setPlacedOrderId}
			/>
		</div>
	);
};

export default Page;
