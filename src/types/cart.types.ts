export interface Item {
	product_id: string;
	name: string;
	image: string;
	price: number;
	quantity: number;
	stock: number;
}

export interface Cart {
	items: Item[];
	addItem: (item: Item) => void;
	removeItem: (id: string) => void;
	updateQuantity: (id: string, quantity: number) => void;
}
