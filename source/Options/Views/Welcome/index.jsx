import React from 'react';
import Grid from '@material-ui/core/Grid';
import { FullscreenContainer, LinkButton } from '@components';
import BackIcon from '@assets/icons/back.svg';
import { useTranslation } from 'react-i18next';
import Header from './components/Header';
import useSteps from './hooks/useSteps';
import useStyles from './styles';

const Welcome = () => {
  const { t } = useTranslation();
  const classes = useStyles();
  const {
    steps,
    currentStep,
    handlePreviousStep,
  } = useSteps();

  const step = steps[currentStep];

  return (
    <FullscreenContainer maxWidth={currentStep === 0 ? 'md' : 'sm'}>
      <Grid container spacing={2} style={{ position: 'relative' }}>
        {
          (currentStep > 0 && currentStep < steps.length - 1)
          && (
          <div className={classes.goBack}>
            <LinkButton value={t('welcome.goBack')} onClick={handlePreviousStep} startIcon={BackIcon} />
          </div>
          )
        }
        <Grid item xs={12}>
          <Header title={step.title} subtitle={step.subtitle} message={step.message} />
        </Grid>
        {
          step.component
        }
      </Grid>
    </FullscreenContainer>
  );
};

export default Welcome;
