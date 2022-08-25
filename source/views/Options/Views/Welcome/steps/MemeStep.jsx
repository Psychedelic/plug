import React from 'react';

import gifKidDance from '@assets/kid-dance.gif';
import useStyles from '../styles';

const MemeStep = () => {
  const styles = useStyles();
  return (
    <div className={styles.memeContainer}>
      <img src={gifKidDance} alt="meme" className={styles.meme} />
    </div>
  );
};

export default MemeStep;
