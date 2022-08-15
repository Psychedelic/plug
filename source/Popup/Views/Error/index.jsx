import React from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from '@material-ui/core';
import { Button, Layout } from '@components';
import { useRouter } from '@components/Router';
import SighEmoji from '@assets/icons/sigh-face.svg';

import useStyles from './styles';

function ErrorScreen() {
  const { t } = useTranslation();
  const { navigator } = useRouter();
  const navigateHome = () => navigator?.navigate?.('home');
  const styles = useStyles();
  return (
    <Layout>
      <div className={styles.container}>
        <img src={SighEmoji} className={styles.image} />
        <Typography variant="h4" className={styles.text}>{t('error.errorTitle')}</Typography>
        <Typography variant="subtitle2" className={styles.text}>{t('error.errorBody')}</Typography>
        <Button
          variant="rainbow"
          value={t('error.returnHome')}
          onClick={navigateHome}
        />
      </div>
    </Layout>
  );
}

export default ErrorScreen;
