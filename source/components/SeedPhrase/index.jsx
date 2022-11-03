import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import Tooltip from '@material-ui/core/Tooltip';
import clsx from 'clsx';

import ListItem from '../ListItem';
import RevealSeedPhrase from './components/RevealSeedPhrase';
import useStyles from './styles';

const SeedPhrase = ({
  words, seedPhraseBoxTestId, onReveal, className,
}) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const [copied, setCopied] = useState(false);
  const [revealed, setRevealed] = useState(false);

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

  const handleReveal = () => {
    setRevealed(true);
    onReveal();
  };
  return (
    <Tooltip
      classes={{ tooltipPlacementTop: classes.tooltip }}
      title={tooltipText}
      arrow
      open={showTooltip || copied}
      placement="top"
    >
      <div className={classes.root}>
        <div
          className={clsx(classes.seedContainer, className)}
          onClick={() => handleClick()}
          data-testid={seedPhraseBoxTestId}
          onMouseOver={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          {words.map((word, i) => (
            <div className={classes.item} key={word}>
              <ListItem number={i + 1} text={word} />
            </div>
          ))}
          {showTooltip && <div className={classes.layer} />}
        </div>
        {!revealed && (
          <>
            <RevealSeedPhrase onClick={handleReveal} />
            <div className={classes.blurContainer}>
              <div className={classes.blur} />
            </div>
            <div className={classes.blurContainer}>
              <div className={classes.rainbowBg} />
            </div>
          </>
        )}
      </div>
    </Tooltip>
  );
};

export default SeedPhrase;

SeedPhrase.defaultProps = {
  seedPhraseBoxTestId: 'seed-phrase-box',
  className: '',
};

SeedPhrase.propTypes = {
  onReveal: PropTypes.func.isRequired,
  words: PropTypes.arrayOf(PropTypes.string).isRequired,
  seedPhraseBoxTestId: PropTypes.string,
  className: PropTypes.string,
};
