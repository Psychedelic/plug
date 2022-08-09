import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from '@material-ui/core';
import { Button } from '@ui';
import { Layout } from '@components';
import { useRouter } from '@components/Router';

import { useSelector } from 'react-redux';
import useStyles from './styles';

function SendErrorScreen() {
  const { t } = useTranslation();
  const { navigator } = useRouter();
  const navigateHome = () => navigator?.navigate?.('home');
  const styles = useStyles();

  const [selectedError, setSelectedError] = useState(null);

  const {
    error,
  } = useSelector((state) => state.send);

  console.log(error);

  const sendErrors = [
    {
      code: 100,
      emoji: '💸',
      title: 'Insufficient Balance',
      description: 'This transaction couldn’t be completed because there are insufficient funds available.',
    },
    {
      code: 200,
      emoji: '😶',
      title: 'Register token don’t respect the interface',
      description: 'We’re sorry, something weird happened. Return home and retry the action.',
    },
  ];

  useEffect(() => {
    sendErrors.map((err) => {
      if (err.code === error.errorCode) {
        console.log(err);
      }
    });
  }, [error]);

  return (
    <Layout>
      <div className={styles.container}>
        {/* <img src={SighEmoji} className={styles.image} /> */}
         <Typography variant="h4" className={styles.text}>{t('sendErrors.errorTitle')}</Typography>
        <Typography variant="subtitle2" className={styles.text}>{t('sendErrors.errorTitle')}</Typography>
        <Button
          variant="rainbow"
          value={t('error.returnHome')}
          onClick={navigateHome}
        />
      </div>
    </Layout>
  );
}

export default SendErrorScreen;
