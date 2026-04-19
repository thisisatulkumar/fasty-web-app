import { createClient } from '@/lib/supabase/server';
import { DB_TABLES } from '@/lib/constants';
import { Product } from '@/types/product.types';
import { Database } from '@/types/supabase';

type DatabaseProduct = Database['public']['Tables']['products']['Row'];

export async function getProducts(): Promise<Product[]> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.from(DB_TABLES.PRODUCTS)
		.select('*')
		.gt('stock', 0)
		.eq('is_deleted', false)
		.overrideTypes<DatabaseProduct[]>();

	if (error) {
		throw new Error('Failed to fetch products');
	}

	return data.map(({ id, image_url, name, price, stock }) => ({
		id,
		imageUrl: image_url,
		name,
		price,
		stock,
	}));
}
