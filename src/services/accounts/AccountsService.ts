import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

type GetAccountsProps = {
	select?: Prisma.accountsSelect;
	orderBy?: Prisma.Enumerable<Prisma.accountsOrderByWithRelationInput>;
	where?: Prisma.accountsWhereInput;
	take?: number;
	skip?: number;
};

export async function getAccounts({ select, orderBy, take, skip }: GetAccountsProps) {
	const accounts = await prisma.accounts.findMany({
		select,
		orderBy,
		take,
		skip,
	});

	return accounts;
}

export async function getAccountUnique<T extends Prisma.accountsFindUniqueArgs>(
	args: T,
): Promise<Prisma.accountsGetPayload<T>> {
	try {
		const account = await prisma.accounts.findUnique(args);
		return account as Prisma.accountsGetPayload<T>;
	} catch (e) {
		const error: Error = e as Error;
		console.error("Error al obtener la cuenta:", error);
		throw error;
	}
}

type UpdateAccountProps = {
	where: Prisma.accountsWhereUniqueInput;
	data: Prisma.accountsUpdateInput;
};

export async function updateAccount({ where, data }: UpdateAccountProps) {
	return await prisma.accounts.update({
		where,
		data,
	});
}
