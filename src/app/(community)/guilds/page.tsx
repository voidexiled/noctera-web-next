"use server";

import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

import TableGuild from "./components/tableGuild";

export default async function Guilds() {
	return (
		<>
			<Card>
				<CardHeader className="border-b">
					<CardTitle>Guilds</CardTitle>
				</CardHeader>
				<CardContent className="space-y-2 p-2">
					<TableGuild />
				</CardContent>
			</Card>
		</>
	);
}
