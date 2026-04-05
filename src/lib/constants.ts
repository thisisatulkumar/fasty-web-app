import type { Database } from '@/types/supabase';

export type TableNames = keyof Database['public']['Tables'];
export const DB_TABLES: Record<string, TableNames> = {
	ALLOWED_USERS: 'allowed_users',
	CART: 'cart',
	CART_ITEMS: 'cart_items',
	DELIVERIES: 'deliveries',
	DELIVERY_OTPS: 'delivery_otps',
	ORDER_ITEMS: 'order_items',
	ORDERS: 'orders',
	PAYMENTS: 'payments',
	PRODUCTS: 'products',
	PROFILES: 'profiles',
} as const satisfies Record<string, TableNames>;

export const ALLOWED_EMAILS_DOMAIN = 'ietlucknow.ac.in';

export const ADMIN_EMAILS = [
	'2500520100023@ietlucknow.ac.in',
	'2500520100018@ietlucknow.ac.in',
	'2500521520003@ietlucknow.ac.in',
	'2500520310058@ietlucknow.ac.in',
];
