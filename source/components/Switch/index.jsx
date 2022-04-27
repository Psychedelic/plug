import React from 'react';
import MuiSwitch from '@material-ui/core/Switch';

import useStyles from './styles';

const Switch = (props) => {
  const classes = useStyles();
  return (
    <MuiSwitch
      focusVisibleClassName={classes.focusVisible}
      disableRipple
      classes={{
        root: classes.root,
        switchBase: classes.switchBase,
        thumb: classes.thumb,
        track: classes.track,
        checked: classes.checked,
      }}
      {...props}
    />
  );
};

export default Switch;
