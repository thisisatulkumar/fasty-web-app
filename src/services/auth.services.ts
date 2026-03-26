import { DB_TABLES } from '@/lib/constants';
import { supabase } from '@/lib/supabase/client';
import { UserProfile } from '@/types/auth.types';

// Note: Cart is auto-created via Supabase trigger (on_profile_created)
export const syncProfile = async (userProfile: UserProfile): Promise<void> => {
	await supabase.from(DB_TABLES.PROFILES).upsert({
		clerk_id: userProfile.id,
		email: userProfile.email,
		last_name: userProfile.last_name,
		first_name: userProfile.first_name,
		image_url: userProfile.image_url,
	});

	// TODO: Use some error logging system in the future
};
