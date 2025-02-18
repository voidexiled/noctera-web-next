import Item from "@/components/base-layout/main-menu/Item";
import ItemChild from "@/components/base-layout/main-menu/ItemChild";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function MainMenu() {
	return (
		<>
			<Accordion type="single" collapsible className="space-y-1 p-0">
				<Item accordionValue="item-1" title="News" imgSrc={"/icons/icon-news.gif"} imgAlt="News">
					<ItemChild title="Last news" href={"/"} />
					<ItemChild title="Road Map" href={"/road-map"} />
				</Item>

				<Item
					accordionValue="item-2"
					title="Community"
					imgSrc={"/icons/icon-community.gif"}
					imgAlt="Community"
				>
					<ItemChild title="Characters" href={"/characters"} />
					<ItemChild title="Who's Online" href={"/online"} />
					<ItemChild title="Highscores" href={"/highscores"} />
					<ItemChild title="Guilds" href={"/guilds"} />
					<ItemChild title="Last Kills" href={"/last-kills"} />
					<ItemChild title="Support List" href={"/support-list"} />
					<ItemChild title="Casts" href={"/casts"} />
				</Item>

				<Item
					accordionValue="item-3"
					title="Library"
					imgSrc={"/icons/icon-library.gif"}
					imgAlt="Library"
				>
					<ItemChild title="Server Infos" href={"/server-info"} />
					<ItemChild title="Loyalty" href={"/loyalty"} />
					<ItemChild title="Rules" href={"/rules"} />
					<ItemChild title="Terms and Conditions" href={"/terms"} />
					<ItemChild title="Privacy Policy" href={"/privacy"} />
				</Item>

				<Item
					accordionValue="item-4"
					title="Shop"
					imgSrc={"/icons/icon-shops.gif"}
					imgAlt="Webshop"
				>
					<ItemChild title="Buy Coins" href={"/shop"} />
					<ItemChild title="Character Market" href={"/character-market"} />
					{/* <ItemChild title="Battlepass" href={'/battlepass'} /> */}
				</Item>

				<Item
					accordionValue="item-5"
					title="Battlepass"
					imgSrc={"/icons/icon-battlepass.gif"}
					imgAlt="Battlepass"
				>
					<ItemChild title="Battlepass" href={"/battlepass"} />
					<ItemChild title="Buy" href={"/buy-battlepass"} />
				</Item>
			</Accordion>
		</>
	);
}
