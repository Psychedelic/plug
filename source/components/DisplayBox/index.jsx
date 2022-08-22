import React from 'react';
import PropTypes from 'prop-types';

import useStyles from './styles';

const DisplayBox = ({
  title, subtitle, img,
}) => {
  const classes = useStyles();

  return (
    <div className={classes.assetContainer}>
      <div className={classes.assetText}>
        <h2 className={classes.amountTitle}>
          {title}
        </h2>
        <p className={classes.amountDescription}>
          <span>{subtitle}</span>
        </p>
      </div>
      {
        React.isValidElement(img)
          ? img
          : <img src={img} className={classes.assetImg} alt="asset" />
      }
    </div>
  );
};

DisplayBox.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  img: PropTypes.string || PropTypes.node,
};

DisplayBox.defaultProps = {
  img: '',
};

export default DisplayBox;
