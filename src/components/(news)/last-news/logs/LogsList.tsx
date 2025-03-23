"use client";
import { LogItem } from "@/components/(news)/last-news/logs/LogItem";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { posts } from "@prisma/client";
import dayjs from "dayjs";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export const LogsList = ({ logs }: { logs?: posts[] }) => {
	return (
		<Card>
			<CardHeader className="border-b">
				<CardTitle>Latest Logs</CardTitle>
			</CardHeader>
			<CardContent className="p-0">
				<div className="flex flex-col gap-0">
					{logs?.map((log, index) => {
						const isFirst = index === 0;
						const isLast = index === logs.length - 1;

						return <LogItem log={log} isFirst={isFirst} isLast={isLast} key={log.id} />;
					})}
				</div>
			</CardContent>
		</Card>
	);
};
