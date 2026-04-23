'use client';

import AuthButtons from '@/components/navbar/AuthButtons';
import SheetSide from '../cart/CartSheet';
import MyOrdersSheet from '../my-orders/MyOrdersSheet';
import { useUser } from '@clerk/nextjs';

export default function NavbarActions() {
	const { user, isLoaded, isSignedIn } = useUser();

	return (
		<div className="flex items-center gap-2 md:gap-4">
			<SheetSide />
			{isLoaded && isSignedIn && user && <MyOrdersSheet />}
			<AuthButtons />
		</div>
	);
}
