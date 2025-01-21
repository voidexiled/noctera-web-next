"use client";

import { useToast } from "@/components/ui/use-toast";

type ErrorCardMessageProps = {
    errorType: string;
    errorMessage: string;
}

export const ErrorCardMessage = ({errorType, errorMessage}: ErrorCardMessageProps) => {
    //const {toast} = useToast()

	return (
		<div className="flex flex-row items-center justify-center rounded-md bg-destructive p-4 text-center font-sm text-destructive-foreground">
			<p>
				<span className="font-semibold">{errorType}:{" "}</span> 
                <span>{errorMessage}</span>
			</p>
		</div>
	);
};
