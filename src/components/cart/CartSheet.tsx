'use client';

import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet';
import CartItemsGrid from './CartItemsGrid';
import CartSummary from './CartSummary';
import useSheetFlow from '@/hooks/useSheetFlow';
import { OrderPlaced } from '../OrderPlaced';
import { SummaryTable } from '../checkout/OrderSummary';
import { NoRefundNotice } from '../checkout/NoRefundNotice';
import { CheckoutForm } from '../checkout/CheckOutForm';
import CartButton from '../navbar/CartButton';
import { useCartCount, useCartTotal } from '@/store/cart.selectors';
import { useRef, useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { pushSentinel, removeSentinels, useBackButton } from '@/hooks/useBackButton';
import { formatDeliverySlot, getNextTimeSlot } from '@/utils/orders.utils';

export default function CartSheet() {
	const {
		sheetStatus,
		setSheetStatus,
		placedOrderId,
		pendingData,
		setOrderPlaced,
		setPendingData,
		setPlacedOrderId,
	} = useSheetFlow();

	const total = useCartTotal();
	const itemsCount = useCartCount();
	const isMobile = useIsMobile();

	const [open, setOpen] = useState(false);
	const sentinelCount = useRef(0);

	const closeSheet = () => {
		const toRemove = sentinelCount.current;
		sentinelCount.current = 0;
		removeSentinels(toRemove);
		setOpen(false);
		setSheetStatus('cart');
	};

	const openSheet = () => {
		setOpen(true);
		if (isMobile) {
			pushSentinel();
			sentinelCount.current = 1;
		}
	};

	const goToCheckout = () => {
		setSheetStatus('checkout');
		if (isMobile) {
			pushSentinel();
			sentinelCount.current += 1;
		}
	};

	const onOpenChange = (isOpen: boolean) => {
		if (!isOpen) closeSheet();
	};

	useBackButton(() => {
		sentinelCount.current = Math.max(0, sentinelCount.current - 1);

		if (sheetStatus === 'checkout') {
			setSheetStatus('cart');
		} else {
			setOpen(false);
			setSheetStatus('cart');
		}
	}, open && isMobile);

	return (
		<div className="flex flex-wrap gap-2">
			<Sheet open={open} onOpenChange={onOpenChange}>
				<SheetTrigger asChild>
					<CartButton onClick={openSheet} />
				</SheetTrigger>

				{sheetStatus === 'cart' ? (
					<SheetContent
						side="right"
						className={`p-0 data-[side=bottom]:max-h-[50vh] data-[side=top]:max-h-[50vh] ${isMobile ? 'w-full' : ''}`}
					>
						<SheetHeader>
							<SheetTitle>My Cart</SheetTitle>
							<SheetDescription>Your cart items</SheetDescription>
						</SheetHeader>

						<CartItemsGrid closeSheet={closeSheet} />

						<SheetFooter className="px-2 pb-3 pt-0">
							<CartSummary setSheetStatus={goToCheckout} />
						</SheetFooter>
					</SheetContent>
				) : sheetStatus === 'checkout' ? (
					<SheetContent
						side="right"
						className={`p-0 data-[side=bottom]:max-h-[50vh] data-[side=top]:max-h-[50vh] ${isMobile ? 'w-full' : ''}`}
					>
						<SheetHeader>
							<SheetTitle>Checkout</SheetTitle>
							<SheetDescription>Checkout</SheetDescription>
						</SheetHeader>

						<p className="text-center">
							<strong>Delivery Slot: </strong>{' '}
							<span>{formatDeliverySlot(getNextTimeSlot())}</span>
						</p>
						<SummaryTable />
						<NoRefundNotice />

						<SheetFooter>
							<CheckoutForm
								pendingData={pendingData}
								setOrderPlaced={setOrderPlaced}
								setPendingData={setPendingData}
								setPlacedOrderId={setPlacedOrderId}
								setSheetStatus={setSheetStatus}
							/>
						</SheetFooter>
					</SheetContent>
				) : (
					<SheetContent
						side="right"
						className={`p-0 data-[side=bottom]:max-h-[50vh] data-[side=top]:max-h-[50vh] ${isMobile ? 'w-full' : ''}`}
					>
						<OrderPlaced
							orderId={placedOrderId}
							roomNo={pendingData?.roomNo ?? ''}
							totalAmount={total}
							itemCount={itemsCount}
							setSheetStatus={setSheetStatus}
							closeSheet={closeSheet}
						/>
					</SheetContent>
				)}
			</Sheet>
		</div>
	);
}
