import express, { Request, Response } from "express";
import CreateTransaction from "./application/CreateTransaction";
import GetTransaction from "./application/GetTransaction";

const app = express();

app.use(express.json());

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
	const createTransaction = new CreateTransaction();
	await createTransaction.execution(req.body);
	res.status(201).end();
});

app.get("/transaction/:code", async (req: TransactionGetRequest, res: Response) => {
	const getTransaction = new GetTransaction();
	const transaction = await getTransaction.execution(req.params.code);
	res.json(transaction).end();
});

app.listen(3000);
