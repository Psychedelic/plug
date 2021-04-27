import React, { useState } from 'react';
import { LinkButton } from '@ui';
import { useTranslation } from 'react-i18next';
import { useRouter } from '@components/Router';
import BackIcon from '@assets/icons/back.svg';
import Step1 from '../Steps/Step1';
import Step2 from '../Steps/Step2';
import Step3 from '../Steps/Step3';
import { CURRENCIES } from '../../../../shared/constants/currencies';

const useSteps = () => {
  const [step, setStep] = useState(0);
  const { navigator } = useRouter();
  const { t } = useTranslation();

  const [selectedFromAsset, setSelectedFromAsset] = useState(CURRENCIES.get('ICP'));
  const [selectedToAsset, setSelectedToAsset] = useState(CURRENCIES.get('CYCLES'));

  const handleChangeStep = (index) => setStep(index);

  const rightButton = <LinkButton value={t('common.cancel')} onClick={() => navigator.navigate('home')} />;
  const leftButton = <LinkButton value={t('common.back')} onClick={() => handleChangeStep(0)} startIcon={BackIcon} />;

  const steps = [
    {
      component: <Step1 
      handleChangeStep={() => handleChangeStep(1)}
      fromAssets={[selectedFromAsset]}
      toAssets={[selectedToAsset]}
      selectedFromAsset={selectedFromAsset}
      selectedToAsset={selectedToAsset}
      />,
      left: null,
      right: rightButton,
      center: t('swap.title'),
    },
    {
      component: <Step2 
      handleChangeStep={() => handleChangeStep(2)}
      />,
      left: leftButton,
      right: rightButton,
      center: `${t('swap.reviewSwap')}`,
    },
    {
      component: <Step3 />,
      left: leftButton,
      right: rightButton,
      center: `${t('swap.title')}`,
    },
  ];

  return steps[step];
};

export default useSteps;
