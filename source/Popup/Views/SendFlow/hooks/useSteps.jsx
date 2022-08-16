import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { LinkButton } from '@ui';
import BackIcon from '@assets/icons/back.svg';
import { setAssets } from '@redux/wallet';
import { HANDLER_TYPES, sendMessage } from '@background/Keyring';
import { USD_PER_TC } from '@shared/constants/currencies';
import {
  isICNSName, validateAddress, validateCanisterId, validatePrincipalId,
} from '@shared/utils/ids';
import { ADDRESS_TYPES, getAssetFee } from '@shared/constants/addresses';
import { useICPPrice } from '@redux/icp';
import {
  setSendTokenAmount,
  setSendTokenSelectedAsset,
  setSendTokenAddressInfo,
  swapSendTokenValues,
  sendToken,
  burnXTC,
  resetState,
} from '@redux/send';
import { useICNS } from '@hooks';
import {
  MAX_DECIMALS,
  DISPLAY_DECIMALS,
  XTC_OPTIONS,
} from '@shared/constants/send';
import { truncateFloatForDisplay } from '@shared/utils/send';

import {
  SelectAssetStep,
  XtcToCanisterStep,
  ConfirmStep,
} from '../steps';

import { CancelButton } from '../components';

const getAddressType = (address) => {
  const type = validatePrincipalId(address) ? ADDRESS_TYPES.PRINCIPAL : ADDRESS_TYPES.ACCOUNT;
  return isICNSName(address) ? ADDRESS_TYPES.ICNS : type;
};

const useSteps = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { assets } = useSelector((state) => state.wallet);
  const {
    amount,
    address,
    selectedAsset,
    primaryValue,
    fulfilled,
  } = useSelector((state) => state.send);

  const icpPrice = useICPPrice();

  const [step, setStep] = useState(0);
  const [destination, setDestination] = useState(XTC_OPTIONS.SEND);
  const [sendingXTCtoCanister, setSendingXTCtoCanister] = useState(false);

  const {
    loading, resolvedAddress, isValid: isValidICNS,
  } = useICNS(address, selectedAsset?.symbol);

  const handleChangeAsset = (value) => {
    dispatch(setSendTokenAddressInfo({ isValid: null, resolvedAddress: null, type: null }));
    dispatch(setSendTokenSelectedAsset({ icpPrice, value }));
  };
  const handleChangeDestination = (value) => setDestination(value);

  const fee = getAssetFee(selectedAsset);
  const getAvailableAmount = (value) => (
    truncateFloatForDisplay(value - fee, MAX_DECIMALS, DISPLAY_DECIMALS)
  );

  const handleSendClick = () => {
    if (sendingXTCtoCanister && destination === XTC_OPTIONS.BURN) {
      dispatch(burnXTC());
    } else {
      dispatch(sendToken());
    }
  };

  const available = getAvailableAmount((selectedAsset?.amount || 0));
  const convertedAmount = Math.max(available * primaryValue.conversionRate, 0);
  const [availableAmount, setAvailableAmount] = useState({
    amount: convertedAmount,
    prefix: primaryValue.prefix,
    suffix: primaryValue.suffix,
  });

  // TODO: Refactor cleaner way
  // when seeing asset as USD,
  // we need to convert back the amount to the correct rate when going to review
  const convertToPrimaryAsset = () => {
    const parsedAmount = truncateFloatForDisplay(
      amount / primaryValue.conversionRate,
      MAX_DECIMALS,
      DISPLAY_DECIMALS,
    );

    dispatch(setSendTokenAmount(parsedAmount));
  };

  // TODO: Refactor cleaner way
  // when coming back from review we need to view amount with the correct rate
  const convertToSecondaryAsset = () => {
    const parsedAmount = truncateFloatForDisplay(
      amount * primaryValue.conversionRate,
      MAX_DECIMALS,
      DISPLAY_DECIMALS,
    );

    dispatch(setSendTokenAmount(parsedAmount));
  };

  const handleSwapValues = () => dispatch(swapSendTokenValues());

  const handleNextStep = () => {
    const newStep = sendingXTCtoCanister ? 1 : 2;

    convertToPrimaryAsset();
    setStep(newStep);
  };

  const handlePreviousStep = () => {
    const newStep = sendingXTCtoCanister ? 1 : 0;

    setStep(newStep);
    if (!sendingXTCtoCanister) convertToSecondaryAsset();
  };

  useEffect(() => {
    const maxAmount = convertedAmount;
    setAvailableAmount(
      {
        amount: maxAmount,
        prefix: primaryValue.prefix,
        suffix: primaryValue.suffix,
      },
    );

    if (amount > maxAmount) {
      const parsedAmount = truncateFloatForDisplay(
        maxAmount,
        MAX_DECIMALS,
        DISPLAY_DECIMALS,
      );

      dispatch(setSendTokenAmount(parsedAmount));
    }
  }, [primaryValue, convertedAmount]);

  useEffect(() => {
    if (!assets?.length) {
      sendMessage({
        type: HANDLER_TYPES.GET_ASSETS,
        params: {},
      }, (keyringAssets) => {
        dispatch(setAssets({ keyringAssets, icpPrice }));
      });
    }
  }, []);

  useEffect(() => {
    dispatch(setSendTokenSelectedAsset({ icpPrice }));
  }, [icpPrice]);

  useEffect(() => {
    if (address !== null) {
      let isValid = validateAddress(address) || isValidICNS;
      const type = getAddressType(address);
      // TODO: Serialize token standard in asset and check for 'icp' standard tokens here
      if (type === ADDRESS_TYPES.ACCOUNT && !['ICP', 'OGY'].includes(selectedAsset?.symbol)) {
        isValid = false;
      }
      dispatch(setSendTokenAddressInfo({ isValid, type, resolvedAddress }));

      setSendingXTCtoCanister(selectedAsset?.symbol === 'XTC' && validateCanisterId(address));
    }
  }, [address, selectedAsset, isValidICNS, resolvedAddress]);

  useEffect(() => {
    if (fulfilled) {
      dispatch(resetState());
      setStep(0);
    }
  }, [fulfilled]);

  const step2c = {
    component: <XtcToCanisterStep
      handleChangeStep={() => setStep(2)}
      destination={destination}
      handleChangeDestination={handleChangeDestination}
    />,
    left: <LinkButton
      value={t('common.back')}
      onClick={() => { convertToSecondaryAsset(); setStep(0); }}
      startIcon={BackIcon}
    />,
    right: <CancelButton />,
    center: `${t('send.choose')}`,
  };

  let step2;

  if (sendingXTCtoCanister) {
    step2 = step2c;
  }

  const steps = [
    {
      component: <SelectAssetStep
        resolvedAddress={resolvedAddress}
        availableAmount={availableAmount}
        handleSwapValues={handleSwapValues}
        handleChangeAsset={handleChangeAsset}
        handleChangeStep={handleNextStep}
        loadingAddress={loading}
      />,
      left: null,
      right: <CancelButton />,
      center: t('send.title'),
    },
    {
      ...step2,
    },
    {
      component: <ConfirmStep handleSendClick={handleSendClick} />,
      left: <LinkButton
        value={t('common.back')}
        onClick={() => handlePreviousStep()}
        startIcon={BackIcon}
      />,
      right: <CancelButton />,
      center: `${t('send.review')}`,
    },
  ];

  return steps[step];
};

export default useSteps;
