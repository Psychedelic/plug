import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import WhiteKeyImage from '@assets/icons/white-key.svg';
import useStyles from './styles';

const RevealSeedPhrase = ({ onClick, ...other }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  return (
    <button
      type="button"
      className={classes.root}
      onClick={onClick}
      data-testid="reveal-seedphrase-button"
      {...other}
    >
      <div className={classes.blur} />
      <div className={classes.center}>
        <img src={WhiteKeyImage} />
        <span className={classes.text}>{t('seedPhrase.reveal')}</span>
      </div>
    </button>
  );
};

export default RevealSeedPhrase;

RevealSeedPhrase.propTypes = {
  onClick: PropTypes.func.isRequired,
};
