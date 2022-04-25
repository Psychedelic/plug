import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import clsx from 'clsx';
import { Info } from 'react-feather';

import ICNS_IMG from '@assets/icons/icns.svg';
import Switch from '@components/Switch';

import useStyles from './styles';

const ICNSToggle = () => {
  const classes = useStyles();
  const { names } = useSelector((state) => state.icns);
  const [active, setActive] = useState(true);
  const handleToggleICNS = (event) => setActive(event.target.checked);

  return (
    <div className={clsx(
      classes.icnsContainer,
      active && classes.active,
    )}>
      <div className={classes.toggleContainer}
      >
        <img
          className={classes.icnsImg}
          src={ICNS_IMG}
        />
        <Info
          className={classes.info}
          size={20}
        />
        <Switch
          checked={active}
          onChange={handleToggleICNS}
        />
      </div>
    </div>
  )
};

export default ICNSToggle;