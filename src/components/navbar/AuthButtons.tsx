'use client';

import { Button } from '@/components/ui/button';
import { useAuth, SignInButton, SignOutButton } from '@clerk/nextjs';
import { Spinner } from '@/components/ui/spinner';

export default function AuthButtons() {
	const { isSignedIn, isLoaded } = useAuth();

	if (!isLoaded) {
		return (
			<div className="h-8 w-16 flex items-center justify-center">
				<Spinner className="h-4 w-4" />
			</div>
		);
	}

	return (
		<div className="flex items-center">
			{isSignedIn ? (
				<SignOutButton>
					<Button>Sign Out</Button>
				</SignOutButton>
			) : (
				<SignInButton mode="modal">
					<Button>Sign In</Button>
				</SignInButton>
			)}
		</div>
	);
}
