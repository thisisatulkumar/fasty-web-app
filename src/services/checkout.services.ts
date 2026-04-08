import { supabase } from '@/lib/supabase/client';
import type { RoomNumber } from '@/types/checkout.types';
import { Database } from '@/types/supabase';

type Order = Database['public']['Tables']['orders']['Insert'];
type OrderItem = Database['public']['Tables']['order_items']['Insert'];

export const placeOrder = async (
	roomNo: RoomNumber,
	userId: string,
	totalAmount: number
): Promise<string> => {
	const payload: Order = {
		user_id: userId,
		room_number: roomNo,
		total_amount: totalAmount,
		payment_method: 'COD',
		status: 'pending',
	};

	const { data, error } = await supabase.from('orders').upsert(payload).select('id').single();
	if (error) throw error;
	return data.id;
};

export const profileIdFromClerkId = async (userId: string): Promise<string> => {
	const { data } = await supabase.from('profiles').select('id').eq('clerk_id', userId).single();
	return data?.id ?? null;
};

export const insertOrderItems = async (
	orderId: string,
	productId: string,
	quantity: number,
	price: number,
	totalPrice: number
): Promise<void> => {
	const payload: OrderItem = {
		order_id: orderId,
		product_id: productId,
		quantity: quantity,
		price,
		total_price: totalPrice,
	};

	const { error } = await supabase.from('order_items').upsert(payload);
	if (error) throw error;
};
