import React, { useState, useEffect } from 'react';
import { LinkButton } from '@ui';
import { useTranslation } from 'react-i18next';
import { useRouter } from '@components/Router';
import BackIcon from '@assets/icons/back.svg';
import Step1 from '../Steps/Step1';
import Step2 from '../Steps/Step2';
import { CURRENCIES } from '../../../../shared/constants/currencies';
import { SOURCES } from '../../../../shared/constants/sources';

const useSteps = () => {
  const [step, setStep] = useState(0);
  const { navigator } = useRouter();
  const { t } = useTranslation();

  const [selectedAsset, setSelectedAsset] = useState(CURRENCIES.get('ICP'));
  const [selectedSource, setSelectedSource] = useState(SOURCES.get('PLUG_ACCOUNT'));

  const handleChangeStep = (index) => setStep(index);

  const rightButton = (text) => <LinkButton value={text} onClick={() => navigator.navigate('home')} />;

  useEffect(() => {
    if (selectedAsset.id === 'ICP') {
      setSelectedSource(SOURCES.get('PLUG_ACCOUNT'));
    }
  }, [selectedAsset]);

  const steps = [
    {
      component: <Step1
        handleChangeStep={() => handleChangeStep(1)}
        assets={CURRENCIES}
        selectedAsset={selectedAsset}
        setSelectedAsset={setSelectedAsset}
        sources={SOURCES}
        selectedSource={selectedSource}
        setSelectedSource={setSelectedSource}
      />,
      left: null,
      right: rightButton(t('common.close')),
      center: t('deposit.title'),
    },
    {
      component: <Step2 selectedSource={selectedSource} selectedAsset={selectedAsset} />,
      left: <LinkButton value={t('common.back')} onClick={() => handleChangeStep(0)} startIcon={BackIcon} />,
      right: rightButton(t('common.done')),
      center: `${t('deposit.title')} ${selectedAsset.symbol}`,
    },
  ];

  return steps[step];
};

export default useSteps;
