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

type Props = {
	playerName: string;
	newEmail: string;
	loginLink: string;
};

export function ChangeEmailNewTemplate({ playerName, newEmail, loginLink }: Props) {
	const serverName = "Noctera Global";

	return (
		<Tailwind>
			<Html>
				<Head />
				<Preview>{serverName} - Correo Electrónico de Cuenta Actualizado</Preview>
				<Body className="bg-zinc-50 font-sans">
					<Container className="my-10 rounded-lg bg-white p-10 shadow-md dark:bg-zinc-800 dark:shadow-zinc-700">
						<Heading className="mb-4 text-center font-bold text-2xl text-zinc-800 dark:text-white">
							Correo Electrónico de Cuenta Actualizado
						</Heading>

						<Text className="mb-4 text-zinc-700 dark:text-zinc-300">Hola {playerName},</Text>
						<Text className="mb-6 text-zinc-700 dark:text-zinc-300">
							Te damos la bienvenida a tu nueva dirección de correo electrónico para tu cuenta de{" "}
							{serverName}:
						</Text>

						<Text className="mb-6 text-center font-bold font-mono text-blue-500 text-lg dark:text-blue-400">
							{newEmail}
						</Text>

						<Text className="mb-6 text-zinc-700 dark:text-zinc-300">
							El correo electrónico de tu cuenta se ha actualizado correctamente. Por favor, inicia
							sesión en tu cuenta nuevamente para verificar tu nueva dirección de correo electrónico
							y asegurar que todo esté correcto.
						</Text>

						<Section align="center" className="mb-6">
							<Link
								href={loginLink}
								className="rounded-md bg-blue-500 px-6 py-3 font-semibold text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
							>
								Iniciar Sesión en la Cuenta
							</Link>
						</Section>

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
