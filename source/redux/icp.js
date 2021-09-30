import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import getICPPrice from '@shared/services/ICPPrice';
import { createSlice } from '@reduxjs/toolkit';

/* eslint-disable no-param-reassign */
export const walletSlice = createSlice({
  name: 'wallet',
  initialState: {
    icpPrice: null,
  },
  reducers: {
    setICPPrice: (state, action) => {
      state.icpPrice = action.payload;
    },
  },
});

export const { setICPPrice } = walletSlice.actions;

export const selectICPPrice = (store) => store.icp.icpPrice;

/**
 * @description Hook that takes the ICP price from the coingecko API and sets it to the store.
 * @param {Array.<*>} dependencies Array of dependencies for useEffect
 * @returns {number} icpPrice
 */
export const useICPPrice = (refetch = false, dependencies = []) => {
  const dispatch = useDispatch();
  const icpPrice = useSelector(selectICPPrice);

  const fetchICPPrice = async () => {
    try {
      const { data } = await getICPPrice();

      dispatch(setICPPrice(data?.['internet-computer']?.usd ?? 1));
    } catch (error) {
      // TODO: Handle error
      console.warn(error);
    }
  };

  useEffect(() => {
    if (!icpPrice || refetch) {
      fetchICPPrice();
    }
  }, dependencies);

  return icpPrice;
};

export default walletSlice.reducer;
