import React from 'react';
import {
  Container, Button, LinkButton, CodeBox,
} from '@ui';
import PropTypes from 'prop-types';
import { QRCode } from '@components';
import { Typography } from '@material-ui/core';
import { shortenString } from '@shared/helpers/stringHelper';
import { useTranslation } from 'react-i18next';
import useStyles from '../styles';
import { currencyPropTypes } from '../../../../shared/constants/currencies';
import { sourcePropTypes } from '../../../../shared/constants/sources';

const Step2 = ({ selectedSource, selectedAsset }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const walletName = 'Main IC Wallet';
  const address = '0xc6e8e3197dac52a68428030463584437227a3e5f';
  const code = 'dfx canister --no-wallet call $(dfx identity get-wallet) wallet_call "(record { canister=(principal "<dank-canister-id>"); method_name="deposit"; args=(blob "(principal "<user-pulg-principal>")"); cycles=<amount> })"';

  return (
    <Container>
      {
        selectedSource.id === 'PLUG_ACCOUNT'
        && (
          <div className={classes.plugContainer}>
            <QRCode value={address} />
            <div className={classes.textContainer}>
              <Typography variant="h3" className={classes.title}>{walletName}</Typography>
              <Typography variant="subtitle1">{shortenString(address)}</Typography>
            </div>
            <Button variant="rainbow" value={t('deposit.copyAddress')} onClick={() => navigator.clipboard.writeText(address)} />
            <LinkButton value={`${t('deposit.learnMore')} ${selectedAsset.name}`} />
          </div>
        )
      }
      {
        selectedSource.id === 'CYCLE_WALLET'
        && (
          <div className={classes.cyclesContainer}>
            <div>
              <Typography variant="h5" className={classes.command}>{t('deposit.runCommandTitle')}</Typography>
              <Typography variant="subtitle2">{t('deposit.runCommandSubtitle')}</Typography>
            </div>
            <CodeBox code={code} />
            <Button variant="primary" value={t('deposit.runCommandButton')} onClick={() => navigator.clipboard.writeText(address)} fullWidth />
          </div>
        )
      }
    </Container>
  );
};

export default Step2;

Step2.propTypes = {
  selectedSource: PropTypes.shape(sourcePropTypes).isRequired,
  selectedAsset: PropTypes.shape(currencyPropTypes).isRequired,
};
