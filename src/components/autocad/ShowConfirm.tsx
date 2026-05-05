import { useIsMobile } from '@/hooks/use-mobile';
import { useState } from 'react';

interface ShowConfirmProps {
	step: number;
	price: number;
	setDialogOpen: (open: boolean) => void;
}

const ShowConfirm = ({ step, price }: ShowConfirmProps) => {
	const isMobile = useIsMobile();
	const [copied, setCopied] = useState(false);

	const handleCopyUPI = async () => {
		const upiId = '8303714677-1@nyes';

		await navigator.clipboard.writeText(upiId);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				fontFamily: 'system-ui, sans-serif',
			}}
			className="px-0 py-4"
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
						background: 'radial-gradient(circle, rgba(0,0,0,0.06) 0%, transparent 70%)',
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
						background: '#0a0a0a',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<svg width="48" height="48" viewBox="0 0 48 48" fill="none">
						<path
							d="M10 24L20 34L38 14"
							stroke="#f5f5f5"
							strokeWidth="3.5"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeDasharray="50"
							strokeDashoffset={step >= 1 ? 0 : 50}
							style={{
								transition: 'stroke-dashoffset 0.5s ease 0.3s',
							}}
						/>
					</svg>
				</div>
			</div>

			{/* Title */}
			<h1
				style={{
					color: '#0a0a0a',
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

			{isMobile && (
				<>
					<p className="text-gray-600 my-2">
						Pay <strong>₹{price}</strong>
					</p>
					<p>
						UPI ID:{' '}
						<strong className="inline-flex items-center gap-1">
							8303714677-1@nyes
							{!copied && (
								<span
									onClick={handleCopyUPI}
									className="text-gray-500 font-normal underline ml-2"
								>
									Copy
								</span>
							)}
							{copied && <span className="text-green-500 ml-2	">Copied!</span>}
						</strong>
					</p>
				</>
			)}

			<style>{`
        @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.5; transform: scale(0.85); }
        }
    `}</style>
		</div>
	);
};

export default ShowConfirm;
