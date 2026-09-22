import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { portfolioAPI } from "../../api/endpoints";

export const fetchPortfolio = createAsyncThunk(
  "portfolio/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await portfolioAPI.get();
      return res.data.portfolio;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

const portfolioSlice = createSlice({
  name: "portfolio",
  initialState: {
    holdings        : [],
    totalInvested   : 0,
    currentValue    : 0,
    totalPnL        : 0,
    totalPnLPercent : 0,
    holdingsCount   : 0,
    loading         : false,
    error           : null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPortfolio.pending, (state) => { state.loading = true; })
      .addCase(fetchPortfolio.fulfilled, (state, action) => {
        state.loading = false;
        Object.assign(state, action.payload);
      })
      .addCase(fetchPortfolio.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default portfolioSlice.reducer;
