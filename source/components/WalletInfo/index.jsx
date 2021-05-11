import React, { useState } from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import shortAddress from '@shared/utils/short-address';
import useStyles from './styles';

const WalletInfo = ({ name, address }) => {
  const classes = useStyles();
  const [copied, setCopied] = useState(false);

  const { t } = useTranslation();
  const copyText = t('copy.copyText');
  const copiedText = t('copy.copiedText');

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
        <Typography variant="h5">{name}</Typography>
        <Typography variant="subtitle2">{shortAddress(address)}</Typography>
      </div>
    </Tooltip>
  );
};

export default WalletInfo;

WalletInfo.propTypes = {
  name: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
};
