import React from 'react';
import PropTypes from 'prop-types';
import MenuList from '@material-ui/core/MenuList';
import DialogTitle from '@material-ui/core/DialogTitle';
import MuiDialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import MenuItem from '../MenuItem';
import useStyles from './styles';

const Dialog = ({
  title, items, onClose, selectedValue, open,
}) => {
  const classes = useStyles();

  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleItemClick = (value) => {
    onClose(value);
  };

  return (
    <MuiDialog
      onClose={handleClose}
      open={open}
      PaperProps={{ className: classes.paper }}
    >
      <DialogTitle disableTypography>
        <span className={classes.title}>{title}</span>
        <IconButton className={classes.closeButton} onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <MenuList>
        {items.map((item, index) => (
          <MenuItem
            name={item.name}
            image={item.image}
            onClick={() => handleItemClick(item)}
            border={index !== items.length - 1}
            big
          />
        ))}
      </MenuList>
    </MuiDialog>
  );
};

export default Dialog;

Dialog.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
  })).isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.string.isRequired,
};
