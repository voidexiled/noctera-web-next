import type { AuthActiveEmailPOSTRequest, AuthActiveEmailPOSTResponse } from "@/app/api/types";
import configLua from "@/hooks/useConfigLua";
import { authOptions } from "@/lib/auth";
import { MailProvider } from "@/lib/nodemailer";
import { prisma } from "@/lib/prisma";
import { randomCode } from "@/utils/functions/randomCode";
import { formatStringWithHyphens } from "@/utils/functions/randomKey";
import dayjs from "dayjs";
import { getServerSession } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const create = async (req: Request) => {
	const session = await getServerSession(authOptions);
	if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	const acc = await prisma.accounts.findUnique({
		where: { id: Number(session?.user?.id), email_verified: false },
	});
	if (!acc) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	const token = randomCode(24);
	const code = randomCode(10);

	await prisma.tokens.create({
		data: {
			code,
			token,
			expired_at: dayjs().add(1, "day").toDate(),
			account_id: acc.id,
			isValid: true,
		},
	});

	const link = `${process.env.NEXTAUTH_URL}/email-confirmation/${token}?key=${code}`;

	// ! Send Welcome Email with the steps to activate the account

	return NextResponse.json({}, { status: 200 });
};

export async function POST(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions);
		if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

		const data: AuthActiveEmailPOSTRequest = await request.json();
		const { code, token } = data;

		console.log(data);
		const getToken = await prisma.tokens.findFirst({
			where: { code, token, isValid: true, accounts: { email_verified: false } },
			include: {
				accounts: {
					select: {
						email: true,
						email_verified: true,
					},
				},
			},
		});

		if (getToken?.accounts?.email_verified)
			return NextResponse.json({ error: "Email already verified" }, { status: 401 });
		if (!getToken) return NextResponse.json({ error: "Token not valid" }, { status: 401 });

		const createdAt = dayjs(getToken.created_at);
		const validatedAt = dayjs(getToken.expired_at);
		const now = dayjs();

		if (now.isAfter(createdAt) && !now.isBefore(validatedAt))
			return NextResponse.json({ error: "Token expired" }, { status: 401 });

		const key = randomCode(20);

		await prisma.accounts.update({
			where: { id: getToken.account_id! },
			data: { email_verified: true, key },
		});

		await prisma.tokens.update({
			where: { id: getToken.id },
			data: { isValid: false },
		});

		// ! Send Email verified notification

		const response: AuthActiveEmailPOSTResponse = {
			recovery_key: key,
		};

		return NextResponse.json(response, { status: 200 });
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: "Error al verificar el token" }, { status: 500 });
	}
}

export { create as GET };
