import { BattlepassContext } from "@/components/(battlepass)/battlepass/context/BattlepassContext";
import { useContext } from "react";

export const useBattlepass = () => {
	const context = useContext(BattlepassContext);

	if (!context) {
		throw new Error("useBattlepass debe usarse dentro de un BattlepassProvider");
	}

	return context;
};
