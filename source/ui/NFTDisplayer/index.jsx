import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import useStyles from './styles';

const TYPE_MAP = {
  'video/mp4': 'video',
  'image/png': 'img',
  'text/html': 'iframe',
};

const TAG_PROPS = {
  video: {
    autoPlay: true,
    muted: true,
    loop: true,
  },
  iframe: {
    width: 112,
    height: 112,
    loading: 'lazy',
  },
};

const NFTDisplayer = ({
  url, className, onClick, interactive,
}) => {
  const classes = useStyles();
  const [type, setType] = useState('image/png');

  useEffect(() => {
    fetch(url)
      .then((response) => {
        setType(response.headers.get('Content-Type'));
      });
  }, []);

  const Tag = TYPE_MAP[type] || 'img';
  const customProps = TAG_PROPS[Tag] || {};

  if (Tag === 'iframe') {
    return (
      <div
        className={`${classes.iframeWrapper} ${interactive ? classes.interactive : className}`}
        onClick={onClick}
      >
        {!interactive && <span className={classes.iframeClick} />}
        <Tag
          className={classes.innerFrame}
          {...customProps}
          src={url}
        />
      </div>
    );
  }

  return (
    <Tag
      {...customProps}
      onClick={onClick}
      className={className}
      src={url}
    />
  );
};

NFTDisplayer.propTypes = {
  url: PropTypes.string.isRequired,
  className: PropTypes.string,
  onClick: PropTypes.func,
  interactive: PropTypes.bool,
};

NFTDisplayer.defaultProps = {
  className: '',
  onClick: () => {},
  interactive: false,
};

export default NFTDisplayer;
