import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import useStyles from './styles';

const Stepper = ({
  current, total, showPrevious, showNext, isActive,
}) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const shouldShowPrevious = current > 1;
  const shouldShowNext = current < total;

  return (
    <div
      className={clsx(
        classes.stepper,
        isActive ? classes.stepperActive : classes.stepperInactive,
      )}
    >
      {shouldShowPrevious && (
        <span
          className={clsx(classes.arrow, classes.left)}
          onClick={showPrevious}
        >
          {t('transfer.previous')}
        </span>
      )}

      <span className={classes.requestCenter}>
        <b>{current} {t('transfer.of')} {total}</b>{' '}
        {t('transfer.transactions')}
      </span>

      {shouldShowNext && (
        <span className={clsx(classes.arrow, classes.right)} onClick={showNext}>
          {t('transfer.next')}
        </span>
      )}
    </div>
  );
};

export default Stepper;

Stepper.propTypes = {
  isActive: PropTypes.bool.isRequired,
  current: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  showPrevious: PropTypes.func.isRequired,
  showNext: PropTypes.func.isRequired,
};
