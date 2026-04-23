'use server';

import { createClient } from '@/lib/supabase/server';
import { DB_TABLES } from '@/lib/constants';
import { Order, OrderItem, OrdersGroupedByDate } from '@/types/orders.types';
import { Database } from '@/types/supabase';
import { profileIdFromClerkId } from './checkout.services';

type DatabaseOrder = Database['public']['Tables']['orders']['Row'];
type DatabaseOrderItem = Database['public']['Tables']['order_items']['Row'];

export async function getUserOrders(userId: string): Promise<Order[]> {
	const supabase = await createClient();

	const { data: ordersData, error: ordersError } = await supabase
		.from(DB_TABLES.ORDERS)
		.select('*')
		.eq('user_id', userId)
		.order('created_at', { ascending: false })
		.overrideTypes<DatabaseOrder[]>();

	if (ordersError) {
		throw new Error('Failed to fetch orders');
	}

	if (!ordersData || ordersData.length === 0) {
		return [];
	}

	// Fetch order items for all orders
	const orderIds = ordersData.map((order) => order.id);
	const { data: orderItemsData, error: itemsError } = await supabase
		.from(DB_TABLES.ORDER_ITEMS)
		.select('*, products(name)')
		.in('order_id', orderIds)
		.overrideTypes<(DatabaseOrderItem & { products: { name: string } | null })[]>();

	if (itemsError) {
		throw new Error('Failed to fetch order items');
	}

	// Map items to orders
	const itemsByOrderId = new Map<string, OrderItem[]>();
	if (orderItemsData) {
		orderItemsData.forEach((item) => {
			const items = itemsByOrderId.get(item.order_id) || [];
			items.push({
				id: item.id,
				productName: item.products?.name || 'Unknown Product',
				price: item.price || 0,
				quantity: item.quantity || 0,
				totalPrice: item.total_price || 0,
			});
			itemsByOrderId.set(item.order_id, items);
		});
	}

	// Transform orders data
	const orders: Order[] = ordersData.map((order) => {
		const items = itemsByOrderId.get(order.id) || [];
		return {
			id: order.id,
			createdAt: order.created_at,
			totalAmount: order.total_amount || 0,
			roomNumber: order.room_number || 'N/A',
			paymentMethod: order.payment_method as 'COD' | 'UPI',
			status: order.status as 'pending' | 'paid' | 'on_the_way' | 'delivered' | 'failed',
			itemsCount: items.length,
			items,
		};
	});

	return orders;
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
	return date.toLocaleTimeString('en-IN', {
		hour: '2-digit',
		minute: '2-digit',
		hour12: true,
	});
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
