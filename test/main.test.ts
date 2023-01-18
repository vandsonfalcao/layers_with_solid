import axios from "axios";

test("Deve criar a transação", async () => {
	await axios({
		url: "http://localhost:3000/transactions",
		method: "POST",
		data: {
			amount: 1000,
			number_installments: 12,
			payment_method: "credit_card",
		},
	});
});
