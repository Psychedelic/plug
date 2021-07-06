import React from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, Typography, Container } from '@material-ui/core';
import { Button } from '@ui';
import { Layout } from '@components';
import { useRouter } from '@components/Router';
import SighEmoji from '@assets/icons/sigh-face.svg';

import styles from './styles';

function ErrorScreen() {
  const { t } = useTranslation();
  const { navigator } = useRouter();
  const navigateHome = () => navigator.navigate('home');
  return (
    <Layout>
      <Container>
        <div container className={styles.container}>
          <img src={SighEmoji} className={styles.image} />
          <Grid item xs={12}>
            <Typography variant="h5" className={styles.title}>{t('error.errorTitle')}</Typography>
            <Typography variant="subtitle2">{t('error.errorBody')}</Typography>
          </Grid>
          <Button
            variant="rainbow"
            value={t('error.returnHome')}
            onClick={navigateHome}
            fullWidth
          />
        </div>
      </Container>
    </Layout>
  );
}

export default ErrorScreen;
