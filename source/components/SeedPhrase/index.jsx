import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import Tooltip from '@material-ui/core/Tooltip';
import ListItem from '../ListItem';
import useStyles from './styles';

const SeedPhrase = ({ words, seedPhraseBoxTestId }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const [copied, setCopied] = useState(false);

  const copyText = t('copy.copyText');
  const copiedText = t('copy.copiedText');

  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipText, setTooltipText] = useState(copyText);

  const handleClick = () => {
    navigator.clipboard.writeText(words.join(' '));
    setCopied(true);
    setTooltipText(copiedText);

    setTimeout(() => {
      setCopied(false);
    }, 2500);

    setTimeout(() => {
      setTooltipText(copyText);
    }, 3000);
  };

  return (
    <Tooltip
      classes={{ tooltipPlacementTop: classes.tooltip }}
      title={tooltipText}
      arrow
      open={showTooltip || copied}
      placement="top"
    >
      <div
        className={classes.root}
        onClick={() => handleClick()}
        data-testid={seedPhraseBoxTestId}
        onMouseOver={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {
          words.map((word, i) => (
            <div className={classes.item} key={word}>
              <ListItem number={i + 1} text={word} />
            </div>
          ))
        }
        {
          showTooltip
          && <div className={classes.layer} />
        }
      </div>
    </Tooltip>
  );
};

export default SeedPhrase;

SeedPhrase.defaultProps = {
  seedPhraseBoxTestId: 'seed-phrase-box',
};

SeedPhrase.propTypes = {
  words: PropTypes.arrayOf(PropTypes.string).isRequired,
  seedPhraseBoxTestId: PropTypes.string,
};
