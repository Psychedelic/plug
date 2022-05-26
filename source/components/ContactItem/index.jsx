import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import shortAddress from '@shared/utils/short-address';
import { Typography } from '@material-ui/core';
import { Trash2, X } from 'react-feather';
import UserIcon from '../UserIcon';
import CopyButton from '../CopyButton';
import useStyles from './styles';

const ContactItem = ({
  contact, handleClick, handleDelete, handleCancel,
}) => {
  const classes = useStyles();
  return (
    <div
      className={clsx(classes.contact,
        handleClick && classes.selectable,
        handleCancel ? classes.cancelable : classes.border)}
      onClick={() => handleClick(contact)}
    >
      <UserIcon icon={contact.image} />
      <div className={classes.nameContainer}>
        <Typography variant="h4">{contact.name}</Typography>
        <Typography variant="subtitle1">{shortAddress(contact.id)}</Typography>
      </div>
      {
        handleDelete
        && (
          <>
            <CopyButton text={contact.id} placement="left" style={{ marginLeft: 'auto' }} />
            <Trash2
              className={clsx(classes.icon, classes.deleteIcon)}
              onClick={() => handleDelete()}
              size="18"
            />
          </>
        )
      }
      {
        handleCancel
        && (
          <X className={clsx(classes.icon, classes.cancelIcon)} onClick={() => handleCancel()} />
        )
      }
    </div>
  );
};

ContactItem.propTypes = {
  contact: PropTypes.object.isRequired,
  handleClick: PropTypes.func,
  handleDelete: PropTypes.func,
  handleCancel: PropTypes.func,
};

ContactItem.defaultProps = {
  handleClick: null,
  handleDelete: null,
  handleCancel: null,
};

export default ContactItem;
