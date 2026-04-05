'use client';

import { AlertCircleIcon } from 'lucide-react';
import { FallbackProps } from 'react-error-boundary';

export default function ProductError({ resetErrorBoundary }: FallbackProps) {
	return (
		<div className="flex flex-col items-center justify-center py-16 px-8 text-center">
			<AlertCircleIcon className="mb-8" />

			<p className="text-base font-medium text-foreground mb-2">Couldn't load products</p>
			<p className="text-sm text-muted-foreground max-w-65 leading-relaxed mb-6">
				Something went wrong while fetching the store. Try again or check back in a moment.
			</p>

			<button
				onClick={resetErrorBoundary}
				className="text-sm px-5 py-2 rounded-md border border-border hover:bg-muted transition-colors"
			>
				Try again
			</button>
		</div>
	);
}
