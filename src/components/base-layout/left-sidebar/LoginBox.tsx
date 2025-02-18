import { TransparentContainer } from "@/components/base-layout/common/TransparentContainer";
import { LogoutButton } from "@/components/base-layout/left-sidebar/LogoutButton";
import { Button } from "@/components/ui/button";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import Link from "next/link";

export default async function LoginBox() {
	const session = await getServerSession(authOptions);

	return (
		<TransparentContainer>
			<div className="flex grow flex-col space-y-1">
				{session?.user ? (
					<>
						{session.user.role === "admin" && (
							<Button variant="adminpanel" asChild className="rounded-md">
								<Link href={"/account-manager/admin"}>Admin Panel</Link>
							</Button>
						)}
						<Button variant="myaccount" asChild className="rounded-md">
							<Link href={"/account-manager/"}>My Account</Link>
						</Button>
						<LogoutButton />
					</>
				) : (
					<>
						<Button asChild size="sm" variant="login" className="rounded-md">
							<Link href={"/account-manager/login"}>Login</Link>
						</Button>
						<Button asChild size="sm" variant="register" className="rounded-md">
							<Link href={"/account-manager/register"}>Create Account</Link>
						</Button>
					</>
				)}
			</div>
		</TransparentContainer>
	);
}
