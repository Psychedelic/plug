import React, { useEffect, useState } from 'react';
import { LinkButton } from '@ui';
import { useTranslation } from 'react-i18next';
import { useRouter } from '@components/Router';
import BackIcon from '@assets/icons/back.svg';
import Step1 from '../Steps/Step1';
import Step2 from '../Steps/Step2';
import Step3 from '../Steps/Step3';
import { CURRENCIES } from '../../../../shared/constants/currencies';

const AVAILABLE_AMOUNT = 100; // get available amount from somewhere

const useSteps = () => {
  const [step, setStep] = useState(0);
  const { navigator } = useRouter();
  const { t } = useTranslation();

  const [selectedAsset, setSelectedAsset] = useState(CURRENCIES.get('ICP'));
  const [amount, setAmount] = useState(null);

  const [address, setAddress] = useState(null);
  const [addressInfo, setAddressInfo] = useState({ isValid: null, type: null });

  const [destination, setDestination] = useState('dank');

  const handleChangeAddress = (value) => setAddress(value);
  const handleChangeAddressInfo = (value) => setAddressInfo(value);
  const handleChangeAsset = (value) => setSelectedAsset(value);
  const handleChangeStep = (index) => setStep(index);
  const handleChangeAmount = (value) => setAmount(value);
  const handleChangeDestination = (value) => setDestination(value);

  const [primaryValue, setPrimaryValue] = useState(
    {
      prefix: '',
      suffix: ` ${selectedAsset.value}`,
      price: selectedAsset.price,
      conversionRate: 1,
    },
  );

  const [secondaryValue, setSecondaryValue] = useState(
    {
      prefix: '$',
      suffix: ' USD',
      price: 1 / selectedAsset.price,
      conversionRate: selectedAsset.price,
    },
  );

  const [availableAmount, setAvailableAmount] = useState({
    amount: AVAILABLE_AMOUNT * primaryValue.conversionRate,
    prefix: primaryValue.prefix,
    suffix: primaryValue.suffix,
  });

  useEffect(() => {
    const maxAmount = AVAILABLE_AMOUNT * primaryValue.conversionRate;

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
        suffix: ` ${selectedAsset.value}`,
        price: selectedAsset.price,
        conversionRate: 1,
      },
    );

    setSecondaryValue(
      {
        prefix: '$',
        suffix: ' USD',
        price: 1 / selectedAsset.price,
        conversionRate: selectedAsset.price,
      },
    );
  }, [selectedAsset]);

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
        assets={Array.from(CURRENCIES.values())}
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
      component: <Step2
        destination={destination}
        handleChangeDestination={handleChangeDestination}
        handleChangeStep={() => handleChangeStep(2)}
      />,
      left: <LinkButton value={t('common.back')} onClick={() => { convertToSecondaryAsset(); handleChangeStep(0); }} startIcon={BackIcon} />,
      right: rightButton,
      center: `${t('swap.review')}`,
    },
    {
      component: <Step3
        asset={selectedAsset}
        amount={amount}
        address={address}
        handleSendClick={() => navigator.navigate('home')}
      />,
      left: <LinkButton value={t('common.back')} onClick={() => handlePreviousStep()} startIcon={BackIcon} />,
      right: rightButton,
      center: `${t('send.review')}`,
    },
  ];

  return steps[step];
};

export default useSteps;
