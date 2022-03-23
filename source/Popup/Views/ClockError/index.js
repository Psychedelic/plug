import React from 'react';
import { useTranslation } from 'react-i18next';
import ClockIcon from '@assets/icons/clock.svg';
import { Layout } from '@components';
import { useRouter } from '@components/Router';
import useStyles from './styles';

const ClockError = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { navigator } = useRouter();

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
          <a
            className={classes.descriptionLink}
            href="https://docs.plugwallet.ooo/resources/troubleshooting-tokens/#clock-error-code-400-specified-ingress_expiry-not-within-expected-range"
            target="_blank"
            rel="noreferrer noopener"
          >
            {t('clock.descriptionLink')}
          </a>
        </p>
      </div>
    </Layout>
  );
};

export default ClockError;
