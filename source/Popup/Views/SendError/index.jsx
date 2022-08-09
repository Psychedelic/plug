import React from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from '@material-ui/core';
import { Button } from '@ui';
import { Layout } from '@components';
import { useRouter } from '@components/Router';
import NoMouthFace from '@assets/icons/nomouth-face.svg';
import RedFlag from '@assets/icons/red-flag.svg';
import FlyBill from '@assets/icons/fly-bill.svg';

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

  const emojiError = {
    100: FlyBill,
    300: NoMouthFace,
    301: RedFlag,
  };

  return (
    <Layout>
      <div className={styles.container}>
        <img src={emojiError[error.errorCode] || NoMouthFace} className={styles.image} />
        <Typography variant="h4" className={styles.text}>{t(`sendError.${error.errorCode}.title`) || t('sendError.default.title') }</Typography>
        <Typography variant="subtitle2" className={styles.text}>{t(`sendError.${error.errorCode}.description`) || t('sendError.default.title')}</Typography>
        <Typography variant="subtitle2" className={styles.errorCode}>{`Error code: #${error.errorCode}`}</Typography>
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
