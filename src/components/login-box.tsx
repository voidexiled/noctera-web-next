import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import Link from "next/link";
import { LogoutButton } from "./logout";
import { Button } from "./ui/button";

export default async function LoginBox() {
	const session = await getServerSession(authOptions);

	if (!session?.user) {
		return (
			<>
				<div className="rounded-md bg-background/10 p-1 shadow-sm backdrop-blur-[6px]">
					<div className="flex flex-row gap-2">
						<div className="flex grow flex-col space-y-1">
							<Button asChild>
								<Link href={"/account-manager/login"}>Login</Link>
							</Button>
							<Button asChild size={"sm"} variant={"blue"}>
								<Link href={"/account-manager/register"}>Create Account</Link>
							</Button>
						</div>
					</div>
				</div>
			</>
		);
	}

	return (
		<>
			<div className="rounded-md bg-background/10 p-1 shadow-sm backdrop-blur-[6px]">
				<div className="flex flex-row gap-2">
					<div className="flex grow flex-col space-y-1">
						{session?.user?.role === "admin" && (
							<Button variant={"destructive"} asChild>
								<Link href={"/account-manager/admin"}>Admin Panel</Link>
							</Button>
						)}

						<Button asChild>
							<Link href={"/account-manager/"}>My Account</Link>
						</Button>
						<LogoutButton />
					</div>
				</div>
			</div>
		</>
	);
}
