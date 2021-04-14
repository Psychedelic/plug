import React, { useState } from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import PropTypes from 'prop-types';
import useStyles from './styles';
import { useTranslation } from 'react-i18next';
import { shortenString } from '../../../../shared/helpers/stringHelper';

const WalletInfo = ({ name, address }) => {
  const classes = useStyles();
  const [copied, setCopied] = useState(false);

  const { t } = useTranslation();
  const copyText = t('walletInfo.copyText');
  const copiedText = t('walletInfo.copiedText');

  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipText, setTooltipText] = useState(copyText);

  const handleWalletClick = () => {
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
      placement="bottom"
    >
      <div
        className={classes.root}
        onClick={() => handleWalletClick()}
        onMouseOver={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <span className={classes.title}>{name}</span>
        <span className={classes.subtitle}>{shortenString(address)}</span>
      </div>
    </Tooltip>
  );
};

export default WalletInfo;

WalletInfo.propTypes = {
  name: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
};
