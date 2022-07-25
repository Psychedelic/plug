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
  title,
  items,
  onClose,
  selectedValue,
  open,
  component,
  closeable,
  titleTestId,
  menuItemTestId,
  closeIconButtonTestId,
  ...rest
}) => {
  const classes = useStyles();

  const handleClose = () => {
    if (!closeable) return;
    if (selectedValue) {
      onClose?.(selectedValue);
    } else {
      onClose?.();
    }
  };

  const handleItemClick = (value) => {
    onClose?.(value);
  };

  return (
    <MuiDialog
      onClose={handleClose}
      open={open}
      PaperProps={{ className: classes.paper }}
      {...rest}
    >
      {title && (
        <DialogTitle disableTypography>
          <span className={classes.title} data-testid={titleTestId}>
            {title}
          </span>
          <IconButton className={classes.closeButton} onClick={handleClose}>
            <CloseIcon data-testid={closeIconButtonTestId} />
          </IconButton>
        </DialogTitle>
      )}
      <MenuList className={classes.root}>
        {items && items.length > 0
          ? items.map((item, index) => (
            <MenuItem
              key={`${index.toString()}-${item.name}`}
              onClick={() => handleItemClick(item)}
              border={index !== items.length - 1}
              size="medium"
              {...item}
              data-testid={`${menuItemTestId}-${item.name}`}
            />
          ))
          : component}
      </MenuList>
    </MuiDialog>
  );
};

export default Dialog;

Dialog.defaultProps = {
  component: null,
  selectedValue: null,
  closeable: true,
  titleTestId: 'dialog-title',
  menuItemTestId: 'dialog-menu-item',
  closeIconButtonTestId: 'close-icon-button',
};

Dialog.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
    }),
  ).isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.objectOf(PropTypes.string),
  component: PropTypes.node,
  closeable: PropTypes.bool,
  titleTestId: PropTypes.string,
  menuItemTestId: PropTypes.string,
  closeIconButtonTestId: PropTypes.string,
};
