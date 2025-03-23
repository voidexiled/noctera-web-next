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
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

export const LogoutButton = () => {
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button className="whitespace-nowrap" variant="logout">
					Logout
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Confirm Logout!</AlertDialogTitle>
					<AlertDialogDescription className="flex flex-row items-center justify-between space-x-2 text-pretty rounded-md py-3 text-sm">
						Are you sure you want to log out of your account? This will end your current session and
						you will need to log in again to access your account.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction asChild>
						<Button
							variant="logout"
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
