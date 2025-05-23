export enum ErrorCode {
	IncorrectUsernamePassword = "incorrect-username-password",
	UserNotFound = "user-not-found",
	IncorrectPassword = "incorrect-password",
	UserMissingPassword = "missing-password",
	TwoFactorDisabled = "two-factor-disabled",
	TwoFactorAlreadyEnabled = "two-factor-already-enabled",
	TwoFactorSetupRequired = "two-factor-setup-required",
	SecondFactorRequired = "second-factor-required",
	IncorrectTwoFactorCode = "incorrect-two-factor-code",
	InternalServerError = "internal-server-error",
	NewPasswordMatchesOld = "new-password-matches-old",
	ThirdPartyIdentityProviderEnabled = "third-party-identity-provider-enabled",
}
