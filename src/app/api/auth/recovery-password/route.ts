import { RecoveryPasswordTemplate } from "@/app/(default)/emails/RecoveryPassword";
import configLua from "@/hooks/useConfigLua";
import { MailProvider } from "@/lib/nodemailer";
import { prisma } from "@/lib/prisma";
import { randomCode } from "@/utils/functions/randomCode";
import dayjs from "dayjs";
import { type NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.NO_REPLY_RESEND_KEY as string);

export async function POST(req: NextRequest) {
	const lua = configLua();

	const data = await req.json();
	const existsUser = await prisma.accounts.findFirst({
		where: { OR: [{ name: data.email }, { email: data.email }] },
	});
	if (!existsUser) {
		return NextResponse.json({ error: "User not found" }, { status: 400 });
	}
	//const emailProvider = new MailProvider();

	const token = randomCode(32);
	const code = randomCode(20);

	const link = `${process.env.NEXTAUTH_URL}/reset-password/${token}`;

	await prisma.tokens.create({
		data: {
			token,
			code,
			expired_at: dayjs().add(1, "day").toDate(),
			isValid: true,
			account_id: existsUser.id,
		},
	});

	const recoveryPasswordContent = RecoveryPasswordTemplate({
		rlname: existsUser.rlname,
		recoveryLink: link,
		recoveryCode: code,
	});

	const { data: dataEmail, error } = await resend.emails.send({
		from: "Noctera Global <no-reply@noctera-global.com>",
		to: [data.email],
		subject: "Recover your password",
		react: recoveryPasswordContent,
	});

	if (error) {
		return NextResponse.json({ error: "Failed to send email." }, { status: 500 });
	}

	return NextResponse.json({}, { status: 200 });
}
