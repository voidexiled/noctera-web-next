import { ChangeEmailNewTemplate } from "@/app/(default)/emails/ChangeEmailNewTemplate";
import { ChangeEmailOriginTemplate } from "@/app/(default)/emails/ChangeEmailOriginTemplate";
import type {
	AccountsUpdateEmailPOSTRequest,
	AccountsUpdateEmailPOSTResponse,
} from "@/app/api/types";
import { authOptions } from "@/lib/auth";
import { MailProvider } from "@/lib/nodemailer";
import { prisma } from "@/lib/prisma";
import { comparePassword } from "@/utils/functions/criptoPassword";
import { getServerSession } from "next-auth";
import email from "next-auth/providers/email";
import { NextResponse } from "next/server";
import { Resend } from "resend";

import { ZodError, z } from "zod";

const resend = new Resend(process.env.NO_REPLY_RESEND_KEY as string);

const UpdateAccountsSchema = z
	.object({
		email: z.string().email(),
		password: z.string(),
		key: z.string().min(23),
	})
	.strict();

export async function PATCH(req: Request) {
	try {
		const data = UpdateAccountsSchema.parse(await req.json());
		const dataRequest: AccountsUpdateEmailPOSTRequest = data as AccountsUpdateEmailPOSTRequest;

		const { email, password, key } = dataRequest;

		const session = await getServerSession(authOptions);
		const user = session?.user;

		const acc = await prisma.accounts.findUnique({
			where: { id: Number(user?.id) },
		});

		if (!user || !acc || !comparePassword(password, acc?.password!))
			return NextResponse.json({ message: "Password incorrect" }, { status: 401 });
		if (key.replace(/-/g, "") !== acc.key)
			return NextResponse.json({ message: "Recovery key incorrect" }, { status: 401 });

		const accountWithEmailExists = await prisma.accounts.findFirst({
			where: { email },
			select: { email: true, id: true },
		});
		if (accountWithEmailExists)
			return NextResponse.json({ message: "Email already is in use" }, { status: 400 });
		await prisma.accounts.update({
			where: { id: Number(user.id) },
			data: {
				email: email,
				email_verified: false,
			},
		});

		const changeEmailOriginContent = ChangeEmailOriginTemplate({
			playerName: acc.rlname,
			oldEmail: acc.email,
			newEmail: email,
			supportEmail: "jalomo.chavez21@hotmail.com",
		});

		await resend.emails.send({
			from: "Noctera Global <no-reply@noctera-global.com>",
			to: [acc.email],
			subject: "Warning! Your email has been changed",
			react: changeEmailOriginContent,
		});

		const changeEmailNewContent = ChangeEmailNewTemplate({
			playerName: acc.rlname,
			loginLink: (process.env.NEXTAUTH_URL! as string).concat("/account-manager/login"),
			newEmail: email,
		});

		await resend.emails.send({
			from: "Noctera Global <no-reply@noctera-global.com>",
			to: [email],
			subject: "Your account has been updated",
			react: changeEmailNewContent,
		});
		const response: AccountsUpdateEmailPOSTResponse = undefined;

		return NextResponse.json(response, { status: 200 });
	} catch (e) {
		const error: Error = e as Error;
		if (error instanceof ZodError) {
			return NextResponse.json(
				{ error: "Validation error.", issues: error.issues[0] },
				{ status: 400 },
			);
		}
		return NextResponse.json({ error }, { status: 500 });
	}
}
