'use client';

import CartButton from '@/components/navbar/CartButton';
import AuthButtons from '@/components/navbar/AuthButtons';

export default function NavbarActions() {
	return (
		<div className="flex items-center gap-4">
			<CartButton />
			<AuthButtons />
		</div>
	);
}
