import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import SyncClerkWithSupabase from '@/components/auth/SyncClerkWithSupabase';
import Navbar from '@/components/navbar/Navbar';

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body>
				<ClerkProvider
					localization={{
						signIn: {
							start: {
								subtitle: 'Use your college email ID',
							},
						},
						signUp: {
							start: {
								subtitle: 'Use your college email ID',
							},
						},
						formFieldInputPlaceholder__emailAddress: 'Use your IET Email ID',
					}}
				>
					<SyncClerkWithSupabase />
					<Navbar />
					{children}
				</ClerkProvider>
			</body>
		</html>
	);
}
