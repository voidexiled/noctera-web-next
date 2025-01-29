import { prisma } from "@/lib/prisma";
import { ErrorCode } from "@/utils/ErrorCode";
import { symmetricDecrypt } from "@/utils/crypto";
import { comparePassword } from "@/utils/functions/criptoPassword";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import dayjs from "dayjs";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { authenticator } from "otplib";

export const authOptions: NextAuthOptions = {
	adapter: PrismaAdapter(prisma),
	pages: {
		signIn: "/account-manager/login",
		verifyRequest: "/account-manager/verify-request",
		newUser: "/account-manager/register",
	},
	secret: process.env.NEXTAUTH_SECRET,
	session: {
		strategy: "jwt",
		maxAge: 60 * 60, // 60 min
	},
	providers: [
		CredentialsProvider({
			name: "credentials",
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
				totpCode: {
					label: "Two-factor Code",
					type: "input",
					placeholder: "Code from authenticator app",
				},
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials.password) return null;
				const user = await prisma.accounts.findFirst({
					where: { email: credentials.email },
				});
				if (!user || !comparePassword(credentials.password, user.password!))
					throw new Error(ErrorCode.IncorrectPassword);

				if (user.secret_status) {
					if (!credentials.totpCode)
						throw new Error(ErrorCode.SecondFactorRequired);
					if (!user.secret) throw new Error(ErrorCode.InternalServerError);
					const isValidToken = authenticator.check(
						credentials.totpCode,
						user.secret,
					);
					if (!isValidToken) throw new Error(ErrorCode.IncorrectPassword);
				}

				await prisma.accounts.update({
					where: { id: Number(user.id) },
					data: { web_lastlogin: dayjs().unix() },
				});

				return {
					id: String(user.id),
					email: user.email,
					name: user.rlname,
				};
			},
		}),
	],

	callbacks: {
		session: async ({ session, token }) => {
			const user = await prisma.accounts.findUnique({
				where: { id: Number(token.id) },
			});
			return {
				...session,
				user: {
					// ...session.user,
					id: Number(token.id),
					email: token.email,
					name: token.name,
					role: user?.type === 6 ? "admin" : "user",
				},
			};
		},
		jwt: ({ token, user }) => {
			if (user) {
				const u = user;
				return {
					...token,
					id: Number(u.id),
				};
			}
			return token;
		},
	},
};
