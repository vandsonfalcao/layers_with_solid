import { PrismaClient } from "@prisma/client";

type Output = {
	code: string;
	amount: number;
	numberInstallments: number;
	paymentMethod: string;
	date: string;
	installments: { number: number; amount: number }[];
} | null;

export default class GetTransaction {
	protected prisma;

	constructor() {
		this.prisma = new PrismaClient();
	}

	async execution(input: string): Promise<Output> {
		const transaction = await this.prisma.transaction.findFirst({
			where: {
				code: input,
			},
			include: {
				installments: true,
			},
		});

		this.prisma.$disconnect();
		console.log({ found: transaction });
		if (!transaction) {
			return null;
		}
		const { amount, code, date, installments, numberInstallments, paymentMethod } = transaction;
		return {
			amount,
			code,
			date: date.toDateString(),
			installments,
			numberInstallments,
			paymentMethod,
		};
	}
}
