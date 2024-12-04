import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import type { Url } from "url";


type ItemChildProps = {
    title: string
    className?: string
    href: string
}

export default function ItemChild({ title, className, href }: ItemChildProps) {
    return (
        <Button variant="itemchild" asChild className={cn("justify-between ", className)}>
            <Link href={href ?? "/"}> {title}</Link>
        </Button>
    )
}