"use client";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { signOut } from "next-auth/react";
import { Button } from "./ui/button";

export const LogoutButton = () => {
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button className="whitespace-nowrap" variant={"secondary"}>
					Logout
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Confirm Logout!</AlertDialogTitle>
					<AlertDialogDescription className="flex flex-row items-center justify-between space-x-2 rounded-md border p-2 text-sm leading-none">
						Are you sure you want to log out of your account? This will end your
						current session and you will need to log in again to access your
						account.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction asChild>
						<Button
							className="whitespace-nowrap"
							onClick={() => signOut({ redirect: true, callbackUrl: "/" })}
						>
							Logout
						</Button>
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};
