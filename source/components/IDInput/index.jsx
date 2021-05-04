import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import InputBase from '@material-ui/core/InputBase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinnerThird } from '@fortawesome/pro-regular-svg-icons/faSpinnerThird';
import ErrorImg from '@assets/icons/error.svg';
import SuccessImg from '@assets/icons/success.svg';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import useStyles from './styles';

const IDInput = ({
  value, onChange, addressInfo, handleChangeAddressInfo,
}) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (value !== null) {
        setLoading(true);
        setTimeout(() => { setLoading(false); }, 1000);

        const isValid = value.includes('valid id') && (value.includes('dank') || value.includes('canister'));

        let type = null;
        if (value.includes('dank')) type = 'dank';
        else if (value.includes('canister')) type = 'canister';

        handleChangeAddressInfo({ isValid, type });
      }
    }, 1000);

    return () => clearTimeout(debounce);
  }, [value]);

  let image;

  if (addressInfo.isValid === null) image = null;
  else if (addressInfo.isValid) image = SuccessImg;
  else image = ErrorImg;

  return (
    <div className={classes.root}>
      <InputBase
        classes={{
          input: classes.input,
        }}
        fullWidth
        value={value}
        type="text"
        onChange={(e) => onChange(e.target.value)}
        placeholder={t('send.inputId')}
      />
      <div className={classes.iconContainer}>
        {
          loading
            ? (
              <FontAwesomeIcon
                icon={faSpinnerThird}
                spin
                className={clsx(classes.icon, classes.spinner)}
              />
            )
            : (image !== null
              && <img src={image} className={classes.icon} />
            )
        }
      </div>
    </div>
  );
};

export default IDInput;

IDInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  addressInfo: PropTypes.objectOf(PropTypes.object).isRequired,
  handleChangeAddressInfo: PropTypes.func.isRequired,
};
