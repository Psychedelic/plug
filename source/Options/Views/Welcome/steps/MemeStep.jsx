import React from 'react';

import useStyles from '../styles';

const MemeStep = () => {
  const styles = useStyles();
  return (
    <div className={styles.memeContainer}>
      <img src="https://media.giphy.com/media/5FKNjm8Ru327u/giphy.gif" alt="meme" className={styles.meme} />
    </div>
  );
};

export default MemeStep;
