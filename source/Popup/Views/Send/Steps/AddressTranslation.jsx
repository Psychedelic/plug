import React, { useState } from 'react';
import {
  Button,
  Card,
  Dialog,
  LinkButton,
} from '@ui';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import extension from 'extensionizer';
import { Typography } from '@material-ui/core';

import ArrowImg from '@assets/icons/send-arrow.svg';
import ArrowUpRight from '@assets/icons/arrow-up-right.png';

import shortAddress from '@shared/utils/short-address';
import { ADDRESS_TYPES } from '@shared/constants/addresses';
import { getICRocksAccountUrl, icIdsUrl } from '@shared/constants/urls';

import { Info } from 'react-feather';
import useStyles from '../styles';

const AddressTranslation = ({ addresses = [], loading }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [ICPModalOpen, setOpenICPModal] = useState(false);

  const openExplorer = (accountId) => !loading && extension.tabs.create({
    url: getICRocksAccountUrl(accountId),
  });
  const openTwoIdsBlog = () => {
    if (!loading) {
      extension.tabs.create({ url: icIdsUrl });
    }
  };
  return (
    <Card className={classes.card}>
      <div className={classes.addressTranslationContainer}>
        <div className={classes.leftContainer}>
          <Typography variant="subtitle1" className={classes.to}>{t('send.to')}</Typography>
          {addresses.length > 1 && <img src={ArrowImg} className={classes.arrow} />}
        </div>
        <div className={classes.rightContainer}>
          {addresses.map(({ type, address }, index) => (
            <div className={classes.addressContainer} key={address.type}>
              <div className={classes.row}>
                <div
                  className={
                    clsx(classes.badge, index === addresses.length - 1 && classes.primaryBadge)
                    }
                >
                  {t(`common.${type}`)}

                </div>
                {type === ADDRESS_TYPES.ACCOUNT && (
                  <Info
                    onClick={() => setOpenICPModal(true)}
                    color="#3574F4"
                    size={16}
                    className={classes.infoIcon}
                  />
                )}
              </div>
              <div className={`${classes.row} ${classes.relative}`}>
                <Typography variant="h6">{shortAddress(address)}</Typography>
                {type === ADDRESS_TYPES.ACCOUNT && (
                  <img
                    src={ArrowUpRight}
                    className={classes.arrowUpRight}
                    onClick={openExplorer}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Dialog
        title={t('send.icpModalTitle')}
        onClose={() => setOpenICPModal(false)}
        open={ICPModalOpen}
        component={(
          <div className={classes.modal}>
            <Typography>{t('send.icpModalText')}</Typography>
            <Button
              variant="rainbow"
              value={t('send.icpModalButton1')}
              onClick={() => setOpenICPModal(false)}
              fullWidth
              disabled={loading}
            />
            <LinkButton
              value={t('send.icpModalButton2')}
              onClick={openTwoIdsBlog}
            />
          </div>
          )}
      />
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
