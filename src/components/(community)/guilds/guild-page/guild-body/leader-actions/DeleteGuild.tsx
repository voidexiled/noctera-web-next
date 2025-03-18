"use client";
import type {
	DeleteGuildError,
	DeleteGuildRequest,
	DeleteGuildResponse,
} from "@/components/(community)/guilds/types/guilds";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type DeleteGuildProps = {
	guild_id: number;
};

export const DeleteGuild = ({ guild_id }: DeleteGuildProps) => {
	const [confirmDeleteGuild, setConfirmDeleteGuild] = useState("");
	const router = useRouter();

	async function handleDeleteGuild() {
		const request: DeleteGuildRequest = {
			guild_id,
		};

		// const res = await fetch(`/api/guilds/manager/${guild_id}`, {
		// 	method: "DELETE",
		// 	body: JSON.stringify(request),
		// });

		const res = toast
			.promise(
				fetch(`/api/guilds/manager/${guild_id}`, {
					method: "DELETE",
					body: JSON.stringify(request),
				}),
				{
					loading: "Deleting Guild...",
					success: "Guild deleted successfully!",
					error: "An error ocurred while deleting the guild!",
				},
			)
			.unwrap()
			.then((res) => {
				document.getElementById("closeDialog")?.click();
				router.push("/guilds");
				return res;
			});

		// if (res.ok) {

		// 	const dataResponse: DeleteGuildResponse = await res.json();
		// 	toast.success(`Guild ${dataResponse.guild_name} deleted`);
		// 	router.push("/guilds");
		// } else {
		// 	const dataError: DeleteGuildError = await res.json();
		// 	toast.error(dataError.message);
		// }
	}

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button size="sm" variant="destructive" className="whitespace-nowrap">
					Delete Guild
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle className="font-bold text-lg">Confirm deletion!</AlertDialogTitle>

					<AlertDialogDescription className="text-gray-300 text-sm">
						Are you sure you want to delete your guild? <br />
						This action cannot be undone.
					</AlertDialogDescription>
					<div className="flex flex-col gap-2 pt-5">
						<Label htmlFor="confirmDeleteGuild" className="text-sm">
							Type <span className="font-bold">'Delete'</span> to confirm deletion
						</Label>
						<Input
							type="text"
							id="confirmDeleteGuild"
							value={confirmDeleteGuild}
							onChange={(e) => setConfirmDeleteGuild(e.target.value)}
						/>
					</div>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<Button
						variant={"destructive"}
						type="submit"
						onClick={handleDeleteGuild}
						disabled={confirmDeleteGuild !== "Delete"}
					>
						Confirm Deletion
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};
