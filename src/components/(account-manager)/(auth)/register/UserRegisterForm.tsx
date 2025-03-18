"use client";

import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import type { RouteErrorResponse } from "@/app/api/auth/register/route";
import { API_ROUTES } from "@/app/api/routes";
import type { AuthRegisterPOSTRequest, AuthRegisterPOSTResponse } from "@/app/api/types";
import { generateRandomName } from "@/components/(account-manager)/(auth)/register/utils/functions";
import { countries } from "@/components/(account-manager)/(manager)/data/countries";
import { FormProvider, RHFSelect, RHFTextField } from "@/components/common/hook-form";
import RHFCheckbox from "@/components/common/hook-form/RHFCheckbox";
import { PhoneInput } from "@/components/ui/phone-input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { type TypedFetchBaseResponse, typedFetch } from "@/utils/typedFetch";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { isValidPhoneNumber } from "react-phone-number-input";
import { toast } from "sonner";
import { z } from "zod";

interface UseRegisterFormProps extends React.HTMLAttributes<HTMLDivElement> {}

const sexOptions = [
	{ value: "0", label: "Female" },
	{ value: "1", label: "Male" },
];
const vocationOptions = [
	{ value: "1", label: "Sorcerer" },
	{ value: "2", label: "Druid" },
	{ value: "3", label: "Paladin" },
	{ value: "4", label: "Knight" },
];

const passwordUppercase = z
	.string()
	.regex(/[A-Z]/, "The password should contain at least 1 uppercase character");
const passwordLowercase = z
	.string()
	.regex(/[a-z]/, "The password must contain at least one lowercase letter");
const passwordDigit = z
	.string()
	.regex(/\d/, "The password must contain at least one numeric digit");
const passwordSpecialChar = z
	.string()
	.regex(
		/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/,
		"The password must contain at least one special character",
	);

const countryOptions: { label: string; value: string }[] = [...countries];

