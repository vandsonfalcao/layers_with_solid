import Transaction from "../domain/entity/Transaction";
import TransactionRepository from "../domain/repository/TransactionRepository";

type Input = {
	code: string;
	amount: number;
	numberInstallments: number;
	paymentMethod: string;
};

export default class CreateTransaction {
	constructor(readonly transactionRepository: TransactionRepository) {}

	async execution(input: Input): Promise<void> {
		const date = new Date();
		const transaction = new Transaction(
			input.code,
			input.amount,
			input.numberInstallments,
			input.paymentMethod,
			date
		);
		transaction.generateInstallments();
		await this.transactionRepository.save(transaction);
	}
}
