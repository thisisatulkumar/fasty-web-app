export default function NoProducts() {
	return (
		<div className="flex flex-col items-center justify-center py-16 px-8 text-center">
			<div className="relative w-20 h-20 mb-6">
				<svg width="80" height="80" viewBox="0 0 80 80" fill="none">
					<rect
						x="10"
						y="20"
						width="44"
						height="48"
						rx="4"
						className="stroke-border fill-muted"
						strokeWidth="1.5"
					/>
					<line
						x1="18"
						y1="32"
						x2="46"
						y2="32"
						className="stroke-border"
						strokeWidth="1.5"
						strokeLinecap="round"
					/>
					<line
						x1="18"
						y1="40"
						x2="46"
						y2="40"
						className="stroke-border"
						strokeWidth="1.5"
						strokeLinecap="round"
					/>
					<line
						x1="18"
						y1="48"
						x2="36"
						y2="48"
						className="stroke-border"
						strokeWidth="1.5"
						strokeLinecap="round"
					/>
					<circle
						cx="56"
						cy="56"
						r="16"
						className="fill-background stroke-border"
						strokeWidth="1.5"
					/>
					<line
						x1="49"
						y1="56"
						x2="63"
						y2="56"
						className="stroke-muted-foreground"
						strokeWidth="1.5"
						strokeLinecap="round"
					/>
				</svg>
			</div>

			<p className="text-base font-medium text-foreground mb-2">No items available</p>
			<p className="text-sm text-muted-foreground max-w-65 leading-relaxed">
				The store is currently empty. Check back soon - new stationery drops regularly.
			</p>
		</div>
	);
}
