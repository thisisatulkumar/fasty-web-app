import React, { CSSProperties } from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import AppSidebar from '@/components/admin/layout/sidebar/AppSidebar';

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
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
