import React from 'react';
import clsx from 'clsx';
import { IconButton } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { useHiddenAccounts, toggleAccountHidden } from '@redux/profile';

import BluePencil from '@assets/icons/blue-pencil.svg';
import InvisibleIcon from '@assets/icons/invisible.svg';
import SwitchAccount from '@assets/icons/switch-account.svg';
import VisibleIcon from '@assets/icons/visible.svg';

import UserIcon from '../../../UserIcon';
import useStyles from './styles';

/*
  <MenuItem
    size="small"
    key={account.walletNumber}
    name={account.name}
    icon={(
      <UserIcon
        size="small"
        icon={account.icon ? account.icon : '👽'}
        style={{ marginLeft: -6, marginRight: 12 }}
      />
    )}
    onClick={!isHidden && handleChangeAccount(account.walletNumber)}
    selected={isExactWalletNumber}
    className={clsx(isHidden && classes.hiddenAccount)}
    itemNameTestId="account-name"
    endIcon={isExactWalletNumber ? (
      <IconButton data-testid={`edit-button-${account.name}`} onClick={handleEditAccount}>
        <img src={BluePencil} />
      </IconButton>
    ) : isEditing ? (
      <IconButton
        data-testid={`visibility-button-${account.name}`}
        onClick={toggleAccountVisibility(account.walletNumber)}
      >
        <img src={isHidden ? InvisibleIcon : VisibleIcon} />
      </IconButton>
    ) : null}
  />
*/

const AccountItem = ({
  account,
  isCurrentAccount,
  isEditing,
  handleChangeAccount,
  handleEditAccount
}) => {
  const classes = useStyles();
  const hiddenAccounts = useHiddenAccounts();
  const dispatch = useDispatch();

  const isHidden = hiddenAccounts.includes(account.walletNumber);

  const toggleAccountVisibility = (account) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleAccountHidden(account));
  };

  if (isHidden && !isEditing) return null;

  return (
    <div
      className={clsx(classes.accountItemContainer, isHidden && classes.hiddenAccount)}
      itemNameTestId="account-name"
    >
      <div className={classes.leftContainer}>
        <UserIcon
          size="small"
          icon={account.icon ? account.icon : '👽'}
          style={{ marginLeft: -6, marginRight: 12 }}
        />
        <div
          className={classes.accountDetails}
        >
          <span className={classes.accountName}>
            {account.name}
          </span>
          <span className={classes.accountType}>
            Placeholder
          </span>
        </div>
      </div>
      <div className={classes.rightContainer}>
        <IconButton
          disabled={isCurrentAccount || isHidden}
          onClick={handleChangeAccount(account.walletNumber)}
        > 
          <img
            className={clsx((isCurrentAccount || isHidden) && classes.disabledIcon)}
            src={SwitchAccount}
          />
        </IconButton>
        <IconButton
          disabled={isHidden}
          onClick={handleEditAccount(account)}
        > 
          <img
            className={clsx(isHidden && classes.disabledIcon)}
            src={BluePencil}
          />
        </IconButton>
        { isEditing && (
          <IconButton
            onClick={toggleAccountVisibility(account.walletNumber)}
          > 
            <img src={isHidden ? InvisibleIcon : VisibleIcon} />
          </IconButton>
        )}
      </div>
    </div>
  );
};

export default AccountItem;
