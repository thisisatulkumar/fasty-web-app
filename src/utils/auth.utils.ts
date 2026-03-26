import { ALLOWED_EMAILS_DOMAIN } from '@/lib/constants';

export const isEmailAllowed = (email: string): boolean => {
	const domain = email.split('@')[1];
	return domain === ALLOWED_EMAILS_DOMAIN;
};
