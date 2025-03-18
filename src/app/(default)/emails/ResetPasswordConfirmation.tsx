import {
	Body,
	Container,
	Head,
	Heading,
	Hr,
	Html,
	Link,
	Preview,
	Section,
	Tailwind,
	Text,
} from "@react-email/components";

type EmailTemplateProps = {
	newPassword: string;
	securityHintsLink?: string; // Optional link to security hints page
};

export function PasswordResetConfirmationTemplate({
	newPassword,
	securityHintsLink = "https://www.noctera-global.com/gameguides/securityhints", // Default security hints link
}: EmailTemplateProps) {
	const serverName = "Noctera Global";

	return (
		<Tailwind>
			<Html>
				<Head />
				<Preview>{serverName} - Contraseña Restablecida Exitosamente</Preview>
				<Body className="bg-zinc-50 font-sans">
					<Container className="my-10 rounded-lg bg-white p-10 shadow-md dark:bg-zinc-800 dark:shadow-zinc-700">
						<Heading className="mb-4 text-center font-bold text-2xl text-zinc-800 dark:text-white">
							Contraseña Restablecida Exitosamente
						</Heading>

						{/* <Text className="mb-4 text-zinc-700 dark:text-zinc-300">Estimado {rlname},</Text> */}
						<Text className="mb-6 text-zinc-700 dark:text-zinc-300">
							Has solicitado una nueva contraseña para tu cuenta de {serverName}. Tu nueva
							contraseña es:
						</Text>

						<Section align="center" className="mb-6">
							<Text className="rounded-md bg-zinc-100 px-6 py-3 font-bold font-mono text-blue-500 text-lg dark:bg-zinc-700 dark:text-blue-400">
								{newPassword}
							</Text>
						</Section>

						<Text className="mb-6 text-zinc-700 dark:text-zinc-300">
							Por favor, guarda esta contraseña en un lugar seguro y memorízala lo antes posible.
							Por razones de seguridad, te recomendamos eliminar este correo electrónico una vez que
							hayas iniciado sesión en tu cuenta con éxito.
						</Text>

						{securityHintsLink && (
							<Text className="mb-6 text-zinc-700 dark:text-zinc-300">
								Para obtener más información sobre cómo proteger tu cuenta de {serverName}, consulta
								nuestros consejos de seguridad:
								<Link href={securityHintsLink} className="text-blue-500 underline">
									Consejos de Seguridad
								</Link>
							</Text>
						)}

						<Text className="mb-6 text-zinc-700 dark:text-zinc-300">
							Si no has solicitado este restablecimiento de contraseña, por favor, contacta con
							nuestro soporte inmediatamente.
						</Text>

						<Hr className="my-6 border-zinc-300 dark:border-zinc-600" />
						<Text className="text-center text-sm text-zinc-500 dark:text-zinc-400">
							Atentamente, El equipo de {serverName}
						</Text>
					</Container>
				</Body>
			</Html>
		</Tailwind>
	);
}
