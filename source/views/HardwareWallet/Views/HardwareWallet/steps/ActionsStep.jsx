import React from 'react';
import PropTypes from 'prop-types';
import { ActionCard } from '@components';
import Grid from '@material-ui/core/Grid';
import ImportImg from '@assets/icons/options/importwallet.svg';
import { useTranslation } from 'react-i18next';
import { HANDLER_TYPES, sendMessage } from '@background/Keyring';
import { getRandomEmoji } from '@shared/constants/emojis';
import ledger from '@ledgerhq/hw-transport-webhid';

const ActionsStep = ({ handleChangeBranch }) => {
  const { t } = useTranslation();

  const handleConnectLedger = async () => {
    const transport = await ledger.request();
    if (!transport) return;
    console.log(transport);
    sendMessage({ type: HANDLER_TYPES.IMPORT_LEDGER_ACCOUNT, params: { name: 'LEDGER', icon: getRandomEmoji() } }, (response) => {
      console.log(response);
      transport.close();
      console.log('transport closed');
    });
    console.log('identity');
  };

  return (
    <>
      <Grid item xs={12} md={6}>
        <ActionCard
          icon={ImportImg}
          title={t('ledger.connect')}
          subtitle={t('ledger.connectText')}
          button={t('ledger.connect')}
          onClick={handleConnectLedger}
          buttonProps={{ 'data-testid': 'import-wallet-button' }}
        />
      </Grid>
    </>
  );
};

export default ActionsStep;

ActionsStep.propTypes = {
  handleChangeBranch: PropTypes.func.isRequired,
};
