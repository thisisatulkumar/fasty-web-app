import {
	Table,
	TableBody,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { billAmount } from '@/utils/cart.utils';
import useCartStore from '@/store/cart.store';

export const SummaryTable = () => {
	const { items: cartItems } = useCartStore();

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
					<TableCell className="text-right">₹{billAmount(cartItems)}</TableCell>
				</TableRow>
			</TableFooter>
		</Table>
	);
};
