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
					id: user.id,
					email: email,
					first_name: user.firstName ?? '',
					last_name: user.lastName ?? '',
					image_url: user.imageUrl ?? '',
				});
			} else {
				setShowPopup(true);
				await user?.delete();
				await signOut();
			}
		};

		sync();
	}, [isLoaded, isSignedIn, user]);

	return <WrongEmailPopup open={showPopup} onClose={() => setShowPopup(false)} />;
};

export default SyncClerkWithSupabase;
