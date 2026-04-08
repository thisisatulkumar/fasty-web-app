import {
	Table,
	TableBody,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import useCartStore from '@/store/cart.store';
import { useCartTotal } from '@/store/cart.selectors';

export const SummaryTable = () => {
	const { items: cartItems } = useCartStore();
	const total = useCartTotal();

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>#</TableHead>
					<TableHead>Item</TableHead>
					<TableHead>Price</TableHead>
					<TableHead>Qty</TableHead>
					<TableHead className="text-right">Total</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{cartItems.map(({ name, price, quantity }, index) => (
					<TableRow key={index}>
						<TableCell>{index + 1}</TableCell>
						<TableCell>{name}</TableCell>
						<TableCell>₹{price}</TableCell>
						<TableCell>{quantity}</TableCell>
						<TableCell className="text-right">₹{price * quantity}</TableCell>
					</TableRow>
				))}
			</TableBody>
			<TableFooter>
				<TableRow>
					<TableCell colSpan={4}>Total</TableCell>
					<TableCell className="text-right">₹{total}</TableCell>
				</TableRow>
			</TableFooter>
		</Table>
	);
};
