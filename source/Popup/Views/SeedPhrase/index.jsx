import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from '@components/Router';
import { Layout } from '@components';
import { Header, LinkButton } from '@ui';
import BackIcon from '@assets/icons/back.svg';
import Step1 from './Steps/Step1';
import Step2 from './Steps/Step2';
import Step3 from './Steps/Step3';

const getSteps = (handleChangeStep, t) => {
  const { navigator } = useRouter();

  const leftButton = (onClick) => <LinkButton value={t('common.back')} onClick={onClick} startIcon={BackIcon} />;
  const rightButton = (text) => <LinkButton value={text} onClick={() => navigator.navigate('home')} />;

  return [
    {
      component: <Step1 handleChangeStep={() => handleChangeStep(1)} />,
      left: leftButton(() => navigator.navigate('settings')),
      right: rightButton(t('common.close')),
    },
    {
      component: <Step2 handleChangeStep={() => handleChangeStep(2)} />,
      left: leftButton(() => handleChangeStep(0)),
      right: rightButton(t('common.close')),
    },
    {
      component: <Step3 />,
      left: null,
      right: rightButton(t('common.done')),
      next: null,
    },
  ];
};

const SeedPhrase = () => {
  const [step, setStep] = useState(0);
  const { t } = useTranslation();

  const handleChangeStep = (index) => setStep(index);

  const {
    component,
    left,
    right,
  } = getSteps(handleChangeStep, t)[step];

  return (
    <Layout>
      <Header left={left} right={right} value={t('seedPhrase.title')} />
      {
        component
      }
    </Layout>
  );
};

export default SeedPhrase;
