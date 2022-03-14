import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Tooltip, Typography } from '@material-ui/core';

import useStyles from './styles';

const ActivityItemDisplay = ({
  image, title, subtitle, tooltip, onCopy, tooltipText, copied, titleClassName,
}) => {
  const classes = useStyles();

  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <>
      {image}
      <div className={classes.leftContainer}>
        <Typography variant="h5" className={titleClassName}>{title}</Typography>
        <Typography
          variant="subtitle2"
          onClick={onCopy}
          onMouseOver={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          {subtitle}
          {tooltip && (
            <Tooltip
              classes={{ tooltipPlacementBottom: classes.tooltip }}
              title={tooltipText}
              arrow
              open={showTooltip || copied}
              placement="bottom"
            >
              <span>{tooltip}</span>
            </Tooltip>
          )}
        </Typography>
      </div>
    </>
  );
};

ActivityItemDisplay.defaultProps = {
  tooltip: null,
  tooltipText: null,
  copied: false,
  onCopy: () => {},
  titleClassName: '',
};

ActivityItemDisplay.propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  tooltip: PropTypes.string,
  tooltipText: PropTypes.string,
  copied: PropTypes.bool,
  onCopy: PropTypes.func,
  titleClassName: PropTypes.string,
};

export default ActivityItemDisplay;
