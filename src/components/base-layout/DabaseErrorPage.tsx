"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const DatabaseErrorPage = () => {
	return (
		<div className="flex h-screen items-center justify-center">
			<Card className="w-[90%] max-w-md rounded-md border-none p-3 shadow-xl ">
				<CardHeader>
					<CardTitle className="text-center font-bold text-secondary text-xl">
						¡Oops! Algo Salió Mal
					</CardTitle>
				</CardHeader>
				<CardContent className="grid gap-4 px-12">
					<p className="text-center text-foreground/75 text-sm">
						Estamos trabajando para solucionar este problema. Por favor, intenta de nuevo más tarde.
					</p>
					<div className="mt-4 flex justify-center">
						<Button variant="ghost" size="xs" onClick={() => window.location.reload()}>
							Reintentar
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default DatabaseErrorPage;
