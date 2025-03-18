import { randomFillSync } from "node:crypto";
import { PasswordResetConfirmationTemplate } from "@/app/(default)/emails/ResetPasswordConfirmation";
import type { AuthResetPasswordPOSTRequest, AuthResetPasswordPOSTResponse } from "@/app/api/types";
import configLua from "@/hooks/useConfigLua";
import { authOptions } from "@/lib/auth";
import { MailProvider } from "@/lib/nodemailer";
import { prisma } from "@/lib/prisma";
import { encryptPassword } from "@/utils/functions/criptoPassword";
import dayjs from "dayjs";
import { getServerSession } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

function generatePassword(size: number) {
	const specialChars = "@#$%&";
	const mayusLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	const minusLetters = "abcdefghijklmnopqrstuvwxyz";
	const numbers = "0123456789";

	const chars = specialChars + mayusLetters + minusLetters + numbers;

	let password = "";

	password += specialChars.charAt(Math.floor(Math.random() * specialChars.length));
	password += mayusLetters.charAt(Math.floor(Math.random() * mayusLetters.length));
	password += minusLetters.charAt(Math.floor(Math.random() * minusLetters.length));

	for (let i = password.length; i < size; i++) {
		const indice = Math.floor(Math.random() * chars.length);
		password += chars.charAt(indice);
	}

	return password;
}

const resend = new Resend(process.env.NO_REPLY_RESEND_KEY as string);

export async function POST(request: NextRequest) {
	try {
		const data: AuthResetPasswordPOSTRequest = await request.json();
		const { code, token } = data;

		const getToken = await prisma.tokens.findFirst({
			where: { code, token, isValid: true },
			include: {
				accounts: {
					select: {
						email: true,
					},
				},
			},
		});

		if (!getToken) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

		const createdAt = dayjs(getToken.created_at);
		const validatedAt = dayjs(getToken.expired_at);
		const now = dayjs();

		console.log(now.isAfter(createdAt), !now.isBefore(validatedAt));
		if (now.isAfter(createdAt) && !now.isBefore(validatedAt))
			return NextResponse.json({ error: "This token has expired" }, { status: 401 });

		const newPass = generatePassword(12);

		await prisma.accounts.update({
			where: { id: getToken.account_id! },
			data: { password: encryptPassword(newPass) },
		});

		await prisma.tokens.update({
			where: { id: getToken.id! },
			data: { isValid: false },
		});

		const passwordResetConfirmationContent = PasswordResetConfirmationTemplate({
			newPassword: newPass,
		});

		await resend.emails.send({
			from: "Noctera Global <no-reply@noctera-global.com>",
			to: [getToken.accounts?.email!],
			subject: "New password for your account",
			react: passwordResetConfirmationContent,
		});

		const response: AuthResetPasswordPOSTResponse = undefined;

		return NextResponse.json(response, { status: 200 });
	} catch (e) {
		const error: Error = e as Error;
		console.error(error);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
