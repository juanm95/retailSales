import { createAppSlice } from '../../app/createAppSlice';
import { getRetailSalesById } from './retailSalesAPI';
import { RetailSalesData } from './retailSalesTypes';

export interface RetailSalesSliceState {
    retailSalesData: RetailSalesData | null,
    retailSalesStatus: "loading" | "loaded" | "failed"
}

const initialState: RetailSalesSliceState = {
    retailSalesData: null,
    retailSalesStatus: "loading"
};

export const retailSalesSlice = createAppSlice({
    name: 'retailSales',
    initialState,
    reducers: create => ({
        fetchSalesDataAsync: create.asyncThunk(
            async (id: string) => {
              const response = await getRetailSalesById(id);
              return response;
            },
            {
              pending: state => {
                state.retailSalesStatus = "loading"
              },
              fulfilled: (state, action) => {
                state.retailSalesStatus = "loaded"
                state.retailSalesData = action.payload
              },
              rejected: state => {
                state.retailSalesStatus = "failed"
              },
            },
          ),
    }),
    selectors: {
        selectRetailSalesData: counter => counter.retailSalesData,
        selectRetailSalesStatus: counter => counter.retailSalesStatus,
    },
})

export const { fetchSalesDataAsync } =
retailSalesSlice.actions

export const { selectRetailSalesData, selectRetailSalesStatus } = retailSalesSlice.selectors

export default retailSalesSlice.reducer;