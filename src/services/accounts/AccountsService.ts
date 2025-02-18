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

type GetAccountProps = {
	select?: Prisma.accountsSelect;
	where?: Prisma.accountsWhereUniqueInput;
};

export async function getAccount({ select, where }: GetAccountProps) {
	if (!where) return null;
	const account = await prisma.accounts.findUnique({
		where,
		select,
	});

	return account;
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
