import { Typography } from "@/components/Typography";
import { TransparentContainer } from "@/components/base-layout/common/TransparentContainer";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export const Footer = () => {
	return (
		<TransparentContainer as="footer">
			<Card className="flex h-full w-full justify-between gap-2 p-2">
				<Typography variant={"overline"} className="">
					Noctera-Global &copy; 2024
				</Typography>
				<div className="flex flex-row items-center gap-2">
					<Typography variant={"overline"} className="">
						FAQ
					</Typography>
				</div>
			</Card>
		</TransparentContainer>
	);
};
