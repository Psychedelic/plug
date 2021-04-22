import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import { Layout } from '@components';
import { Button, Container } from '@ui';
import useStyles from './styles';

const AppConnection = ({ url, image }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  return (
    <Layout>
      <Container>
        <div className={classes.infoContainer}>
          <img src={image} className={classes.image} />
          <Typography variant="h2">{url}</Typography>
          <Typography variant="subtitle1">{t('appConnection.connect')}</Typography>
        </div>
        <div className={classes.buttonContainer}>
          <Button variant="default" value={t('common.decline')} onClick={() => null} style={{ width: '48%' }} />
          <Button variant="rainbow" value={t('common.allow')} onClick={() => null} style={{ width: '48%' }} />
        </div>
      </Container>
    </Layout>
  );
};

export default AppConnection;

AppConnection.propTypes = {
  url: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
};
