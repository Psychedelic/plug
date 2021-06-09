import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import shortAddress from '@shared/utils/short-address';
import { faTrashAlt } from '@fortawesome/pro-regular-svg-icons/faTrashAlt';
import { Typography } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/pro-regular-svg-icons/faTimes';
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
      <img src={contact.image} className={classes.image} />
      <div className={classes.nameContainer}>
        <Typography variant="h5">{contact.name}</Typography>
        <Typography variant="subtitle1">{shortAddress(contact.id)}</Typography>
      </div>
      {
        handleDelete
        && (
          <>
            <CopyButton text={contact.id} placement="left" style={{ marginLeft: 'auto' }} />
            <FontAwesomeIcon
              icon={faTrashAlt}
              className={clsx(classes.icon, classes.deleteIcon)}
              onClick={() => handleDelete()}
            />
          </>
        )
      }
      {
        handleCancel
        && (
          <FontAwesomeIcon
            icon={faTimes}
            className={clsx(classes.icon, classes.cancelIcon)}
            onClick={() => handleCancel()}
          />
        )
      }
    </div>
  );
};

ContactItem.propTypes = {
  contact: PropTypes.objectOf(PropTypes.object).isRequired,
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
