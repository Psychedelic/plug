import React from 'react';
import PropTypes from 'prop-types';
import NumberFormat from 'react-number-format';
import ChevronDown from '@assets/icons/chevron-down.svg';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import ExchangeIcon from '@assets/icons/exchange-arrows.svg';
import TokenIcon from '../TokenIcon';

import InputBase from '../InputBase';
import useStyles from './styles';

const NumberFormatCustom = (props) => {
  const {
    inputRef, onChange, prefix, suffix, availableAmount, ...other
  } = props;

  const withValueLimit = (input) => {
    const { value } = input;
    return value <= availableAmount;
  };

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => { onChange(values.value); }}
      decimalScale={5}
      fixedDecimalScale
      thousandSeparator=","
      allowNegative={false}
      placeholder={`0${suffix}`}
      isNumericString
      suffix={suffix}
      prefix={prefix}
      isAllowed={withValueLimit}
    />
  );
};

const MultiInput = ({
  name,
  image,
  onClick,
  value,
  onChange,
  primaryValue,
  secondaryValue,
  conversionPrice,
  handleSwapValues,
  availableAmount,
  decimalScale,
  buttonTestId,
  inputTestId,
  swapTestId,
}) => {
  const classes = useStyles();
  const hasConversionRate = !!secondaryValue?.conversionRate
    && !Number.isNaN(secondaryValue?.conversionRate);
  return (
    <InputBase>
      <div className={classes.leftContainer} onClick={onClick} data-testid={buttonTestId}>
        <TokenIcon logo={image} className={classes.icon} symbol={name} small />
        <Typography variant="h4">{name}</Typography>
        <img src={ChevronDown} className={classes.alignRight} />
      </div>
      <div className={classes.rightContainer}>
        <TextField
          className={classes.input}
          variant="outlined"
          value={value}
          onChange={onChange}
          prefix={primaryValue.prefix}
          suffix={primaryValue.suffix}
          InputProps={{
            inputProps: {
              suffix: primaryValue.suffix,
              prefix: primaryValue.prefix,
              availableAmount,
              'data-testid': inputTestId,
            },
            inputComponent: NumberFormatCustom,
            decimalScale,
          }}
        />
        <span className={classes.estimatedTotal}>
          {hasConversionRate ? (
            <NumberFormat
              displayType="text"
              decimalScale={decimalScale}
              fixedDecimalScale
              thousandSeparator=","
              value={conversionPrice}
              prefix={secondaryValue.prefix}
              suffix={secondaryValue.suffix}
            />
          ) : (
            <span>No price available</span>
          )}
        </span>
        {hasConversionRate && (
          <IconButton
            data-testid={swapTestId}
            className={classes.swapIcon}
            onClick={() => handleSwapValues()}
          >
            <img src={ExchangeIcon} />
          </IconButton>
        )}
      </div>
    </InputBase>
  );
};

export default MultiInput;

MultiInput.defaultProps = {
  decimalScale: 2,
  buttonTestId: 'multi-input-button',
  inputTestId: 'multi-input',
  swapTestId: 'multi-input-swap',
};

MultiInput.propTypes = {
  name: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  primaryValue: PropTypes.objectOf(PropTypes.string).isRequired,
  secondaryValue: PropTypes.objectOf(PropTypes.string).isRequired,
  conversionPrice: PropTypes.number.isRequired,
  handleSwapValues: PropTypes.func.isRequired,
  availableAmount: PropTypes.number.isRequired,
  decimalScale: PropTypes.number,
  buttonTestId: PropTypes.string,
  inputTestId: PropTypes.string,
  swapTestId: PropTypes.string,
};

NumberFormatCustom.propTypes = {
  inputRef: PropTypes.objectOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
  prefix: PropTypes.string.isRequired,
  suffix: PropTypes.string.isRequired,
  availableAmount: PropTypes.number.isRequired,
};
