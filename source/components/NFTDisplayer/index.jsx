import React, { useEffect, useState } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import PropTypes from 'prop-types';
import useStyles from './styles';

const TYPE_MAP = {
  'video/mp4': 'video',
  'image/png': 'img',
  'text/html': 'iframe',
  'image/svg+xml': 'img',
};

const TAG_PROPS = {
  img: {
    width: '100%',
    height: '100%',
  },
  iframe: {
    width: '100%',
    height: '100%',
    loading: 'lazy',
  },
  video: {
    autoPlay: true,
    muted: true,
    loop: true,
    width: '100%',
    height: '100%',
  },
};

const NFTDisplayer = ({
  url, className, onClick, interactive, defaultTag,
}) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState('image/png');

  useEffect(() => {
    if (defaultTag === undefined) {
      fetch(url)
        .then((response) => {
          setType(response.headers.get('Content-Type'));
        });
    }
  }, []);

  const Tag = defaultTag || TYPE_MAP[type] || 'img';
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
    <div className={`${className} ${classes.wrapper} ${loading ? classes.loadingWrapper : ''}`}>
      <Tag
        {...customProps}
        onClick={onClick}
        onLoad={() => setLoading(false)}
        onPlay={() => setLoading(false)}
        src={url}
      />
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

NFTDisplayer.propTypes = {
  url: PropTypes.string.isRequired,
  defaultTag: PropTypes.string,
  className: PropTypes.string,
  onClick: PropTypes.func,
  interactive: PropTypes.bool,
};

NFTDisplayer.defaultProps = {
  className: '',
  onClick: () => {},
  interactive: false,
  defaultTag: undefined,
};

export default NFTDisplayer;
