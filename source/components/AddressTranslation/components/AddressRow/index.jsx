import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Typography } from '@material-ui/core';
import extension from 'extensionizer';
import { Info } from 'react-feather';
import clsx from 'clsx';

import { ADDRESS_TYPES } from '@shared/constants/addresses';
import { getAccountDashboardURL } from '@shared/constants/urls';
import ArrowUpRight from '@assets/icons/arrow-up-right.png';
import shortAddress from '@shared/utils/short-address';
import Dialog from '../../../Dialog';

import useStyles from './styles';
import TranslationModal from '../TranslationModal';

const AddressRow = ({
  loading, type, address, primary,
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [modalOpen, setModalOpen] = useState(false);

  const openExplorer = (accountId) => () => !loading && extension.tabs.create({
    url: getAccountDashboardURL(accountId),
  });
  const isICP = type === ADDRESS_TYPES.ACCOUNT;
  const isICNS = type === ADDRESS_TYPES.ICNS;
  return (
    <div className={clsx(classes.addressRow, !primary && classes.secondaryAddressRow)}>
      <div className={classes.row}>
        <div className={clsx(classes.badge, primary && classes.primaryBadge)}>
          {t(`common.${type}`)}
        </div>
        {primary && isICNS && (
          <Info
            onClick={() => setModalOpen(true)}
            color="#3574F4"
            size={16}
            className={classes.infoIcon}
          />
        )}
      </div>
      <div className={clsx(classes.row, classes.relative)}>
        <Typography variant="h6">{type === ADDRESS_TYPES.ICNS ? address : shortAddress(address)}</Typography>
        {isICP && (
          <img
            src={ArrowUpRight}
            className={classes.arrowUpRight}
            onClick={openExplorer(address)}
          />
        )}
      </div>
      <Dialog
        title={t('send.icnsModalTitle')}
        onClose={() => setModalOpen(false)}
        open={modalOpen}
        component={(
          <TranslationModal
            loading={loading}
            isICP={isICP}
            closeModal={() => setModalOpen(false)}
          />
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
