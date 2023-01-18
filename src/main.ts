import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const app = express();

app.use(express.json());

const prisma = new PrismaClient();

interface TransactionPostRequest extends Request {
	body: {
		amount: number;
		number_installments: number;
		payment_method: string;
	};
}

app.post("/transactions", async (req: TransactionPostRequest, res: Response) => {
	const { amount, number_installments, payment_method } = req.body;

	const transaction = await prisma.transaction.create({
		data: {
			amount,
			number_installments,
			payment_method,
		},
	});

	prisma.$disconnect();
	console.log(transaction);
	res.end();
});

app.listen(3000);
