import axios from "axios";
import crypto from "crypto";
import CreateTransaction from "../src/application/CreateTransaction";

test("Deve criar a transação com parcelas", async () => {
	const uuid = crypto.randomUUID();
	const input = {
		code: uuid,
		amount: 1000,
		numberInstallments: 12,
		paymentMethod: "credit_card",
	};
	const createTransaction = new CreateTransaction();
	await createTransaction.execution(input);

	const getRes = await axios({
		url: `http://localhost:3000/transaction/${uuid}`,
		method: "GET",
	});

	expect(getRes.data).toBeTruthy();

	const { code, amount, paymentMethod, numberInstallments, installments } = getRes.data;

	expect(code).toBe(uuid);
	expect(amount).toBe(1000);
	expect(paymentMethod).toBe("credit_card");
	expect(numberInstallments).toBe(12);
	expect(installments).toHaveLength(12);
	expect(installments[0].amount).toBe(83.33);
	expect(installments[11].amount).toBe(83.37);
});
