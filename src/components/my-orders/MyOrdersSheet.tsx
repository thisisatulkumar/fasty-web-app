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
import { pushSentinel, removeSentinels, useBackButton } from '@/hooks/useBackButton';
import { useEffect, useRef, useState } from 'react';
import { Badge } from '../ui/badge';
import { useUser } from '@clerk/nextjs';
import { profileIdFromClerkId } from '@/services/checkout.services';
import { supabase } from '@/lib/supabase/client';

const MyOrdersSheet = () => {
	const isMobile = useIsMobile();
	const { user, isSignedIn, isLoaded } = useUser();

	const [orders, setOrders] = useState(0);
	const [open, setOpen] = useState(false);

	// Tracks how many sentinel entries we've pushed that haven't been
	// consumed by a back-press yet.
	const sentinelCount = useRef(0);

	/**
	 * The ONE place that closes the sheet.
	 * If called after a back-press, the browser already popped one sentinel,
	 * so sentinelCount has been decremented before this runs.
	 * If called from the ✕ button / outside click, all sentinels remain and
	 * must be rewound.
	 */
	const closeSheet = () => {
		const toRemove = sentinelCount.current;
		sentinelCount.current = 0;
		removeSentinels(toRemove); // no-op when toRemove === 0
		setOpen(false);
	};

	const openSheet = () => {
		setOpen(true);
		if (isMobile) {
			pushSentinel();
			sentinelCount.current = 1;
		}
	};

	const onOpenChange = (isOpen: boolean) => {
		// isOpen=true  → SheetTrigger click (openSheet handles this via the button)
		// isOpen=false → ✕ button or outside-click; back-press never triggers this
		//                because we never call setOpen(false) inside useBackButton.
		if (!isOpen) closeSheet();
	};

	// Called by the browser back-press. The sentinel pop already happened,
	// so we just update React state and decrement the counter.
	// We do NOT call setOpen(false) here to avoid triggering onOpenChange.
	useBackButton(() => {
		sentinelCount.current = Math.max(0, sentinelCount.current - 1);
		// Use the internal setter directly so onOpenChange is NOT called.
		setOpen(false);
	}, open && isMobile);

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

	return (
		<div>
			<Sheet open={open} onOpenChange={onOpenChange}>
				<SheetTrigger asChild>
					<Button
						className="relative"
						variant="outline"
						size={isMobile ? 'sm' : 'default'}
						onClick={openSheet}
					>
						My Orders
						{orders !== 0 && (
							<Badge className="absolute -top-1 -right-1 h-4 min-w-4 px-1 flex items-center justify-center rounded-full text-[10px]">
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

					<MyOrderItemsGrid closeSheet={closeSheet} />
				</SheetContent>
			</Sheet>
		</div>
	);
};

export default MyOrdersSheet;
