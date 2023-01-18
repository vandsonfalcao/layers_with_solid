import axios from "axios";
import crypto from "crypto";

test("Deve criar a transação", async () => {
	const code = crypto.randomUUID();
	await axios({
		url: "http://localhost:3000/transactions",
		method: "POST",
		data: {
			code,
			amount: 1000,
			numberInstallments: 12,
			paymentMethod: "credit_card",
		},
	});
});
