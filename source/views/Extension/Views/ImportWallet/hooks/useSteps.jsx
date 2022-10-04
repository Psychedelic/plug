import React, { useState } from 'react';
import { LinkButton } from '@components';
import { useTranslation } from 'react-i18next';
import { useRouter } from '@components/Router';
import BackIcon from '@assets/icons/back.svg';
import Step1 from '../Steps/Step1';
import Step2 from '../Steps/Step2';

const useSteps = () => {
  const [step, setStep] = useState(0);
  const { navigator } = useRouter();
  const { t } = useTranslation();

  const [userPemFile, setUserPemFile] = useState(null);

  const handleChangeStep = (index) => setStep(index);
  const handleClose = () => navigator.navigate('home');

  const leftButton = (onClick) => <LinkButton value={t('common.back')} onClick={onClick} startIcon={BackIcon} />;
  const rightButton = <LinkButton value={t('common.close')} onClick={handleClose} />;



  const steps = [
    {
      component: <Step1 handleChangeStep={handleChangeStep} setUserPemFile={setUserPemFile} userPemFile={userPemFile} />,
      left: leftButton(() => handleClose()),
      right: rightButton,
      center: `${t("importPem.importPEMfile")}`,
    },
    {
      component: <Step2
        handleClose={handleClose}
        userPemFile={userPemFile}
      />,
      right: rightButton,
      center: `${t("importPem.walletDetails")}`,
    },
  ];

  return steps[step];
};

export default useSteps;
