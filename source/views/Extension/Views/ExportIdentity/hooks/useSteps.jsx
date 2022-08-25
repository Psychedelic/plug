import React, { useState } from 'react';
import { LinkButton } from '@components';
import { useTranslation } from 'react-i18next';
import { useRouter } from '@components/Router';
import BackIcon from '@assets/icons/back.svg';
import Step1 from '../steps/Step1';
import Step2 from '../steps/Step2';

const useSteps = () => {
  const [step, setStep] = useState(0);
  const { navigator } = useRouter();
  const { t } = useTranslation();

  const handleChangeStep = (index) => setStep(index);

  const rightButton = (text) => <LinkButton value={text} onClick={() => navigator.navigate('home')} spanTestId="close-button" />;

  const steps = [
    {
      component: <Step1 handleChangeStep={() => handleChangeStep(1)} />,
      left: <LinkButton value={t('common.back')} onClick={() => navigator.navigate('settings')} startIcon={BackIcon} spanTestId="back-button" />,
      right: rightButton(t('common.close')),
    },
    {
      component: <Step2 />,
      left: null,
      right: rightButton(t('common.done')),
    },
  ];

  return steps[step];
};

export default useSteps;
