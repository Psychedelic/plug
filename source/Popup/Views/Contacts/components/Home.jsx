import { Typography } from '@material-ui/core';
import { Button, Container } from '@components';
import React from 'react';
import { useTranslation } from 'react-i18next';
import ContactIcon from '@assets/icons/contacts.svg';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';

const Home = ({ handleChangeView }) => {
  const { t } = useTranslation();
  return (
    <Container big>
      <Grid container spacing={1} style={{ textAlign: 'center' }}>
        <Grid item xs={12}>
          <img src={ContactIcon} />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h3">{t('contacts.addContacts')}</Typography>
        </Grid>
        <Grid item xs={12} style={{ padding: '6px 48px' }}>
          <Typography variant="subtitle1">{t('contacts.description')}</Typography>
        </Grid>
        <Grid item xs={12} style={{ marginTop: 12 }}>
          <Button variant="rainbow" value={t('contacts.addContact')} onClick={() => handleChangeView()} />
        </Grid>
        {
          /* <Grid item xs={12} style={{ marginTop: 24, marginBottom: -24 }}>
            <Typography variant="subtitle1">{t('contacts.dab')}</Typography>
          </Grid> */
        }
      </Grid>
    </Container>
  );
};

export default Home;

Home.propTypes = {
  handleChangeView: PropTypes.func.isRequired,
};
