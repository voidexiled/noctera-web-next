import {
	Body,
	Button,
	Column,
	Container,
	Head,
	Heading,
	Hr,
	Html,
	Img,
	Link,
	Preview,
	Row,
	Section,
	Tailwind,
	Text,
} from "@react-email/components";

type EmailTemplateProps = {
	rlname: string;
	recoveryLink: string;
	recoveryCode: string;
};

export function RecoveryPasswordTemplate({
	rlname,
	recoveryLink,
	recoveryCode,
}: EmailTemplateProps) {
	return (
		<Tailwind>
			<Html>
				<Head />
				<Preview>Solicitud de nueva contraseña para tu cuenta</Preview>
				<Body className="bg-zinc-50 font-sans">
					<Container className="my-10 rounded-lg bg-white p-10 shadow-md dark:bg-zinc-800 dark:shadow-zinc-700">
						<Img
							src="https://github.com/voidexiled/noctera-assets/blob/master/banner.png?raw=true"
							alt="Noctera Global Logo"
							width="260"
							height="146"
							className="mx-auto mb-6"
						/>
						<Heading className="mb-4 text-center font-bold text-2xl text-zinc-800 dark:text-white">
							Solicitud de Nueva Contraseña
						</Heading>

						<Text className="mb-4 text-zinc-700 dark:text-zinc-300">
							Estimado jugador de Noctera Global{rlname ? `, ${rlname}` : ""},
						</Text>
						<Text className="mb-6 text-zinc-700 dark:text-zinc-300">
							Hemos recibido una solicitud para restablecer la contraseña de tu cuenta. Para
							continuar con el proceso y crear una nueva contraseña, por favor, haz clic en el
							siguiente botón:
						</Text>
						<Section align="center" className="mb-6">
							<Button
								className="rounded-md bg-blue-500 px-6 py-3 font-semibold text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
								href={recoveryLink}
							>
								Restablecer Contraseña
							</Button>
						</Section>

						<Text className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">
							Si el botón no funciona, copia y pega este enlace en tu navegador:
						</Text>
						<Link href={recoveryLink} className="break-all text-blue-500 text-sm underline">
							{recoveryLink}
						</Link>

						{recoveryCode && (
							<>
								<Hr className="my-6 border-zinc-300 dark:border-zinc-600" />
								<Text className="mb-2 text-zinc-700 dark:text-zinc-300">
									Usa el siguiente código de confirmación en la página de recuperación:
								</Text>
								<Text className="mb-6 text-center font-bold font-mono text-blue-500 text-lg dark:text-blue-400">
									{recoveryCode}
								</Text>
							</>
						)}

						<Hr className="my-6 border-zinc-300 dark:border-zinc-600" />
						<Text className="text-center text-sm text-zinc-500 dark:text-zinc-400">
							Si no solicitaste este cambio de contraseña, ignora este correo. El enlace de
							restablecimiento expirará en 24 horas.
						</Text>
						<Text className="mt-2 text-center text-xs text-zinc-500 dark:text-zinc-400">
							Atentamente, El equipo de Noctera Global
						</Text>
					</Container>
				</Body>
			</Html>
		</Tailwind>
	);
}
