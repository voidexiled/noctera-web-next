// ! TODO: Delete this file
"use client";

import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export default function VocationFilter({
	options,
}: { options: { value: string; label: string }[] }) {
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const { replace } = useRouter();

	const defaultValue = searchParams.get("vocation") || "";

	const handleSearch = useDebouncedCallback((term) => {
		const params = new URLSearchParams(searchParams);
		params.set("page", "1");
		if (term) {
			params.set("vocation", term);
		} else {
			params.delete("vocation");
		}

		if (term === "all") {
			params.set("vocation", "0");
		}

		replace(`${pathname}?${params.toString()}`);
	}, 300);

	return (
		<Select
			defaultValue={defaultValue}
			onValueChange={(e) => {
				handleSearch(e);
			}}
		>
			<SelectTrigger className="">
				<SelectValue placeholder="Select a vocation" />
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					<SelectItem value="all" defaultChecked={!defaultValue}>
						All
					</SelectItem>
					{options.map((option) => (
						<SelectItem key={option.value} value={option.value}>
							{option.label}
						</SelectItem>
					))}
				</SelectGroup>
			</SelectContent>
		</Select>
	);
}
