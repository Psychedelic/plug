import React, { useState } from 'react';
import clsx from 'clsx';
import { IconButton, Typography } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { useHiddenAccounts, toggleAccountHidden } from '@redux/profile';

import BluePencil from '@assets/icons/blue-pencil.svg';
import InvisibleIcon from '@assets/icons/invisible.svg';
import SwitchAccount from '@assets/icons/switch-account.svg';
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
}) => {
  const classes = useStyles();
  const hiddenAccounts = useHiddenAccounts();
  const dispatch = useDispatch();

  const isHidden = hiddenAccounts.includes(account.walletNumber);

  const [openModal, setOpenModal] = useState(true);

  const toggleAccountVisibility = (account) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleAccountHidden(account));
  };

  if (isHidden && !isEditing) return null;

  return (
    <>
      <div
        className={clsx(classes.accountItemContainer, isHidden && classes.hiddenAccount)}
        itemNameTestId="account-name"
        onClick={handleEditAccount(account)}
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
            disabled={isCurrentAccount || isHidden}
            onClick={handleChangeAccount(account.walletNumber)}
          >
            <img
              className={clsx((isCurrentAccount || isHidden) && classes.disabledIcon)}
              src={SwitchAccount}
            />
          </IconButton>
          <IconButton onClick={() => setOpenModal(!openModal)}>
            <MoreHoriz style={{ color: '#3574F4' }} />
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
      <div>
        {
          openModal && (
            <div className={classes.selectorContainer}>
              <div className={classes.selector}>
                <img
                  src={BluePencil}
                />
                <Typography variant="h7" style={{ fontWeight: 500, fontSize: 16 }}>
                  Edit
                </Typography>
              </div>
              <div className={classes.selector}>
                <RemoveCircleOutline style={{ color: '#DC2626' }} />
                <Typography variant="h7" style={{ fontWeight: 500, fontSize: 16 }}>
                  Remove
                </Typography>
              </div>
            </div>
          )
        }
      </div>
    </>
  );
};

export default AccountItem;
