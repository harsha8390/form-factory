/** @type {import('next').NextConfig} */
// import Home from "../form-factory/src/pages/index"
import dotenv from "dotenv";

// dotenv.config();
const nextConfig = {
	// Next.js configuration options
	// env: {
	// 	MONGODB_URI: ,
	// 	// Add other environment variables as needed
	// },
};
const config = {
	env: {
		MONGODB_URI: process.env.MONGODB_URI,
		// Add other environment variables as needed
	},
};
// module.exports = {
// 	async redirects() {
// 		return [
// 			{
// 				source: "/",
// 				destination: "../form-factory/src/pages/index",
// 				permanent: true,
// 			},
// 		];
// 	},
// };

export default nextConfig;
