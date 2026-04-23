import { Order, OrdersGroupedByDate } from '@/types/orders.types';

const TIME_SLOTS = [
	{ start: '10:00', end: '10:15', period: 'AM' },
	{ start: '12:15', end: '12:30', period: 'PM' },
	{ start: '16:50', end: '17:00', period: 'PM' },
	{ start: '19:45', end: '20:00', period: 'PM' },
	{ start: '22:00', end: '22:15', period: 'PM' },
	{ start: '23:50', end: '00:00', period: 'AM' },
];

export function getNextTimeSlot(referenceDate?: Date): string {
	const now = referenceDate || new Date();
	const currentHours = now.getHours();
	const currentMinutes = now.getMinutes();
	const currentTimeInMinutes = currentHours * 60 + currentMinutes;

	for (const slot of TIME_SLOTS) {
		const [startHours, startMinutes] = slot.start.split(':').map(Number);
		const slotStartInMinutes = startHours * 60 + startMinutes;

		if (slotStartInMinutes > currentTimeInMinutes) {
			return `${slot.start}-${slot.end} ${slot.period}`;
		}
	}

	// If no slot found today, return the first slot (tomorrow)
	return `${TIME_SLOTS[0].start}-${TIME_SLOTS[0].end} ${TIME_SLOTS[0].period}`;
}

export function formatDeliverySlot(slotString: string): string {
	// Input: "10:00-10:15 AM" or "16:50-17:00 PM" or "23:50-00:00 AM"
	// Output: "10:00 AM - 10:15 AM" or "4:50 PM - 5:00 PM"
	const match = slotString.match(/^(\d{2}):(\d{2})-(\d{2}):(\d{2})\s(AM|PM)$/);
	if (!match) return slotString;

	const [, startHourStr, startMinStr, endHourStr, endMinStr, period] = match;
	const startHour = parseInt(startHourStr);
	const endHour = parseInt(endHourStr);

	// Convert to 12-hour format
	const convert24to12 = (hour: number): number => {
		if (hour === 0) return 12;
		if (hour > 12) return hour - 12;
		return hour;
	};

	const start12Hour = convert24to12(startHour);
	const end12Hour = convert24to12(endHour);

	return `${start12Hour}:${startMinStr} ${period} - ${end12Hour}:${endMinStr} ${period}`;
}

export function groupOrdersByDate(orders: Order[]): OrdersGroupedByDate[] {
	const grouped = new Map<string, Order[]>();

	orders.forEach((order) => {
		const date = new Date(order.createdAt);
		const dateKey = date.toLocaleDateString('en-IN', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		});

		if (!grouped.has(dateKey)) {
			grouped.set(dateKey, []);
		}
		grouped.get(dateKey)!.push(order);
	});

	// Convert to array and maintain order
	return Array.from(grouped.entries()).map(([date, groupedOrders]) => ({
		date,
		orders: groupedOrders,
	}));
}

export function formatOrderTime(dateString: string): string {
	const date = new Date(dateString);
	return date
		.toLocaleTimeString('en-IN', {
			hour: '2-digit',
			minute: '2-digit',
			hour12: true,
		})
		.toUpperCase();
}

export function getStatusColor(status: string): string {
	switch (status) {
		case 'pending':
			return 'bg-yellow-100 text-yellow-800';
		case 'paid':
			return 'bg-blue-100 text-blue-800';
		case 'on_the_way':
			return 'bg-purple-100 text-purple-800';
		case 'delivered':
			return 'bg-green-100 text-green-800';
		case 'failed':
			return 'bg-red-100 text-red-800';
		default:
			return 'bg-gray-100 text-gray-800';
	}
}
