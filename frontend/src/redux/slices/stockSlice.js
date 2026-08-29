import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { stockAPI } from "../../api/endpoints";

export const fetchStocks = createAsyncThunk(
  "stocks/fetchAll",
  async (params, { rejectWithValue }) => {
    try {
      const res = await stockAPI.getAll(params);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

export const fetchTopMovers = createAsyncThunk(
  "stocks/fetchTopMovers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await stockAPI.getTopMovers();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

const stockSlice = createSlice({
  name: "stocks",
  initialState: {
    list      : [],
    gainers   : [],
    losers    : [],
    total     : 0,
    loading   : false,
    error     : null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStocks.pending, (state) => { state.loading = true; })
      .addCase(fetchStocks.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.stocks;
        state.total = action.payload.total;
      })
      .addCase(fetchStocks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchTopMovers.fulfilled, (state, action) => {
        state.gainers = action.payload.gainers;
        state.losers = action.payload.losers;
      });
  },
});

export default stockSlice.reducer;
