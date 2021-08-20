import React, { useState, useEffect } from 'react';
import MenuList from '@material-ui/core/MenuList';
import Button from '@material-ui/core/Button';
import {
  HoverAnimation, MenuItem, FormItem, TextInput,
} from '@ui';
import PropTypes from 'prop-types';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import { HANDLER_TYPES, sendMessage } from '@background/Keyring';
import { Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import Plus from '@assets/icons/plus.svg';
import { setAccountInfo, setAssets, setAssetsLoading } from '@redux/wallet';
import { useDispatch, useSelector } from 'react-redux';
import BluePencil from '@assets/icons/blue-pencil.svg';
import { getRandomEmoji } from '@shared/constants/emojis';
import clsx from 'clsx';
import { useRouter } from '../Router';
import ActionDialog from '../ActionDialog';
import useMenuItems from '../../hooks/useMenuItems';
import useStyles from './styles';
import UserIcon from '../UserIcon';

const Profile = ({ disableProfile }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { navigator } = disableProfile ? {} : useRouter();
  const { icpPrice } = useSelector((state) => state.icp);

  const { walletNumber } = useSelector((state) => state.wallet);

  const [open, setOpen] = useState(false);
  const [accounts, setAccounts] = useState([]);

  const [openCreateAccount, setOpenCreateAccount] = useState(false);
  const [accountName, setAccountName] = useState('');

  const menuItems = disableProfile ? [] : useMenuItems();

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

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

  const handleChangeAccount = (wallet) => () => {
    sendMessage({ type: HANDLER_TYPES.SET_CURRENT_PRINCIPAL, params: wallet },
      (state) => {
        if (state?.wallets?.length) {
          dispatch(setAccountInfo(state.wallets[state.currentWalletId]));
          dispatch(setAssetsLoading(true));
          sendMessage({
            type: HANDLER_TYPES.GET_ASSETS,
            params: icpPrice,
          }, (keyringAssets) => {
            dispatch(setAssets(keyringAssets));
            dispatch(setAssetsLoading(false));
          });
          setOpen(false);
          navigator.navigate('home');
        }
      });
  };

  return (
    <>
      <HoverAnimation
        disabled={disableProfile}
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
              <Typography variant="h5" className={classes.myAccounts}>My Accounts</Typography>
              <MenuList className={clsx(classes.accountContainer, classes.menu)}>
                {
                  accounts.map((account) => (
                    <MenuItem
                      size="small"
                      key={account.walletNumber}
                      name={account.name}
                      icon={<UserIcon size="small" icon={account.icon || '👽'} style={{ marginLeft: -6, marginRight: 12 }} />}
                      onClick={handleChangeAccount(account.walletNumber)}
                      selected={account.walletNumber === walletNumber}
                      endIcon={(
                        <img
                          src={BluePencil}
                          onClick={handleEditAccount}
                        />
                      )}
                    />
                  ))
                }
              </MenuList>
              <MenuList className={clsx(classes.settingContainer, classes.menu)}>
                <Divider style={{ margin: '6px 0' }} />
                <MenuItem
                  size="small"
                  key="createAccount"
                  name="Create Account"
                  alignLeft
                  image={Plus}
                  onClick={() => setOpenCreateAccount(true)}
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
