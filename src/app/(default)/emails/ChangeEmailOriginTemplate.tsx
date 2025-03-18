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
	oldEmail: string;
	newEmail: string;
	supportEmail: string;
};

export function ChangeEmailOriginTemplate({ playerName, oldEmail, newEmail, supportEmail }: Props) {
	const serverName = "Noctera Global";

	return (
		<Tailwind>
			<Html>
				<Head />
				<Preview>{serverName} - Notificación de Cambio de Correo Electrónico en tu Cuenta</Preview>
				<Body className="bg-zinc-50 font-sans">
					<Container className="my-10 rounded-lg bg-white p-10 shadow-md dark:bg-zinc-800 dark:shadow-zinc-700">
						<Heading className="mb-4 text-center font-bold text-2xl text-zinc-800 dark:text-white">
							Cambio de Correo Electrónico en tu Cuenta
						</Heading>

						<Text className="mb-4 text-zinc-700 dark:text-zinc-300">Estimado {playerName},</Text>
						<Text className="mb-6 text-zinc-700 dark:text-zinc-300">
							Te informamos que la dirección de correo electrónico asociada a tu cuenta de{" "}
							{serverName}
							ha sido cambiada.
						</Text>

						<Text className="mb-4 text-zinc-700 dark:text-zinc-300">
							Correo electrónico antiguo: {oldEmail}
							<br />
							Nuevo correo electrónico: {newEmail}
						</Text>

						<Text className="mb-6 text-zinc-700 dark:text-zinc-300">
							Si tú NO solicitaste este cambio, por favor, ponte en contacto con nuestro soporte
							inmediatamente para asegurar la seguridad de tu cuenta.
						</Text>

						<Section align="center" className="mb-6">
							<Link
								href={`mailto:${supportEmail}`}
								className="rounded-md bg-red-500 px-6 py-3 font-semibold text-white hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
							>
								Contactar Soporte
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
