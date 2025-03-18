import VerifyEmail from "@/app/(default)/emails/VerifyEmail";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getAccountUnique } from "@/services/accounts/AccountsService";
import { randomCode } from "@/utils/functions/randomCode";
import dayjs from "dayjs";
import { getServerSession } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

const resend = new Resend(process.env.NO_REPLY_RESEND_KEY as string);

const schema = z.object({
	accountName: z.string(),
	targetEmail: z.string(),
});

export async function POST(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions);

		if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

		const acc = await getAccountUnique({
			where: { id: Number(session?.user?.id), email_verified: false },
			select: {
				id: true,
				email_verified: true,
				rlname: true,
			},
		});

		if (!acc) return Response.json({ error: "Unauthorized" }, { status: 401 });
		if (acc.email_verified)
			return Response.json({ error: "Email already verified" }, { status: 403 });

		const { accountName, targetEmail } = schema.parse(await request.json());

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

		const verificationUrl = `${process.env.NEXTAUTH_URL}/email-confirmation/${token}?key=${code}`;

		const emailContent = VerifyEmail({
			accountname: accountName,
			verificationUrl,
			rlname: acc.rlname,
		});

		const { data, error } = await resend.emails.send({
			from: "Noctera Global <no-reply@noctera-global.com>",
			to: [targetEmail],
			subject: "Verify your email",
			react: emailContent,
		});

		if (error) {
			return NextResponse.json({ error: "Failed to send email." }, { status: 500 });
		}

		return NextResponse.json({ data });
	} catch (error) {
		return NextResponse.json({ error: "An error ocurred while sending email." }, { status: 500 });
	}
}
