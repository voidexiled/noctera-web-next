"use server";

import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import type { Session } from "next-auth";
import { NextResponse } from "next/server";

type ManageUserSessionParams = (session: Session) => boolean | Promise<boolean>;

const errorResponse = { error: "Unauthorized" };
const errorStatus = { status: 401 };

export async function ManageUserSession(callback?: ManageUserSessionParams): Promise<Session | ReturnType<typeof NextResponse.json>> {
	try {
		const session = await getServerSession(authOptions);
		if (!session || !session.user) {
			return NextResponse.json(errorResponse, errorStatus);
		}

		// Soporta callbacks síncronos o asíncronos
		if (callback && !(await callback(session))) {
			return NextResponse.json(errorResponse, errorStatus);
		}

		return session;
	} catch (e) {
		const error = e as Error;
		throw error;
	}
}
