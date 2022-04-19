import React, { useState } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import PropTypes from 'prop-types';

import shortAddress from '@shared/utils/short-address';
import { ICNS_LOGO } from '@shared/services/ICNS';

import useStyles from './styles';

const ICNSDisplay = ({
  icns, className, onClick,
}) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);

  return (
    <div className={`${className} ${classes.wrapper} ${loading ? classes.loadingWrapper : ''}`}>
      <img
        className={classes.icnsBackground}
        onClick={onClick}
        onLoad={() => setLoading(false)}
        src={icns.url}
      />
      <span className={classes.icnsName}>
        {icns.name?.length > 12 ? shortAddress(icns?.name, 3, 6) : icns?.name}
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
};

ICNSDisplay.defaultProps = {
  className: '',
  onClick: () => {},
};

export default ICNSDisplay;
