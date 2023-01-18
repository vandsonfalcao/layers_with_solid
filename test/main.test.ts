import axios from "axios";

test("Deve criar a transação com parcelas", async () => {
	const postRes = await axios({
		url: "http://localhost:3000/transaction",
		method: "POST",
		data: {
			amount: 1000,
			numberInstallments: 12,
			paymentMethod: "credit_card",
		},
	});

	expect(postRes.status).toBe(201);

	const getRes = await axios({
		url: `http://localhost:3000/transaction/${postRes.data.id}`,
		method: "GET",
	});

	const { id, amount, paymentMethod, numberInstallments, installments } = getRes.data;

	expect(id).toBe(id);
	expect(amount).toBe(1000);
	expect(paymentMethod).toBe("credit_card");
	expect(numberInstallments).toBe(12);
	expect(installments).toHaveLength(12);
	expect(installments[0].amount).toBe(83.33);
	expect(installments[11].amount).toBe(83.37);
});
