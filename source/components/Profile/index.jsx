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
import { useTranslation } from 'react-i18next';
import Plus from '@assets/icons/plus.svg';
import {
  setAccountInfo,
  setAssets,
  setAssetsLoading,
  setCollections,
  setTransactions,
  setTransactionsLoading,
} from '@redux/wallet';
import { useDispatch, useSelector } from 'react-redux';
import BluePencil from '@assets/icons/blue-pencil.svg';
import VisibleIcon from '@assets/icons/visible.svg';
import InvisibleIcon from '@assets/icons/invisible.svg';
import { getRandomEmoji } from '@shared/constants/emojis';
import clsx from 'clsx';
import { useICPPrice } from '@redux/icp';
import { toggleAccountHidden, useHiddenAccounts } from '@redux/profile';
import { TABS, useRouter } from '../Router';
import ActionDialog from '../ActionDialog';
import useMenuItems from '../../hooks/useMenuItems';
import useStyles from './styles';
import UserIcon from '../UserIcon';
import { setICNSData } from '../../redux/icns';

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

  const [openCreateAccount, setOpenCreateAccount] = useState(false);
  const [accountName, setAccountName] = useState('');

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
    setAccountName(e.target.value);
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
    (wallet) => {
      if (wallet) {
        setAccounts([...accounts, wallet]);
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

  const handleChangeAccount = (wallet) => () => {
    dispatch(setCollections({ collections: [], principalId }));
    sendMessage({ type: HANDLER_TYPES.SET_CURRENT_PRINCIPAL, params: wallet },
      (state) => {
        if (state?.wallets?.length) {
          const newWallet = state.wallets[state.currentWalletId];
          dispatch(setAccountInfo(newWallet));
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
      });
  };

  const handleOpenCreateAccount = () => {
    handleToggle();
    setOpenCreateAccount(true);
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
        >
          <UserIcon />
        </Button>
      </HoverAnimation>

      <ActionDialog
        open={openCreateAccount}
        title={t('settings.createAccountTitle')}
        content={(
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
              />
            )}
          />
        )}
        button={t('common.create')}
        buttonVariant="rainbow"
        onClick={handleCreateAccount}
        onClose={() => setOpenCreateAccount(false)}
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
                />
                <Divider style={{ margin: '6px 0' }} />
                {
                  menuItems.map((item) => (
                    <MenuItem
                      size="small"
                      key={item.name}
                      name={item.name}
                      image={item.image}
                      alignLeft={item.alignLeft}
                      onClick={() => item.onClick()}
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
