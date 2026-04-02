'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';
import { OrderWithDetails } from '@/types/admin.types';
import { updateOrderStatus } from '@/services/admin/orders.services';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

// ─── Types ────────────────────────────────────────────────────────────────────

type OrderStatus = OrderWithDetails['status'];

// ─── Constants ────────────────────────────────────────────────────────────────

// Maps each status to a Tailwind-compatible badge style.
// Defined outside the component so it's not recreated on every render.
const STATUS_STYLES: Record<OrderStatus, string> = {
	pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
	paid: 'bg-blue-100 text-blue-800 border-blue-200',
	on_the_way: 'bg-purple-100 text-purple-800 border-purple-200',
	delivered: 'bg-green-100 text-green-800 border-green-200',
	failed: 'bg-red-100 text-red-800 border-red-200',
};

const STATUS_LABELS: Record<OrderStatus, string> = {
	pending: 'Pending',
	paid: 'Paid',
	on_the_way: 'On the way',
	delivered: 'Delivered',
	failed: 'Failed',
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatTime(isoString: string): string {
	return new Date(isoString).toLocaleTimeString('en-IN', {
		hour: '2-digit',
		minute: '2-digit',
		hour12: true,
	});
}

// ─── Subcomponent: Items Table ────────────────────────────────────────────────

// Isolated so OrderRow's JSX stays readable.
const ItemsTable = ({ items }: { items: OrderWithDetails['items'] }) => (
	<div className="mt-3 rounded-md border border-border overflow-hidden">
		<table className="w-full text-sm">
			<thead className="bg-muted text-muted-foreground">
				<tr>
					<th className="px-3 py-2 text-left font-medium">#</th>
					<th className="px-3 py-2 text-left font-medium">Name</th>
					<th className="px-3 py-2 text-right font-medium">Price</th>
					<th className="px-3 py-2 text-right font-medium">Qty</th>
					<th className="px-3 py-2 text-right font-medium">Total</th>
				</tr>
			</thead>
			<tbody>
				{items.map((item, idx) => (
					<tr
						key={item.id}
						className="border-t border-border hover:bg-muted/40 transition-colors"
					>
						<td className="px-3 py-2 text-muted-foreground">{idx + 1}</td>
						<td className="px-3 py-2 font-medium">{item.product.name}</td>
						<td className="px-3 py-2 text-right">₹{item.price}</td>
						<td className="px-3 py-2 text-right">{item.quantity}</td>
						<td className="px-3 py-2 text-right font-semibold">₹{item.total_price}</td>
					</tr>
				))}
			</tbody>
		</table>
	</div>
);

// ─── Subcomponent: Verify OTP Dialog ─────────────────────────────────────────

interface VerifyOtpDialogProps {
	orderId: string;
	expectedOtp: string; // from delivery_otps — never shown to user, used to verify
	onVerified: () => void; // parent callback to flip status locally
}

const VerifyOtpDialog = ({ orderId, expectedOtp, onVerified }: VerifyOtpDialogProps) => {
	const [open, setOpen] = useState(false);
	const [otp, setOtp] = useState('');
	const [error, setError] = useState<string | null>(null);
	const [isVerifying, setIsVerifying] = useState(false);

	const handleVerify = async () => {
		if (otp !== expectedOtp) {
			setError('Incorrect OTP. Please try again.');
			return;
		}

		setIsVerifying(true);
		try {
			// 2. Set order status to 'delivered'
			await updateOrderStatus(orderId, 'delivered');
			onVerified();
			setOpen(false);
		} catch {
			setError('Something went wrong. Please try again.');
		} finally {
			setIsVerifying(false);
		}
	};

	// Reset state when dialog closes
	const handleOpenChange = (val: boolean) => {
		setOpen(val);
		if (!val) {
			setOtp('');
			setError(null);
		}
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogTrigger asChild>
				<Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
					<ShieldCheck className="h-3.5 w-3.5" />
					Verify OTP
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-xs">
				<DialogHeader>
					<DialogTitle>Verify Delivery OTP</DialogTitle>
				</DialogHeader>
				<div className="flex flex-col gap-3 pt-2">
					<Input
						placeholder="Enter OTP"
						value={otp}
						onChange={(e) => {
							setOtp(e.target.value);
							setError(null);
						}}
						className="font-mono tracking-widest text-center text-lg"
						maxLength={6}
					/>
					{error && <p className="text-xs text-destructive">{error}</p>}
					<Button onClick={handleVerify} disabled={!otp || isVerifying}>
						{isVerifying ? <Spinner /> : 'Confirm'}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};

// ─── Main Component ───────────────────────────────────────────────────────────

interface OrderRowProps {
	serialNo: number;
	order: OrderWithDetails;
}

const OrderRow = ({ serialNo, order }: OrderRowProps) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const [status, setStatus] = useState<OrderStatus>(order.status);
	const [confirmOpen, setConfirmOpen] = useState(false);

	const handleVerified = () => setStatus('delivered');

	const handleConfirmDelivered = async () => {
		try {
			await updateOrderStatus(order.id, 'delivered');
			setStatus('delivered');
			setConfirmOpen(false);
		} catch {
			// TODO: handle error
		}
	};

	return (
		<div className="border-b border-border hover:bg-muted/50 transition-colors">
			{/* ── Main Row ── */}
			<div className="grid grid-cols-[40px_1fr_90px_110px_100px_120px_140px] items-center gap-4 px-4 py-3">
				{/* Serial no. */}
				<span className="text-sm text-muted-foreground text-center">{serialNo}</span>

				{/* Customer + time */}
				<div className="min-w-0">
					<p className="text-sm font-medium truncate">{order.user.name}</p>
					<p className="text-xs text-muted-foreground">{formatTime(order.created_at)}</p>
				</div>

				{/* Room */}
				<span className="text-sm text-muted-foreground">Room {order.room_number}</span>

				{/* Payment method */}
				<span className="text-sm font-mono uppercase text-muted-foreground">
					{order.payment_method}
				</span>

				{/* Total */}
				<span className="text-sm font-semibold">₹{order.total_amount}</span>

				{/* Status badge */}
				<Badge
					variant="outline"
					className={`text-xs font-medium px-2 py-0.5 w-fit ${STATUS_STYLES[status]}`}
				>
					{STATUS_LABELS[status]}
				</Badge>

				{/* Actions */}
				<div className="flex items-center gap-2 justify-end">
					{status !== 'delivered' && (
						<AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
							<AlertDialogTrigger asChild>
								<Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
									Mark Delivered
								</Button>
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>Confirm Delivery</AlertDialogTitle>
									<AlertDialogDescription>
										Are you sure this order has been delivered?
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel>Cancel</AlertDialogCancel>
									<AlertDialogAction onClick={handleConfirmDelivered}>
										Confirm
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					)}

					{/* Expand items toggle */}
					<Button
						variant="ghost"
						size="icon"
						className="h-8 w-8 text-muted-foreground hover:text-foreground"
						onClick={() => setIsExpanded((prev) => !prev)}
						aria-label={isExpanded ? 'Collapse items' : 'Expand items'}
					>
						{isExpanded ? (
							<ChevronUp className="h-4 w-4" />
						) : (
							<ChevronDown className="h-4 w-4" />
						)}
						<span className="sr-only">{order.items.length} items</span>
					</Button>
				</div>
			</div>

			{/* ── Expandable Items Table ── */}
			{isExpanded && (
				<div className="px-4 pb-4">
					<ItemsTable items={order.items} />
				</div>
			)}
		</div>
	);
};

export default OrderRow;
