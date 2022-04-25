import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Typography } from '@material-ui/core';
import { ChevronDown } from 'react-feather';

import { InputBase } from '@ui';

import useStyles from './styles';

const ICNSSelector = () => {
  const classes = useStyles();
  const { names, resolved } = useSelector(state => state.icns);
  const [isOpen, setIsOpen] = useState(false);
  const openSelectDialog = () => names?.length && setIsOpen(true);
  return (
    <InputBase className={classes.icnsSelectContainer} onClick={openSelectDialog}>
      <Typography variant="subtitle2">
        {resolved ?? 'Select' }
      </Typography>
      {names?.length > 1 &&  (
        resolved ? (
          <Typography variant="subtitle2" className={classes.changeText}>
            Change
          </Typography>
        ) : <ChevronDown className={classes.alignRight} />
      )}
    </InputBase>
  )
};

export default ICNSSelector;
