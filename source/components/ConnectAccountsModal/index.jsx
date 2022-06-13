import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import { getApps, setApps } from '@modules/storageManager';
import { CONNECTION_STATUS } from '@shared/constants/connectionStatus';
import { getTabURL } from '@shared/utils/chrome-tabs';
import { getMultipleReverseResolvedNames } from '@shared/services/ICNS';

import ActionDialog from '../ActionDialog';
import useStyles from './styles';
import ConnectAccountsModalLayout from './layout';

const ConnectAccountsModal = ({
  wallets,
  open,
  onClose,
  connectedWallets,
  onConfirm,
  app,
  tab,
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [walletsToUpdate, setWalletsToUpdate] = useState({});
  const [selectAllWallets, setSelectAllWallets] = useState(false);
  const [icnsNames, setICNSNames] = useState({});

  const getReverseResolvedNames = async () => {
    const principals = wallets.map((wallet) => wallet.principal);
    const names = await getMultipleReverseResolvedNames(principals);
    setICNSNames(names);
  };

  useEffect(() => {
    getReverseResolvedNames();
  }, [wallets]);

  const connectAccountToTab = (wallet) => {
    getApps(wallet.walletNumber.toString(), (apps) => {
      // If any other account is connected, create an entry for the current wallet
      const date = new Date().toISOString();
      const url = getTabURL(tab);
      const newApps = {
        ...apps,
        [url]: {
          // Use previously fetched app from current wallet
          ...app,
          date,
          events: [
            {
              status: CONNECTION_STATUS.accepted,
              date,
            },
          ],
        },
      };
      setApps(wallet.walletNumber.toString(), newApps);
    });
  };

  const handleConfirm = () => {
    Object.keys(walletsToUpdate).forEach((walletId) => connectAccountToTab(wallets[walletId], tab));
    onConfirm?.();
    setWalletsToUpdate({});
    setSelectAllWallets(false);
    onClose();
  };

  const onCheckWallet = (walletId) => (event) => {
    setWalletsToUpdate({
      ...walletsToUpdate,
      [walletId]: event.target.checked,
    });
  };

  const handleSelectAll = (event) => {
    const newWalletsToUpdate = {};
    wallets.forEach((wallet) => {
      newWalletsToUpdate[wallet.walletNumber] = event.target.checked;
    });
    setSelectAllWallets(event.target.checked);
    setWalletsToUpdate(newWalletsToUpdate);
  };

  return (
    <ActionDialog
      open={open}
      className={classes.modalContainer}
      confirmText={t('common.allow')}
      cancelText={t('common.decline')}
      buttonVariant="rainbow"
      onClick={handleConfirm}
      onClose={onClose}
      content={(
        <ConnectAccountsModalLayout
          tab={tab}
          app={app}
          wallets={wallets}
          selectAllWallets={selectAllWallets}
          handleSelectAll={handleSelectAll}
          onCheckWallet={onCheckWallet}
          connectedWallets={connectedWallets}
          walletsToUpdate={walletsToUpdate}
          icnsNames={icnsNames}
        />
)}
    />
  );
};

ConnectAccountsModal.propTypes = {
  wallets: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)).isRequired,
  app: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)).isRequired,
  tab: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)).isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  connectedWallets: PropTypes.arrayOf(PropTypes.number),
};

ConnectAccountsModal.defaultProps = {
  connectedWallets: [],
};

export default ConnectAccountsModal;
