import { useEffect, useState } from "react";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "../app/hooks/store";
import { getPricesThunk, setSymbol } from "../app/slices/price";

const Home = () => {
	const dispatch = useAppDispatch();
	// const symbol = useSelector((state) => state.price.symbol);
	// const prices = useSelector((state) => state.price.prices);

	const { loading, error, symbol, prices } = useAppSelector(
		({ priceSlice }) => priceSlice
	);

	useEffect(() => {
		const apiCall = () => {
			dispatch(getPricesThunk(symbol)).unwrap();
		};
		// fetchPrices();
		const interval = setInterval(apiCall, 5000);

		return () => clearInterval(interval);
	}, [symbol, dispatch]);

	const [showModal, setShowModal] = useState(false);
	const [newSymbol, setNewSymbol] = useState("");

	const handleChangeSymbol = () => {
		dispatch(setSymbol(newSymbol));
		setShowModal(false);
	};

	return (
		<div>
			<h1>Real-Time Prices for {symbol.toUpperCase()}</h1>
			<table>
				<thead>
					<tr>
						<th>Price</th>
						<th>Timestamp</th>
					</tr>
				</thead>
				<tbody>
					{prices?.map((price, index) => (
						<tr key={index}>
							<td>{price.price}</td>
							<td>{new Date(price.timestamp).toLocaleString()}</td>
						</tr>
					))}
				</tbody>
			</table>
			<button onClick={() => setShowModal(true)}>Change Symbol</button>
			{showModal && (
				<div className="modal">
					<input
						value={newSymbol}
						onChange={(e) => setNewSymbol(e.target.value)}
					/>
					<button onClick={handleChangeSymbol}>Save</button>
					<button onClick={() => setShowModal(false)}>Cancel</button>
				</div>
			)}
		</div>
	);
};

export default Home;
