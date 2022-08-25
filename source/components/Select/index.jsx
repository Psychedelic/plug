import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import clsx from 'clsx';
import ChevronDown from '@assets/icons/chevron-down.svg';
import TokenIcon from '../TokenIcon';

import InputBase from '../InputBase';
import useStyles from './styles';

const Select = ({
  image,
  name,
  shadow,
  onClick,
  text,
  icon,
  readonly,
  imageClassName,
  nft,
  className,
  accountNameTestId,
  ...other
}) => {
  const classes = useStyles();

  return (
    <InputBase className={className}>
      <div
        className={clsx(classes.root, readonly && classes.readonly, onClick && classes.selectable)}
        onClick={onClick}
        {...other}
      >
        {icon}
        {image && (
          <TokenIcon
            alt={name}
            logo={image}
            nft={nft}
            className={clsx(
              classes.icon,
              shadow && classes.iconShadow,
              imageClassName && imageClassName,
            )}
            symbol={name}
          />
        )}
        <div className={classes.textContainer}>
          <Typography variant="h4" data-testid={accountNameTestId}>{name}</Typography>
          {text && (
            <Typography variant="subtitle2" style={{ marginTop: 4 }}>
              {text}
            </Typography>
          )}
        </div>

        {!readonly && <img src={ChevronDown} className={classes.alignRight} />}
      </div>
    </InputBase>
  );
};

export default Select;

Select.defaultProps = {
  shadow: false,
  text: null,
  onClick: null,
  icon: null,
  readonly: false,
  imageClassName: '',
  nft: false,
  className: '',
  accountNameTestId: '',
};

Select.propTypes = {
  image: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  shadow: PropTypes.bool,
  onClick: PropTypes.func,
  text: PropTypes.string,
  icon: PropTypes.node,
  readonly: PropTypes.bool,
  imageClassName: PropTypes.string,
  nft: PropTypes.oneOf([PropTypes.bool, PropTypes.objectOf(PropTypes.string)]),
  className: PropTypes.string,
  accountNameTestId: PropTypes.string,
};
