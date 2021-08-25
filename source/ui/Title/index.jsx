import React from 'react';
import { Typography } from '@material-ui/core';

const Title = ({ icon, value }) => (
  <div className={classes.root}>
    {
        icon
        && <img src={icon} className={classes.icon} />
      }
    <Typography variant="h4">{value}</Typography>
  </div>
);

export default Title;
