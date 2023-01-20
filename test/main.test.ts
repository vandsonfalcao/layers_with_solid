import axios from "axios";
import crypto from "crypto";
import Transaction from "../src/domain/entity/Transaction";

test("Deve criar a transação com parcelas", async () => {
	const uuid = crypto.randomUUID();
	const postRes = await axios({
		url: "http://localhost:3000/transaction",
		method: "POST",
		data: {
			code: uuid,
			amount: 1000,
			numberInstallments: 12,
			paymentMethod: "credit_card",
		},
	});

	expect(postRes.status).toBe(201);

	const getRes = await axios<Transaction | null>({
		url: `http://localhost:3000/transaction/${uuid}`,
		method: "GET",
	});

	if (getRes.data instanceof Transaction) {
		const { code, amount, paymentMethod, numberInstallments, installments } = getRes.data;
		expect(code).toBe(uuid);
		expect(amount).toBe(1000);
		expect(paymentMethod).toBe("credit_card");
		expect(numberInstallments).toBe(12);
		expect(installments).toHaveLength(12);
		expect(installments[0].amount).toBe(83.33);
		expect(installments[11].amount).toBe(83.37);
	} else {
		expect(getRes.data).toBeTruthy();
	}
});
