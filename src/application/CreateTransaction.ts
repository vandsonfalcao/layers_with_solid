import { PrismaClient } from "@prisma/client";

export default class CreateTransaction {
	protected prisma;

	constructor() {
		this.prisma = new PrismaClient();
	}

	async execution(input: Input): Promise<void> {
		const transaction = await this.prisma.transaction.create({
			data: input,
		});

		const { amount, numberInstallments } = transaction;

		let number = 1;
		const installmentAmount = Math.round((amount / numberInstallments) * 100) / 100;
		const diff = Math.round((amount - installmentAmount * numberInstallments) * 100) / 100;
		while (number <= numberInstallments) {
			await this.prisma.installment.create({
				data: {
					number,
					amount:
						number === numberInstallments
							? installmentAmount + diff
							: installmentAmount,
					transactionId: transaction.id,
				},
			});
			number++;
		}

		this.prisma.$disconnect();
		console.log({ created: transaction });
	}
}

type Input = {
	code: string;
	amount: number;
	numberInstallments: number;
	paymentMethod: string;
};
