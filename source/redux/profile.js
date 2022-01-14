import { createSlice } from '@reduxjs/toolkit';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import {
  getHiddenAccounts as getStorageHiddenAccounts,
  setHiddenAccounts as setStorageHiddenAccounts,
} from '@modules/storageManager';

/* eslint-disable no-param-reassign */
export const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    hiddenAccounts: [],
  },
  reducers: {
    setHiddenAccounts: (state, action) => {
      state.hiddenAccounts = action.payload;
    },
    toggleAccountHidden: (state, action) => {
      const index = state?.hiddenAccounts?.indexOf(action.payload) ?? -1;
      if (index === -1) {
        state.hiddenAccounts.push(action.payload);
      } else {
        state.hiddenAccounts.splice(index, 1);
      }
      setStorageHiddenAccounts(Object.values(state.hiddenAccounts));
    },
  },
});

export const { setHiddenAccounts, toggleAccountHidden } = profileSlice.actions;

/**
 * @description Hook that fetches hidden accounts from storage and sets them in the state.
 * @param {Array.<*>} dependencies Array of dependencies for useEffect
 * @returns {Array.<number>} hiddenAccounts
 */
export const useHiddenAccounts = (dependencies = []) => {
  const dispatch = useDispatch();
  const { hiddenAccounts } = useSelector((state) => state.profile);

  const getHiddenAccountsFromStorage = async () => {
    try {
      getStorageHiddenAccounts((hidden) => {
        if (hidden?.length) {
          dispatch(profileSlice.actions.setHiddenAccounts(hidden));
        }
      });
    } catch (error) {
      // TODO: Handle error
      /* eslint-disable-next-line */
      console.warn(error);
    }
  };

  useEffect(() => {
    if (!hiddenAccounts.length) {
      getHiddenAccountsFromStorage();
    }
  }, dependencies);

  return hiddenAccounts;
};

export default profileSlice.reducer;
