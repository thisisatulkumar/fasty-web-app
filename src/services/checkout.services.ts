import { supabase } from '@/lib/supabase/client';
import type { RoomNumber } from '@/types/checkout.types';

export const PlaceOrder = async (
	roomNo: RoomNumber,
	userId: string,
	totalAmount: number
): Promise<string> => {
	const { data, error } = await supabase
		.from('orders')
		.upsert({
			user_id: userId,
			total_amount: totalAmount,
			room_number: roomNo,
			payment_method: 'COD',
			status: 'pending',
		})
		.select('id')
		.single();
	if (error) throw error;
	return data.id;
};

export const profileIdFromClerkId = async (userId: string): Promise<string> => {
	const { data } = await supabase.from('profiles').select('id').eq('clerk_id', userId).single();
	return data?.id ?? null;
};

export const insertOrderItems = async (
	orderid: string,
	productid: string,
	qty: number,
	price: number,
	totalprice: number
): Promise<void> => {
	const { error } = await supabase.from('order_items').upsert({
		order_id: orderid,
		product_id: productid,
		quantity: qty,
		price: price,
		total_price: totalprice,
	});
	if (error) throw error;
};
