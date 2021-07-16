import React, { useState, useRef } from 'react';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import MenuList from '@material-ui/core/MenuList';
import Button from '@material-ui/core/Button';
import { HoverAnimation, MenuItem } from '@ui';
import PropTypes from 'prop-types';
import UserIcon from '../UserIcon';
import useStyles from './styles';
import useMenuItems from '../../hooks/useMenuItems';

const Profile = ({ disableProfile }) => {
  const classes = useStyles();

  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);

  const menuItems = disableProfile ? [] : useMenuItems();

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  return (
    <>
      <HoverAnimation
        disabled={disableProfile}
      >
        <Button
          ref={anchorRef}
          onClick={handleToggle}
          className={classes.button}
          classes={{
            label: classes.label,
          }}
          disabled={disableProfile}
        >
          <UserIcon />
        </Button>
      </HoverAnimation>

      <Popper
        className={classes.menu}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        placement="bottom-end"
      >
        {({ TransitionProps }) => (
          <Grow {...TransitionProps}>
            <Paper className={classes.paper}>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList className={classes.menu}>
                  {
                    menuItems.map((item) => (
                      <MenuItem
                        size="small"
                        key={item.name}
                        name={item.name}
                        image={item.image}
                        alignLeft={item.alignLeft}
                        onClick={(e) => { item.onClick(); handleClose(e); }}
                      />
                    ))
                  }
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
};

export default Profile;

Profile.propTypes = {
  disableProfile: PropTypes.bool.isRequired,
};
