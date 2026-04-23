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

	/**
	 * The ONE place that fully closes and resets the sheet.
	 * Safe to call from ✕ button, outside-click, or programmatic close.
	 * NOT called from the back-press handler (which manages its own cleanup).
	 */
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
			pushSentinel(); // sentinel #1 — back from cart closes the sheet
			sentinelCount.current = 1;
		}
	};

	const goToCheckout = () => {
		setSheetStatus('checkout');
		if (isMobile) {
			pushSentinel(); // sentinel #2 — back from checkout → cart
			sentinelCount.current += 1;
		}
	};

	const onOpenChange = (isOpen: boolean) => {
		// isOpen=true is handled by openSheet() via the CartButton onClick.
		// isOpen=false only fires from ✕ / outside-click, never from back-press,
		// because the back handler uses setOpen(false) directly, bypassing
		// the Radix controlled-open callback chain.
		if (!isOpen) closeSheet();
	};

	useBackButton(() => {
		// The browser already popped one sentinel — decrement our count.
		sentinelCount.current = Math.max(0, sentinelCount.current - 1);

		if (sheetStatus === 'checkout') {
			// Go back to cart. One sentinel (#1) still remains for the
			// eventual cart → close back-press.
			setSheetStatus('cart');
			// Keep the sheet open — do NOT call setOpen or closeSheet.
		} else {
			// sheetStatus === 'cart' or 'order_placed': close entirely.
			// All sentinels have been consumed (count is now 0), so no rewind needed.
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
