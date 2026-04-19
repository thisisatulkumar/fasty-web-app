import { DB_TABLES } from '@/lib/constants';
import { supabase } from '@/lib/supabase/client';

export const addProduct = async (image_url: string, name: string, price: number, stock: number) => {
	const { error } = await supabase
		.from(DB_TABLES.PRODUCTS)
		.insert({ image_url, name, price, stock });

	if (error) throw { message: 'Failed to add product' };
};

export const getProducts = async () => {
	const { data, error } = await supabase
		.from(DB_TABLES.PRODUCTS)
		.select()
		.eq('is_deleted', false)
		.order('name', { ascending: true });

	if (error) throw { message: 'Failed to fetch products' };

	return data;
};

export const updateProduct = async (
	id: string,
	image_url: string,
	name: string,
	price: number,
	stock: number
) => {
	const { error } = await supabase
		.from(DB_TABLES.PRODUCTS)
		.update({ image_url, name, price, stock })
		.eq('id', id);

	if (error) throw { message: 'Failed to update product' };
};

export const deleteProduct = async (productId: string) => {
	const { error } = await supabase
		.from(DB_TABLES.PRODUCTS)
		.update({ is_deleted: true })
		.eq('id', productId);

	if (error) throw { message: 'Failed to delete product' };
};
