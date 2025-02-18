import { TransparentContainer } from "@/components/base-layout/common/TransparentContainer";
import { IconiFy } from "@/components/common/Iconify";
import { Facebook } from "@/components/svg/Facebook";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { DiscordLogoIcon } from "@radix-ui/react-icons";
import { CloudDownload, DownloadIcon } from "lucide-react";
import Link from "next/link";

type HeaderProps = {
	isServerOnline: boolean | null;
	playerOnlineCount: number;
};

export const Header = ({ isServerOnline, playerOnlineCount }: HeaderProps) => {
	return (
		<TransparentContainer as="header">
			<Card className="flex items-center justify-between p-1">
				<div className="flex flex-row gap-4 pl-1 underline-offset-2">
					<Link
						href={process.env.DISCORD_URL ?? "#"}
						className="flex flex-row items-center text-teal-400 text-xs transition-all hover:underline"
					>
						Discord
					</Link>
					{/* <Link href={process.env.YOUTUBE_URL ?? ' #'} className='flex flex-row items-center text-xs '>
                          <IconiFy icon={'line-md:youtube'} className='w-6' /> YouTube
                        </Link>
                        <Link href={process.env.INSTAGRAM_URL ?? '#'} className='flex flex-row items-center text-xs '>
                          <IconiFy icon={'line-md:instagram'} className='w-6' /> Instagram
                        </Link> */}
					<Link
						href={process.env.FACEBOOK_URL ?? "#"}
						className="flex flex-row items-center text-blue-400 text-xs transition-all hover:underline"
					>
						Facebook
					</Link>
					<Link
						href={process.env.WHATSAPP_URL ?? "#"}
						className="flex flex-row items-center text-emerald-400 text-xs transition-all hover:underline "
					>
						Whatsapp
					</Link>
				</div>

				<div className="flex items-center space-x-1 p-1 px-2">
					{isServerOnline ? (
						<Badge variant="serveron">{playerOnlineCount} players</Badge>
					) : (
						<Badge variant="serveroff">Offline</Badge>
					)}
				</div>
			</Card>
		</TransparentContainer>
	);
};
