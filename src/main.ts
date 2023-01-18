import express, { Request, Response } from "express";

const app = express();

app.post("/transactions", (req: Request, res: Response) => {
	console.log(req.body);
	res.end();
});
app.listen(3000);
