'use client';

import Logo from '@/components/navbar/Logo';
import NavbarActions from '@/components/navbar/NavbarActions';
import { Separator } from '@/components/ui/separator';
import { usePathname } from 'next/navigation';

export default function Navbar() {
	const pathname = usePathname();
	if (pathname !== '/') return null;

	return (
		<header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
			<div className="flex h-16 items-center justify-between px-4 md:px-6">
				<Logo />
				<NavbarActions />
			</div>
			<Separator />
		</header>
	);
}
