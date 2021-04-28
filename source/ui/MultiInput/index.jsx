import React from 'react';
import PropTypes from 'prop-types';
import NumberFormat from 'react-number-format';
import ChevronDown from '@assets/icons/chevron-down.svg';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import ExchangeIcon from '@assets/icons/exchange-arrows.svg';
import InputBase from '../InputBase';
import useStyles from './styles';

const NumberFormatCustom = (props) => {
  const {
    inputRef, onChange, prefix, suffix, availableAmount, ...other
  } = props;

  // eslint-disable-next-line consistent-return
  const withValueLimit = (input) => {
    const { value } = input;
    if (value <= availableAmount) return input;
  };

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => { onChange(values.value); }}
      decimalScale={2}
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
}) => {
  const classes = useStyles();

  return (
    <InputBase>
      <div className={classes.leftContainer} onClick={onClick}>
        <img src={image} className={classes.icon} />
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
            },
            inputComponent: NumberFormatCustom,
          }}
        />
        <span className={classes.estimatedTotal}>
          <NumberFormat
            displayType="text"
            decimalScale={2}
            fixedDecimalScale
            thousandSeparator=","
            value={conversionPrice}
            prefix={secondaryValue.prefix}
            suffix={secondaryValue.suffix}
          />
        </span>
        <IconButton className={classes.swapIcon} onClick={() => handleSwapValues()}>
          <img src={ExchangeIcon} />
        </IconButton>
      </div>
    </InputBase>
  );
};

export default MultiInput;

MultiInput.propTypes = {
  name: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  primaryValue: PropTypes.objectOf(PropTypes.object).isRequired,
  secondaryValue: PropTypes.objectOf(PropTypes.object).isRequired,
  conversionPrice: PropTypes.number.isRequired,
  handleSwapValues: PropTypes.func.isRequired,
  availableAmount: PropTypes.number.isRequired,
};

NumberFormatCustom.propTypes = {
  inputRef: PropTypes.objectOf(PropTypes.object).isRequired,
  onChange: PropTypes.func.isRequired,
  prefix: PropTypes.string.isRequired,
  suffix: PropTypes.string.isRequired,
  availableAmount: PropTypes.number.isRequired,
};
