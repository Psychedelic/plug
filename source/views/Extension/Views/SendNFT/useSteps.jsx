import React, { useState } from 'react';

import { useTranslation } from 'react-i18next';

import InputStep from './components/InputStep';
import ReviewStep from './components/ReviewStep';

const useSteps = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const { t } = useTranslation();
  const advanceStep = () => !currentStep && setCurrentStep(currentStep + 1);
  const steps = [
    {
      component: <InputStep advanceStep={advanceStep} />,
      title: t('nfts.send'),
    },
    {
      component: <ReviewStep />,
      title: t('nfts.review'),
    },
  ];

  return steps[currentStep];
};

export default useSteps;
