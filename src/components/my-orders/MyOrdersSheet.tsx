'use client';

import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '../ui/button';
import MyOrderItemsGrid from './MyOrderItemGrid';

import { useIsMobile } from '@/hooks/use-mobile';
import useBackButton from '@/hooks/useBackButton';
import { useCallback, useEffect, useState } from 'react';
import useSheetFlow from '@/hooks/useSheetFlow';
import { Badge } from '../ui/badge';
import { useUser } from '@clerk/nextjs';
import { profileIdFromClerkId } from '@/services/checkout.services';
import { supabase } from '@/lib/supabase/client';

const MyOrdersSheet = () => {
	const isMobile = useIsMobile();
	const { sheetStatus, setSheetStatus } = useSheetFlow();

	const { user, isSignedIn, isLoaded } = useUser();

	const [orders, setOrders] = useState(0);

	const [open, setOpen] = useState(false);
	const onOpenChange = (open: boolean) => {
		setOpen(open);
		if (!open) closeSheet();
	};

	const closeSheet = () => {
		setOpen(false);
		setSheetStatus('cart');
	};

	const handleBack = useCallback(() => {
		if (isMobile) {
			closeSheet();
		}
	}, [isMobile, sheetStatus, closeSheet, setSheetStatus]);

	useEffect(() => {
		const fetchNumberOfPendingOrders = async () => {
			if (!user) return;
			const profileId = await profileIdFromClerkId(user?.id);
			const { data } = await supabase
				.from('orders')
				.select()
				.eq('user_id', profileId)
				.eq('status', 'pending');

			setOrders(data?.length ?? 0);
		};

		fetchNumberOfPendingOrders();
	}, [user, isSignedIn, isLoaded]);

	useBackButton(handleBack);

	return (
		<div>
			<Sheet open={open} onOpenChange={onOpenChange}>
				<SheetTrigger asChild>
					<Button
						className="relative"
						variant="outline"
						size={isMobile ? 'sm' : 'default'}
					>
						My Orders
						{orders !== 0 && (
							<Badge className="absolute -top-1 -right-1 h-4 min-w-4 px-1 flex items-center justify-center rounded-full  text-[10px]">
								{orders}
							</Badge>
						)}
					</Button>
				</SheetTrigger>

				<SheetContent
					side="right"
					className={`p-0 data-[side=bottom]:max-h-[50vh] data-[side=top]:max-h-[50vh] ${isMobile ? 'w-full' : ''}`}
				>
					<SheetHeader>
						<SheetTitle>My Orders</SheetTitle>
						<SheetDescription>Your order history</SheetDescription>
					</SheetHeader>

					<MyOrderItemsGrid />
				</SheetContent>
			</Sheet>
		</div>
	);
};

export default MyOrdersSheet;
