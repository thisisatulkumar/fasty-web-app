import Image from 'next/image';
import { Button } from '../ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import qrCode from '@/../public/qr.png';
import { Label } from '../ui/label';
import Link from 'next/link';

interface PlaceOrderProps {
	onSubmit: () => void;
	isBuying: boolean;
	isDrawer: boolean;
	price: number;
}

const PlaceOrder = ({ onSubmit, isBuying, isDrawer, price }: PlaceOrderProps) => {
	const isMobile = useIsMobile();

	return (
		<>
			{isMobile ? (
				<>
					<Image
						src="https://xmilcbzxgstsgasraceh.supabase.co/storage/v1/object/public/product_images/1777396354215.jpg"
						alt="AutoCAD Assignment"
						width={400}
						height={160}
						className={`w-full h-40 object-cover rounded-md ${isDrawer ? 'my-2' : ''}`}
					/>

					<p className="text-gray-600 my-2">
						You'll have to make the payment after clicking on{' '}
						<strong>Place Order</strong>
					</p>
				</>
			) : (
				<>
					<Label className="mx-auto">Pay via this QR Code</Label>
					<Image
						src={qrCode}
						alt="AutoCAD Assignment"
						width={0}
						height={0}
						className={`w-[50%] mx-auto h-auto object-cover rounded-md ${isDrawer ? 'my-2' : ''}`}
					/>

					<p className="text-gray-600 my-2">
						<ol>
							<li>
								1. Pay <strong>₹{price}</strong> via this QR Code
							</li>
							<li>
								2. Send the transaction screenshot (<strong>Transaction ID</strong>{' '}
								must be visible) to <strong>+91 95190 47102</strong>{' '}
							</li>
							<li>3. Click on Place Order 👇</li>
							<li>
								4. After payment verification, your AutoCAD PDF will be uploaded to{' '}
								<Link
									href="https://drive.google.com/drive/folders/1Q7duUKY0X9QAHu2vFCyIUPjXSJuvCTOh?usp=drive_link"
									target="_blank"
									className="text-blue-500 underline"
								>
									Google Drive
								</Link>
							</li>
						</ol>
					</p>
				</>
			)}

			<div className="space-y-6">
				<Button type="submit" className="w-full" onClick={onSubmit} disabled={isBuying}>
					{isBuying ? 'Placing order...' : 'Place Order'}
				</Button>
			</div>
		</>
	);
};

export default PlaceOrder;
