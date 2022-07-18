import React, { useState } from 'react';
import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';
import { Typography, CircularProgress } from '@material-ui/core';
import { ChevronDown } from 'react-feather';

import { sendMessage, HANDLER_TYPES } from '@background/Keyring';
import { setICNSData } from '@redux/icns';
import { InputBase, Dialog } from '@components';

import useStyles from './styles';

const ICNSSelector = () => {
  const classes = useStyles();
  const { names, resolved } = useSelector((state) => state.icns);
  const [isOpen, setIsOpen] = useState(false);
  const [nameLoading, setLoading] = useState();
  const dispatch = useDispatch();
  const openSelectDialog = () => names?.length && setIsOpen(true);

  const resetModal = () => {
    setLoading(false);
    setIsOpen(false);
  };

  const setReverseResolutionName = (name) => {
    setIsOpen(false);
    setLoading(name);
    if (name === resolved) {
      resetModal();
    }

    sendMessage({
      type: HANDLER_TYPES.SET_REVERSE_RESOLVED_NAME,
      params: name,
    }, (response) => {
      if (response.error) {
        // eslint-disable-next-line
        console.log('Error when setting your reverse resolved name', response.error); // TODO HANDLE ERROR (shouldnt happen tho)
      } else {
        sendMessage({
          type: HANDLER_TYPES.GET_ICNS_DATA,
          params: { refresh: true },
        }, (icnsData) => {
          dispatch(setICNSData(icnsData));
          resetModal();
        });
      }
    });
  };

  const getInputContent = () => {
    if (names?.length === 0) {
      return (
        <Typography variant="subtitle2">
          No ICNS names owned
        </Typography>
      );
    }
    if (nameLoading) {
      return (
        <>
          <Typography variant="subtitle2">
            {nameLoading}
          </Typography>
          <CircularProgress size={24} />
        </>
      );
    }
    return (
      <>
        <Typography variant="subtitle2">
          {resolved ?? 'Select an ICNS name' }
        </Typography>
        {resolved ? (
          <Typography variant="subtitle2" className={classes.changeText}>
            Change
          </Typography>
        ) : (
          <ChevronDown className={classes.arrowDown} />
        )}
      </>
    );
  };

  return (
    <>
      <InputBase className={classes.icnsSelectContainer} onClick={openSelectDialog}>
        { getInputContent() }
      </InputBase>
      <Dialog
        title="Select ICNS"
        onClose={() => setIsOpen(false)}
        open={isOpen}
        component={(
          <div className={classes.namesContainer}>
            {names?.map((name, index) => (
              <div className={classes.nameContainer} onClick={() => setReverseResolutionName(name)}>
                <Typography
                  className={
                    clsx(
                      classes.name,
                      names?.length > 1 && index < names.length - 1 && classes.borderBottom,
                    )
                  }
                >
                  {name}
                </Typography>
                {nameLoading === name && <CircularProgress size={24} />}
              </div>
            ))}
          </div>
        )}
      />
    </>
  );
};

export default ICNSSelector;
