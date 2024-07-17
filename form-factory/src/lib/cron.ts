// import fetchData from "@/pages/api/fetchData";
import cron from "node-cron";
// import fetchData from "@/pages/api/fetchData";
import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
// import clientPromise from "@/app/lib/mongodb";

// cron.schedule("*/5 * * * * *", async () => {
// 	try {
// 		await axios.get("http://localhost:3000/api/fetchData");
// 		console.log("Data fetched successfully");
// 	} catch (error) {
// 		console.error("Error fetching data:", error);
// 	}
// });
// cron.schedule("*/5 * * * * *", fetchData);
import { MongoClient } from "mongodb";

// console.log("process.env", process.env);

// const uri = process.env.MONGODB_URI;
const uri = "mongodb://localhost:27017";

const options = {};

if (!uri) {
	throw new Error("Please add your Mongo URI to .env.local");
}

let client;
let clientPromise: Promise<MongoClient>;

let globalWithMongo = global as typeof globalThis & {
	_mongoClientPromise?: Promise<MongoClient>;
};

if (process.env.NODE_ENV === "development") {
	// In development mode, use a global variable so we can have hot reloading
	if (!globalWithMongo._mongoClientPromise) {
		client = new MongoClient(uri, options);
		globalWithMongo._mongoClientPromise = client.connect();
	}
	clientPromise = globalWithMongo._mongoClientPromise;
} else {
	// In production mode, it's best to not use a global variable
	client = new MongoClient(uri, options);
	clientPromise = client.connect();
}

const API_URL = "https://api.coingecko.com/api/v3/simple/price";
const SYMBOLS = ["bitcoin", "ethereum", "litecoin", "ripple", "bitcoin-cash"];

const fetchData = async (req: NextApiRequest, res: NextApiResponse) => {
	const client = await clientPromise;
	try {
		const db = client.db("crypto"); // replace 'mydatabase' with your actual database name
		const collection = db.collection("prices");

		const responses = await Promise.all(
			SYMBOLS.map((symbol) =>
				axios.get(`${API_URL}?ids=${symbol}&vs_currencies=usd`)
			)
		);

		// console.log("responses", responses);

		const prices = responses.map((response, index) => ({
			symbol: SYMBOLS[index],
			price: response.data[SYMBOLS[index]].usd,
			timestamp: new Date(),
		}));

		console.log("prives", prices);

		await collection.insertMany(prices);

		res.status(200).json({ success: true, prices });
	} catch (error: any) {
		// console.log("responses", responses);
		res.status(500).json({ success: false, error: error.message });
	} finally {
		await client.close();
	}
};

cron.schedule("*/5 * * * * *", async () => {
	try {
		const req = {} as any; // mock request object if not needed
		const res = {} as any; // mock response object if not needed
		await fetchData(req, res);
		console.log("Data fetched successfully");
	} catch (error) {
		console.error("Error fetching data:", error);
	}
});
