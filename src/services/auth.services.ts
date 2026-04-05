import { DB_TABLES } from '@/lib/constants';
import { supabase } from '@/lib/supabase/client';
import { UserProfile } from '@/types/auth.types';
import { Database } from '@/types/supabase';

type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];

// Note: Cart is auto-created via Supabase trigger (on_profile_created)
export const syncProfile = async ({
	clerkId,
	email,
	firstName,
	lastName,
	imageUrl,
}: UserProfile): Promise<void> => {
	const payload: ProfileInsert = {
		clerk_id: clerkId,
		email,
		first_name: firstName,
		last_name: lastName,
		image_url: imageUrl,
	};

	await supabase.from(DB_TABLES.PROFILES).upsert(payload);

	// TODO: Use some error logging system in the future
};
