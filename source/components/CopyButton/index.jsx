import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Tooltip from '@material-ui/core/Tooltip';
import { Copy } from 'react-feather';
import PropTypes from 'prop-types';
import useStyles from './styles';

const CopyButton = ({ text, placement, ...other }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const [copied, setCopied] = useState(false);

  const copyText = t('copy.copyText');
  const copiedText = t('copy.copiedText');

  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipText, setTooltipText] = useState(copyText);

  const handleCopy = (address) => {
    navigator.clipboard.writeText(address);
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
      title={tooltipText}
      arrow
      open={showTooltip || copied}
      placement={placement}
    >
      <div
        className={classes.copyIcon}
        onClick={() => handleCopy(text)}
        onMouseOver={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        {...other}
      >
        <Copy size="18" className={classes.icon} />
      </div>
    </Tooltip>
  );
};

export default CopyButton;

CopyButton.propTypes = {
  text: PropTypes.string.isRequired,
  placement: PropTypes.string.isRequired,
};
