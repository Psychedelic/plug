import React, { useState } from 'react';
import { ListItem } from '@ui';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import useStyles from './styles';

const SeedPhrase = ({ words }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [showCopy, setShowCopy] = useState(false);

  return (
    <div
      className={classes.root}
      onClick={() => navigator.clipboard.writeText(words.join(' '))}
      onMouseOver={() => setShowCopy(true)}
      onMouseLeave={() => setShowCopy(false)}
    >
      {
        words.map((word, i) => (
          <div className={classes.item}>
            <ListItem number={i + 1} text={word} />
          </div>
        ))
      }
      {
        showCopy
        && (
        <div className={classes.layer}>
          <span className={classes.copy}>{t('copy.copyText')}</span>
        </div>
        )
      }
    </div>
  );
};

export default SeedPhrase;

SeedPhrase.propTypes = {
  words: PropTypes.arrayOf(PropTypes.string).isRequired,
};
