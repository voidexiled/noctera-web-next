"use client";
import { createContext, useState } from "react";

export type AdminToolbarContextType = {
	isOpenDialogViewAllAccounts: boolean;
	setIsOpenDialogViewAllAccounts: (isOpenDialogViewAllAccounts: boolean) => void;
};

export const AdminToolbarContext = createContext<AdminToolbarContextType | undefined>(undefined);

export const AdminToolbarProvider: React.FC<{
	children: React.ReactNode;
}> = ({ children }) => {
	const [isOpenDialogViewAllAccounts, setIsOpenDialogViewAllAccounts] = useState(false);

	return (
		<AdminToolbarContext.Provider
			value={{
				isOpenDialogViewAllAccounts,
				setIsOpenDialogViewAllAccounts,
			}}
		>
			{children}
		</AdminToolbarContext.Provider>
	);
};
