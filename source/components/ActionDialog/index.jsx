import React from 'react';
import PropTypes from 'prop-types';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import clsx from 'clsx';

import Button from '../Button';
import useStyles from './styles';

const ActionDialog = ({
  title,
  content,
  confirmText,
  cancelText,
  buttonVariant,
  onClick,
  onClose,
  open,
  className,
  cancelButtonProps,
  submitButtonProps,
}) => {
  const classes = useStyles();

  return (
    <Dialog
      onClose={onClose}
      open={open}
      PaperProps={{ className: clsx(classes.paper, className) }}
    >
      <DialogTitle disableTypography>
        <span className={classes.title}>{title}</span>
        <IconButton className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {content}

        <div className={classes.buttonContainer}>
          <Button
            variant="default"
            value={cancelText}
            onClick={onClose}
            style={{ width: '96%' }}
            fullWidth
            {...cancelButtonProps}
          />
          <Button
            variant={buttonVariant}
            value={confirmText}
            onClick={onClick}
            style={{ width: '96%' }}
            wrapperStyle={{ textAlign: 'right' }}
            fullWidth
            {...submitButtonProps}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ActionDialog;

ActionDialog.defaultProps = {
  cancelButtonProps: {},
  submitButtonProps: {},
};

ActionDialog.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.node.isRequired,
  buttonVariant: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  className: PropTypes.string,
  cancelButtonProps: PropTypes.objectOf(PropTypes.string),
  submitButtonProps: PropTypes.objectOf(PropTypes.string),
};

ActionDialog.defaultProps = {
  className: '',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
};
