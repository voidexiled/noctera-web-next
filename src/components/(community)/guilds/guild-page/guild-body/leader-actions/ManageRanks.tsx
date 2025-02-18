"use client";

import CreateNewRankForm from "@/components/(community)/guilds/guild-page/guild-body/leader-actions/CreateNewRankForm";
import { IconiFy } from "@/components/common/Iconify";
import { FormProvider, RHFSelect, RHFTextField } from "@/components/common/hook-form";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { zodResolver } from "@hookform/resolvers/zod";
import type { guild_membership, guild_ranks, guilds } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const FormSchema = z.object({
	guild_id: z.number(),
	ranks: z.array(
		z.object({ id: z.number(), guild_id: z.number(), name: z.string(), level: z.number() }),
	),
});

type ItemFormValues = z.infer<typeof FormSchema>;

type ManageRanksProps = {
	guild: guilds & {
		guild_membership: guild_membership[];
		guild_ranks: guild_ranks[];
	};
};

export const ManageRanks = ({ guild }: ManageRanksProps) => {
	const router = useRouter();
	const defaultValues: ItemFormValues = {
		guild_id: guild.id,
		ranks: guild.guild_ranks,
	};

	const methods = useForm<ItemFormValues>({
		resolver: zodResolver(FormSchema),
		defaultValues,
	});
	const {
		setValue,
		handleSubmit,
		watch,
		formState: { isSubmitting, isDirty },
	} = methods;

	async function onSubmit(formData: ItemFormValues) {
		try {
			const res = await fetch(`/api/guilds/manager/${guild.id}/ranks`, {
				method: "PUT",
				body: JSON.stringify(formData),
			});
			if (res.ok) {
				toast.success("Guild has been updated.");
			}
			router.refresh();
			document.getElementById("closeDialog")?.click();
		} catch (e) {
			console.error(e);
		}
	}

	async function onDelete(id: number) {
		try {
			const res = await fetch(`/api/guilds/manager/${guild.id}/ranks/${id}`, {
				method: "DELETE",
			});
			console.log(res);
			if (res.ok) {
				const deletedRankName = watch("ranks").find((rank) => rank.id === id)?.name;
				toast.success(`Rank ${deletedRankName} has been deleted`);
				router.refresh();
				return;
			}
			if (res.status === 400) {
				toast.error("An error ocurred while deleting rank");
				router.refresh();
				return;
			}

			toast.error("An internal error ocurred while deleting rank");
			router.refresh();
		} catch (e) {
			console.error(e);
		}
	}

	const reloadRanks = async () => {
		const res = await fetch(`/api/guilds/manager/${guild.id}/ranks`);
		const dataResponse: {
			ranks: guild_ranks[];
		} = await res.json();
		setValue("ranks", dataResponse.ranks);
	};

	useEffect(() => {
		if (guild?.guild_ranks) {
			methods.reset({
				guild_id: guild.id,
				ranks: guild.guild_ranks,
			});
		}
	}, [guild, methods.reset]);

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button>Manager Ranks</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Manager Ranks</DialogTitle>
				</DialogHeader>

				<CreateNewRankForm guild_id={guild.id} onSuccessAction={reloadRanks} />

				<FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
					<div className="rounded-md border">
						<Table>
							<TableBody>
								{watch("ranks").map((rank, index) => {
									return (
										<TableRow key={rank.id} className="border-none">
											<TableCell>
												<RHFTextField name={`ranks.${index}.name`} />
											</TableCell>
											<TableCell>
												<RHFSelect
													placeholder="Select a rank"
													name={`ranks.${index}.level`}
													onValueChange={(value) =>
														setValue(`ranks.${index}.level`, Number.parseInt(value))
													}
													defaultValue={`${rank.level}`}
													options={[
														{ value: "3", label: "Leader" },
														{ value: "2", label: "Vice Leader" },
														{ value: "1", label: "Member" },
													]}
													keyValue="value"
													LabelOption="label"
												/>
											</TableCell>
											<TableCell>
												{index <= 2 ? (
													<Button variant={"outline"} disabled>
														<IconiFy icon={"ph:trash-simple"} />
													</Button>
												) : (
													<Button
														variant={"outline"}
														onClick={(e) => {
															e.preventDefault();
															onDelete(rank.id);
														}}
													>
														<IconiFy icon={"ph:trash-simple"} />
													</Button>
												)}
											</TableCell>
										</TableRow>
									);
								})}
							</TableBody>
						</Table>
					</div>

					<DialogFooter>
						<DialogClose asChild>
							<Button variant="outline" id="closeDialog">
								Cancel
							</Button>
						</DialogClose>
						<Button disabled={isSubmitting} type="submit">
							Save
						</Button>
					</DialogFooter>
				</FormProvider>
			</DialogContent>
		</Dialog>
	);
};
