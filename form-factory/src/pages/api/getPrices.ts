import clientPromise from "@/app/lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";

const getPrices = async (req: NextApiRequest, res: NextApiResponse) => {
	const { symbol } = req.query;

	try {
		const client = await clientPromise;
		const db = client.db("mydatabase");
		const collection = db.collection("prices");

		const prices = await collection
			.find({ symbol })
			.sort({ timestamp: -1 })
			.limit(20)
			.toArray();

		res.status(200).json(prices);
	} catch (error: any) {
		res.status(500).json({ success: false, error: error.message });
	}
};

export default getPrices;
