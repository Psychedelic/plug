import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import extension from 'extensionizer';
import PropTypes from 'prop-types';

import { getApps, setApps } from '@modules/storageManager';
import { CONNECTION_STATUS } from '@shared/constants/connectionStatus';
import { getTabURL } from '@shared/utils/chrome-tabs';

import ActionDialog from '../ActionDialog';
import useStyles from './styles';
import ConnectAccountsModalLayout from './layout';

const ConnectAccountsModal = ({
  wallets,
  open,
  onClose,
  executeAccountSwitch,
  selectedWallet,
  connectedWallets,
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [app, setApp] = useState(null);
  const [tab, setTab] = useState(null);
  const [walletsToUpdate, setWalletsToUpdate] = useState({});
  const [selectAllWallets, setSelectAllWallets] = useState(false);
  const { walletNumber: currentWalletNumber } = useSelector((state) => state.wallet);

  useEffect(() => {
    extension.tabs.query({ active: true }, (tabs) => {
      setTab(tabs?.[0]);
      getApps(currentWalletNumber.toString(), (apps) => {
        const url = getTabURL(tabs?.[0]);
        const currentApp = apps[url];
        setApp(currentApp);
      });
    });
  }, [open, currentWalletNumber]);

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

  const onConfirm = () => {
    Object.keys(walletsToUpdate).forEach((walletId) => connectAccountToTab(wallets[walletId], tab));
    executeAccountSwitch(selectedWallet);
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
      title={t('profile.subaccountNotConnected')}
      className={classes.modalContainer}
      button={t('common.allow')}
      buttonVariant="rainbow"
      onClick={onConfirm}
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
        />
)}
    />
  );
};

ConnectAccountsModal.propTypes = {
  wallets: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)).isRequired,
  selectedWallet: PropTypes.number.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  executeAccountSwitch: PropTypes.func.isRequired,
  connectedWallets: PropTypes.arrayOf(PropTypes.number),
};

ConnectAccountsModal.defaultProps = {
  connectedWallets: [],
};

export default ConnectAccountsModal;
