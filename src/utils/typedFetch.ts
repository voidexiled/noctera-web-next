export type TypedFetchBaseResponse = {
	message?: string;
	error?: string;
	status: number | string;
};

export type TypedFetchOptions<TRequest, TResponse> = Omit<RequestInit, "body"> & {
	/** Cuerpo de la request, que se convertirá a JSON (a menos que sea FormData o string) */
	body?: TRequest;
	/** Tiempo máximo en milisegundos antes de abortar la request */
	timeout?: number;
	/**
	 * Función para parsear la respuesta.
	 * Si no se especifica, se intentará parsear la respuesta como JSON.
	 */
	responseParser?: (response: Response, text: string) => TResponse;
};

export async function typedFetch<TRequest, TResponse>(
	url: string,
	options?: TypedFetchOptions<TRequest, TypedFetchBaseResponse & TResponse>,
): Promise<
	TypedFetchBaseResponse & (TResponse extends undefined ? Record<string, never> : TResponse)
> {
	const { body, timeout, responseParser, ...initOptions } = options ?? {};

	// Configuramos el AbortController para timeout si se especifica
	const controller = new AbortController();
	const timer = timeout ? setTimeout(() => controller.abort(), timeout) : null;

	// Preparamos los headers
	const headers = new Headers(initOptions.headers);

	// Computamos el body de la request de forma segura:
	let computedBody: BodyInit | undefined;
	if (body !== undefined) {
		if (body instanceof FormData || typeof body === "string") {
			computedBody = body;
		} else {
			// Si el header Content-Type no está definido, se asume JSON.
			if (!headers.has("Content-Type")) {
				headers.set("Content-Type", "application/json");
			}
			computedBody = JSON.stringify(body);
		}
	}

	const fetchOptions: RequestInit = {
		...initOptions,
		headers,
		signal: controller.signal,
		body: computedBody,
	};

	let response: Response;
	try {
		response = await fetch(url, fetchOptions);
	} catch (error) {
		if (error instanceof Error && error.name === "AbortError") {
			throw new Error("La solicitud ha superado el tiempo de espera.");
		}
		throw error instanceof Error ? error : new Error(String(error));
	} finally {
		if (timer) clearTimeout(timer);
	}

	// Obtenemos el texto de la respuesta
	const text = await response.text();

	let parsed: TypedFetchBaseResponse & TResponse;
	try {
		parsed = responseParser
			? responseParser(response, text)
			: text
				? JSON.parse(text)
				: ({} as TResponse);
		parsed.status = response.status;
	} catch (parseError) {
		throw new Error(
			`Error al parsear JSON: ${parseError instanceof Error ? parseError.message : String(parseError)}`,
		);
	}

	// Si la respuesta no es OK, se lanza un error con el mensaje adecuado
	if (!response.ok) {
		const errorMessage = parsed.error || response.statusText || "Error desconocido";
		throw new Error(errorMessage);
	}

	return parsed as TypedFetchBaseResponse &
		(TResponse extends undefined ? Record<string, never> : TResponse);
}
