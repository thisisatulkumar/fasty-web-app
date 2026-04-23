'use server';

import { createClient } from '@/lib/supabase/server';
import { DB_TABLES } from '@/lib/constants';
import { Order, OrderItem } from '@/types/orders.types';
import { Database } from '@/types/supabase';

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
