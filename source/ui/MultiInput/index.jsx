import React from 'react';
import PropTypes from 'prop-types';
import NumberFormat from 'react-number-format';
import ChevronRight from '@assets/icons/chevron-right.svg';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import InputBase from '../InputBase';
import useStyles from './styles';

const NumberFormatCustom = (props) => {
  const { inputRef, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      decimalScale={2}
      fixedDecimalScale
      thousandSeparator=","
      allowNegative={false}
      placeholder="0"
    />
  );
};

const MultiInput = ({
  name, image, onClick, value, onChange, currencyValue,
}) => {
  const classes = useStyles();

  const estimatedTotal = value * currencyValue;

  return (
    <InputBase>
      <div className={classes.leftContainer} onClick={onClick}>
        <img src={image} className={classes.icon} />
        <Typography variant="h4">{name}</Typography>
        <img src={ChevronRight} className={classes.alignRight} />
      </div>
      <div className={classes.rightContainer}>
        <TextField
          className={classes.input}
          variant="outlined"
          value={value}
          onChange={onChange}
          InputProps={{
            inputComponent: NumberFormatCustom,
          }}
        />
        {
          estimatedTotal > 0
          && (
            <span className={classes.estimatedTotal}>
              <NumberFormat
                displayType="text"
                decimalScale={2}
                fixedDecimalScale
                thousandSeparator=","
                value={estimatedTotal}
                prefix="~$"
              />
            </span>
          )
        }
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
  currencyValue: PropTypes.number.isRequired,
};

NumberFormatCustom.propTypes = {
  inputRef: PropTypes.objectOf(PropTypes.object).isRequired,
};
