'use client';

import AuthButtons from '@/components/navbar/AuthButtons';
import SheetSide from '../cart/CartSheet';
import MyOrdersSheet from '../my-orders/MyOrdersSheet';

export default function NavbarActions() {
	return (
		<div className="flex items-center gap-2 md:gap-4">
			<SheetSide />
			<MyOrdersSheet />
			<AuthButtons />
		</div>
	);
}
