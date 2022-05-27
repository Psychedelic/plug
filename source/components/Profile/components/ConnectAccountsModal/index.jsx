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
import { useScroll } from '@hooks';

import UserIcon from '../../../UserIcon';
import useStyles from './styles';

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
  const { onScroll, fullScroll } = useScroll();

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

  console.log('wallets to update', walletsToUpdate);
  console.log('connectedWallets', connectedWallets);
  return (
    <ActionDialog
      open={open}
      title={t('profile.subaccountNotConnected')}
      className={classes.modalContainer}
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
          <div
            className={
              clsx(
                classes.walletsContainer,
                wallets?.length > 3 && !fullScroll && classes.scrollShadow,
              )
}
            onScroll={onScroll}
          >
            {wallets.map((wallet) => {
              const alreadyConnected = connectedWallets.includes(wallet.walletNumber);
              return (
                <div
                  key={wallet.walletNumber}
                  className={clsx(
                    classes.flex,
                    classes.walletContainer,
                    alreadyConnected && classes.walletConnected,
                  )}
                >
                  <div className={classes.flex}>
                    <Checkbox
                      className={classes.checkbox}
                      checked={
                        !!walletsToUpdate[wallet.walletNumber]
                        || alreadyConnected
                      }
                      handleChange={!alreadyConnected && onCheckWallet(wallet.walletNumber)}
                    />
                    <UserIcon size="small" icon={wallet.icon} style={{ marginLeft: -6, marginRight: 12 }} />
                    <Typography variant="h6" className={classes.walletName}>{wallet.name}</Typography>
                  </div>
                  <Typography variant="h6">{shortAddress(wallet.principal)}</Typography>
                </div>
              );
            })}
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
