'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Item, ItemContent } from '@/components/ui/item';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Order } from '@/types/orders.types';
import {
	formatOrderTime,
	getStatusColor,
	getNextTimeSlot,
	formatDeliverySlot,
} from '@/utils/orders.utils';

export default function MyOrderItem({ createdAt, totalAmount, status, itemsCount, items }: Order) {
	const [isExpanded, setIsExpanded] = useState(false);

	const orderTime = formatOrderTime(createdAt);
	const deliverySlot = status === 'pending' ? getNextTimeSlot(new Date(createdAt)) : null;

	const statusColor = getStatusColor(status);
	const statusLabel = status
		.split('_')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');

	return (
		<div className="w-full">
			{/* Order Summary Row */}
			<Item
				variant="outline"
				className="w-full p-0 border-none px-4 py-3 rounded-xl bg-white cursor-pointer hover:bg-gray-50 transition-colors"
				onClick={() => setIsExpanded(!isExpanded)}
			>
				<ItemContent>
					<div className="flex items-center gap-3 w-full">
						{/* Expand Icon */}
						<div className="shrink-0">
							{isExpanded ? (
								<ChevronUp className="w-5 h-5 text-gray-600" />
							) : (
								<ChevronDown className="w-5 h-5 text-gray-600" />
							)}
						</div>

						{/* Order Details */}
						<div className="flex-1 min-w-0">
							{/* Items and Count */}
							<p className="text-xs md:text-sm text-gray-500 mt-1">
								{itemsCount} item{itemsCount !== 1 ? 's' : ''} • {orderTime}
							</p>
							{/* Delivery Slot for Pending Orders */}
							{deliverySlot && (
								<p className="text-xs text-gray-400 mt-1">
									Delivery:{' '}
									<span className="font-semibold">
										{formatDeliverySlot(deliverySlot)}
									</span>
								</p>
							)}
						</div>

						{/* Price and Status */}
						<div className="flex items-center gap-3 shrink-0">
							<div className="text-right">
								<p className="text-sm md:text-base font-semibold text-gray-900">
									₹{totalAmount}
								</p>
							</div>
							<Badge className={`${statusColor} border-0 text-xs`}>
								{statusLabel}
							</Badge>
						</div>
					</div>
				</ItemContent>
			</Item>

			{/* Expanded Details - Items Table */}
			{isExpanded && (
				<div className="mt-2 px-4 py-3 bg-gray-50 rounded-xl overflow-x-auto">
					<Table>
						<TableHeader>
							<TableRow className="border-b border-gray-200">
								<TableHead className="text-xs font-semibold">S.No</TableHead>
								<TableHead className="text-xs font-semibold">Name</TableHead>
								<TableHead className="text-xs font-semibold">Price</TableHead>
								<TableHead className="text-xs font-semibold">Qty</TableHead>
								<TableHead className="text-right text-xs font-semibold">
									Total
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{items.map((item, index) => (
								<TableRow key={item.id} className="border-b border-gray-200">
									<TableCell className="text-xs py-2">{index + 1}</TableCell>
									<TableCell className="text-xs py-2 truncate max-w-xs">
										{item.productName}
									</TableCell>
									<TableCell className="text-xs py-2">₹{item.price}</TableCell>
									<TableCell className="text-xs py-2">{item.quantity}</TableCell>
									<TableCell className="text-right text-xs py-2 font-semibold">
										₹{item.totalPrice}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			)}
		</div>
	);
}
