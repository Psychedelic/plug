/* eslint-disable max-len */
import React, { useState, useEffect } from 'react';
import MenuList from '@material-ui/core/MenuList';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import { HANDLER_TYPES, sendMessage } from '@background/Keyring';
import { Typography } from '@material-ui/core';
import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import extensionizer from 'extensionizer';

import Plus from '@assets/icons/plus.svg';
import LinkEmoji from '@assets/icons/link-emoji.png';

import {
  setAccountInfo,
  setAssets,
  setAssetsLoading,
  setTransactions,
} from '@redux/wallet';
import { getRandomEmoji } from '@shared/constants/emojis';
import { getTabURL } from '@shared/utils/chrome-tabs';
import { getWalletsConnectedToUrl, getApp } from '@modules/storageManager';
import { setEditAccount } from '@redux/profile';
import { setICNSData } from '@redux/icns';
import { useICPPrice } from '@redux/icp';
import { getContacts } from '@redux/contacts';
import { useMenuItems } from '@hooks';
import { Dialog, Button as CButton } from '@components';
import ConnectAccountsModal from '../ConnectAccountsModal';
import HoverAnimation from '../HoverAnimation';
import MenuItem from '../MenuItem';
import FormItem from '../FormItem';
import TextInput from '../TextInput';
import LinkButton from '../LinkButton';
import { TABS, useRouter } from '../Router';
import ActionDialog from '../ActionDialog';
import { AccountItem } from './components';
import UserIcon from '../UserIcon';
import useStyles from './styles';

const IMPORT_WALLET_ENABLED = process.env.TARGET_BROWSER !== 'firefox';

