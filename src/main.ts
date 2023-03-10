import express, { Request, Response } from "express";
import CreateTransaction from "./application/CreateTransaction";
import GetTransaction from "./application/GetTransaction";
import TransactionDatabaseRepository from "./infra/repository/TransactionDatabaseRepository";

const app = express();

app.use(express.json());

const transactionRepository = new TransactionDatabaseRepository();

interface TransactionPostRequest extends Request {
	body: {
		id: number;
		code: string;
		amount: number;
		numberInstallments: number;
		paymentMethod: string;
	};
}
interface TransactionGetRequest extends Request {
	params: {
		code: string;
	};
}

app.post("/transaction", async (req: TransactionPostRequest, res: Response) => {
	const createTransaction = new CreateTransaction(transactionRepository);
	await createTransaction.execution(req.body);
	res.status(201).end();
});

app.get("/transaction/:code", async (req: TransactionGetRequest, res: Response) => {
	const getTransaction = new GetTransaction(transactionRepository);
	const transaction = await getTransaction.execution(req.params.code);
	res.json(transaction).end();
});

app.listen(3000);
