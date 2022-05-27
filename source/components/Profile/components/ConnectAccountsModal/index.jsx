import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import extension from 'extensionizer';
import PropTypes from 'prop-types';
import clsx from 'clsx';

import { ActionDialog } from '@components';
import { getApps, setApps } from '@modules/storageManager';
import { CONNECTION_STATUS } from '@shared/constants/connectionStatus';
import { Checkbox } from '@ui';
import { Typography } from '@material-ui/core';
import shortAddress from '@shared/utils/short-address';
import { getTabURL } from '@shared/utils/chrome-tabs';
import UserIcon from '../../../UserIcon';
import useStyles from './styles';

const ConnectAccountsModal = ({
  wallets,
  open,
  onClose,
  executeAccountSwitch,
  selectedWallet,
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

  const handleSelectAll = () => {
    const newWalletsToUpdate = {};
    wallets.forEach((wallet) => {
      newWalletsToUpdate[wallet.walletNumber] = true;
    });
    setSelectAllWallets(!selectAllWallets);
    setWalletsToUpdate(newWalletsToUpdate);
  };
  return (
    <ActionDialog
      open={open}
      title={t('profile.subaccountNotConnected')}
      content={(
        <div>
          {tab && app && (
            <div className={classes.infoContainer}>
              <img src={app?.icon} className={classes.appImage} />
              <Typography variant="h2" className={classes.title}>{getTabURL(tab)}</Typography>
              <Typography variant="subtitle1">{t('profile.wantToConnect')}</Typography>
            </div>
          )}
          <Checkbox
            checked={selectAllWallets}
            handleChange={handleSelectAll}
            label="Select all"
          />
          <div className={classes.walletsContainer}>
            {wallets.map((wallet) => (
              <div
                key={wallet.walletNumber}
                className={clsx(classes.flex, classes.walletContainer)}
              >
                <div className={classes.flex}>
                  <Checkbox
                    className={classes.checkbox}
                    checked={walletsToUpdate[wallet.walletNumber]}
                    handleChange={onCheckWallet(wallet.walletNumber)}
                  />
                  <UserIcon size="small" icon={wallet.icon} style={{ marginLeft: -6, marginRight: 12 }} />
                  <Typography variant="h6">{wallet.name}</Typography>
                </div>
                <Typography variant="h4">{shortAddress(wallet.principal)}</Typography>
              </div>
            ))}
          </div>

        </div>
        )}
      button={t('common.allow')}
      buttonVariant="rainbow"
      onClick={onConfirm}
      onClose={onClose}
    />
  );
};

ConnectAccountsModal.propTypes = {
  wallets: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectedWallet: PropTypes.arrayOf(PropTypes.object).isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  executeAccountSwitch: PropTypes.func.isRequired,
};

export default ConnectAccountsModal;
