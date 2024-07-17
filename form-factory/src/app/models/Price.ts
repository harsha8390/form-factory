import { Document } from "mongodb";

export interface IPrice extends Document {
	symbol: string;
	price: number;
	timeStamp: Date;
}

// const PriceSchema = new S
