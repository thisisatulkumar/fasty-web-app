import Link from 'next/link';

const teamMembers = [
	{ name: 'Aditya', linkedin: 'https://www.linkedin.com/in/aditya-gupta-36bb123a6/' },
	{ name: 'Anurudh Agarwal', linkedin: 'https://www.linkedin.com/in/anurudh-agarwal-597b15380/' },
	{ name: 'Atul Kumar', linkedin: 'https://www.linkedin.com/in/thisisatulkumar/' },
	{
		name: 'Ratan Deep Pathak',
		linkedin: 'https://www.linkedin.com/in/ratan-deep-pathak-163382387/',
	},
];

const Footer = () => {
	return (
		<footer className="bg-white border-t py-8">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="space-y-4 text-center text-sm text-gray-600">
					<p>
						Built by{' '}
						{teamMembers.map((member, index) => (
							<span key={member.name}>
								<Link
									href={member.linkedin}
									target="_blank"
									className="font-medium hover:text-foreground transition"
								>
									{member.name}
								</Link>
								{index < teamMembers.length - 1 && ', '}
							</span>
						))}
					</p>
					<p>
						<Link
							href="https://github.com/IET-Fasty/fasty-web-app"
							target="_blank"
							className="underline underline-offset-4 hover:text-foreground transition"
						>
							Source Code
						</Link>
					</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
