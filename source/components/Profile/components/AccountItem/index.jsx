import React from 'react';
import clsx from 'clsx';
import { IconButton } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { useHiddenAccounts, toggleAccountHidden } from '@redux/profile';

import BluePencil from '@assets/icons/blue-pencil.svg';
import InvisibleIcon from '@assets/icons/invisible.svg';
import VisibleIcon from '@assets/icons/visible.svg';

import UserIcon from '../../../UserIcon';
import useStyles from './styles';

const AccountItem = ({
  account,
  isCurrentAccount,
  isEditing,
  handleChangeAccount,
  handleEditAccount,
}) => {
  const classes = useStyles();
  const hiddenAccounts = useHiddenAccounts();
  const dispatch = useDispatch();

  const isHidden = hiddenAccounts.includes(account.walletId);

  const toggleAccountVisibility = (e, walletId) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleAccountHidden(walletId));
  };

  if (isHidden && !isEditing) return null;

  return (
    <div
      className={clsx(classes.accountItemContainer, isHidden && classes.hiddenAccount)}
      itemNameTestId="account-name"
      onClick={(e) => handleChangeAccount(e, account.walletId)}
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
            {account.icnsData.reverseResolvedName ? account.icnsData.reverseResolvedName : account.name }
          </span>
        </div>
      </div>
      <div className={classes.rightContainer}>
        <IconButton
          disabled={isHidden}
          onClick={(e) => handleEditAccount(e, account)}
        >
          <img
            className={clsx(isHidden && classes.disabledIcon)}
            src={BluePencil}
          />
        </IconButton>
        { isEditing && (
          <IconButton
            onClick={(e) => { toggleAccountVisibility(e, account.walletId) }}
          >
            <img src={isHidden ? InvisibleIcon : VisibleIcon} />
          </IconButton>
        )}
      </div>
    </div>
  );
};

export default AccountItem;
