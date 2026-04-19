import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import type { Product } from '@/types/admin.types';
import { Trash, SquarePen } from 'lucide-react';
import ConfirmDeleteDialog from './ConfirmDeleteDialog';
import AddOrUpdateProductSheet from './AddOrUpdateProductSheet';
import { updateProduct } from '@/services/admin/inventory.services';
import { useState } from 'react';
import { Spinner } from '@/components/ui/spinner';

interface ProductRowProps {
	serialNo: number;
	product: Product;
}

const ProductRow = ({ serialNo, product }: ProductRowProps) => {
	const [stock, setStock] = useState(product.stock);
	const [isDecrementingStock, setIsDecrementingStock] = useState(false);
	const [isIncrementingStock, setIsIncrementingStock] = useState(false);

	const handleMinusClick = async () => {
		setIsDecrementingStock(true);
		await updateProduct(product.id, product.image_url, product.name, product.price, stock - 1);
		setStock(stock - 1);
		setIsDecrementingStock(false);
	};

	const handlePlusClick = async () => {
		setIsIncrementingStock(true);
		await updateProduct(product.id, product.image_url, product.name, product.price, stock + 1);
		setStock(stock + 1);
		setIsIncrementingStock(false);
	};

	return (
		<div className="grid grid-cols-[40px_56px_1fr_100px_140px_80px] items-center gap-4 px-4 py-3 border-b border-border hover:bg-muted/50 transition-colors">
			<span className="text-sm text-muted-foreground text-center">{serialNo}</span>

			<img
				src={product.image_url}
				alt={product.name}
				className="w-10 h-10 rounded-md object-cover border border-border"
			/>

			<span className="text-sm font-medium truncate">{product.name}</span>

			<span className="text-sm font-semibold">₹{product.price}</span>

			<ButtonGroup>
				<Button
					variant="outline"
					size="icon"
					className="h-8 w-8 text-base select-none"
					onClick={handleMinusClick}
					disabled={isIncrementingStock || isDecrementingStock || stock === 0}
				>
					{isDecrementingStock ? <Spinner /> : <span>&minus;</span>}
				</Button>
				<Button
					variant="outline"
					className="h-8 w-12 font-mono text-sm cursor-default pointer-events-none select-none"
				>
					{stock}
				</Button>
				<Button
					variant="outline"
					size="icon"
					className="h-8 w-8 text-base select-none"
					onClick={handlePlusClick}
					disabled={isIncrementingStock || isDecrementingStock}
				>
					{isIncrementingStock ? <Spinner /> : <span>+</span>}
				</Button>
			</ButtonGroup>

			<div className="flex items-center gap-2 justify-end">
				<AddOrUpdateProductSheet
					isEdit={true}
					productId={product.id}
					productImageUrl={product.image_url}
					productName={product.name}
					productPrice={product.price}
					productStock={stock}
				>
					<Button
						variant="ghost"
						size="icon"
						className="h-8 w-8 text-muted-foreground hover:text-foreground"
					>
						<SquarePen className="h-4 w-4" />
					</Button>
				</AddOrUpdateProductSheet>

				<ConfirmDeleteDialog productId={product.id}>
					<Button
						variant="ghost"
						size="icon"
						className="h-8 w-8 text-muted-foreground hover:text-destructive"
					>
						<Trash className="h-4 w-4" />
					</Button>
				</ConfirmDeleteDialog>
			</div>
		</div>
	);
};

export default ProductRow;
