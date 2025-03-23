import { Badge } from "@/components/ui/badge";

type OnlineStatusBadgeProps = {
	isOnline: boolean | null;
};

export const OnlineStatusBadge = ({ isOnline }: OnlineStatusBadgeProps) => {
	return (
		<Badge variant={isOnline ? "serveron" : "serveroff"}>{isOnline ? "Online" : "Offline"}</Badge>
	);
};
