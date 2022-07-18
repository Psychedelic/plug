import React, { useState, useEffect } from 'react';
import MenuList from '@material-ui/core/MenuList';
import Button from '@material-ui/core/Button';
import {
  HoverAnimation, MenuItem, FormItem, TextInput, LinkButton,
} from '@ui';
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
import {
  setAccountInfo,
  setAssets,
  setAssetsLoading,
  setCollections,
  setTransactions,
  setTransactionsLoading,
} from '@redux/wallet';
import BluePencil from '@assets/icons/blue-pencil.svg';
import VisibleIcon from '@assets/icons/visible.svg';
import InvisibleIcon from '@assets/icons/invisible.svg';
import { getRandomEmoji } from '@shared/constants/emojis';
import { getTabURL } from '@shared/utils/chrome-tabs';
import { getWalletsConnectedToUrl, getApp } from '@modules/storageManager';
import { toggleAccountHidden, useHiddenAccounts } from '@redux/profile';
import { setICNSData } from '@redux/icns';
import { useICPPrice } from '@redux/icp';
import { ConnectAccountsModal } from '@components';
import { useMenuItems, useContacts } from '@hooks';

import { TABS, useRouter } from '../Router';
import ActionDialog from '../ActionDialog';
import UserIcon from '../UserIcon';
import useStyles from './styles';

const Profile = ({ disableProfile }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { navigator } = disableProfile ? {} : useRouter();
  const [isEditing, setIsEditing] = useState(false);

  const { walletNumber, principalId } = useSelector((state) => state.wallet);
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
  const { getContacts } = useContacts();

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const menuItems = disableProfile ? [] : useMenuItems(handleToggle);

  const hiddenAccounts = useHiddenAccounts();

  useEffect(() => {
    sendMessage({ type: HANDLER_TYPES.GET_STATE, params: {} },
      (state) => {
        if (state?.wallets?.length) {
          setAccounts(state.wallets);
        }
      });
  }, []);

  const handleChangeAccountName = (e) => {
    const name = e.target.value;
    if (name.length > 24) {
      setError(t('profile.accountNameTooLong'));
    } else {
      setAccountName(e.target.value);
    }
  };

  const handleEditAccount = (e) => {
    e.preventDefault();
    e.stopPropagation();
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

  const toggleAccountVisibility = (account) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleAccountHidden(account));
  };

  const executeAccountSwitch = (wallet) => {
    dispatch(setCollections({ collections: [], principalId }));
    sendMessage({ type: HANDLER_TYPES.SET_CURRENT_PRINCIPAL, params: wallet },
      (state) => {
        if (state?.wallets?.length) {
          const newWallet = state.wallets[state.currentWalletId];
          dispatch(setAccountInfo(newWallet));
          getContacts();
          dispatch(setICNSData(newWallet.icnsData));
          dispatch(setAssetsLoading(true));
          dispatch(setTransactions([]));
          dispatch(setTransactionsLoading(true));
          sendMessage({
            type: HANDLER_TYPES.GET_ICNS_DATA,
            params: { refresh: true },
          }, (icnsData) => {
            dispatch(setICNSData(icnsData));
          });
          sendMessage({
            type: HANDLER_TYPES.GET_ASSETS,
            params: {},
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

  const handleChangeAccount = (wallet) => () => {
    setSelectedWallet(wallet);
    extensionizer.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
      const url = getTabURL(tabs?.[0]);
      const ids = accounts.map((_, idx) => idx);
      setTab(tabs?.[0]);
      // Check if new wallet is connected to the current page
      getWalletsConnectedToUrl(url, ids, async (wallets = []) => {
        const currentConnected = wallets.includes(walletNumber);
        const newConnected = wallets.includes(wallet);

        setConnectedWallets(wallets);
        getApp(walletNumber.toString(), url, (currentApp) => {
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

  return (
    <>
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
                    const isHidden = hiddenAccounts.includes(account.walletNumber);
                    return (!isHidden || isEditing) && (
                      <MenuItem
                        size="small"
                        key={account.walletNumber}
                        name={account.name}
                        icon={<UserIcon size="small" icon={account.icon} style={{ marginLeft: -6, marginRight: 12 }} />}
                        onClick={!isHidden && handleChangeAccount(account.walletNumber)}
                        selected={account.walletNumber === walletNumber}
                        className={clsx(isHidden && classes.hiddenAccount)}
                        endIcon={account.walletNumber === walletNumber ? (
                          <img
                            src={BluePencil}
                            onClick={handleEditAccount}
                          />
                        ) : isEditing && (
                        <img
                          src={isHidden ? InvisibleIcon : VisibleIcon}
                          onClick={toggleAccountVisibility(account.walletNumber)}
                        />
                        )}
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
                  image={Plus}
                  onClick={handleOpenCreateAccount}
                  data-testid="create-account-button"
                />
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
