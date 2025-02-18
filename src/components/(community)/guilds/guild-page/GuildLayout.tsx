import { Card, CardContent } from "@/components/ui/card";
import { Suspense } from "react";

type GuildLayoutProps = {
	header: React.ReactNode;
	body: React.ReactNode;
	membersTable: React.ReactNode;
	invitedTable: React.ReactNode;
};

export const GuildLayout = ({ header, body, membersTable, invitedTable }: GuildLayoutProps) => {
	return (
		<Suspense>
			<Card>
				{header}
				{body}
				{membersTable}
				{invitedTable}
			</Card>
		</Suspense>
	);
};
