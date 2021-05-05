import React from 'react';
import { fleekUrl } from '@shared/constants/urls';
import ThunderImg from '@assets/icons/options/thunder.svg';
import useStyles from './styles';

const MadeBy = () => {
  const classes = useStyles();

  return (
    <div className={classes.root} onClick={() => window.open(fleekUrl, '_blank')}>
      <span>MADE BY</span><img src={ThunderImg} className={classes.image} />
    </div>
  );
};

export default MadeBy;
