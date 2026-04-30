'use client';

import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle } from '@/components/ui/drawer';
import { insertOrderItems, placeOrder, profileIdFromClerkId } from '@/services/checkout.services';
import { supabase } from '@/lib/supabase/client';
import ShowConfirm from './ShowConfirm';
import Trigger from './Trigger';
import PlaceOrder from './PlaceOrder';
import ProductCardSkeleton from '../products/ProductCartSkeleton';
import Countdown from './Countdown';

const AutoCad = () => {
	const { user, isLoaded, isSignedIn } = useUser();

	const [showConfirm, setShowConfirm] = useState(false);
	const [step, setStep] = useState(0);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [hasBought, setHasBought] = useState(false);
	const [isSenior, setIsSenior] = useState(false);
	const [isBuying, setIsBuying] = useState(false);
	const [isLoadingHasBought, setIsLoadingHasBought] = useState(true);
	const [isFromOtherBranch, setIsFromOtherBranch] = useState(false);

	const isMobile = useIsMobile();

	const price: number = 20;

	useEffect(() => {
		if (!user) return;

		const email = user.primaryEmailAddress?.emailAddress;
		if (!email) return;

		const year = parseInt(email[0] + email[1]);
		if (year < 25) {
			setIsSenior(true);
		} else {
			setIsSenior(false);
		}

		const rollNo = email.split('@')[0];
		const branchCode = rollNo.substring(7, 11);

		if (['1000', '1001', '0000', '5100'].includes(branchCode)) {
			setIsFromOtherBranch(false);
		} else {
			setIsFromOtherBranch(true);
		}
	}, [user, isSignedIn, isLoaded]);

	useEffect(() => {
		if (!user) {
			setIsLoadingHasBought(false);
			return;
		}

		const checkHasBought = async () => {
			setIsLoadingHasBought(true);

			const profileId = await profileIdFromClerkId(user.id);
			const { data } = await supabase
				.from('orders')
				.select('*')
				.eq('user_id', profileId)
				.eq('total_amount', 0);

			if (!data) {
				setHasBought(false);
			} else if (data.length === 0) {
				setHasBought(false);
			} else {
				setHasBought(true);
			}

			setIsLoadingHasBought(false);
		};

		checkHasBought();
	}, [user, isSignedIn, isLoaded]);

	useEffect(() => {
		if (!showConfirm) return;

		const timers = [
			setTimeout(() => setStep(1), 100),
			setTimeout(() => setStep(2), 600),
			setTimeout(() => setStep(3), 1000),
			setTimeout(() => setStep(4), 1400),
		];

		return () => timers.forEach(clearTimeout);
	}, [showConfirm]);

	const onSubmit = async () => {
		if (!user) {
			return;
		}

		setIsBuying(true);

		const profileId = await profileIdFromClerkId(user.id);
		const orderId = await placeOrder('101', profileId, price);
		await insertOrderItems(orderId, 'b403f967-5553-4fc1-9229-34b7f80a491a', 1, price, price);

		setShowConfirm(true);
		setHasBought(true);
		setIsBuying(false);
	};

	if (isSenior) return null;

	if (!isLoaded) return <ProductCardSkeleton />;

	return (
		<Card className="relative">
			<CardContent className="p-3">
				<Image
					src="https://xmilcbzxgstsgasraceh.supabase.co/storage/v1/object/public/product_images/1777396354215.jpg"
					alt="AutoCAD Assignment"
					width={400}
					height={160}
					className="w-full h-40 object-cover rounded-md"
				/>

				<h2 className="mt-2 text-sm font-medium">AutoCAD Assignment</h2>

				<div className="mt-2 flex items-center justify-between">
					<p className="text-sm text-muted-foreground">
						{price === 0 ? 'FREE' : `₹ ${price}`}
					</p>

					{isMobile ? (
						<Drawer open={dialogOpen} onOpenChange={(open) => setDialogOpen(open)}>
							{isLoaded && !isFromOtherBranch && (
								<Trigger
									isDrawer={false}
									hasBought={hasBought}
									isLoadingHasBought={isLoadingHasBought}
									isSignedIn={isSignedIn ?? false}
								/>
							)}

							<DrawerContent className="p-4">
								{showConfirm ? (
									<ShowConfirm step={step} setDialogOpen={setDialogOpen} />
								) : (
									<>
										<DrawerTitle>AutoCAD Assignment</DrawerTitle>
										<DrawerDescription>
											{price === 0 ? 'FREE' : `₹ ${price}`}
										</DrawerDescription>

										<PlaceOrder
											isBuying={isBuying}
											isDrawer={true}
											onSubmit={onSubmit}
										/>
									</>
								)}
							</DrawerContent>
						</Drawer>
					) : (
						<Dialog open={dialogOpen} onOpenChange={(open) => setDialogOpen(open)}>
							{isLoaded && !isFromOtherBranch && (
								<Trigger
									isDrawer={false}
									hasBought={hasBought}
									isLoadingHasBought={isLoadingHasBought}
									isSignedIn={isSignedIn ?? false}
								/>
							)}

							<DialogContent className="p-4">
								{showConfirm ? (
									<ShowConfirm step={step} setDialogOpen={setDialogOpen} />
								) : (
									<>
										<DialogTitle>AutoCAD Assignment</DialogTitle>
										<DialogDescription>
											{price === 0 ? 'FREE' : `₹ ${price}`}
										</DialogDescription>

										<PlaceOrder
											isBuying={isBuying}
											isDrawer={true}
											onSubmit={onSubmit}
										/>
									</>
								)}
							</DialogContent>
						</Dialog>
					)}
				</div>
			</CardContent>
		</Card>
	);
};

export default AutoCad;
