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
import { billAmount, getItemsCount } from '@/utils/cart.utils';
import { SummaryTable } from '../checkout/OrderSummary';
import { NoRefundNotice } from '../checkout/NoRefundNotice';
import { CheckoutForm } from '../checkout/CheckOutForm';

interface SheetSideProps {
	children: React.ReactNode;
}

export default function SheetSide({ children }: SheetSideProps) {
	const {
		sheetStatus,
		setSheetStatus,
		placedOrderId,
		pendingData,
		items,
		setOrderPlaced,
		setPendingData,
		setPlacedOrderId,
	} = useSheetFlow();

	return (
		<div className="flex flex-wrap gap-2">
			<Sheet>
				<SheetTrigger>{children}</SheetTrigger>

				{sheetStatus === 'cart' ? (
					<SheetContent
						side="right"
						className="p-0 data-[side=bottom]:max-h-[50vh] data-[side=top]:max-h-[50vh]"
					>
						<SheetHeader>
							<SheetTitle>My Cart</SheetTitle>
							<SheetDescription>Your cart items</SheetDescription>
						</SheetHeader>

						<CartItemsGrid />

						<SheetFooter>
							<CartSummary setSheetStatus={setSheetStatus} />
						</SheetFooter>
					</SheetContent>
				) : sheetStatus === 'checkout' ? (
					<SheetContent
						side="right"
						className="p-0 data-[side=bottom]:max-h-[50vh] data-[side=top]:max-h-[50vh]"
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
						className="p-0 data-[side=bottom]:max-h-[50vh] data-[side=top]:max-h-[50vh]"
					>
						<SheetHeader></SheetHeader>

						<OrderPlaced
							orderId={placedOrderId}
							roomNo={pendingData?.roomNo ?? ''}
							totalAmount={billAmount(items)}
							itemCount={getItemsCount(items)}
							setSheetStatus={setSheetStatus}
						/>
						<SheetFooter></SheetFooter>
					</SheetContent>
				)}
			</Sheet>
		</div>
	);
}
