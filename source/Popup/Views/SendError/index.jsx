import React from 'react';
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

  const {
    error,
  } = useSelector((state) => state.send);

  return (
    <Layout>
      <div className={styles.container}>
        {/* <img src={SighEmoji} className={styles.image} /> */}
        <Typography variant="h4" className={styles.text}>{t(`sendError.${error.errorCode}.title`)}</Typography>
        <Typography variant="subtitle2" className={styles.text}>{t(`sendError.${error.errorCode}.description`)}</Typography>
        <Typography variant="subtitle2" className={styles.text}>{`Error code: #${error.errorCode}`}</Typography>
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
