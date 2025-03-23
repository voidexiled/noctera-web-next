import { CHARACTER_NAMES } from "@/components/(account-manager)/(auth)/register/utils/consts";

export function generateRandomName() {
	let newName = "";
	if (Math.random() < 0.3) {
		const numSyllables = Math.floor(Math.random() * 3) + 2; // 2 to 4 syllables
		for (let i = 0; i < numSyllables; i++) {
			newName +=
				CHARACTER_NAMES.syllables[Math.floor(Math.random() * CHARACTER_NAMES.syllables.length)];
		}
	} else {
		const randomPrefix =
			CHARACTER_NAMES.prefixes[Math.floor(Math.random() * CHARACTER_NAMES.prefixes.length)];
		const randomSuffix =
			CHARACTER_NAMES.suffixes[Math.floor(Math.random() * CHARACTER_NAMES.suffixes.length)];
		newName = randomPrefix + randomSuffix;
	}

	newName = newName.charAt(0).toUpperCase() + newName.slice(1); // Capitalize first letter
	return newName;
}
