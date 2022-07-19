import React from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from '@material-ui/core';
import { Button } from '@components';
import SighEmoji from '@assets/icons/sigh-face.svg';

import useStyles from './styles';

function ErrorScreen() {
  const { t } = useTranslation();
  const styles = useStyles();
  const closeModal = () => window.close();
  return (
    <div className={styles.container}>
      <img src={SighEmoji} className={styles.image} />
      <Typography variant="h4" className={styles.text}>{t('error.errorTitle')}</Typography>
      <Typography variant="subtitle2" className={styles.text}>{t('error.notificationError')}</Typography>
      <Button
        variant="rainbow"
        value={t('common.close')}
        onClick={closeModal}
      />
    </div>
  );
}

export default ErrorScreen;
