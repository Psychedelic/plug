import React from 'react';
import { useTranslation } from 'react-i18next';
import ClockIcon from '@assets/icons/clock.svg';
import { Layout } from '@components';
import { Button } from '@ui';
import { isClockOutOfSync } from '@shared/utils/time';
import { useRouter } from '@components/Router';
import useStyles from './styles';

const Clock = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { navigator } = useRouter();

  const handleRetry = async () => {
    const clockOutOfSync = await isClockOutOfSync();

    if (!clockOutOfSync) {
      navigator.navigate('home');
    }
  };

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
          >
            {t('clock.descriptionLink')}
          </a>
        </p>
        <Button
          value="Reload"
          variant="default"
          onClick={handleRetry}
        />
      </div>
    </Layout>
  );
};

export default Clock;
