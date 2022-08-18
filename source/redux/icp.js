import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import getICPPrice from '@shared/services/ICPPrice';
import { createSlice } from '@reduxjs/toolkit';

/* eslint-disable no-param-reassign */
export const icpDataSlice = createSlice({
  name: 'icpData',
  initialState: {
    price: null,
    isLoading: false,
  },
  reducers: {
    setICPPrice: (state, action) => {
      state.price = action.payload;
    },
    setICPPriceLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setICPPrice, setICPPriceLoading } = icpDataSlice.actions;

export const selectICPData = (store) => store.icp;

/**
 * @description Hook that takes the ICP price from the coingecko API and sets it to the store.
 * @param {Array.<*>} dependencies Array of dependencies for useEffect
 * @returns {number} icpPrice
 */
export const useICPPrice = (refetch = false, dependencies = []) => {
  const dispatch = useDispatch();
  const { price, isLoading } = useSelector(selectICPData);

  const fetchICPPrice = async () => {
    try {
      dispatch(setICPPriceLoading(true));
      const { data } = await getICPPrice();

      dispatch(setICPPrice(data?.['internet-computer']?.usd ?? 1));
    } catch (error) {
      /* eslint-disable-next-line */
      console.error(error);
    } finally {
      dispatch(setICPPriceLoading(false));
    }
  };

  useEffect(() => {
    if (!isLoading && (!price || refetch)) {
      fetchICPPrice();
    }
  }, dependencies);

  return price;
};

export default icpDataSlice.reducer;
