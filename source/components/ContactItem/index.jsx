import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import shortAddress from '@shared/utils/short-address';
import { faTrashAlt } from '@fortawesome/pro-regular-svg-icons/faTrashAlt';
import { Typography } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClone } from '@fortawesome/pro-regular-svg-icons/faClone';
import { faTimes } from '@fortawesome/pro-regular-svg-icons/faTimes';
import { useTranslation } from 'react-i18next';
import Tooltip from '@material-ui/core/Tooltip';
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
          <CopyButton text={contact.id} />
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

const CopyButton = ({ text }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const [copied, setCopied] = useState(false);

  const copyText = t('copy.copyText');
  const copiedText = t('copy.copiedText');

  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipText, setTooltipText] = useState(copyText);

  const handleCopy = (address) => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTooltipText(copiedText);

    setTimeout(() => {
      setCopied(false);
    }, 2500);

    setTimeout(() => {
      setTooltipText(copyText);
    }, 3000);
  };

  return (
    <Tooltip
      title={tooltipText}
      arrow
      open={showTooltip || copied}
      placement="left"
    >
      <div
        className={classes.copyIcon}
        onClick={() => handleCopy(text)}
        onMouseOver={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <FontAwesomeIcon
          icon={faClone}
          className={classes.icon}
        />
      </div>
    </Tooltip>
  );
};

CopyButton.propTypes = {
  text: PropTypes.string.isRequired,
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
