import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Typography } from '@material-ui/core';
import { ChevronDown } from 'react-feather';
import clsx from 'clsx';

import { InputBase, Dialog } from '@ui';

import useStyles from './styles';

const ICNSSelector = () => {
  const classes = useStyles();
  const { names, resolved } = useSelector(state => state.icns);
  const [isOpen, setIsOpen] = useState(false);
  const openSelectDialog = () => names?.length && setIsOpen(true);
  return (
    <>
      <InputBase className={classes.icnsSelectContainer} onClick={openSelectDialog}>
        <Typography variant="subtitle2">
          {resolved ?? 'Select' }
        </Typography>
        {resolved ? (
            <Typography variant="subtitle2" className={classes.changeText}>
              Change
            </Typography>
          ) : <ChevronDown className={classes.arrowDown} />
        }
      </InputBase>
      <Dialog
        title="Select ICNS"
        onClose={() => setIsOpen(false)}
        open={isOpen}
        component={(
          <div className={classes.namesContainer}>
            {names?.map((name, index) => (
              <div className={classes.nameContainer} onClick={() => {}}>
                <Typography
                  className={
                    clsx(classes.name, names?.length > 1 && index < names.length - 1 && classes.borderBottom)}
                >
                  {name}
                </Typography>
              </div>
            ))}
          </div>
        )}
      />
    </>
  )
};

export default ICNSSelector;
