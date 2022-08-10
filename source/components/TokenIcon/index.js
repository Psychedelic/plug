import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';
import { NFTDisplayer } from '@ui';
import randomColor from 'random-color';
import clsx from 'clsx';

import { NFT_COLLECTION_DEFAULT_TYPES } from '@shared/constants/nft';
import SHADOW_1 from '@shared/styles/shadows';

const useStyles = makeStyles((theme) => ({
  genericToken: {
    width: '41px',
    height: '41px',
    textAlign: 'center',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '10px',
    fontWeight: 'bold',
  },
  small: {
    height: 29,
    width: 29,
    marginRight: theme.spacing(1),
    borderRadius: 26,
    boxShadow: SHADOW_1,
  },
  icon: {
    width: '100%',
    height: 'auto',
  },
}));

const TokenIcon = ({
  logo,
  symbol,
  className,
  color,
  nft,
  small,
  ...props
}) => {
  const classes = useStyles();
  const backgroundColor = `rgb(${color.values.rgb.join(',')})`;

  const nftDefaultTag = NFT_COLLECTION_DEFAULT_TYPES[nft.canisterId];

  if (logo) {
    return nft ? (
      <NFTDisplayer url={logo} className={className} defaultTag={nftDefaultTag} {...props} />
    ) : (
      <img src={logo} className={clsx(classes.icon, className)} {...props} />
    );
  }

  return (
    <div
      className={clsx(classes.genericToken, className)}
      style={{ backgroundColor }}
    >
      <span>{symbol}</span>
    </div>
  );
};

TokenIcon.propTypes = {
  symbol: PropTypes.string.isRequired,
  logo: PropTypes.string,
  className: PropTypes.string,
  nft: PropTypes.bool,
  color: PropTypes.shape({
    values: PropTypes.shape({
      rgb: PropTypes.arrayOf(PropTypes.number),
    }),
  }),
  small: PropTypes.bool,
};

TokenIcon.defaultProps = {
  logo: null,
  nft: false,
  className: '',
  color: randomColor({ luminosity: 'light' }),
  small: false,
};

export default TokenIcon;
