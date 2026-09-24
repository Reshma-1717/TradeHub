import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { watchlistAPI } from "../../api/endpoints";

export const fetchWatchlist = createAsyncThunk(
  "watchlist/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await watchlistAPI.get();
      return res.data.watchlist;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

const watchlistSlice = createSlice({
  name: "watchlist",
  initialState: {
    items   : [],
    loading : false,
    error   : null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWatchlist.pending, (state) => { state.loading = true; })
      .addCase(fetchWatchlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchWatchlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default watchlistSlice.reducer;
