'use client';

import { useEffect, useState } from 'react';
import MyOrderItem from './MyOrderItem';
import { OrdersGroupedByDate } from '@/types/orders.types';
import { getUserOrders } from '@/services/myOrders.services';
import { groupOrdersByDate } from '@/utils/orders.utils';
import { useAuth } from '@clerk/nextjs';
import { Separator } from '@/components/ui/separator';
import { profileIdFromClerkId } from '@/services/checkout.services';
import { Button } from '../ui/button';

interface MyOrderItemsGridProps {
	closeSheet: () => void;
}

export default function MyOrderItemsGrid({ closeSheet }: MyOrderItemsGridProps) {
	const [orders, setOrders] = useState<OrdersGroupedByDate[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const { userId } = useAuth();

	useEffect(() => {
		const fetchOrders = async () => {
			if (!userId) {
				setError('User not authenticated');
				setIsLoading(false);
				return;
			}

			try {
				setIsLoading(true);
				const profileId = await profileIdFromClerkId(userId);
				const fetchedOrders = await getUserOrders(profileId);
				const groupedOrders = groupOrdersByDate(fetchedOrders);
				setOrders(groupedOrders);
				setError(null);
			} catch {
				setError('Failed to load orders. Please try again.');
			} finally {
				setIsLoading(false);
			}
		};

		fetchOrders();
	}, [userId]);

	if (isLoading) {
		return (
			<div className="flex flex-col items-center justify-center py-8">
				<div className="animate-spin w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full"></div>
				<p className="mt-2 text-sm text-gray-500">Loading orders...</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex flex-col items-center justify-center py-8 px-4">
				<p className="text-sm text-red-600 text-center">{error}</p>
			</div>
		);
	}

	if (orders.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-12 px-4">
				<div className="text-center">
					<p className="text-sm md:text-base font-semibold text-gray-900">
						No orders yet
					</p>
					<p className="text-xs md:text-sm text-gray-500 mt-1">
						You haven't placed any orders.
					</p>
					<Button variant="outline" onClick={closeSheet} className="mt-4">
						Shop Now
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col overflow-y-auto overflow-x-hidden space-y-4 p-4">
			{orders.map((dateGroup) => (
				<div key={dateGroup.date}>
					{/* Date Separator */}
					<div className="flex items-center gap-3 my-4">
						<Separator className="flex-1" />
						<span className="text-xs md:text-sm font-semibold text-gray-600 px-2">
							{dateGroup.date}
						</span>
						<Separator className="flex-1" />
					</div>

					{/* Orders for this date */}
					<div className="space-y-2">
						{dateGroup.orders.map((order) => (
							<MyOrderItem key={order.id} {...order} />
						))}
					</div>
				</div>
			))}
		</div>
	);
}
