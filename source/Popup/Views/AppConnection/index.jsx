import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Layout } from '@components';
import { Button, Container, IncomingAction } from '@ui';
import useStyles from './styles';

const AppConnection = ({ url, image }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  return (
    <Layout>
      <Container>
        <IncomingAction url={url} image={image} action={t('appConnection.connect')} />
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
