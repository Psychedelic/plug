import React from 'react';

import useStyles from '../styles';
import gifKidDance from '../../../../assets/kid-dance.gif';

const MemeStep = () => {
  const styles = useStyles();
  return (
    <div className={styles.memeContainer}>
      <img src={gifKidDance} alt="meme" className={styles.meme} />
    </div>
  );
};

export default MemeStep;
