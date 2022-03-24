import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { LinkButton } from '@ui';
import { useRouter } from '@components/Router';
import BackIcon from '@assets/icons/back.svg';
import { setAssets, setTransactions } from '@redux/wallet';
import { HANDLER_TYPES, sendMessage } from '@background/Keyring';
import {
  CURRENCIES, USD_PER_TC,
} from '@shared/constants/currencies';
import {
  isICNSName, validateAddress, validateCanisterId, validatePrincipalId,
} from '@shared/utils/ids';
import { ADDRESS_TYPES, DEFAULT_ICP_FEE, XTC_FEE } from '@shared/constants/addresses';
import { useICPPrice } from '@redux/icp';
import { useICNS } from '@hooks';

import Step1 from '../Steps/Step1';
import Step2c from '../Steps/Step2c';
import Step3 from '../Steps/Step3';
import XTC_OPTIONS from '../constants/xtc';

const MAX_DECIMALS = 12;
const DISPLAY_DECIMALS = 5;
const getAddressType = (address) => {
  const type = validatePrincipalId(address) ? ADDRESS_TYPES.PRINCIPAL : ADDRESS_TYPES.ACCOUNT;
  return isICNSName(address) ? ADDRESS_TYPES.ICNS : type;
};

const useSteps = () => {
  const [step, setStep] = useState(0);
  const { navigator } = useRouter();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { assets } = useSelector((state) => state.wallet);
  const icpPrice = useICPPrice();

  const [selectedAsset, setSelectedAsset] = useState(assets?.[0] || CURRENCIES.get('ICP'));
  const [amount, setAmount] = useState(0);
  const [address, setAddress] = useState(null);
  const [addressInfo, setAddressInfo] = useState({
    isValid: null,
    type: null,
    resolvedAddress: null,
  });
  const [trxComplete, setTrxComplete] = useState(false);
  const [destination, setDestination] = useState(XTC_OPTIONS.SEND);
  const [sendError, setError] = useState(false);
  const [sendingXTCtoCanister, setSendingXTCtoCanister] = useState(false);

  const {
    loading, resolvedAddress, isValid: isValidICNS,
  } = useICNS(address, selectedAsset?.symbol);

  const truncateFloatForDisplay = (value) => Number(
    value.toFixed(MAX_DECIMALS).slice(0, -(MAX_DECIMALS - DISPLAY_DECIMALS)),
  );
  const handleChangeAddress = (value) => {
    if (value !== address) {
      setAddressInfo({ isValid: null, resolvedAddress: null, type: null });
      setAddress(value.trim());
    }
  };
  const handleChangeAddressInfo = (value) => setAddressInfo(value);
  const handleChangeAsset = (value) => {
    setAddressInfo({ isValid: null, resolvedAddress: null, type: null });
    setSelectedAsset({
      ...value,
      price: {
        ICP: icpPrice, XTC: USD_PER_TC, WTC: USD_PER_TC, WICP: icpPrice,
      }[value?.symbol],
    });
  };
  const handleChangeStep = (index) => setStep(index);
  const handleChangeAmount = (value) => setAmount(Number(value));
  const handleChangeDestination = (value) => setDestination(value);
  const parseSendResponse = (response) => {
    const { error } = response || {};
    if (error) {
      setError(true);
    } else {
      setTrxComplete(true);
    }
  };

  const getTransactionFee = () => {
    let currentFee;

    switch (selectedAsset?.symbol) {
      case 'ICP':
        currentFee = DEFAULT_ICP_FEE;
        break;
      case 'XTC':
        currentFee = XTC_FEE;
        break;
      default:
        currentFee = 0.0;
        break;
    }

    return currentFee;
  };

  const getAvailableAmount = (value) => truncateFloatForDisplay(value - getTransactionFee());

  const handleSendClick = () => {
    const to = addressInfo.resolvedAddress || address;
    if (sendingXTCtoCanister && destination === XTC_OPTIONS.BURN) {
      sendMessage({
        type: HANDLER_TYPES.BURN_XTC,
        params: { to, amount: amount.toString() },
      }, parseSendResponse);
    } else {
      sendMessage({
        type: HANDLER_TYPES.SEND_TOKEN,
        params: { to, amount: amount.toString(), canisterId: selectedAsset?.canisterId },
      }, (response) => {
        parseSendResponse(response);
        if (!selectedAsset) {
          sendMessage({ type: HANDLER_TYPES.GET_TRANSACTIONS, params: {} },
            (transactions) => {
              dispatch(setTransactions({ ...transactions, icpPrice }));
            });
        }
      });
    }
  };

  useEffect(() => {
    const price = { ICP: icpPrice, XTC: USD_PER_TC, WTC: USD_PER_TC }[selectedAsset?.symbol] || 1;
    setSelectedAsset({ ...selectedAsset, price });
  }, [icpPrice]);

  useEffect(() => {
    if (address !== null) {
      let isValid = validateAddress(address) || isValidICNS;
      const type = getAddressType(address);
      // check for accountId if cycles selected
      if (type === ADDRESS_TYPES.ACCOUNT && selectedAsset?.symbol !== 'ICP') {
        isValid = false;
      }
      setAddressInfo({ isValid, type, resolvedAddress });

      setSendingXTCtoCanister(selectedAsset?.symbol === 'XTC' && validateCanisterId(address));
    }
  }, [address, selectedAsset, isValidICNS, resolvedAddress]);

  const [primaryValue, setPrimaryValue] = useState(
    {
      prefix: '',
      suffix: ` ${selectedAsset?.symbol}`,
      value: selectedAsset?.value,
      conversionRate: 1,
    },
  );

  const [secondaryValue, setSecondaryValue] = useState(
    {
      prefix: '$',
      suffix: ' USD',
      value: 1 / selectedAsset?.value,
      conversionRate: selectedAsset?.value,
    },
  );
  const available = getAvailableAmount((selectedAsset?.amount || 0));
  const convertedAmount = Math.max(available * primaryValue.conversionRate, 0);
  const [availableAmount, setAvailableAmount] = useState({
    amount: convertedAmount,
    prefix: primaryValue.prefix,
    suffix: primaryValue.suffix,
  });

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
      setAmount(truncateFloatForDisplay(maxAmount));
    }
  }, [primaryValue, convertedAmount]);

  useEffect(() => {
    setPrimaryValue(
      {
        prefix: '',
        suffix: ` ${selectedAsset?.symbol}`,
        value: selectedAsset?.value,
        price: selectedAsset?.value / selectedAsset?.amount,
        conversionRate: 1,
      },
    );

    setSecondaryValue(
      {
        prefix: '$',
        suffix: ' USD',
        price: 1 / selectedAsset?.price,
        value: 1 / selectedAsset?.value,
        conversionRate: selectedAsset?.price,
      },
    );
  }, [selectedAsset]);

  useEffect(() => {
    if (!assets?.length) {
      sendMessage({
        type: HANDLER_TYPES.GET_ASSETS,
        params: {},
      }, (keyringAssets) => {
        dispatch(setAssets({ keyringAssets, icpPrice }));
        setAvailableAmount(
          {
            amount: getAvailableAmount(keyringAssets?.[0]?.amount),
            prefix: primaryValue.prefix,
            suffix: primaryValue.suffix,
          },
        );
      });
    }
  }, []);

  const handleSwapValues = () => {
    const temp = secondaryValue;
    setSecondaryValue(primaryValue);
    setPrimaryValue(temp);
  };

  // when seeing asset as USD,
  // we need to convert back the amount to the correct rate when going to review
  const convertToPrimaryAsset = () => {
    setAmount(truncateFloatForDisplay(amount / primaryValue.conversionRate));
  };

  // when coming back from review we need to view amount with the correct rate
  const convertToSecondaryAsset = () => {
    setAmount(truncateFloatForDisplay(amount * primaryValue.conversionRate));
  };

  const conversionPrice = amount / secondaryValue.price;

  const rightButton = <LinkButton value={t('common.cancel')} onClick={() => navigator.navigate('home')} />;

  const step2c = {
    component: <Step2c
      handleChangeStep={() => handleChangeStep(2)}
      destination={destination}
      handleChangeDestination={handleChangeDestination}
    />,
    left: <LinkButton value={t('common.back')} onClick={() => { convertToSecondaryAsset(); handleChangeStep(0); }} startIcon={BackIcon} />,
    right: rightButton,
    center: `${t('send.choose')}`,
  };

  let step2;

  if (sendingXTCtoCanister) {
    step2 = step2c;
  }

  const handleNextStep = () => {
    convertToPrimaryAsset();

    if (sendingXTCtoCanister) {
      handleChangeStep(1);
    } else {
      handleChangeStep(2);
    }
  };

  const handlePreviousStep = () => {
    if (sendingXTCtoCanister) {
      handleChangeStep(1);
    } else {
      convertToSecondaryAsset();
      handleChangeStep(0);
    }
  };

  const steps = [
    {
      component: <Step1
        primaryValue={primaryValue}
        secondaryValue={secondaryValue}
        conversionPrice={conversionPrice}
        handleSwapValues={handleSwapValues}
        amount={amount}
        handleChangeAmount={handleChangeAmount}
        assets={assets}
        selectedAsset={selectedAsset}
        availableAmount={availableAmount}
        handleChangeAsset={handleChangeAsset}
        address={address}
        handleChangeAddress={handleChangeAddress}
        addressInfo={addressInfo}
        handleChangeAddressInfo={handleChangeAddressInfo}
        handleChangeStep={handleNextStep}
        loadingAddress={loading}
      />,
      left: null,
      right: rightButton,
      center: t('send.title'),
    },
    {
      ...step2,
    },
    {
      component: <Step3
        asset={selectedAsset}
        amount={amount}
        address={address}
        addressInfo={addressInfo}
        handleSendClick={handleSendClick}
        error={sendError}
        isTrxCompleted={trxComplete}
      />,
      left: <LinkButton value={t('common.back')} onClick={() => handlePreviousStep()} startIcon={BackIcon} />,
      right: rightButton,
      center: `${t('send.review')}`,
    },
  ];
  return steps[step];
};

export default useSteps;
