export interface CartItem {
	productId: string;
	name: string;
	image: string;
	price: number;
	quantity: number;
	stock: number;
}

export interface Cart {
	items: CartItem[];
	addItem: (item: CartItem) => void;
	removeItem: (id: string) => void;
	updateQuantity: (id: string, quantity: number) => void;
	clearCart: () => void;
}
