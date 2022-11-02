import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActionsStep,
  CreatePasswordStep,
  ImportMnemonicStep,
  MemeStep,
  SeedPhraseStep,
} from '../steps';

const useSteps = () => {
  const { t } = useTranslation();

  const [currentStep, setCurrentStep] = useState(0);

  const [currentBranch, setCurrentBranch] = useState('import');

  const [mnemonic, setMnemonic] = useState(null);

  const handlePreviousStep = () => setCurrentStep(currentStep - 1);
  const handleNextStep = () => setCurrentStep(currentStep + 1);

  const handleChangeBranch = (branch) => {
    setCurrentBranch(branch);
    handleNextStep();
  };
  const handleSetMnemonic = (value) => setMnemonic(value);
  useEffect(() => setMnemonic(null), [currentBranch]);

  const branches = {
    import: [
      {
        title: t('welcome.welcomeTitle'),
        subtitle: t('welcome.welcomeSubtitle'),
        message: t('welcome.welcomeMessage'),
        component: <ActionsStep
          handleChangeBranch={handleChangeBranch}
        />,
      },
      {
        title: t('welcome.importWallet'),
        subtitle: t('welcome.importSubtitle'),
        message: t('welcome.importMessage'),
        component: <ImportMnemonicStep
          handleNextStep={handleNextStep}
          handleSetMnemonic={handleSetMnemonic}
        />,
      },
      {
        title: t('welcome.memeTitle'),
        subtitle: t('welcome.memeSubtitle'),
        message: t('welcome.memeMessage'),
        component: <MemeStep />,
      },
    ],
    create: [
      {
        title: t('welcome.welcomeTitle'),
        subtitle: t('welcome.welcomeSubtitle'),
        message: t('welcome.welcomeMessage'),
        component: <ActionsStep
          handleChangeBranch={handleChangeBranch}
        />,
      },
      {
        title: t('welcome.passwordTitle'),
        subtitle: t('welcome.passwordSubtitle'),
        message: t('welcome.passwordMessage'),
        component: <CreatePasswordStep
          handleNextStep={handleNextStep}
          handleSetMnemonic={handleSetMnemonic}
        />,
      },
      {
        title: t('welcome.seedTitle'),
        subtitle: t('welcome.seedSubtitle'),
        message: t('welcome.seedMessage'),
        component: <SeedPhraseStep
          handleNextStep={handleNextStep}
          mnemonic={mnemonic}
        />,
      },
      {
        title: t('welcome.memeTitle'),
        subtitle: t('welcome.memeSubtitle'),
        message: t('welcome.memeMessage'),
        component: <MemeStep />,
      },
    ],
  };

  return {
    steps: branches[currentBranch],
    currentStep,
    handlePreviousStep,
  };
};

export default useSteps;
