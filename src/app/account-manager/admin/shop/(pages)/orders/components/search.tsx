"use client";

import { IconiFy } from "@/components/Iconify";
import Pagination from "@/components/pagination";
import { Input } from "@/components/ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import FilterStatus from "./filter-status";

export default function Search({
	placeholder,
	totalPage = 1,
	options = [],
}: {
	placeholder: string;
	totalPage?: number;
	options?: { value: string; label: string }[];
}) {
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const { replace } = useRouter();

	const handleSearch = useDebouncedCallback((term) => {
		const params = new URLSearchParams(searchParams);
		params.set("page", "1");
		if (term) {
			params.set("search", term);
		} else {
			params.delete("search");
		}
		replace(`${pathname}?${params.toString()}`);
	}, 300);

	return (
		<div className="flex flex-row gap-2 border-b p-2">
			<div className="relative flex flex-1 flex-shrink-0">
				<label htmlFor="search" className="sr-only">
					Search
				</label>
				<Input
					className="peer w-full pl-10 text-sm"
					placeholder={placeholder}
					onChange={(e) => {
						handleSearch(e.target.value);
					}}
					defaultValue={searchParams.get("search")?.toString()}
				/>
				<IconiFy
					icon={"entypo:magnifying-glass"}
					className="-translate-y-1/2 absolute top-1/2 left-3 h-[18px] w-[18px] text-gray-500 peer-focus:text-gray-900"
				/>
			</div>
			{options && <FilterStatus options={options} />}
			<Pagination totalPages={totalPage} />
		</div>
	);
}
