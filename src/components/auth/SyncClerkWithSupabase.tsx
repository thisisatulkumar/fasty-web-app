'use client';

import { useEffect, useState } from 'react';
import { useUser, useClerk } from '@clerk/nextjs';
import { syncProfile } from '@/services/auth.services';
import { isEmailAllowed } from '@/utils/auth.utils';
import WrongEmailPopup from './WrongEmailPopup';

const SyncClerkWithSupabase = () => {
	const { user, isLoaded, isSignedIn } = useUser();
	const { signOut } = useClerk();
	const [showPopup, setShowPopup] = useState(false);

	useEffect(() => {
		if (!isLoaded || !isSignedIn || !user) return;

		const sync = async () => {
			const email = user?.primaryEmailAddress?.emailAddress;

			if (!email) return;

			if (isEmailAllowed(email)) {
				await syncProfile({
					clerkId: user.id,
					email,
					firstName: user.firstName ?? '',
					lastName: user.lastName ?? '',
					imageUrl: user.imageUrl ?? '',
				});
			} else {
				setShowPopup(true);

				try {
					await user?.delete();
				} finally {
					await signOut();
				}
			}
		};

		sync();
	}, [isLoaded, isSignedIn, user?.id]);

	return <WrongEmailPopup open={showPopup} onClose={() => setShowPopup(false)} />;
};

export default SyncClerkWithSupabase;