const Profile = ({ disableProfile }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { navigator } = disableProfile ? {} : useRouter();
  const [isEditing, setIsEditing] = useState(false);

  const { walletId } = useSelector((state) => state.wallet);
  const icpPrice = useICPPrice();

  const [open, setOpen] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [app, setApp] = useState(null);
  const [tab, setTab] = useState(null);

  const [openCreateAccount, setOpenCreateAccount] = useState(false);
  const [openConnectAccount, setOpenConnectAccount] = useState(false);
  const [accountName, setAccountName] = useState('');
  const [error, setError] = useState(null);
  const [connectedWallets, setConnectedWallets] = useState([]);
  const [selectedRemoveAccount, setSelectedRemovedAccount] = useState(null);
  const [openRemoveModal, setOpenRemoveModal] = useState(false);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const menuItems = disableProfile ? [] : useMenuItems(handleToggle);

  useEffect(() => {
    sendMessage({ type: HANDLER_TYPES.GET_STATE, params: {} },
      (state) => {
        const walletsArray = Object.values(state?.wallets);
        if (walletsArray?.length) {
          setAccounts(walletsArray);
        }
      });
  }, [open]);

  const handleChangeAccountName = (e) => {
    const name = e.target.value;
    if (name.length > 24) {
      setError(t('profile.accountNameTooLong'));
    } else {
      setAccountName(e.target.value);
    }
  };

  const handleEditAccount = (e, account) => {
    e.stopPropagation();
    dispatch(setEditAccount(account));
    setOpen(false);
    navigator.navigate('wallet-details');
  };

  const handleCreateAccount = () => {
    sendMessage({
      type: HANDLER_TYPES.CREATE_PRINCIPAL,
      params: { name: accountName, icon: getRandomEmoji() },
    },
    (newWallet) => {
      if (newWallet) {
        setAccounts([...accounts, newWallet]);
      }
      setAccountName('');
      setOpenCreateAccount(false);
    });
  };

  const toggleEditAccounts = () => {
    setIsEditing(!isEditing);
  };

  const executeAccountSwitch = (wallet) => {
    sendMessage({ type: HANDLER_TYPES.SET_CURRENT_PRINCIPAL, params: wallet },
      (state) => {
        const walletsArray = Object.values(state?.wallets);
        if (walletsArray.length) {
          const newWallet = state.wallets[state.currentWalletId];
          dispatch(setAccountInfo(newWallet));
          dispatch(getContacts());
          dispatch(setICNSData(newWallet.icnsData));
          dispatch(setAssetsLoading(true));
          dispatch(setTransactions([]));
          sendMessage({
            type: HANDLER_TYPES.GET_ICNS_DATA,
            params: { refresh: true },
          }, (icnsData) => {
            dispatch(setICNSData(icnsData));
          });
          sendMessage({
            type: HANDLER_TYPES.GET_ASSETS,
            params: { refresh: true },
          }, (keyringAssets) => {
            dispatch(setAssets({ keyringAssets, icpPrice }));
            dispatch(setAssetsLoading(false));
          });
          setOpen(false);
          navigator.navigate('home', TABS.TOKENS);
        }
        // Clear selected wallet for all flows
        setSelectedWallet(null);
      });
  };

  const handleChangeAccount = (e, wallet) => {
    e.stopPropagation();
    setSelectedWallet(wallet);
    extensionizer.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
      const url = getTabURL(tabs?.[0]);
      const ids = accounts.map((account) => account.walletId);
      setTab(tabs?.[0]);
      // Check if new wallet is connected to the current page
      getWalletsConnectedToUrl(url, ids, async (wallets = []) => {
        const currentConnected = wallets.includes(walletId);
        const newConnected = wallets.includes(wallet);

        setConnectedWallets(wallets);
        getApp(walletId, url, (currentApp) => {
          setApp(currentApp);
          // If current was connected but new one isnt, prompt modal
          if (currentConnected && !newConnected) {
            setOpenConnectAccount(true);
          } else {
            executeAccountSwitch(wallet);
          }
        });
      });
    });
  };

  const handleOpenCreateAccount = () => {
    handleToggle();
    setOpenCreateAccount(true);
  };

  const handleDeclineConnect = () => {
    executeAccountSwitch(selectedWallet);
    setOpenConnectAccount(false);
    setSelectedWallet(null);
  };

  const handleOpenImportWallet = () => {
    navigator.navigate('import-wallet');
  };

  const handleRemoveAccountModal = (e, account) => {
    e.stopPropagation();
    setOpenRemoveModal(true);
    setSelectedRemovedAccount(account);
  };

  const handleRemoveAccount = () => {
    sendMessage({
      type: HANDLER_TYPES.REMOVE_PEM_ACCOUNT,
      params: selectedRemoveAccount.walletId,
    }, () => executeAccountSwitch(accounts[0].walletId));
    setOpenRemoveModal(false);
    setOpen(false);
  };


  return (
    <>
      <Dialog
        title="Remove Account"
        onClose={() => setOpenRemoveModal(false)}
        open={openRemoveModal}
        component={(
          <div className={classes.removeAccountDialog}>
            <Typography>
              Are you sure you want to remove <b>{selectedRemoveAccount?.name}</b> from your account list?
            </Typography>
            <Typography>
              You can always add the wallet back by importing it again.
            </Typography>
            <CButton variant="danger" value="Remove Account" onClick={handleRemoveAccount} style={{ marginTop: 22 }} />
          </div>
        )}
      />
      <HoverAnimation
        disabled={disableProfile}
        style={{ padding: '15px' }}
      >
        <Button
          onClick={handleToggle}
          className={classes.button}
          classes={{
            label: classes.label,
          }}
          disabled={disableProfile}
          data-testid="profile-button"
        >
          <UserIcon />
        </Button>
      </HoverAnimation>

      <ActionDialog
        open={openCreateAccount}
        title={t('settings.createAccountTitle')}
        content={(
          <div>
            <FormItem
              label={t('common.name')}
              smallLabel
              component={(
                <TextInput
                  fullWidth
                  value={accountName}
                  onChange={handleChangeAccountName}
                  type="text"
                  className={classes.createAccountInput}
                  error={!!error}
                  data-testid="create-account-name-input"
                />
              )}
            />
            {error && <span className={classes.errorMessage}>{error}</span>}
          </div>
        )}
        confirmText={t('common.create')}
        button={t('common.create')}
        buttonVariant="rainbow"
        onClick={handleCreateAccount}
        onClose={() => setOpenCreateAccount(false)}
        cancelButtonProps={{
          'data-testid': 'create-account-cancel-button',
        }}
        submitButtonProps={{
          'data-testid': 'create-account-submit-button',
        }}
      />
      <ConnectAccountsModal
        open={openConnectAccount}
        onClose={handleDeclineConnect}
        onConfirm={() => executeAccountSwitch(selectedWallet)}
        wallets={accounts}
        connectedWallets={connectedWallets}
        app={app}
        tab={tab}
      />
      {
        !disableProfile
        && (
          <Drawer
            anchor="right"
            open={open}
            onClose={handleToggle}
            classes={{
              root: classes.drawer,
              paper: classes.paper,
            }}
            data-testid="drawer"
          >
            <div className={classes.container}>
              <div className={classes.header}>
                <Typography variant="h5" className={classes.myAccounts}>{t('profile.myAccounts')}</Typography>
                <LinkButton value={t(`common.${isEditing ? 'done' : 'edit'}`)} onClick={toggleEditAccounts} />
              </div>
              <MenuList className={clsx(classes.accountContainer, classes.menu)}>
                {
                  accounts.map((account) => {
                    const isCurrentAccount = account.walletId === walletId;

                    return (
                      <AccountItem
                        account={account}
                        isEditing={isEditing}
                        isCurrentAccount={isCurrentAccount}
                        handleChangeAccount={handleChangeAccount}
                        handleEditAccount={handleEditAccount}
                        handleRemoveAccountModal={handleRemoveAccountModal}
                      />
                    );
                  })
}
              </MenuList>
              <MenuList className={clsx(classes.settingContainer, classes.menu)}>
                <Divider style={{ margin: '6px 0' }} />
                <MenuItem
                  size="small"
                  key="createAccount"
                  name={t('profile.createAccount')}
                  alignLeft
                  logo={Plus}
                  onClick={handleOpenCreateAccount}
                  data-testid="create-account-button"
                />
                { IMPORT_WALLET_ENABLED && (
                  <MenuItem
                    size="small"
                    key="createAccount"
                    name={t('profile.importWallet')}
                    alignLeft
                    logo={LinkEmoji}
                    onClick={handleOpenImportWallet}
                    data-testid="create-account-button"
                  />
                )}
                <Divider style={{ margin: '6px 0' }} />
                {
                  menuItems.map((item) => (
                    <MenuItem
                      size="small"
                      key={item.name}
                      {...item}
                    />
                  ))
                }
              </MenuList>
            </div>
          </Drawer>
        )
      }
    </>
  );
};

export default Profile;

Profile.propTypes = {
  disableProfile: PropTypes.bool.isRequired,
};
