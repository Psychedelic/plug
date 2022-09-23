import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { CURRENCIES, USD_PER_TC } from '@shared/constants/currencies';
import {
  sendToken as callSendToken,
  burnXTC as callBurnXTC,
} from '@background/Keyring';

const DEFAULT_ASSET = CURRENCIES.get('ICP');
const DEFAULT_ADDRESS_INFO = {
  isValid: null,
  type: null,
  resolvedAddress: null,
};
const DEFAULT_PRIMARY = {
  prefix: '',
  suffix: ` ${DEFAULT_ASSET?.symbol}`,
  value: DEFAULT_ASSET?.value,
  conversionRate: 1,
};
const DEFAULT_SECONDARY = {
  prefix: '$',
  suffix: ' USD',
  value: 1 / DEFAULT_ASSET?.value,
  conversionRate: DEFAULT_ASSET?.value,
};
const DEFAULT_STATE = {
  amount: 0,
  address: null,
  pending: false,
  fulfilled: false,
  error: false,
  addressInfo: DEFAULT_ADDRESS_INFO,
  selectedAsset: DEFAULT_ASSET,
  primaryValue: DEFAULT_PRIMARY,
  secondaryValue: DEFAULT_SECONDARY,
};

const ERRORS_INFO = [
  {
    errorNames: ['InsufficientBalance', 'InsufficientFunds'],
    errorCode: 100,
  },
  {
    errorNames: ['DestinationInvalid'],
    errorCode: 300,
  },
  {
    errorNames: ['is out of cycles'],
    errorCode: 301,
  },
];

const matchErrors = (err) => {
  for (const errorInfo of ERRORS_INFO) {
    const currentError = errorInfo?.errorNames?.some(
      (errorKeyword) => err.includes(errorKeyword),
    );

    if (currentError) {
      return errorInfo?.errorCode;
    }
  }

  return 600;
};

export const sendToken = createAsyncThunk(
  'sendToken/regularSend',
  async (arg, { getState, rejectWithValue }) => {
    const { send: state } = getState();
    const {
      addressInfo,
      address,
      amount: rawAmount,
      selectedAsset,
    } = state;

    const to = addressInfo.resolvedAddress || address;
    const amount = rawAmount.toString();

    const {
      canisterId, standard, decimals, fee = 0,
    } = selectedAsset || {};
    const opts = { fee };
    try {
      const res = await callSendToken({
        to, amount, canisterId, standard, decimals, opts,
      });
      return res;
    } catch ({ error }) {
      return rejectWithValue(error);
    }
  },
);

export const burnXTC = createAsyncThunk(
  'sendToken/burnXTC',
  async (arg, { getState, rejectWithValue }) => {
    const { send: state } = getState();
    const { addressInfo, address, amount: rawAmount } = state;

    const to = addressInfo.resolvedAddress || address;
    const amount = rawAmount.toString();

    try {
      const res = await callBurnXTC({ to, amount });
      return res;
    } catch ({ error }) {
      return rejectWithValue(error);
    }
  },
);

export const sendSlice = createSlice({
  name: 'sendToken',
  initialState: DEFAULT_STATE,
  reducers: {
    setSendingXTCtoCanister: (state, action) => {
      state.sendingXTCtoCanister = action.payload;
    },
    setSendTokenAmount: (state, action) => {
      state.amount = action.payload;
    },
    setSendTokenAddress: (state, action) => {
      if (action.payload !== state.address) {
        state.addressInfo = DEFAULT_ADDRESS_INFO;
        state.address = action.payload.trim();
      }
    },
    setSendTokenAddressInfo: (state, action) => {
      state.addressInfo = action.payload;
    },
    setSendTokenSelectedAsset: (state, action) => {
      const { value, icpPrice } = { value: state.selectedAsset, ...action.payload };

      const newSelectedAsset = {
        ...value,
        price: {
          ICP: icpPrice, XTC: USD_PER_TC, WTC: USD_PER_TC, WICP: icpPrice,
        }[value?.symbol],
      };

      const newPrimaryValue = {
        prefix: '',
        suffix: ` ${newSelectedAsset?.symbol}`,
        value: newSelectedAsset?.value,
        price: newSelectedAsset?.value / newSelectedAsset?.amount,
        conversionRate: 1,
      };

      const newSecondaryValue = {
        prefix: '$',
        suffix: ' USD',
        price: 1 / newSelectedAsset?.price,
        value: 1 / newSelectedAsset?.value,
        conversionRate: newSelectedAsset?.price,
      };

      state.primaryValue = newPrimaryValue;
      state.secondaryValue = newSecondaryValue;
      state.selectedAsset = newSelectedAsset;
    },
    swapSendTokenValues: (state) => {
      const temp = state.primaryValue;

      state.primaryValue = state.secondaryValue;
      state.secondaryValue = temp;
    },
    resetState: (state) => {
      Object.keys(DEFAULT_STATE).forEach((stateKey) => {
        state[stateKey] = DEFAULT_STATE[stateKey];
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendToken.pending, (state) => {
        state.pending = true;
      })
      .addCase(sendToken.fulfilled, (state) => {
        state.fulfilled = true;
        state.pending = false;
      })
      .addCase(sendToken.rejected, (state, action) => {
        state.pending = false;
        state.error = matchErrors(action.payload);
      })
      .addCase(burnXTC.pending, (state) => {
        state.pending = true;
      })
      .addCase(burnXTC.fulfilled, (state) => {
        state.fulfilled = true;
        state.pending = false;
      })
      .addCase(burnXTC.rejected, (state) => {
        // TODO: handle error
        state.pending = false;
        state.error = true;
      });
  },
});

export const {
  setSendTokenAmount,
  setSendTokenAddress,
  setSendTokenAddressInfo,
  setSendTokenSelectedAsset,
  setSendingXTCtoCanister,
  swapSendTokenValues,
  resetState,
} = sendSlice.actions;

export default sendSlice.reducer;
