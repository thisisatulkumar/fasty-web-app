'use client';

import { useState, useRef, useEffect } from 'react';
import {
	Drawer,
	DrawerTrigger,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	DrawerDescription,
	DrawerFooter,
	DrawerClose,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { addProduct, updateProduct, uploadProductImage } from '@/services/admin/inventory.services';
import { Upload, X } from 'lucide-react';

interface AddOrUpdateProductSheetProps {
	isEdit: boolean;
	productId?: string;
	productImageUrl?: string;
	productName?: string;
	productPrice?: number;
	productStock?: number;
	children?: React.ReactNode;
}

const AddOrUpdateProductSheet = ({
	isEdit,
	productId,
	productImageUrl,
	productName,
	productPrice,
	productStock,
	children,
}: AddOrUpdateProductSheetProps) => {
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [isAdding, setIsAdding] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string>(productImageUrl || '');
	const [name, setName] = useState(productName || '');
	const [price, setPrice] = useState(productPrice || 0);
	const [stock, setStock] = useState(productStock || 0);
	const fileInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		return () => {
			if (previewUrl && previewUrl.startsWith('blob:')) {
				URL.revokeObjectURL(previewUrl);
			}
		};
	}, [previewUrl]);

	useEffect(() => {
		if (!drawerOpen) {
			// Clean up when drawer closes
			if (previewUrl && previewUrl.startsWith('blob:')) {
				URL.revokeObjectURL(previewUrl);
			}
			setSelectedFile(null);
			setPreviewUrl(productImageUrl || '');
			if (fileInputRef.current) {
				fileInputRef.current.value = '';
			}
		}
	}, [drawerOpen, productImageUrl]);

	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			// Validate file type
			if (!file.type.startsWith('image/')) {
				alert('Please select an image file');
				return;
			}

			setSelectedFile(file);
			const url = URL.createObjectURL(file);
			setPreviewUrl(url);
		}
	};

	const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		const file = e.dataTransfer.files?.[0];
		if (file) {
			// Validate file type
			if (!file.type.startsWith('image/')) {
				alert('Please select an image file');
				return;
			}

			// Validate file size (10MB max)
			if (file.size > 10 * 1024 * 1024) {
				alert('File size must be less than 10MB');
				return;
			}

			setSelectedFile(file);
			const url = URL.createObjectURL(file);
			setPreviewUrl(url);
		}
	};

	const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
	};

	const handleAdd = async () => {
		if (name.trim().length === 0) return;
		if (price < 0) return;
		if (stock < 0) return;

		setIsAdding(true);
		try {
			let finalImageUrl = '';
			if (selectedFile) {
				finalImageUrl = await uploadProductImage(selectedFile);
			}
			await addProduct(finalImageUrl, name, price, stock);
			setDrawerOpen(false);
		} catch (error) {
			alert('Failed to add product. Please try again.');
		} finally {
			setIsAdding(false);
		}
	};

	const handleEdit = async () => {
		if (!productId) return;
		if (name.trim().length === 0) return;
		if (price < 0) return;
		if (stock < 0) return;

		setIsEditing(true);
		try {
			let finalImageUrl = productImageUrl || '';
			if (selectedFile) {
				finalImageUrl = await uploadProductImage(selectedFile);
			}
			await updateProduct(productId, finalImageUrl, name, price, stock);
			setDrawerOpen(false);
		} catch (error) {
			alert('Failed to update product. Please try again.');
		} finally {
			setIsEditing(false);
		}
	};

	return (
		<Drawer open={drawerOpen} onOpenChange={setDrawerOpen} direction="right">
			<DrawerTrigger asChild>
				{children ? (
					children
				) : (
					<Button variant="outline" size="default">
						Add Product
					</Button>
				)}
			</DrawerTrigger>

			<DrawerContent>
				<DrawerHeader className="gap-1">
					<DrawerTitle>{isEdit ? 'Edit Product' : 'Add Product'}</DrawerTitle>
					<DrawerDescription>Add the product to the inventory</DrawerDescription>
				</DrawerHeader>

				<div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
					<Separator />

					<form className="flex flex-col gap-4">
						<div className="flex flex-col gap-3">
							<Label>Product Image</Label>
							{previewUrl ? (
								<div className="relative">
									<img
										src={previewUrl}
										alt="Product preview"
										className="w-full h-48 object-cover rounded-lg border"
									/>
									<Button
										type="button"
										variant="destructive"
										size="sm"
										className="absolute top-2 right-2"
										onClick={() => {
											setSelectedFile(null);
											setPreviewUrl('');
											if (fileInputRef.current) {
												fileInputRef.current.value = '';
											}
										}}
									>
										<X className="h-4 w-4" />
									</Button>
								</div>
							) : (
								<div
									className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer hover:border-muted-foreground/50 transition-colors"
									onDrop={handleDrop}
									onDragOver={handleDragOver}
									onClick={() => fileInputRef.current?.click()}
								>
									<Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
									<p className="text-sm text-muted-foreground mb-1">
										Click to upload or drag and drop
									</p>
									<p className="text-xs text-muted-foreground">
										Any image file is accepted
									</p>
								</div>
							)}
							<input
								ref={fileInputRef}
								type="file"
								accept="image/*"
								onChange={handleFileSelect}
								className="hidden"
							/>
						</div>

						<div className="flex flex-col gap-3">
							<Label htmlFor="name">Name</Label>
							<Input
								id="name"
								placeholder="Product name"
								value={name}
								onChange={(e) => setName(e.target.value)}
							/>
						</div>

						<div className="flex flex-col gap-3">
							<Label htmlFor="title">Price</Label>
							<Input
								id="price"
								placeholder="Price"
								type="number"
								min={0}
								value={price}
								onChange={(e) => setPrice(Number(e.target.value))}
							/>
						</div>

						<div className="flex flex-col gap-3">
							<Label htmlFor="title">Stock</Label>
							<Input
								id="stock"
								placeholder="Stock"
								type="number"
								min={0}
								value={stock}
								onChange={(e) => setStock(Number(e.target.value))}
							/>
						</div>
					</form>
				</div>

				<DrawerFooter className="flex gap-2">
					<Button
						onClick={isEdit ? handleEdit : handleAdd}
						disabled={isAdding || isEditing}
					>
						{isEdit
							? isEditing
								? 'Updating...'
								: 'Update'
							: isAdding
								? 'Adding...'
								: 'Add'}
					</Button>

					<DrawerClose asChild>
						<Button variant="outline">Cancel</Button>
					</DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
};

export default AddOrUpdateProductSheet;
