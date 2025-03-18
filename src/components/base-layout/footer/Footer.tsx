import { Typography } from "@/components/Typography";
import { TransparentContainer } from "@/components/base-layout/common/TransparentContainer";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export const Footer = () => {
	return (
		<TransparentContainer as="footer">
			<Card>
				<CardHeader>
					<CardTitle className="flex h-full w-full flex-row justify-between gap-2">
						<Typography variant={"overline"} className="">
							Noctera Global &copy; 2025
						</Typography>
						<div className="flex flex-row items-center gap-2">
							<Typography variant={"overline"} className="">
								FAQ
							</Typography>
						</div>
					</CardTitle>
				</CardHeader>
			</Card>
		</TransparentContainer>
	);
};
