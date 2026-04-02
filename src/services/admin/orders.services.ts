import { supabase } from '@/lib/supabase/client';
import type { OrderWithDetails } from '@/types/admin.types';

type OrderStatus = OrderWithDetails['status'];

export async function fetchAllOrders(): Promise<OrderWithDetails[]> {
	// 1. Fetch all orders with user info
	const { data: orders, error: ordersError } = await supabase
		.from('orders')
		.select(
			`
			id,
			total_amount,
			room_number,
			payment_method,
			status,
			created_at,
			user:profiles!user_id ( id, first_name, last_name, email )
		`
		)
		.order('created_at', { ascending: false });

	if (ordersError) throw new Error(`Failed to fetch orders: ${ordersError.message}`);

	const orderIds = orders.map((o) => o.id);

	// 2. Fetch all order_items for those orders
	const { data: orderItems, error: itemsError } = await supabase
		.from('order_items')
		.select(
			`
			id,
			order_id,
			quantity,
			price,
			total_price,
			product_id
		`
		)
		.in('order_id', orderIds);

	if (itemsError) throw new Error(`Failed to fetch order items: ${itemsError.message}`);

	const productIds = [...new Set(orderItems.map((i) => i.product_id))];

	// 3. Fetch all products referenced by those items
	const { data: products, error: productsError } = await supabase
		.from('products')
		.select(`id, name, image_url`)
		.in('id', productIds);

	if (productsError) throw new Error(`Failed to fetch products: ${productsError.message}`);

	// 4. Assemble in memory
	const productMap = new Map(products.map((p) => [p.id, p]));

	const itemsByOrderId = new Map<string, OrderWithDetails['items']>();
	for (const item of orderItems) {
		if (!itemsByOrderId.has(item.order_id)) {
			itemsByOrderId.set(item.order_id, []);
		}
		itemsByOrderId.get(item.order_id)!.push({
			id: item.id,
			quantity: item.quantity,
			price: item.price,
			total_price: item.total_price,
			product: productMap.get(item.product_id)!,
		});
	}

	return orders.map((order) => {
		const user = order.user as unknown as {
			id: string;
			first_name: string;
			last_name: string;
			email: string;
		};

		return {
			id: order.id,
			total_amount: order.total_amount,
			room_number: order.room_number,
			payment_method: order.payment_method,
			status: order.status,
			created_at: order.created_at,
			user: {
				id: user.id,
				email: user.email,
				name: `${user.first_name} ${user.last_name}`.trim() || user.email.split('@')[0],
			},
			items: itemsByOrderId.get(order.id) ?? [],
		};
	});
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
	const { error } = await supabase.from('orders').update({ status }).eq('id', orderId);

	if (error) throw new Error(`Failed to update order status: ${error.message}`);
}
