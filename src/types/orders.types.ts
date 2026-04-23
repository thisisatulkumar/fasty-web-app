export interface OrderItem {
	id: string;
	productName: string;
	price: number;
	quantity: number;
	totalPrice: number;
}

export interface Order {
	id: string;
	createdAt: string;
	totalAmount: number;
	roomNumber: string;
	paymentMethod: 'COD' | 'UPI';
	status: 'pending' | 'paid' | 'on_the_way' | 'delivered' | 'failed';
	itemsCount: number;
	items: OrderItem[];
}

export interface OrdersGroupedByDate {
	date: string;
	orders: Order[];
}
