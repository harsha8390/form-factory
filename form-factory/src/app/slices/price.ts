import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface PriceState {
	loading: boolean;
	error: string | null;
	symbol: string;
	prices: { price: number; timestamp: Date }[];
}

const initialState: PriceState = {
	loading: false,
	error: null,
	symbol: "bitcoin",
	prices: [],
};

const priceSlice = createSlice({
	name: "price",
	initialState,
	reducers: {
		setLoading: (state, action: PayloadAction<boolean>) => {
			state.loading = action.payload;
		},
		setError: (state, action: PayloadAction<string | null>) => {
			state.error = action.payload;
		},
		setSymbol: (state, action: PayloadAction<string>) => {
			state.symbol = action.payload;
		},
		setPrices: (
			state,
			action: PayloadAction<{ price: number; timestamp: Date }[]>
		) => {
			state.prices = action.payload;
		},
	},
});

export const getPricesThunk = createAsyncThunk(
	"getPrices",
	async (symbol: string, { dispatch }) => {
		dispatch(setLoading(true));
		dispatch(setError(null));
		let response;
		try {
			response = await fetchPrices(symbol);
			dispatch(setPrices(response.data));
		} catch (error: any) {
			console.error(error);
			dispatch(setError(error));
		} finally {
			dispatch(setLoading(false));
		}
	}
);

const fetchPrices = async (symbol: string) => {
	return await axios.get(`/api/getPrices?symbol=${symbol}`);
};

export const { setLoading, setError, setSymbol, setPrices } =
	priceSlice.actions;
export const priceSliceReducer = priceSlice.reducer;
