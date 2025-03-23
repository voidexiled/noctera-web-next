type VerifyEmailTemplateProps = {
	accountName: string;
	verificationUrl: string;
	companyName: string;
};

export const VerifyEmailTemplate: React.FC<Readonly<VerifyEmailTemplateProps>> = ({
	accountName,
	verificationUrl,
	companyName,
}) => (
	<div className="bg-[--color-background] font-sans text-[--color-foreground]">
		<div className="mx-auto w-full max-w-md p-4 sm:p-6 md:p-8">
			<div className="mb-8 text-center">
				<h1 className="font-bold text-2xl tracking-tight">Verifica tu correo electrónico</h1>
			</div>
			<div className="rounded-lg border border-[--color-border] bg-[--color-card] text-[--color-card-foreground] shadow-md">
				<div className="p-6 sm:p-8">
					<p className="mb-4">Hola {accountName ? accountName : "Usuario"},</p>
					<p className="mb-4">
						Gracias por registrarte en {companyName}. Para activar tu cuenta, por favor verifica tu
						dirección de correo electrónico haciendo clic en el botón de abajo:
					</p>
					<div className="my-6 text-center">
						<a
							href={verificationUrl}
							className="inline-flex h-10 items-center justify-center rounded-md bg-[--color-primary] px-4 py-2 font-medium text-[--color-primary-foreground] text-sm ring-offset-background transition-colors hover:bg-[--color-primary]/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-ring] focus-visible:ring-offset-2 disabled:opacity-50 data-[state=open]:bg-accent data-[state=open]:text-accent-foreground"
						>
							Verificar correo
						</a>
					</div>
					<p className="text-muted-foreground text-sm">
						Si el botón no funciona, puedes copiar y pegar el siguiente enlace en tu navegador:
					</p>
					<p className="mt-2 break-all text-blue-500 text-sm">
						<a href={verificationUrl}>{verificationUrl}</a>
					</p>
				</div>
			</div>
			<div className="mt-6 text-center text-muted-foreground text-sm">
				<hr className="my-4 border-[--color-border] border-t opacity-50" />
				<p>{companyName}.</p>
			</div>
		</div>
	</div>
);
