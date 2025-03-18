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
	accountname: string;
	verificationUrl: string;
	rlname: string;
};

export default function VerifyEmail({ accountname, verificationUrl, rlname }: EmailTemplateProps) {
	return (
		<Tailwind>
			<Html>
				<Head />
				<Preview>Verifica tu dirección de correo electrónico</Preview>
				<Body className=" bg-gray-100 font-sans">
					<Container className="my-10 rounded-lg bg-slate-800 p-10 shadow-sm">
						<Img
							src="https://github.com/voidexiled/noctera-assets/blob/master/banner.png?raw=true"
							alt="Logo de la empresa"
							width="260"
							height="146"
							className="mx-auto mb-5"
						/>
						<Heading className="mb-5 text-center font-bold text-2xl text-slate-100">
							Verifica tu dirección de correo electrónico
						</Heading>

						<Text className="mb-5 text-slate-300">Hola {rlname},</Text>
						<Text className="mb-5 text-slate-300">
							Gracias por registrarte. Por favor, verifica tu dirección de correo electrónico
							haciendo clic en el botón de abajo:
						</Text>
						<Section align="center">
							<Button
								className="rounded bg-blue-600 px-5 py-3 font-bold text-white"
								href={verificationUrl}
							>
								Verificar correo electrónico
							</Button>
						</Section>

						<Text className="mt-5 text-slate-300">
							Si no puedes hacer clic en el botón, copia y pega el siguiente enlace en tu navegador:
						</Text>
						<Link href={verificationUrl} className="text-blue-600">
							{verificationUrl}
						</Link>
						<Hr className="my-5 border-slate-500" />
						<Text className="text-slate-300 text-sm">
							Si no has solicitado esta verificación, puedes ignorar este correo electrónico.
						</Text>
					</Container>
				</Body>
			</Html>
		</Tailwind>
	);
}
