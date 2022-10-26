import { createSlice } from '@reduxjs/toolkit';
import { ACTIVITY_STATUS } from '@shared/constants/activity';
import { ACCOUNT_ICON } from '@shared/constants/account';
import {
  formatAssetBySymbol,
  formatAssets,
  TOKENS,
  TOKEN_IMAGES,
} from '@shared/constants/currencies';

/* eslint-disable no-param-reassign */
export const walletSlice = createSlice({
  name: 'wallet',
  initialState: {
    name: 'Account 1',
    principalId: '',
    accountId: '',
    emoji: ACCOUNT_ICON,
    transactions: [],
    assets: Object.values(TOKENS),
    walletId: '',
    assetsLoading: true,
    transactionsLoading: false,
  },
  reducers: {
    updateWalletDetails: (state, action) => {
      const { name, emoji } = action.payload;
      state.name = name;
      state.emoji = emoji;
    },
    setAccountInfo: (state, action) => {
      if (!action.payload) return;
      // Chrome serializes everything with toJSON
      const {
        accountId, icon, name, principal, walletId,
      } = action.payload;
      state.accountId = accountId;
      state.emoji = icon;
      state.name = name;
      state.principalId = principal;
      state.walletId = walletId;
    },
    setTransactions: (state, action) => {
      const { transactions, useICNS, icpPrice } = action.payload || {};
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
        const isOwnTx = [state.principalId, state.accountId].includes(trx?.caller);
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
      const parsedTrx = transactions?.map(mapTransaction) || [];
      state.transactions = parsedTrx.slice(0, 50); // TODO: Move paging to BE
    },
    setTransactionsLoading: (state, action) => {
      state.transactionsLoading = action.payload;
    },
    setAssets: (state, action) => {
      const { keyringAssets, icpPrice } = action.payload || {};

      const formattedAssets = formatAssets(keyringAssets, icpPrice);

      state.assets = [...formattedAssets];
    },
    setAssetsLoading: (state, action) => {
      state.assetsLoading = action.payload;
    },
    blockNFTFetch: (state) => {
      state.optimisticNFTUpdate = true;
    },
  },
});

export const {
  updateWalletDetails,
  setAccountInfo,
  setTransactions,
  setTransactionsLoading,
  setAssets,
  setAssetsLoading,
  blockNFTFetch,
} = walletSlice.actions;

export default walletSlice.reducer;
