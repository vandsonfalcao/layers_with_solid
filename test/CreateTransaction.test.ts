import crypto from "crypto";
import CreateTransaction from "../src/application/CreateTransaction";
import GetTransaction from "../src/application/GetTransaction";
import Transaction from "../src/domain/entity/Transaction";
import TransactionDatabaseRepository from "../src/infra/repository/TransactionDatabaseRepository";

test("Deve criar a transação com parcelas", async () => {
	const transactionRepository = new TransactionDatabaseRepository();
	const uuid = crypto.randomUUID();
	const input = {
		code: uuid,
		amount: 1000,
		numberInstallments: 12,
		paymentMethod: "credit_card",
	};
	const createTransaction = new CreateTransaction(transactionRepository);
	await createTransaction.execution(input);

	const getTransaction = new GetTransaction(transactionRepository);
	const transaction = await getTransaction.execution(uuid);

	if (transaction instanceof Transaction) {
		expect(transaction.code).toBe(uuid);
		expect(transaction.amount).toBe(1000);
		expect(transaction.paymentMethod).toBe("credit_card");
		expect(transaction.numberInstallments).toBe(12);
		expect(transaction.installments).toHaveLength(12);
		expect(transaction.installments[0].amount).toBe(83.33);
		expect(transaction.installments[11].amount).toBe(83.37);
	} else {
		expect(transaction).toBeTruthy();
	}
});
