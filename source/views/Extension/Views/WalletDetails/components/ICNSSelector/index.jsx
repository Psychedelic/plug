import React, { useState } from 'react';
import clsx from 'clsx';
import { Typography, CircularProgress } from '@material-ui/core';
import { ChevronDown } from 'react-feather';

import { sendMessage, HANDLER_TYPES } from '@background/Keyring';
import { setICNSData } from '@redux/icns';
import { InputBase, Dialog } from '@components';

import useStyles from './styles';

const ICNSSelector = ({ names, resolved, handleSetReverseResolution, loading }) => {
  const classes = useStyles();
  const [isOpen, setIsOpen] = useState(false);
  const [nameLoading, setLoading] = useState();
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

    handleSetReverseResolution(name, resetModal);
  };

  const getInputContent = () => {
    if (loading) {
      return (
        <Typography variant="subtitle2">
          Loading ICNS data...
        </Typography>
      );
    }
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
        <Typography variant="subtitle2" data-testid="icns-selector-text">
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
      <InputBase className={classes.icnsSelectContainer} onClick={openSelectDialog} data-testid="open-selection-modal-button">
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
                  data-testid={`icns-name-${name}`}
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
