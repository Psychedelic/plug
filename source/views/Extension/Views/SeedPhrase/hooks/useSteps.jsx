import React, { useState } from 'react';
import { LinkButton } from '@components';
import { useTranslation } from 'react-i18next';
import { useRouter } from '@components/Router';
import BackIcon from '@assets/icons/back.svg';
import Step1 from '../Steps/Step1';
import Step2 from '../Steps/Step2';

const useSteps = () => {
  const [step, setStep] = useState(0);
  const [password, setPassword] = useState('');
  const { navigator } = useRouter();
  const { t } = useTranslation();

  const handleChangeStep = (index) => setStep(index);

  const leftButton = (onClick) => <LinkButton value={t('common.back')} spanTestId="back-button" onClick={onClick} startIcon={BackIcon} />;
  const rightButton = (text) => <LinkButton value={text} onClick={() => navigator.navigate('home')} spanTestId="close-button" />;

  const steps = [
    {
      component: <Step1
        handleChangeStep={() => handleChangeStep(1)}
        password={password}
        setPassword={setPassword}
      />,
      left: leftButton(() => navigator.navigate('settings')),
      right: rightButton(t('common.close')),
    },
    {
      component: <Step2 password={password} />,
      left: null,
      right: rightButton(t('common.done')),
      next: null,
    },
  ];

  return steps[step];
};

export default useSteps;
