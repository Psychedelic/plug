import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import ClockIcon from '@assets/icons/clock.svg';
import { Layout } from '@components';
import { setClockValidated } from '@redux/clock';

import useStyles from './styles';

const ClockError = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  useEffect(() => dispatch(setClockValidated(true)));
  return (
    <Layout>
      <div className={classes.container}>
        <img
          src={ClockIcon}
          alt="clock-icon"
        />
        <h3 className={classes.title}>
          {t('clock.title')}
        </h3>
        <p className={classes.description}>
          {t('clock.description')}
        </p>
        <a
          className={classes.descriptionLink}
          href="https://docs.plugwallet.ooo/resources/troubleshooting-tokens/#clock-error-code-400-specified-ingress_expiry-not-within-expected-range"
          target="_blank"
          rel="noreferrer noopener"
        >
          {t('clock.descriptionLink')}
        </a>
      </div>
    </Layout>
  );
};

export default ClockError;
