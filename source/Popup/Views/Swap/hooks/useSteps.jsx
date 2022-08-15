import React, { useEffect, useState } from 'react';
import { LinkButton } from '@components';
import { useTranslation } from 'react-i18next';
import { useRouter } from '@components/Router';
import BackIcon from '@assets/icons/back.svg';
import Step1 from '../Steps/Step1';
import Step2 from '../Steps/Step2';
import { CURRENCIES } from '../../../../shared/constants/currencies';

const AVAILABLE_AMOUNT = 100; // get available amount from somewhere

const useSteps = () => {
  const [step, setStep] = useState(0);
  const { navigator } = useRouter();
  const { t } = useTranslation();

  const [selectedFromAsset, setSelectedFromAsset] = useState(CURRENCIES.get('ICP'));
  const [selectedToAsset, setSelectedToAsset] = useState(CURRENCIES.get('CYCLES'));

  const [amount, setAmount] = useState(null);

  const handleChangeFromAsset = (value) => setSelectedFromAsset(value);
  const handleChangeToAsset = (value) => setSelectedToAsset(value);
  const handleChangeStep = (index) => setStep(index);
  const handleChangeAmount = (value) => setAmount(value);

  const [primaryValue, setPrimaryValue] = useState(
    {
      prefix: '',
      suffix: ` ${selectedFromAsset.value}`,
      price: selectedFromAsset.price,
      conversionRate: 1,
    },
  );

  const [secondaryValue, setSecondaryValue] = useState(
    {
      prefix: '$',
      suffix: ' USD',
      price: 1 / selectedFromAsset.price,
      conversionRate: selectedFromAsset.price,
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

  const rightButton = <LinkButton value={t('common.cancel')} onClick={() => navigator.navigate('home')} spanTestId="cancel-button" />;

  const steps = [
    {
      component: <Step1
        primaryValue={primaryValue}
        secondaryValue={secondaryValue}
        conversionPrice={conversionPrice}
        handleSwapValues={handleSwapValues}
        amount={amount}
        handleChangeAmount={handleChangeAmount}
        handleChangeStep={() => { convertToPrimaryAsset(); handleChangeStep(1); }}
        // fromAssets={[selectedFromAsset]}
        // toAssets={[selectedToAsset]}
        selectedFromAsset={selectedFromAsset}
        selectedToAsset={selectedToAsset}
        availableAmount={availableAmount}
        handleChangeFromAsset={handleChangeFromAsset}
        handleChangeToAsset={handleChangeToAsset}
      />,
      left: null,
      right: rightButton,
      center: t('swap.title'),
    },
    {
      component: <Step2
        fromAsset={selectedFromAsset}
        fromAmount={amount}
        toAsset={selectedToAsset}
      />,
      left: <LinkButton value={t('common.back')} onClick={() => { convertToSecondaryAsset(); handleChangeStep(0); }} startIcon={BackIcon} />,
      right: rightButton,
      center: `${t('swap.review')}`,
    },
  ];

  return steps[step];
};

export default useSteps;
