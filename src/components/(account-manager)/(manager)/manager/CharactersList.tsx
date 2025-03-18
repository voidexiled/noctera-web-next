"use client";
import type { players } from "@prisma/client";
import { z } from "zod";

import { API_ROUTES } from "@/app/api/routes";
import { BattlepassRankBadge } from "@/components/(battlepass)/battlepass/info/BattlepassRankBadge";
import { Typography } from "@/components/Typography";
import OutfitComponent from "@/components/animations/OutfitComponent";
import type { Outfit } from "@/components/animations/types";
import { FormProvider } from "@/components/common/hook-form";
import RHFSwitch from "@/components/common/hook-form/RHFSwitch";
import RHFTextarea from "@/components/common/hook-form/RHFTextarea";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getVocation } from "@/utils/functions/getVocations";
import { typedFetch } from "@/utils/typedFetch";
import { zodResolver } from "@hookform/resolvers/zod";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type {
  AccountsPlayersByIdDELETERequest,
  AccountsPlayersByIdDELETEResponse,
  AccountsPlayersByIdPATCHRequest,
  AccountsPlayersByIdPATCHResponse,
} from "@/app/api/types";

type IProps = {
  chars: players[];
  playerOnline: { player_id: number }[];
};

const EditPlayerSchema = z.object({
  comment: z.string().nullable(),
  hidden: z.boolean().default(false),
});
type formValues = z.infer<typeof EditPlayerSchema>;

export default function CharactersList({
  chars = [],
  playerOnline = [],
}: IProps) {
  return (
    <section>
      <div className="flex flex-col rounded-sm border">
        <div className="flex items-center justify-between border-b bg-background/60 p-2 text-sm">
          Characters
        </div>
        <Table>
          <TableHeader className="pointer-events-none text-sm">
            <TableRow>
              <TableHead className="w-16" />
              <TableHead>Name</TableHead>
              <TableHead>Vocation</TableHead>
              <TableHead>Level</TableHead>
              <TableHead className="w-[80px] font-semibold">
                Battlepass
              </TableHead>
              <TableHead className="w-[80px] font-semibold">Status</TableHead>
              <TableHead className="w-[30px] font-semibold" />
            </TableRow>
          </TableHeader>
          <TableBody className="text-sm ">
            {chars.map((player) => {
              const outfit: Outfit = {
                looktype: player.looktype,
                lookaddons: player.lookaddons,
                lookbody: player.lookbody,
                lookfeet: player.lookfeet,
                lookhead: player.lookhead,
                looklegs: player.looklegs,
              };

              return (
                <TableRow key={player.id.toString()} className="h-16">
                  <TableCell>
                    <OutfitComponent
                      outfit={outfit}
                      className="-left-4 -top-4"
                    />
                  </TableCell>
                  <TableCell className="text-zinc-300">
                    <Link href={`/characters/${player.name}`}>
                      {player.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-zinc-300">
                    {getVocation(player.vocation)}
                  </TableCell>
                  <TableCell className="text-zinc-300">
                    {player.level}
                  </TableCell>
                  <TableCell className="text-zinc-300">
                    <BattlepassRankBadge selectedPlayer={player} />
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        playerOnline.find((p) => p.player_id === player.id)
                          ? "serveron"
                          : "serveroff"
                      }
                    >
                      {" "}
                      {playerOnline.find((p) => p.player_id === player.id)
                        ? "ON"
                        : "OFF"}{" "}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Actions player={player} />
                  </TableCell>
                </TableRow>
              );
            })}
            {chars.length === 0 && (
              <TableRow>
                <TableCell>
                  <Typography variant="overline" className="text-center">
                    No characters created yet.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}

type ActionsType = {
  player: players;
};

function Actions({ player }: ActionsType) {
  const route = useRouter();

  const [playerName, setPlayerName] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);

  const methods = useForm<formValues>({
    resolver: zodResolver(EditPlayerSchema),
    defaultValues: {
      hidden: player.hidden,
      comment: player.comment,
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  async function DeletePlayer(id: number) {
    await typedFetch<
      AccountsPlayersByIdDELETERequest,
      AccountsPlayersByIdDELETEResponse
    >(API_ROUTES.accounts.players.id(id), {
      method: "DELETE",
    }).then((res) => {
      if (res.ok) {
        toast.success(`Character with name '${player.name}' has been deleted.`);
        setShowDeleteDialog(false);
        route.refresh();
        return;
      }
      if (res.status === 401) {
        toast.error("You are not authorized to delete this player.");
        return;
      }
      toast.error("Error on delete character.");
      return;
    });
  }

  async function HandleEditPlayer(body: formValues) {
    await typedFetch<
      AccountsPlayersByIdPATCHRequest,
      AccountsPlayersByIdPATCHResponse
    >(API_ROUTES.accounts.players.id(player.id), {
      method: "PATCH",
      body,
    }).then((res) => {
      if (res.status === 200) {
        toast.success(`This player '${player.name}' has been edited.`);
        setIsOpenEdit(false);
        route.refresh();
        return;
      }
      if (res.status === 401) {
        toast.error("You are not authorized to edit this player.");
        return;
      }
      toast.error("Error on edit character.");
      return;
    });
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-6 w-6 p-0" size={"iconsm"}>
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" side="right">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onSelect={() => setIsOpenEdit(true)}>
            Edit Player
          </DropdownMenuItem>
          <DropdownMenuItem onClick={async () => setShowDeleteDialog(true)}>
            Delete Player
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {isOpenEdit && (
        <Dialog open={isOpenEdit} onOpenChange={setIsOpenEdit}>
          <DialogContent>
            <FormProvider
              methods={methods}
              onSubmit={handleSubmit(HandleEditPlayer)}
            >
              <DialogHeader>
                <DialogTitle>Edit Character</DialogTitle>
              </DialogHeader>
              <DialogDescription className="rounded-sm border">
                <div className="flex items-center justify-between border-b bg-card/60 p-2 text-sm">
                  Character Data
                </div>
                <Table className="pointer-events-none">
                  <TableBody>
                    <TableRow>
                      <TableCell>Name:</TableCell>
                      <TableCell className="font-bold">{player.name}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Sex:</TableCell>
                      <TableCell>
                        {player.sex === 0 ? "Female" : "Male"}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Vocation:</TableCell>
                      <TableCell>{getVocation(player.vocation)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Level:</TableCell>
                      <TableCell>{player.level}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </DialogDescription>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex flex-row items-center justify-between gap-2">
                    <Label>Hidden character</Label>

                    <RHFSwitch name="hidden" />
                  </div>
                  <div className="space-y-2">
                    <Label>Comment</Label>
                    <RHFTextarea name="comment" />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    reset();
                    setIsOpenEdit(false);
                  }}
                >
                  Close
                </Button>
                <Button disabled={isSubmitting} type="submit">
                  Save
                </Button>
              </DialogFooter>
            </FormProvider>
          </DialogContent>
        </Dialog>
      )}

      {showDeleteDialog && (
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription className="rounded-sm border p-2 text-red-500">
                This action cannot be undone. This player will no longer be
                accessible.
              </AlertDialogDescription>
              <div className="space-y-1">
                <Label>Enter &quot;{player.name}&quot; to continue.</Label>
                <Input
                  placeholder={player.name ?? "digite o nome do player"}
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                />
              </div>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <Button
                variant="destructive"
                onClick={async () => await DeletePlayer(player.id)}
                disabled={playerName !== player.name}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
