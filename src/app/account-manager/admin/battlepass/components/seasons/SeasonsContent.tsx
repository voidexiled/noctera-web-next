"use client";
import {
	AdminBattlepassContext,
	type AdminBattlepassContextType,
} from "@/app/account-manager/admin/battlepass/components/context/AdminBattlepassProvider";
import { NewSeasonForm } from "@/app/account-manager/admin/battlepass/components/seasons/NewSeasonForm";
import { SeasonsGrid } from "@/app/account-manager/admin/battlepass/components/seasons/SeasonsGrid";

import { useContext } from "react";

export const SeasonsContent = () => {
	return (
		<div className="grid grid-rows-[auto_1fr] overflow-hidden">
			<SeasonsGrid />
			<NewSeasonForm />
		</div>
	);
};
