import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Typography } from '@material-ui/core';
import extension from 'extensionizer';
import { Info } from 'react-feather';
import clsx from 'clsx';

import { Button, LinkButton, Dialog } from '@ui';
import { ADDRESS_TYPES } from '@shared/constants/addresses';
import { getICRocksAccountUrl, icIdsUrl } from '@shared/constants/urls';
import ArrowUpRight from '@assets/icons/arrow-up-right.png';
import shortAddress from '@shared/utils/short-address';

import useStyles from '../../../styles';

const AddressRow = ({
  loading, type, address, primary,
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [ICPModalOpen, setOpenICPModal] = useState(false);
  const openTwoIdsBlog = () => {
    if (!loading) {
      extension.tabs.create({ url: icIdsUrl });
    }
  };
  const openExplorer = (accountId) => !loading && extension.tabs.create({
    url: getICRocksAccountUrl(accountId),
  });
  return (
    <div className={clsx(classes.addressRow, primary && classes.primaryAddressRow)}>
      <div className={classes.row}>
        <div className={clsx(classes.badge, primary && classes.primaryBadge)}>
          {t(`common.${type}`)}
        </div>
        {primary && (
          <Info
            onClick={() => setOpenICPModal(true)}
            color="#3574F4"
            size={16}
            className={classes.infoIcon}
          />
        )}
      </div>
      <div className={clsx(classes.row, classes.relative)}>
        <Typography variant="h6">{shortAddress(address)}</Typography>
        {type === ADDRESS_TYPES.ACCOUNT && (
          <img
            src={ArrowUpRight}
            className={classes.arrowUpRight}
            onClick={openExplorer}
          />
        )}
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
    </div>
  );
};

AddressRow.propTypes = {
  address: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  primary: PropTypes.bool,
};

AddressRow.defaultProps = {
  primary: false,
};

export default AddressRow;
