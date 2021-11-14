import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AppThunk, RootState} from "../../app/store";
import { fetchPair } from "./watcherAPI";

export interface PairState {
    status: 'idle' | 'loading' | 'failed';
    result?:string | number;
    address1?:string;
    address2?:string;
    pairAddress?:string;
}

const initialState: PairState = {
    status: 'idle',
};

export const submitPair = createAsyncThunk(
    'watcher/fetchPair',
    async (address: string) => {
        const response = await fetchPair(address);
        return response.data.data.pair;
    }
);

export const computePair = (amount: number, isToken1: boolean): AppThunk => (
    dispatch,
    getState
) => {
    const currentPair:any = selectPair(getState());
    dispatch(submitPair(currentPair.pairAddress)).then((a) => {
        isToken1 ? dispatch(updateResult(a.payload.token0Price * amount + " " + a.payload.token0.symbol)) : dispatch(updateResult(a.payload.token1Price * amount + " " + a.payload.token1.symbol))
    });
};

export const watcherSlice = createSlice({
    name: 'watcher',
    initialState,
    reducers: {
        updateAddress2: (state, action: PayloadAction<string>) => {
            state.address2 = action.payload;
        },
        updateAddress1: (state, action: PayloadAction<string>) => {
            state.address1 = action.payload;
        },
        updateResult: (state, action: PayloadAction<string>) => {
            state.result = action.payload;
        },
        updatePairAddress:(state, action: PayloadAction<string>) => {
            state.pairAddress = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(submitPair.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(submitPair.fulfilled, (state, action) => {
                state.status = 'idle';
            });
    },
});

export const { updateResult, updatePairAddress, updateAddress2, updateAddress1  } = watcherSlice.actions;

export const selectPair = (state: RootState) => state.watcher;

export default watcherSlice.reducer;
