// src/pages/_app.tsx
import { AppProps } from "next/app";
import { Provider } from "react-redux";
// import "../lib/cron";
// import "../styles/globals.css";
import { store } from "@/app/store/store";
import dotenv from "dotenv";

function MyApp({ Component, pageProps }: AppProps) {
	dotenv.config(); // Load environment variables from .env.local
	return (
		<Provider store={store}>
			<Component {...pageProps} />
		</Provider>
	);
}

export default MyApp;
