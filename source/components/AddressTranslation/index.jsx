import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Typography } from '@material-ui/core';

import ArrowImg from '@assets/icons/send-arrow.svg';
import Card from '../Card';

import useStyles from './styles';
import AddressRow from './components/AddressRow';

const AddressTranslation = ({ addresses = [], loading }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const [originalAddress, translatedAddress] = addresses;
  const hasTranslation = addresses?.length > 1;
  return (
    <Card className={classes.card}>
      <div className={classes.addressTranslationContainer}>
        <div className={classes.row}>
          <Typography variant="subtitle1" className={classes.to}>{t('send.to')}</Typography>
          <AddressRow primary loading={loading} {...originalAddress} />
        </div>
        {hasTranslation && (
        <div className={classes.row}>
          <img src={ArrowImg} className={classes.arrow} />
          <AddressRow loading={loading} {...translatedAddress} />
        </div>
        )}
      </div>
    </Card>
  );
};

AddressTranslation.propTypes = {
  addresses: PropTypes.arrayOf(PropTypes.shape({
    type: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
  })).isRequired,
  loading: PropTypes.bool.isRequired,
};

export default AddressTranslation;
