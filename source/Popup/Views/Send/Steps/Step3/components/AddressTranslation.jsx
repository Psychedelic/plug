import React from 'react';
import { Card } from '@ui';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Typography } from '@material-ui/core';

import ArrowImg from '@assets/icons/send-arrow.svg';

import useStyles from '../../../styles';
import AddressRow from './AddressRow';

const AddressTranslation = ({ addresses = [], loading }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const [originalAddress, translatedAddress] = addresses;
  return (
    <Card className={classes.card}>
      <div className={classes.addressTranslationContainer}>
        <div className={classes.row}>
          <Typography variant="subtitle1" className={classes.to}>{t('send.to')}</Typography>
          <AddressRow loading={loading} {...originalAddress} />
        </div>
        {addresses?.length > 1 && (
        <div className={classes.row}>
          <img src={ArrowImg} className={classes.arrow} />
          <AddressRow primary loading={loading} {...translatedAddress} />
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
