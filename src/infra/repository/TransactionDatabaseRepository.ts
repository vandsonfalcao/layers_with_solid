import { PrismaClient } from "@prisma/client";
import Transaction from "../../domain/entity/Transaction";
import TransactionRepository from "../../domain/repository/TransactionRepository";

export default class TransactionDatabaseRepository implements TransactionRepository {
	protected prisma;

	constructor() {
		this.prisma = new PrismaClient();
	}

	async save(transaction: Transaction): Promise<void> {
		const { amount, code, numberInstallments, paymentMethod, date } = transaction;
		const response = await this.prisma.transaction.create({
			data: { amount, code, numberInstallments, paymentMethod, date },
		});
		for (const installment of transaction.installments) {
			const { amount, number } = installment;
			await this.prisma.installment.create({
				data: { amount, number, transactionId: response.id },
			});
		}
	}

	async get(code: string): Promise<Transaction | null> {
		const prismaTransaction = await this.prisma.transaction.findFirst({
			where: { code: code },
			include: {
				installments: true,
			},
		});
		if (!prismaTransaction) {
			return null;
		}
		const transaction = new Transaction(
			prismaTransaction.code,
			prismaTransaction.amount,
			prismaTransaction.numberInstallments,
			prismaTransaction.paymentMethod,
			prismaTransaction.date
		);
		transaction.generateInstallments();
		return transaction;
	}
}
