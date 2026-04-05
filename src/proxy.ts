import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { ADMIN_EMAILS } from './lib/constants';

export default clerkMiddleware(async (auth, req) => {
	const { userId, sessionClaims } = await auth();
	const url = req.nextUrl;

	if (url.pathname.startsWith('/admin')) {
		if (!userId) return NextResponse.redirect(new URL('/', req.url));

		const email = sessionClaims?.email as string | undefined;
		if (!email || !ADMIN_EMAILS.includes(email)) {
			return NextResponse.redirect(new URL('/', req.url));
		}
	}
});

export const config = {
	matcher: [
		// Skip Next.js internals and all static files, unless found in search params
		'/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
		// Always run for API routes
		'/(api|trpc)(.*)',
	],
};
