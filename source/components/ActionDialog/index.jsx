import React from 'react';
import PropTypes from 'prop-types';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { Button } from '@ui';
import useStyles from './styles';

const ActionDialog = ({
  title, content, button, buttonVariant, onClick, onClose, open,
}) => {
  const classes = useStyles();

  return (
    <Dialog
      onClose={onClose}
      open={open}
      PaperProps={{ className: classes.paper }}
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
          <Button variant="default" value="Cancel" onClick={onClose} style={{ width: '48%' }} />
          <Button variant={buttonVariant} value={button} onClick={onClick} style={{ width: '48%' }} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ActionDialog;

ActionDialog.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.node.isRequired,
  button: PropTypes.string.isRequired,
  buttonVariant: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};
