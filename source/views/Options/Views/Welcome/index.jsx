import React from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from '@material-ui/core';

import BackIcon from '@assets/icons/back.svg';
import { LinkButton, Plug } from '@components';

import useStyles from './styles';
import MadeByFleek from './components/MadeByFleek';
import useSteps from './hooks/useSteps';

const Welcome = () => {
  const { t } = useTranslation();
  const classes = useStyles();
  const {
    steps,
    currentStep,
    handlePreviousStep,
  } = useSteps();

  const step = steps[currentStep];
  const isMiddleStep = currentStep > 0 && currentStep < steps.length - 1;
  return (
    <div className={classes.welcomeContainer}>
      <MadeByFleek />
      <div className={classes.headerContainer}>
        {isMiddleStep && (
          <div className={classes.goBack}>
            <LinkButton value={t('welcome.goBack')} onClick={handlePreviousStep} startIcon={BackIcon} />
          </div>
        )}
        <Plug size="big" message={step.message} style={{ marginBottom: 6 }} />
        <Typography variant="h2">{step.title}</Typography>
        <Typography variant="subtitle1">{step.subtitle}</Typography>
      </div>
      <div className={classes.stepContainer}>
        {step.component}
      </div>
    </div>
  );
};

export default Welcome;
