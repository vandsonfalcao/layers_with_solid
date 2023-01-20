import Transaction from "../domain/entity/Transaction";
import TransactionRepository from "../domain/repository/TransactionRepository";

export default class GetTransaction {

	constructor(readonly transactionRepository: TransactionRepository) {
	}

	async execution(code: string): Promise<Transaction | null> {
		const transaction = await this.transactionRepository.get(code);
		return transaction;
	}
}
