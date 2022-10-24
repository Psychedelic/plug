import React, { useState } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import PropTypes from 'prop-types';

import { ICNS_LOGO, shortICNSName } from '@shared/services/ICNS';

import useStyles from './styles';

const ICNSDisplay = ({
  icns, className, onClick, large,
}) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  return (
    <div className={`${className} ${classes.wrapper} ${loading ? classes.loadingWrapper : ''}`}>
      <img
        className={classes.icnsBackground}
        onClick={onClick}
        onLoad={() => setLoading(false)}
        src="https://icns.id/Rectangle.jpg"
      />
      <span className={`${classes.icnsName} ${large ? classes.large : ''}`}>
        {icns.name?.length > 12 ? shortICNSName(icns?.name) : icns?.name}
      </span>
      <img className={classes.icnsLogo} src={ICNS_LOGO} />
      { loading && (
        <div className={classes.loadingContainer}>
          <CircularProgress
            size="25%"
            color="#6B707B"
          />
        </div>
      )}
    </div>
  );
};

ICNSDisplay.propTypes = {
  icns: PropTypes.shape({
    url: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  className: PropTypes.string,
  onClick: PropTypes.func,
  large: PropTypes.bool,
};

ICNSDisplay.defaultProps = {
  className: '',
  onClick: () => {},
  large: false,
};

export default ICNSDisplay;
