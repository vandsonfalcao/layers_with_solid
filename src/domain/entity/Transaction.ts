import Installment from "./Installment";

export default class Transaction {
	installments: Installment[];

	constructor(
		readonly code: string,
		readonly amount: number,
		readonly numberInstallments: number,
		readonly paymentMethod: string,
		readonly date: Date,
	) {
		this.installments = [];
	}

  generateInstallments(){
		let number = 1;
		let installmentAmount = Math.round((this.amount / this.numberInstallments) * 100) / 100;
		const diff = Math.round((this.amount - installmentAmount * this.numberInstallments) * 100) / 100;
		while (number <= this.numberInstallments) {
			if( number === this.numberInstallments){
				installmentAmount += diff
			}
			this.installments.push(new Installment(number, installmentAmount));
			number++;
		}
  }
}
