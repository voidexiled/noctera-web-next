import { Typography } from "@/components/Typography";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import configLua from "@/hooks/useConfigLua";
const lua = configLua();

export default function TermsAndConditions() {
	return (
		<>
			<Card>
				<CardHeader className="border-b">
					<CardTitle>Terms</CardTitle>
				</CardHeader>

				<CardContent className="space-y-2 p-2">
					<div className="container mx-auto p-4">
						<h1 className="mb-4 font-bold text-3xl">Noctera Global Terms and Conditions</h1>

						<p className="mb-4">
							Welcome to Noctera Global! By accessing and playing on our server, you agree to abide
							by the following Terms and Conditions. Please read them carefully.
						</p>

						<h2 className="mb-2 font-bold text-2xl">1. Account Responsibility</h2>
						<p className="mb-4">
							You are responsible for the security of your account, including your registered email
							address and computer system. Do not share your account information with anyone. We are
							not responsible for any loss or damage resulting from compromised accounts.
						</p>

						<h2 className="mb-2 font-bold text-2xl">2. Server Rules and Conduct</h2>
						<p className="mb-4">
							You must adhere to the rules established for our server. These rules are available{" "}
							<a href="/server-rules" className="text-blue-500 hover:underline">
								here
							</a>
							. Violations may result in account suspension or permanent ban, at our discretion.
							Prohibited conduct includes, but is not limited to:
						</p>
						<ul className="mb-4 ml-6 list-disc">
							<li>Harassment or discrimination of other players.</li>
							<li>Use of bots, hacks, or other unauthorized third-party software.</li>
							<li>Exploiting bugs or glitches for personal gain.</li>
							<li>
								Real-world trading (selling in-game items or accounts for real money) unless
								explicitly permitted by server rules.
							</li>
							<li>Impersonating staff members.</li>
							<li>Disrupting gameplay or community events.</li>
						</ul>

						<h2 className="mb-2 font-bold text-2xl">3. Game Content and Ownership</h2>
						<p className="mb-4">
							All content on the website and in-game, including but not limited to items,
							characters, and other digital assets, remains the property of Noctera Global. You are
							granted a limited, non-exclusive license to use this content in accordance with these
							Terms and the server rules. We reserve the right to modify, remove, or access any
							content or account at any time.
						</p>

						<h2 className="mb-2 font-bold text-2xl">4. Donations and Virtual Currency</h2>
						<p className="mb-4">
							If you choose to make a donation, you are contributing to the server's maintenance and
							development. In return, you may receive virtual currency or other in-game rewards.
							These are for in-game use only and have no real-world value. All donations are final
							and non-refundable. If you are under 18, you must have parental or guardian consent
							before making a donation.
						</p>

						<h2 className="mb-2 font-bold text-2xl">5. Transaction History and Security</h2>
						<p className="mb-4">
							We maintain records of all transactions for security and fraud prevention. This
							information may be used to resolve disputes or investigate suspicious activity.
						</p>

						<h2 className="mb-2 font-bold text-2xl">6. Service Availability</h2>
						<p className="mb-4">
							We strive to provide a stable and enjoyable gaming experience. However, we do not
							guarantee uninterrupted or error-free service. We may perform maintenance or updates
							that require downtime.
						</p>

						<h2 className="mb-2 font-bold text-2xl">7. Modifications to Terms and Conditions</h2>
						<p className="mb-4">
							We may update these Terms and Conditions at any time. It is your responsibility to
							review them periodically for changes. Continued use of the server after changes are
							posted constitutes acceptance of the modified Terms.
						</p>

						<h2 className="mb-2 font-bold text-2xl">8. Disclaimer of Liability</h2>
						<p className="mb-4">
							We are not liable for any loss of in-game items, accounts, or other damages that may
							occur while playing on our server. Use of our server is at your own risk.
						</p>

						<h2 className="mb-2 font-bold text-2xl">9. Governing Law</h2>
						<p className="mb-4">
							These Terms and Conditions shall be governed by and construed in accordance with the
							laws of México.
						</p>

						<h2 className="mb-2 font-bold text-2xl">10. Contact Information</h2>
						<p className="mb-4">
							For any questions or concerns regarding these Terms and Conditions, please contact us
							at{" "}
							<a
								href="mailto:jalomo.chavez21@hotmail.com"
								className="text-blue-500 hover:underline"
							>
								jalomo.chavez21@hotmail.com
							</a>
							.
						</p>

						<h2 className="mb-2 font-bold text-2xl">11. Severability</h2>
						<p className="mb-4">
							If any provision of these Terms and Conditions is found to be invalid or
							unenforceable, the remaining provisions shall remain in full force and effect.
						</p>

						<h2 className="mb-2 font-bold text-2xl">12. Entire Agreement</h2>
						<p className="mb-4">
							These Terms and Conditions constitute the entire agreement between you and Noctera
							Global regarding the use of our server.
						</p>

						<div className="flex justify-center">
							<a href="/privacy-policy" className="mr-4 text-blue-500 hover:underline">
								Privacy Policy
							</a>
							<a href="/server-rules" className="text-blue-500 hover:underline">
								Server Rules
							</a>
						</div>
					</div>
				</CardContent>
			</Card>
		</>
	);
}
