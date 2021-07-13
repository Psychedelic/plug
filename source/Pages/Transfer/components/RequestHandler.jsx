import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import useStyles from '../styles';

const RequestHandler = ({
  currentRequest, requests, handlePrevious, handleNext,
}) => {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <div className={classes.requestHandler}>
      {
        currentRequest > 1
        && (
        <span className={clsx(classes.arrow, classes.left)} onClick={handlePrevious}>
          {t('cycleTransactions.previous')}
        </span>
        )
      }
      <span className={classes.requestCenter}>
        <b>{currentRequest} {t('cycleTransactions.of')} {requests}</b> {t('cycleTransactions.transactions')}
      </span>
      {
        currentRequest < requests
        && (
        <span className={clsx(classes.arrow, classes.right)} onClick={handleNext}>
          {t('cycleTransactions.next')}
        </span>
        )
      }
    </div>
  );
};

export default RequestHandler;

RequestHandler.propTypes = {
  currentRequest: PropTypes.number.isRequired,
  requests: PropTypes.number.isRequired,
  handlePrevious: PropTypes.func.isRequired,
  handleNext: PropTypes.func.isRequired,
};
