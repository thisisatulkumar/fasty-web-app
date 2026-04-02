export type AdminError = {
	message: string;
};

export type Product = {
	id: string;
	image_url: string;
	name: string;
	price: number;
	stock: number;
};

export type OrderWithDetails = {
	id: string;
	total_amount: number;
	room_number: string;
	payment_method: 'COD' | 'UPI';
	status: 'pending' | 'paid' | 'on_the_way' | 'delivered' | 'failed';
	created_at: string;

	user: {
		id: string;
		name: string;
		email: string;
	};

	items: {
		id: string;
		quantity: number;
		price: number;
		total_price: number;
		product: {
			id: string;
			name: string;
			image_url: string;
		};
	}[];
};
