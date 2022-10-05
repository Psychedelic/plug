import React, { useState } from 'react';
import clsx from 'clsx';
import { IconButton, Typography } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { useHiddenAccounts, toggleAccountHidden } from '@redux/profile';

import BluePencil from '@assets/icons/blue-pencil.svg';
import InvisibleIcon from '@assets/icons/invisible.svg';
import VisibleIcon from '@assets/icons/visible.svg';
import MoreHoriz from '@material-ui/icons/MoreHoriz';
import RemoveCircleOutline from '@material-ui/icons/RemoveCircleOutline';

// import ActionDialog from '../../../ActionDialog';
import UserIcon from '../../../UserIcon';
import useStyles from './styles';

const AccountItem = ({
  account,
  isCurrentAccount,
  isEditing,
  handleChangeAccount,
  handleEditAccount,
  walletNumber,
}) => {
  const classes = useStyles();
  const hiddenAccounts = useHiddenAccounts();
  const dispatch = useDispatch();

  const isHidden = hiddenAccounts.includes(account.walletId);

  const isPrincipalAccount = walletNumber === 0;

  const [openModal, setOpenModal] = useState(false);

  const toggleAccountVisibility = (account) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleAccountHidden(walletId));
  };

  if (isHidden && !isEditing) return null;

  return (
    <>
      <div
        className={clsx(classes.accountItemContainer, isHidden && classes.hiddenAccount)}
        itemNameTestId="account-name"
        onClick={handleChangeAccount(account.walletNumber)}
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
              {account.icnsData.reverseResolvedName ? account.icnsData.reverseResolvedName : account.name}
            </span>
          </div>
        </div>
        <div className={classes.rightContainer}>
          <IconButton
            onClick={handleEditAccount(account)}
          >
            <img
              src={BluePencil}
            />
          </IconButton>
          <IconButton disabled={isPrincipalAccount} onClick={() => setOpenModal(!openModal)}>
            <RemoveCircleOutline style={{ color: '#DC2626' }} />
          </IconButton>
          {isEditing && (
            <IconButton
              onClick={toggleAccountVisibility(account.walletNumber)}
            >
              <img src={isHidden ? InvisibleIcon : VisibleIcon} />
            </IconButton>
          )}
        </div>
      </div>
    </>
  );
};

export default AccountItem;
