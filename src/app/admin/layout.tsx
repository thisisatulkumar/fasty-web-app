import React, { CSSProperties } from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import AppSidebar from '@/components/admin/layout/sidebar/AppSidebar';
import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

const ALLOWED_ADMIN_EMAILS = [
	'2500520100023@ietlucknow.ac.in',
	'2500520100018@ietlucknow.ac.in',
	'2500521520003@ietlucknow.ac.in',
	'2500520310058@ietlucknow.ac.in',
];

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
	const { userId } = await auth();
	if (!userId) redirect('/');

	const user = await currentUser();
	const email = user?.emailAddresses[0]?.emailAddress;

	if (!email || !ALLOWED_ADMIN_EMAILS.includes(email)) {
		redirect('/');
	}
	return (
		<SidebarProvider
			style={
				{
					'--sidebar-width': 'calc(var(--spacing) * 72)',
					'--header-height': 'calc(var(--spacing) * 12)',
				} as CSSProperties
			}
		>
			<AppSidebar variant="inset" />

			<SidebarInset>{children}</SidebarInset>
		</SidebarProvider>
	);
};

export default AdminLayout;
