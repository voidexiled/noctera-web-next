"use client";

import { useStripe } from "@stripe/react-stripe-js";
import { createContext, useState } from "react";

export enum Step {
	PRODUCTS = 1,
	CHECKOUT = 2,
	PAYMENT = 3,
	CONFIRMATION = 4,
}

export type StepFormContext = {
	formStep: Step;
	nextFormStep: () => void;
	previousFormStep: () => void;
	resetFormSteps: () => void;
	errorMessage: string | null;
	setErrorMessage: (errorMessage: string | null) => void;
};

export const StepFormContext = createContext<StepFormContext>({
	formStep: Step.PRODUCTS,
	nextFormStep: () => {},
	previousFormStep: () => {},
	resetFormSteps: () => {},
	errorMessage: null,
	setErrorMessage: () => {},
});

export const StepFormContextProvider = ({ children }: { children: React.ReactNode }) => {
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const [formStep, setFormStep] = useState<Step>(Step.PRODUCTS);
	const nextFormStep = () => formStep < Step.CONFIRMATION && setFormStep((prev) => prev + 1);
	const previousFormStep = () => formStep > Step.PRODUCTS && setFormStep((prev) => prev - 1);
	const resetFormSteps = () => setFormStep(Step.PRODUCTS);
	return (
		<StepFormContext.Provider
			value={{
				formStep,
				nextFormStep,
				previousFormStep,
				resetFormSteps,
				errorMessage,
				setErrorMessage,
			}}
		>
			{children}
		</StepFormContext.Provider>
	);
};
