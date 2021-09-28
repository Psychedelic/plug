import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const TYPE_MAP = {
  'video/mp4': 'video',
  'image/png': 'img',
};

const TAG_PROPS = {
  video: {
    autoPlay: true,
    muted: true,
    loop: true,
  },
};

const NFTDisplayer = ({ url, className }) => {
  const [type, setType] = useState('image/png');

  useEffect(() => {
    fetch(url)
      .then((response) => {
        setType(response.headers.get('Content-Type'));
      });
  }, []);

  const Tag = TYPE_MAP[type] || 'img';
  const customProps = TAG_PROPS[Tag] || {};

  return (
    <Tag
      {...customProps}
      className={className}
      src={url}
    />
  );
};

NFTDisplayer.propTypes = {
  url: PropTypes.string.isRequired,
  className: PropTypes.string,
};

NFTDisplayer.defaultProps = {
  className: '',
};

export default NFTDisplayer;
