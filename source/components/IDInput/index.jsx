import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { TextInput } from '@ui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinnerThird } from '@fortawesome/pro-regular-svg-icons/faSpinnerThird';
import ErrorImg from '@assets/icons/error.svg';
import SuccessImg from '@assets/icons/success.svg';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import useStyles from './styles';

const IDInput = ({ value, onChange }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(async () => {
    const debounce = setTimeout(async () => {
      if (value !== null) {
        setLoading(true);

        setStatus(value === 'valid id' ? 'success' : 'error');

        await new Promise((r) => setTimeout(r, 1500));

        setLoading(false);
      }
    }, 3000);

    return () => clearTimeout(debounce);
  }, [value]);

  let image;

  if (status === 'success') image = SuccessImg;
  else if (status === 'error') image = ErrorImg;
  else image = null;

  return (
    <div className={classes.root}>
      <TextInput
        fullWidth
        value={value}
        type="text"
        onChange={onChange}
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
            : (status !== null
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
};
