import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import SyncClerkWithSupabase from '@/components/auth/SyncClerkWithSupabase';
import Navbar from '@/components/navbar/Navbar';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Metadata } from 'next';
import Footer from '@/components/Footer';
import FloatingCartButton from '@/components/cart/FloatingCartButton';
import { SheetProvider } from '@/context/SheetContext';

export const metadata: Metadata = {
	title: 'Fastyy',
	description: 'Stationery items just one-click away',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
					<SheetProvider>
						<SyncClerkWithSupabase />
						<Navbar />
						{children}
						<FloatingCartButton />
						<Footer />
					</SheetProvider>
				</ClerkProvider>
				<Analytics />
				<SpeedInsights />
			</body>
		</html>
	);
}
