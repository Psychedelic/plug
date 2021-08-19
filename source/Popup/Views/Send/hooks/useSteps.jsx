import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { LinkButton } from '@ui';
import { useRouter } from '@components/Router';
import BackIcon from '@assets/icons/back.svg';
import { setAssets, setTransactions } from '@redux/wallet';
import { HANDLER_TYPES, sendMessage } from '@background/Keyring';
import { CURRENCIES, E8S_PER_ICP, USD_PER_TC } from '@shared/constants/currencies';
import { validateAccountId, validatePrincipalId } from '@shared/utils/ids';
import { ADDRESS_TYPES, DEFAULT_FEE } from '@shared/constants/addresses';
import Step1 from '../Steps/Step1';
import Step2a from '../Steps/Step2a';
import Step2b from '../Steps/Step2b';
import Step3 from '../Steps/Step3';

const useSteps = () => {
  const [step, setStep] = useState(0);
  const { navigator } = useRouter();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { assets, principalId, accountId } = useSelector((state) => state.wallet);
  const { icpPrice } = useSelector((state) => state.icp);
  const [selectedAsset, setSelectedAsset] = useState(assets?.[0] || CURRENCIES.get('ICP'));

  const [amount, setAmount] = useState(0);
  const [transaction, setTransaction] = useState(null);
  const [address, setAddress] = useState(null);
  const [addressInfo, setAddressInfo] = useState({ isValid: null, type: null });
  const [trxComplete, setTrxComplete] = useState(false);

  const [destination, setDestination] = useState('dank');
  const [sendError, setError] = useState(false);

  const handleChangeAddress = (value) => setAddress(value.trim());
  const handleChangeAddressInfo = (value) => setAddressInfo(value);
  const handleChangeAsset = (value) => setSelectedAsset({
    ...value,
    price: { ICP: icpPrice, XTC: USD_PER_TC, WTC: USD_PER_TC }[value?.symbol] || 1,
  });
  const handleChangeStep = (index) => setStep(index);
  const handleChangeAmount = (value) => setAmount(value);
  const handleChangeDestination = (value) => setDestination(value);
  const handleSendClick = () => {
    const e8s = parseInt(amount * E8S_PER_ICP, 10);
    console.log('selectedAsset', selectedAsset);
    sendMessage({
      type: HANDLER_TYPES.SEND_TOKEN,
      params: { to: address, amount: e8s, canisterId: selectedAsset?.canisterId },
    }, (response) => {
      const { error } = response || {};
      if (error) {
        setError(true);
      } else {
        setTrxComplete(true);
      }
      if (!selectedAsset) {
        sendMessage({ type: HANDLER_TYPES.GET_TRANSACTIONS, params: {} },
          (transactions) => {
            dispatch(setTransactions({ ...transactions, icpPrice }));
            setTransaction(transactions?.transactions[0]);
          });
      }
    });
  };

  useEffect(() => {
    const price = { ICP: icpPrice, XTC: USD_PER_TC, WTC: USD_PER_TC }[selectedAsset?.symbol] || 1;
    setSelectedAsset({ ...selectedAsset, price });
  }, [icpPrice]);

  useEffect(() => {
    if (address !== null) {
      const isUserAddress = [principalId, accountId].includes(address);
      let isValid = !isUserAddress && (validatePrincipalId(address) || validateAccountId(address));
      const type = validatePrincipalId(address) ? ADDRESS_TYPES.PRINCIPAL : ADDRESS_TYPES.ACCOUNT;
      // check for accountId if cycles selected
      if (type === ADDRESS_TYPES.ACCOUNT && selectedAsset?.symbol !== 'ICP') {
        isValid = false;
      }
      handleChangeAddressInfo({ isValid, type });
    }
  }, [address, selectedAsset]);

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
  const available = (selectedAsset?.amount || 0) - (selectedAsset?.symbol === 'ICP' ? DEFAULT_FEE : 0); // Only ICP supported for now
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
      setAmount(maxAmount);
    }
  }, [primaryValue]);

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
        dispatch(setAssets(keyringAssets));
        setAvailableAmount(
          {
            amount: keyringAssets?.[0]?.amount,
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
    setAmount(amount / primaryValue.conversionRate);
  };

  // when coming back from review we need to view amount with the correct rate
  const convertToSecondaryAsset = () => {
    setAmount(amount * primaryValue.conversionRate);
  };

  const conversionPrice = amount / secondaryValue.price;

  const rightButton = <LinkButton value={t('common.cancel')} onClick={() => navigator.navigate('home')} />;

  const step2a = {
    component: <Step2a
      destination={destination}
      handleChangeDestination={handleChangeDestination}
      handleChangeStep={() => handleChangeStep(2)}
    />,
    left: <LinkButton value={t('common.back')} onClick={() => { convertToSecondaryAsset(); handleChangeStep(0); }} startIcon={BackIcon} />,
    right: rightButton,
    center: `${t('send.review')}`,
  };

  const step2b = {
    component: <Step2b
      handleChangeStep={() => handleChangeStep(2)}
    />,
    left: <LinkButton value={t('common.back')} onClick={() => { convertToSecondaryAsset(); handleChangeStep(0); }} startIcon={BackIcon} />,
    right: rightButton,
    center: `${t('send.warning')}`,
  };

  let step2;

  if (selectedAsset?.symbol === 'XTC') {
    step2 = step2a;
  } else if (selectedAsset?.symbol === 'ICP') {
    step2 = step2b;
  }

  const handleNextStep = () => {
    convertToPrimaryAsset();

    if (addressInfo.type === 'canister') {
      handleChangeStep(1);
    } else {
      handleChangeStep(2);
    }
  };

  const handlePreviousStep = () => {
    if (addressInfo.type === 'canister') {
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
        transaction={transaction}
        trxComplete={trxComplete}
      />,
      left: <LinkButton value={t('common.back')} onClick={() => handlePreviousStep()} startIcon={BackIcon} />,
      right: rightButton,
      center: `${t('send.review')}`,
    },
  ];
  return steps[step];
};

export default useSteps;
