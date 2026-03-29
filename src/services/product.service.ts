import { createClient } from '@/lib/supabase/server';
import { DB_TABLES } from '@/lib/constants';
import { Product } from '@/types/product.types';

export async function getProducts(): Promise<Product[]> {
	const supabase = await createClient();

	const { data, error } = await supabase.from(DB_TABLES.PRODUCTS).select('*');

	if (error) {
		throw new Error('Failed to fetch products');
	}

	return data as Product[];
}
