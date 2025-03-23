"use client";

import { RHFTextEditor } from "@/components/common/hook-form";
import { useState } from "react";

const DEFAULT = "";

export const NewEditor = ({ name, id }: { name: string; id: string }) => {
	const [content, setContent] = useState(DEFAULT);

	const onChangeContent = (value: string) => {
		setContent(value);
	};

	return (
		<RHFTextEditor
			name={name}
			id={id}
			defaultValue={DEFAULT}
			value={content}
			onChange={(event) => {
				setContent(event.target.value);
			}}
		/>
	);
};
