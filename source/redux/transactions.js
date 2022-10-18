import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { asyncSendMessage, HANDLER_TYPES } from '@background/Keyring';
import { ACTIVITY_STATUS } from '@shared/constants/activity';
import {
  formatAssetBySymbol,
  formatAssets,
  TOKENS,
  TOKEN_IMAGES,
} from '@shared/constants/currencies';

export const getTransactions = createAsyncThunk(
  'getTransactions',
  async (args, { rejectWithValue, getState }) => {
    const { wallet, icns, icp } = getState();

    const { useICNS } = icns;
    const { price: icpPrice } = icp; 
    const { principalId, accountId } = wallet;

    try {
      const transactions = await asyncSendMessage({
        type: HANDLER_TYPES.GET_TRANSACTIONS,
      });

      return {
        useICNS,
        icpPrice,
        principalId,
        accountId,
        transactions,
      }
    } catch (e) {
      return rejectWithValue(e);
    }
  },
);

// TODO: Move to BE
const parseTransactions = ({ transactions, useICNS, icpPrice, principalId, accountId }) => {
  const mapTransaction = (trx) => {
    const {
      details, hash, canisterInfo, caller, timestamp,
    } = trx || {};
    const { sonicData } = details || {};
    const getSymbol = () => {
      if ('tokenRegistryInfo' in (details?.canisterInfo || [])) return details?.canisterInfo.tokenRegistryInfo.symbol;
      if ('nftRegistryInfo' in (details?.canisterInfo || [])) return 'NFT';
      return details?.currency?.symbol ?? sonicData?.token?.details?.symbol ?? '';
    };
    const asset = formatAssetBySymbol(
      trx?.details?.amount,
      getSymbol(),
      icpPrice,
    );
    const isOwnTx = [principalId, accountId].includes(trx?.caller);
    const getType = () => {
      const { type } = trx;
      if (type.toUpperCase() === 'TRANSFER') {
        return isOwnTx ? 'SEND' : 'RECEIVE';
      }
      return type.toUpperCase();
    };
    const transaction = {
      ...asset,
      type: getType(),
      hash,
      to: (useICNS ? details?.to?.icns : details?.to?.principal) ?? details?.to?.principal,
      from: (useICNS ? details?.from?.icns : details?.from?.principal) || caller,
      date: new Date(timestamp),
      status: ACTIVITY_STATUS[details?.status],
      logo: details?.sonicData?.token?.logo || details?.canisterInfo?.icon || TOKEN_IMAGES[getSymbol()] || '',
      symbol: getSymbol(),
      canisterId: details?.canisterInfo?.canisterId,
      canisterInfo,
      details: { ...details, caller },
    };
    return transaction;
  };
  const parsedTrx = transactions?.transactions?.map(mapTransaction) || [];
  return parsedTrx;
};

/* eslint-disable no-param-reassign */
export const transactionsSlice = createSlice({
  name: 'transactions',
  initialState: {
    transactions: [],
    loading: false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTransactions.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTransactions.fulfilled, (state, action) => {
        const parsedTransactions = parseTransactions(action.payload);

        state.loading = false;
        state.transactions = parsedTransactions;
      });
  },
});

export default transactionsSlice.reducer;
