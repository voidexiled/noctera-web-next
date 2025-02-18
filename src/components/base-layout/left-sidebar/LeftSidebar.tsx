import { TransparentContainer } from "@/components/base-layout/common/TransparentContainer";
import LoginBox from "@/components/base-layout/left-sidebar/LoginBox";
import MainMenu from "@/components/base-layout/main-menu/MainMenu";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const LeftSidebar = () => {
	return (
		<aside className="col-span-1 gap-2 space-y-2 sm:col-span-2 ">
			<LoginBox />

			<TransparentContainer>
				<div className="flex flex-col space-y-2">
					<Button size="lg" variant="download" className="text-center" asChild>
						<Link href={"/download"} className="justify-center gap-2 rounded-md">
							Download
						</Link>
					</Button>
				</div>
			</TransparentContainer>

			<TransparentContainer>
				<MainMenu />
			</TransparentContainer>
		</aside>
	);
};
