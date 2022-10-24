import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { IconButton } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { useHiddenAccounts, toggleAccountHidden } from '@redux/profile';

import BluePencil from '@assets/icons/blue-pencil.svg';
import InvisibleIcon from '@assets/icons/invisible.svg';
import VisibleIcon from '@assets/icons/visible.svg';
import RemoveCircleOutline from '@material-ui/icons/RemoveCircleOutline';

import UserIcon from '../../../UserIcon';
import useStyles from './styles';

const AccountItem = ({
  account,
  isEditing,
  handleChangeAccount,
  handleEditAccount,
  handleRemoveAccountModal,
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
      className={clsx(
        classes.accountItemContainer,
        isHidden && classes.hiddenAccount,
      )}
      onClick={(e) => handleChangeAccount(e, account.walletId)}
    >
      <div className={classes.leftContainer}>
        <UserIcon
          size="small"
          icon={account?.icon ?? '👽'}
          style={{ marginLeft: -6, marginRight: 12 }}
        />
        <div className={classes.accountDetails}>
          <span
            className={classes.accountName}
            data-testid={`account-name-${account.name}`}
          >
            {account?.icnsData?.reverseResolvedName || account?.name}
          </span>
        </div>
      </div>
      <div className={classes.rightContainer}>
        <IconButton
          data-testid={`edit-button-${account.name}`}
          disabled={isHidden}
          onClick={(e) => handleEditAccount(e, account)}
        >
          <img
            className={clsx(isHidden && classes.disabledIcon)}
            src={BluePencil}
          />
        </IconButton>
        {!(account.type === 'MNEMONIC') && (
        <IconButton onClick={(e) => handleRemoveAccountModal(e, account)}>
          <RemoveCircleOutline style={{ color: '#DC2626' }} />
        </IconButton>
        )}
        {isEditing && (
        <IconButton
          onClick={(e) => {
            toggleAccountVisibility(e, account.walletId);
          }}
        >
          <img src={isHidden ? InvisibleIcon : VisibleIcon} />
        </IconButton>
        )}
      </div>
    </div>
  );
};

AccountItem.propTypes = {
  account: PropTypes.shape({
    name: PropTypes.string,
    walletId: PropTypes.string,
    icon: PropTypes.string,
    type: PropTypes.string,
    icnsData: PropTypes.shape({
      reverseResolvedName: PropTypes.string,
      names: PropTypes.arrayOf(PropTypes.string),
    }),
  }).isRequired,
  isEditing: PropTypes.bool.isRequired,
  handleChangeAccount: PropTypes.func.isRequired,
  handleRemoveAccountModal: PropTypes.func.isRequired,
  handleEditAccount: PropTypes.func.isRequired,
};

export default AccountItem;