export function UserRegisterForm({ className, ...props }: UseRegisterFormProps) {
	const router = useRouter();
	const loginFormSchema = z.object({
		accountName: z.string(),
		email: z.string().email(),
		password: z
			.string()
			.min(8, "A senha deve ter no mínimo 8 caracteres")
			.and(passwordUppercase)
			.and(passwordLowercase)
			.and(passwordDigit)
			.and(passwordSpecialChar),
		passwordConfirm: z
			.string()
			.min(8, "A senha deve ter no mínimo 8 caracteres")
			.and(passwordUppercase)
			.and(passwordLowercase)
			.and(passwordDigit)
			.and(passwordSpecialChar),
		characterName: z.string(),
		gender: z.string(),
		wLocation: z.string().optional(),
		wType: z.string().optional(),
		terms: z.boolean().default(false),
		vocation: z.string().default("1"),
		country: z.string().default("MX"),
		phone: z.string().refine(isValidPhoneNumber, { message: "Invalid phone number" }),
		rlname: z.string(),
	});

	type LoginFormValues = z.infer<typeof loginFormSchema>;

	const methods = useForm<LoginFormValues>({
		resolver: zodResolver(loginFormSchema),
		defaultValues: {
			gender: "0",
			vocation: "1",
			country: "MX",
		},
	});

	const {
		handleSubmit,
		watch,
		formState: { isSubmitting },
		trigger,
	} = methods;

	async function onSubmit(data: LoginFormValues) {
		// console.log("data form", data);

		toast
			.promise(
				typedFetch<AuthRegisterPOSTRequest, AuthRegisterPOSTResponse>(API_ROUTES.auth.register._, {
					method: "POST",
					body: {
						name: data.accountName,
						email: data.email,
						password: data.password,
						gender: data.gender === "0" ? "female" : "male",
						characterName: data.characterName,
						vocation: data.vocation,
						country: data.country,
						phone: data.phone,
						rlname: data.rlname,
					},
				}).then((response: TypedFetchBaseResponse) => {
					if (response.error) {
						throw new Error(response.error);
					}
					return response;
				}),
				{
					loading: "Creating account...",
					success: "Account created successfully",
					error: (err) => `${err}`,
				},
			)
			.unwrap()
			.then((res) => {
				console.log("HEELLO", res);
				if (res.status === 200) {
					return router.push("/account-manager/login");
				}
			});
	}

	return (
		<div className={cn("grid gap-4", className)} {...props}>
			<FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<RHFTextField
						autoComplete="username"
						name="accountName"
						label="Account Name"
						disabled={isSubmitting}
						onChange={() => {
							trigger("accountName");
						}}
					/>

					<RHFTextField
						className="border-input"
						name="email"
						label="Email Address"
						placeholder="email@example.com"
						type="email"
						autoCapitalize="none"
						autoComplete="email webauthn"
						autoCorrect="off"
						disabled={isSubmitting}
						onChange={() => {
							trigger("email");
						}}
					/>
				</div>

				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<RHFTextField
						placeholder="••••••••"
						name="password"
						label="Password"
						type="password"
						autoComplete="current-password webauthn"
						disabled={isSubmitting}
						onChange={() => {
							trigger("password");
						}}
					/>
					<RHFTextField
						placeholder="••••••••"
						name="passwordConfirm"
						label="Password Again"
						type="password"
						autoComplete="current-password webauthn"
						disabled={isSubmitting}
						onChange={() => {
							trigger("passwordConfirm");
						}}
					/>
				</div>
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<RHFTextField
						placeholder="John Doe"
						name="rlname"
						label="Full name"
						type="text"
						autoComplete="name webauthn"
						disabled={isSubmitting}
						onChange={() => {
							trigger("rlname");
						}}
						info={
							<div className="text-popover-foreground">
								<span>Put your full real name here.</span>
								<br />
								<br />
								<div className="text-popover-foreground/85">
									<span>FAQ: Why do you ask for my real name?</span>
									<br />
									<span>This information is only used for payments.</span>
									<br />
								</div>
							</div>
						}
					/>
					<PhoneInput
						label="Phone Number"
						placeholder="(xxx) xxx-xxxx"
						name="phone"
						disabled={isSubmitting}
						onChange={() => {
							trigger("phone");
						}}
					/>
				</div>

				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<RHFTextField
						name="characterName"
						label="Character Name"
						disabled={isSubmitting}
						onChange={() => {
							trigger("characterName");
						}}
						actionLabel={
							<Label
								className="text-accent/90 text-xs transition-all hover:cursor-pointer hover:text-accent active:scale-[0.992]"
								onClick={() => {
									const newName = generateRandomName();
									methods.setValue("characterName", newName);
									trigger("characterName");
								}}
							>
								Generate Random
							</Label>
						}
					/>
					<RHFSelect
						LabelOption={"label"}
						keyValue={"value"}
						name="gender"
						label="Sex"
						defaultValue={"0"}
						options={sexOptions}
						onValueChange={(e) => {
							methods.setValue("gender", e);
							trigger("gender");
						}}
					/>
				</div>

				<div className="gridd-cols-1 grid gap-4 sm:grid-cols-2">
					<RHFSelect
						LabelOption={"label"}
						keyValue={"value"}
						name="vocation"
						label="Vocation"
						defaultValue={"1"}
						options={vocationOptions}
						onValueChange={(e) => {
							methods.setValue("vocation", e);
							trigger("vocation");
						}}
					/>
					<RHFSelect
						info={
							<div className="text-popover-foreground">
								<span>Select the country where you live.</span>
								<br />
								<br />
								<div className="text-popover-foreground/85">
									<span>FAQ: Why isn't my country here?</span>
									<br />
									<span>This information is only used for payments.</span>
									<br />
									<span>
										If your country is not listed, it means that payments from your country are not
										supported by Noctera.
									</span>
									<br />
									<span>
										You can still play Noctera, but you will not be able to make payments from your
										country.
									</span>
									<br />
									<span>If you want your country to be implemented, please contact us.</span>
								</div>
							</div>
						}
						LabelOption={"label"}
						keyValue={"value"}
						name="country"
						label="Country"
						defaultValue={"MX"}
						options={countryOptions}
						onValueChange={(e) => {
							methods.setValue("country", e);
							trigger("country");
							console.log(e);
						}}
					/>
				</div>

				<div className="grid gap-2">
					<div className="grid gap-1">
						<h4 className="font-medium text-sm">World Location:</h4>
						<RadioGroup defaultValue="All" className="grid grid-cols-4 gap-4">
							<div>
								<RadioGroupItem value="All" id="All" className="peer sr-only" />
								<Label
									htmlFor="All"
									className="flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted p-4 transition-colors hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
								>
									All
								</Label>
							</div>
							<div>
								<RadioGroupItem value="europe" id="europe" className="peer sr-only" disabled />
								<Label
									htmlFor="europe"
									className="flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-gray-900 [&:has([data-state=checked])]:border-gray-900"
								>
									Europe
								</Label>
							</div>
							<div>
								<RadioGroupItem
									value="north-america"
									id="north-america"
									className="peer sr-only"
									disabled
								/>
								<Label
									htmlFor="north-america"
									className="flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-gray-900 [&:has([data-state=checked])]:border-gray-900"
								>
									North America
								</Label>
							</div>
							<div>
								<RadioGroupItem
									value="south-america"
									id="south-america"
									className="peer sr-only"
									disabled
								/>
								<Label
									htmlFor="south-america"
									className="flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-gray-900 [&:has([data-state=checked])]:border-gray-900"
								>
									South America
								</Label>
							</div>
						</RadioGroup>
					</div>

					<div className="grid gap-1">
						<h4 className="font-medium text-sm">World Type:</h4>
						<RadioGroup defaultValue="open-pvp" className="grid grid-cols-4 gap-4">
							<div>
								<RadioGroupItem value="pvp" id="pvp" className="peer sr-only" disabled />
								<Label
									htmlFor="pvp"
									className="flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-gray-900 [&:has([data-state=checked])]:border-gray-900"
								>
									Optional PvP
								</Label>
							</div>
							<div>
								<RadioGroupItem value="open-pvp" id="open-pvp" className="peer sr-only" />
								<Label
									htmlFor="open-pvp"
									className="flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted p-4 transition-colors hover:bg-accent hover:text-card-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
								>
									Open PvP
								</Label>
							</div>
							<div>
								<RadioGroupItem
									value="retro-pvp"
									id="retro-pvp"
									className="peer sr-only"
									disabled
								/>
								<Label
									htmlFor="retro-pvp"
									className="flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-gray-900 [&:has([data-state=checked])]:border-gray-900"
								>
									Retro Open PvP
								</Label>
							</div>
							<div>
								<RadioGroupItem
									value="retro-hard-pvp"
									id="retro-hard-pvp"
									className="peer sr-only"
									disabled
								/>
								<Label
									htmlFor="retro-hard-pvp"
									className="flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-gray-900 [&:has([data-state=checked])]:border-gray-900"
								>
									Retro Hardcore PvP
								</Label>
							</div>
						</RadioGroup>
					</div>
					<div className=" flex flex-row justify-end gap-2">
						<RHFCheckbox
							disabled={isSubmitting}
							name="terms"
							label={
								<span>
									I agree to the{" "}
									<Link className="text-blue-300 hover:underline" href="/terms">
										terms and conditions
									</Link>
								</span>
							}
						/>
					</div>
					<div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:mt-2">
						<Button variant={"link"} asChild className="order-2 sm:order-1">
							<Link href="/account-manager/login">Back to login</Link>
						</Button>
						<Button
							disabled={isSubmitting || !watch("terms")}
							type="submit"
							className="order-1 sm:order-2"
						>
							{isSubmitting ? (
								<Icon icon="eos-icons:loading" className="h-4 w-4 animate-spin" />
							) : (
								"Create Account"
							)}
						</Button>
					</div>
				</div>
			</FormProvider>
		</div>
	);
}
