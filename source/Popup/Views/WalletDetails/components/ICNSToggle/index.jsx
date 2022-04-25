import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import clsx from 'clsx';
import { Info } from 'react-feather';

import ICNS_IMG from '@assets/icons/icns.svg';
import Switch from '@components/Switch';

import useStyles from './styles';
import ICNSSelector from '../ICNSSelector';

const ICNSToggle = ({ active, handleToggle }) => {
  const classes = useStyles();
  const { names } = useSelector((state) => state.icns);

  return (
    <div className={clsx(
      classes.icnsContainer,
      active && classes.active,
    )}>
      <div className={classes.toggleContainer}
      >
        <div className={classes.titleContainer}>
          <img
            className={classes.icnsImg}
            src={ICNS_IMG}
          />
          <Info
            className={classes.info}
            size={20}
          />
        </div>
        <Switch
          checked={active}
          onChange={handleToggle}
        />
      </div>
      {active && !!names?.length && <ICNSSelector  />}
    </div>
  )
};

export default ICNSToggle;