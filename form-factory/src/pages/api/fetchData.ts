import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import clientPromise from "@/app/lib/mongodb";

const API_URL = "https://api.coingecko.com/api/v3/simple/price";
const SYMBOLS = ["bitcoin", "ethereum", "litecoin", "ripple", "bitcoin-cash"];

const fetchData = async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		const client = await clientPromise;
		const db = client.db("crypto");
		const collection = db.collection("prices");

		const responses = await Promise.all(
			SYMBOLS.map((symbol) =>
				axios.get(`${API_URL}?ids=${symbol}&vs_currencies=usd`)
			)
		);

		const prices = responses.map((response, index) => ({
			symbol: SYMBOLS[index],
			price: response.data[SYMBOLS[index]].usd,
			timestamp: new Date(),
		}));

		await collection.insertMany(prices);

		res.status(200).json({ success: true, prices });
	} catch (error: any) {
		res.status(500).json({ success: false, error: error.message });
	}
};

export default fetchData;
