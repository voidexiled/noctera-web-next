export default function Custom404() {
	return (
		<>
			<main className="grid place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
				<div className="text-center">
					<p className="font-semibold text-9xl text-indigo-600">404</p>
					<h1 className="mt-4 font-bold text-3xl text-gray-900 tracking-tight sm:text-2xl">
						Page not found
					</h1>
					<p className="mt-6 text-base text-gray-600 leading-7">
						Lo sentimos, no hemos podido encontrar la página que buscas.
					</p>
					<div className="mt-10 flex items-center justify-center gap-x-6">
						<a
							// biome-ignore lint/a11y/useValidAnchor: <explanation>
							href="#"
							className="rounded-md bg-indigo-600 px-3.5 py-2.5 font-semibold text-sm text-white shadow-xs hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-600 focus-visible:outline-offset-2"
						>
							Pagina inicial
						</a>
						{/* biome-ignore lint/a11y/useValidAnchor: <explanation> */}
						<a href="#" className="font-semibold text-gray-900 text-sm">
							Soporte <span aria-hidden="true">&rarr;</span>
						</a>
					</div>
				</div>
			</main>
		</>
	);
}
