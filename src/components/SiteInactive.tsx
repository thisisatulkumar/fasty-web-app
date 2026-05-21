export default function SiteInactive() {
	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/30 px-4">
			<div className="max-w-md w-full flex flex-col items-center text-center">
				{/* Summer Illustration */}
				<div className="relative w-32 h-32 mb-8">
					<svg
						width="128"
						height="128"
						viewBox="0 0 128 128"
						fill="none"
						className="w-full h-full"
					>
						{/* Sun */}
						<circle cx="96" cy="24" r="16" className="fill-yellow-400" />
						<line
							x1="96"
							y1="4"
							x2="96"
							y2="0"
							className="stroke-yellow-400"
							strokeWidth="2"
							strokeLinecap="round"
						/>
						<line
							x1="96"
							y1="48"
							x2="96"
							y2="44"
							className="stroke-yellow-400"
							strokeWidth="2"
							strokeLinecap="round"
						/>
						<line
							x1="116"
							y1="24"
							x2="120"
							y2="24"
							className="stroke-yellow-400"
							strokeWidth="2"
							strokeLinecap="round"
						/>
						<line
							x1="76"
							y1="24"
							x2="72"
							y2="24"
							className="stroke-yellow-400"
							strokeWidth="2"
							strokeLinecap="round"
						/>
						<line
							x1="109"
							y1="11"
							x2="112"
							y2="8"
							className="stroke-yellow-400"
							strokeWidth="2"
							strokeLinecap="round"
						/>
						<line
							x1="83"
							y1="37"
							x2="80"
							y2="40"
							className="stroke-yellow-400"
							strokeWidth="2"
							strokeLinecap="round"
						/>
						<line
							x1="109"
							y1="37"
							x2="112"
							y2="40"
							className="stroke-yellow-400"
							strokeWidth="2"
							strokeLinecap="round"
						/>
						<line
							x1="83"
							y1="11"
							x2="80"
							y2="8"
							className="stroke-yellow-400"
							strokeWidth="2"
							strokeLinecap="round"
						/>

						{/* Ice Cream */}
						<rect
							x="20"
							y="50"
							width="20"
							height="8"
							rx="4"
							className="fill-amber-700"
						/>
						<path d="M 22 58 L 26 72 L 34 72 L 38 58" className="fill-amber-600" />

						{/* Ice Cream - Pink Scoop */}
						<circle cx="30" cy="42" r="12" className="fill-pink-300" />
						<circle cx="24" cy="38" r="4" className="fill-white opacity-40" />

						{/* Ice Cream - Red Scoop */}
						<circle cx="30" cy="28" r="12" className="fill-red-400" />
						<circle cx="36" cy="24" r="4" className="fill-white opacity-40" />

						{/* Waves */}
						<path
							d="M 0 90 Q 8 86 16 90 T 32 90 T 48 90"
							className="stroke-blue-400"
							strokeWidth="2"
							fill="none"
							strokeLinecap="round"
						/>
						<path
							d="M 0 100 Q 8 96 16 100 T 32 100 T 48 100"
							className="stroke-blue-300"
							strokeWidth="2"
							fill="none"
							strokeLinecap="round"
						/>

						{/* Water/Sand area */}
						<rect x="0" y="105" width="128" height="23" className="fill-yellow-200" />
					</svg>
				</div>

				{/* Content */}
				<h1 className="text-3xl font-bold text-foreground mb-3">
					Enjoying Summer Holidays!
				</h1>

				<p className="text-muted-foreground mb-2 text-base font-medium">
					We're taking a break to refresh and recharge
				</p>

				<p className="text-sm text-muted-foreground leading-relaxed mb-8 max-w-sm">
					Our store is temporarily closed for summer holidays. We'll be back soon with
					fresh stock and exciting updates. Thank you for your patience!
				</p>

				{/* Footer Text */}
				<p className="text-xs text-muted-foreground">
					See you on the other side of summer! 🌞
				</p>
			</div>
		</div>
	);
}
