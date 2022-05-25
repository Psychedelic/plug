import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import extension from 'extensionizer';
import PropTypes from 'prop-types';

import { ActionDialog } from '@components';
import { getApps, setApps } from '@modules/storageManager';
import { CONNECTION_STATUS } from '@shared/constants/connectionStatus';
import { Checkbox } from '@ui';

const ConnectAccountsModal = ({
  wallets,
  open,
  onClose,
  executeAccountSwitch,
  selectedWallet,
}) => {
  const { t } = useTranslation();
  const [app, setApp] = useState(null);
  const [tab, setTab] = useState(null);
  const [walletsToUpdate, setWalletsToUpdate] = useState({});
  const { walletNumber: currentWalletNumber } = useSelector((state) => state.wallet);

  useEffect(() => {
    extension.tabs.query({ active: true }, (tabs) => {
      setTab(tabs?.[0]);
      getApps(currentWalletNumber.toString(), (apps) => {
        const url = new URL(tabs?.[0]?.url);
        const currentApp = apps[url.host];
        setApp(currentApp);
      });
    });
  }, []);

  const connectAccountToTab = (wallet) => {
    getApps(wallet.walletNumber.toString(), (apps) => {
      // If any other account is connected, create an entry for the current wallet
      const date = new Date().toISOString();
      const url = new URL(tab.url);
      const newApps = {
        ...apps,
        [url.host]: {
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
  return (
    <ActionDialog
      open={open}
      title={t('settings.subaccountNotConnected')}
      content={(
        <div>
          <span>Do you want to connect your accounts?</span>
          {wallets.map((wallet) => (
            <div key={wallet.walletNumber}>
              <Checkbox
                checked={walletsToUpdate[wallet.walletNumber]}
                handleChange={onCheckWallet(wallet.walletNumber)}
                label={wallet.name}
              />
            </div>
          ))}

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
