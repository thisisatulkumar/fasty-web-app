import useCartStore from '@/store/cart.store';
import { useEffect, useState, useRef } from 'react';
import { getNextTimeSlot, formatDeliverySlot } from '@/utils/orders.utils';

export const OrderPlaced = ({
	orderId,
	roomNo,
	totalAmount,
	itemCount,
	setSheetStatus,
	closeSheet,
}: {
	orderId: string;
	roomNo: string;
	totalAmount: number;
	itemCount: number;
	setSheetStatus: (sheetStatus: 'cart') => void;
	closeSheet: () => void;
}) => {
	const [step, setStep] = useState(0);
	const { clearCart } = useCartStore();

	const info = useRef({
		orderId,
		roomNo,
		totalAmount,
		itemCount,
		deliverySlot: getNextTimeSlot(),
	});

	useEffect(() => {
		const timers = [
			setTimeout(() => setStep(1), 100),
			setTimeout(() => setStep(2), 600),
			setTimeout(() => setStep(3), 1000),
			setTimeout(() => setStep(4), 1400),
		];
		clearCart();
		return () => timers.forEach(clearTimeout);
	}, []);

	const handleBackToHome = () => {
		setSheetStatus('cart');
		closeSheet();
	};

	return (
		<div
			style={{
				minHeight: '100vh',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				background: '#0a0a0a',
				padding: '2rem',
				fontFamily: 'system-ui, sans-serif',
			}}
		>
			{/* Checkmark Circle */}
			<div
				style={{
					position: 'relative',
					marginBottom: '2rem',
					opacity: step >= 1 ? 1 : 0,
					transform: step >= 1 ? 'scale(1)' : 'scale(0.5)',
					transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
				}}
			>
				{/* Outer glow ring */}
				<div
					style={{
						position: 'absolute',
						inset: '-16px',
						borderRadius: '50%',
						background:
							'radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)',
						opacity: step >= 2 ? 1 : 0,
						transition: 'opacity 0.8s ease',
					}}
				/>

				{/* Circle */}
				<div
					style={{
						width: '100px',
						height: '100px',
						borderRadius: '50%',
						background: '#fff',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<svg width="48" height="48" viewBox="0 0 48 48" fill="none">
						<path
							d="M10 24L20 34L38 14"
							stroke="#0a0a0a"
							strokeWidth="3.5"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeDasharray="50"
							strokeDashoffset={step >= 1 ? 0 : 50}
							style={{ transition: 'stroke-dashoffset 0.5s ease 0.3s' }}
						/>
					</svg>
				</div>
			</div>

			{/* Title */}
			<h1
				style={{
					color: '#fff',
					fontSize: '1.75rem',
					fontWeight: '700',
					margin: '0 0 0.5rem',
					letterSpacing: '-0.02em',
					opacity: step >= 2 ? 1 : 0,
					transform: step >= 2 ? 'translateY(0)' : 'translateY(12px)',
					transition: 'all 0.4s ease',
				}}
			>
				Order Placed!
			</h1>

			<p
				style={{
					color: '#666',
					fontSize: '0.95rem',
					margin: '0 0 2.5rem',
					opacity: step >= 2 ? 1 : 0,
					transform: step >= 2 ? 'translateY(0)' : 'translateY(8px)',
					transition: 'all 0.4s ease 0.1s',
				}}
			>
				Your order is on its way to your room
			</p>

			{/* Info Card */}
			<div
				style={{
					width: '100%',
					maxWidth: '340px',
					background: '#141414',
					border: '0.5px solid #2a2a2a',
					borderRadius: '16px',
					overflow: 'hidden',
					opacity: step >= 3 ? 1 : 0,
					transform: step >= 3 ? 'translateY(0)' : 'translateY(16px)',
					transition: 'all 0.4s ease',
				}}
			>
				{/* Card Row */}
				{[
					{
						label: 'Order ID',
						value: `#${info.current.orderId.slice(0, 8).toUpperCase()}`,
					},
					{ label: 'Room No.', value: info.current.roomNo },
					{
						label: 'Items',
						value: `${info.current.itemCount} item${info.current.itemCount > 1 ? 's' : ''}`,
					},
					{ label: 'Total', value: `₹${info.current.totalAmount}`, highlight: true },
					{
						label: 'Delivery Slot',
						value: formatDeliverySlot(info.current.deliverySlot),
						highlight: true,
						bold: true,
					},
				].map(({ label, value, highlight, bold }, i) => (
					<div
						key={label}
						style={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
							padding: '14px 20px',
							borderBottom: i < 4 ? '0.5px solid #1f1f1f' : 'none',
							backgroundColor: bold ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
						}}
					>
						<span style={{ color: '#555', fontSize: '0.875rem' }}>{label}</span>
						<span
							style={{
								color: highlight ? '#fff' : '#aaa',
								fontSize: highlight ? '1rem' : '0.875rem',
								fontWeight: bold ? '700' : highlight ? '700' : '500',
							}}
						>
							{value}
						</span>
					</div>
				))}
			</div>

			{/* Back Button */}
			<button
				onClick={handleBackToHome}
				style={{
					marginTop: '2rem',
					padding: '12px 28px',
					background: 'transparent',
					border: '0.5px solid #aaa',
					borderRadius: '999px',
					color: '#aaa',
					fontSize: '0.875rem',
					cursor: 'pointer',
					opacity: step >= 4 ? 1 : 0,
					transition: 'all 0.4s ease 0.1s, color 0.2s, border-color 0.2s',
				}}
				onMouseEnter={(e) => {
					(e.target as HTMLButtonElement).style.color = '#fff';
					(e.target as HTMLButtonElement).style.borderColor = '#555';
				}}
				onMouseLeave={(e) => {
					(e.target as HTMLButtonElement).style.color = '#aaa';
					(e.target as HTMLButtonElement).style.borderColor = '#2a2a2a';
				}}
			>
				Shop More
			</button>

			<style>{`
				@keyframes pulse {
					0%, 100% { opacity: 1; transform: scale(1); }
					50% { opacity: 0.5; transform: scale(0.85); }
				}
			`}</style>
		</div>
	);
};
