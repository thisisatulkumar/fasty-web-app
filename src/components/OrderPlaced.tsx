import useCartStore from '@/store/cart.store';
import { useEffect, useState } from 'react';

export const OrderPlaced = ({
	orderId,
	roomNo,
	totalAmount,
	itemCount,
	setSheetStatus,
}: {
	orderId: string;
	roomNo: string;
	totalAmount: number;
	itemCount: number;
	setSheetStatus: (sheetStatus: 'cart') => void;
}) => {
	const [step, setStep] = useState(0);
	const { clearCart } = useCartStore();

	useEffect(() => {
		const timers = [
			setTimeout(() => setStep(1), 100),
			setTimeout(() => setStep(2), 600),
			setTimeout(() => setStep(3), 1000),
			setTimeout(() => setStep(4), 1400),
		];
		return () => timers.forEach(clearTimeout);
	}, []);

	const handleBackToHome = () => {
		clearCart();
		setSheetStatus('cart');
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
					{ label: 'Order ID', value: `#${orderId.slice(0, 8).toUpperCase()}` },
					{ label: 'Room No.', value: roomNo },
					{ label: 'Items', value: `${itemCount} item${itemCount > 1 ? 's' : ''}` },
					{ label: 'Total', value: `₹${totalAmount}`, highlight: true },
				].map(({ label, value, highlight }, i) => (
					<div
						key={label}
						style={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
							padding: '14px 20px',
							borderBottom: i < 3 ? '0.5px solid #1f1f1f' : 'none',
						}}
					>
						<span style={{ color: '#555', fontSize: '0.875rem' }}>{label}</span>
						<span
							style={{
								color: highlight ? '#fff' : '#aaa',
								fontSize: highlight ? '1rem' : '0.875rem',
								fontWeight: highlight ? '700' : '500',
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
					border: '0.5px solid #2a2a2a',
					borderRadius: '999px',
					color: '#555',
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
					(e.target as HTMLButtonElement).style.color = '#555';
					(e.target as HTMLButtonElement).style.borderColor = '#2a2a2a';
				}}
			>
				Back to Home
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
