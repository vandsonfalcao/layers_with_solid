import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const app = express();

app.use(express.json());

const prisma = new PrismaClient();

interface TransactionPostRequest extends Request {
	body: {
		amount: number;
		numberInstallments: number;
		paymentMethod: string;
	};
}

app.post("/transaction", async (req: TransactionPostRequest, res: Response) => {
	const transaction = await prisma.transaction.create({
		data: req.body,
	});

	if (!transaction) {
		prisma.$disconnect();
		console.log(transaction);
		return res.status(500).json("Erro ao criar transação").end();
	}

	const { amount, numberInstallments } = transaction;

	let number = 1;
	const installmentAmount = Math.round((amount / numberInstallments) * 100) / 100;
	const diff = Math.round((amount - installmentAmount * numberInstallments) * 100) / 100;
	while (number <= numberInstallments) {
		await prisma.installment.create({
			data: {
				number,
				amount:
					number === numberInstallments ? installmentAmount + diff : installmentAmount,
				transactionId: transaction.id,
			},
		});
		number++;
	}

	prisma.$disconnect();
	console.log(transaction);
	res.status(201).json(transaction).end();
});

app.get("/transaction/:id", async (req: TransactionPostRequest, res: Response) => {
	const transaction = await prisma.transaction.findUnique({
		where: {
			id: Number(req.params.id),
		},
		include: {
			installments: true,
		},
	});

	prisma.$disconnect();
	console.log(transaction);
	res.json(transaction);
	res.end();
});

app.listen(3000);
