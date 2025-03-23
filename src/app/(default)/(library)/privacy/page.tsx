import { Typography } from "@/components/Typography";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import configLua from "@/hooks/useConfigLua";
const lua = configLua();

export default function PrivacyPolicy() {
	return (
		<>
			<Card>
				<CardHeader className="border-b">
					<CardTitle>Privacy Policy</CardTitle>
				</CardHeader>

				<CardContent className="space-y-2">
					<div className="container mx-auto p-4">
						<h1 className="mb-4 font-bold text-3xl">Noctera Global Privacy Policy</h1>

						<p className="mb-4">
							At Noctera Global, we are committed to protecting the privacy of our players. This
							Privacy Policy explains how we collect, use, and protect your personal information.
						</p>

						<h2 className="mb-2 font-bold text-2xl">Information We Collect</h2>
						<p className="mb-4">We collect the following information:</p>
						<ul className="mb-4 ml-6 list-disc">
							<li>IP Address</li>
							<li>Game account information (username, etc.)</li>
							<li>Email address (if you provide it)</li>
							<li>Real name (if you provide it)</li>
							<li>Phone number (if you provide it)</li>
						</ul>

						<h2 className="mb-2 font-bold text-2xl">How We Use Your Information</h2>
						<p className="mb-4">We use your information to:</p>
						<ul className="mb-4 ml-6 list-disc">
							<li>Administer your account and provide you with access to the game.</li>
							<li>Improve the game and our services.</li>
							<li>Communicate with you (if you have given us permission).</li>
							<li>Prevent fraud and ensure server security.</li>
						</ul>

						<h2 className="mb-2 font-bold text-2xl">Sharing Your Information</h2>
						<p className="mb-4">
							We do not share your personal information with third parties, except when necessary to
							comply with the law or protect our rights.
						</p>

						<h2 className="mb-2 font-bold text-2xl">Your Rights</h2>
						<p className="mb-4">
							You have the right to access, rectify, or delete your personal information. You can
							contact us to exercise these rights.
						</p>

						<h2 className="mb-2 font-bold text-2xl">Changes to this Policy</h2>
						<p className="mb-4">
							We may update this Privacy Policy in the future. We will notify you of any significant
							changes.
						</p>

						<p className="mb-4">
							If you have any questions about this Privacy Policy, please contact us at{" "}
							<a
								href="mailto:jalomo.chavez21@hotmail.com"
								className="text-blue-500 hover:underline"
							>
								jalomo.chavez21@hotmail.com
							</a>
							.
						</p>
					</div>
				</CardContent>
			</Card>
		</>
	);
}
