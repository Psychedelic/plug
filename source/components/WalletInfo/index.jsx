import React, { useState } from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import shortAddress from '@shared/utils/short-address';
import { useSelector } from 'react-redux';
import useStyles from './styles';

const WalletInfo = () => {
  const classes = useStyles();
  const [copied, setCopied] = useState(false);

  const { name, principalId } = useSelector((state) => state.wallet);
  const { resolved } = useSelector((state) => state.icns);
  const { t } = useTranslation();
  const copyText = t('copy.copyText');
  const copiedText = t('copy.copiedText');

  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipText, setTooltipText] = useState(copyText);

  const handleWalletClick = () => {
    navigator.clipboard.writeText(principalId);
    setCopied(true);
    setTooltipText(copiedText);

    setTimeout(() => {
      setCopied(false);
    }, 2500);

    setTimeout(() => {
      setTooltipText(copyText);
    }, 3000);
  };
  console.log('resolved name: ', resolved);
  return (
    <Tooltip
      classes={{ tooltipPlacementBottom: classes.tooltip }}
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
        <Typography variant="h5">{resolved || name}</Typography>
        <Typography variant="subtitle2">{shortAddress(principalId)}</Typography>
      </div>
    </Tooltip>
  );
};

export default WalletInfo;
