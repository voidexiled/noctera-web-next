import Image from "next/image"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "../ui/button"
import Link from "next/link"
import Item from "@/components/main-menu/item"
import ItemChild from "@/components/main-menu/item-child"


export default function MainMenu() {
  return (
    <>
      <Accordion type="single" collapsible className=" space-y-1 p-0">
        <Item accordionValue="item-1" title="News" imgSrc={'/icons/icon-news.gif'} imgAlt="Premium" >
          <ItemChild title="Last news" href={'/'} />
          <ItemChild title="Road Map" href={'/road-map'} />
        </Item>
        
        <Item accordionValue="item-2" title="Community" imgSrc={'/icons/icon-community.gif'} imgAlt="Premium" >
          <ItemChild title="Characters" href={'/characters'} />
          <ItemChild title="Who's Online" href={'/online'} />
          <ItemChild title="Highscores" href={'/highscores'} />
          <ItemChild title="Guilds" href={'/guilds'} />
          <ItemChild title="Last Kills" href={'/last-kills'} />
          <ItemChild title="Support List" href={'/support-list'} />
          <ItemChild title="Casts" href={'/casts'} />
        </Item>

        <Item accordionValue="item-3" title="Library" imgSrc={'/icons/icon-library.gif'} imgAlt="Premium" >
          <ItemChild title="Server Infos" href={'/server-info'} />
          <ItemChild title="Loyalty" href={'/loyalty'} />
          <ItemChild title="Rules" href={'/rules'} />
        </Item>

        <Item accordionValue="item-4" title="Shop" imgSrc={'/icons/icon-shops.gif'} imgAlt="Premium" >
          <ItemChild title="Buy Coins" href={'/shop'} />
          <ItemChild title="Character Market" href={'/character-market'} />
        </Item>

      </Accordion>
    </>
  )
}