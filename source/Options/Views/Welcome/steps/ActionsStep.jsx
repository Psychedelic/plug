import React from 'react';
import PropTypes from 'prop-types';
import { ActionCard } from '@ui';
import Grid from '@material-ui/core/Grid';
import ImportImg from '@assets/icons/options/importwallet.svg';
import CreateImg from '@assets/icons/options/createwallet.svg';
import { useTranslation } from 'react-i18next';

const ActionsStep = ({ handleChangeBranch }) => {
  const { t } = useTranslation();

  return (
    <>
      <Grid item xs={12} md={6}>
        <ActionCard
          icon={ImportImg}
          title={t('welcome.importWallet')}
          subtitle={t('welcome.importText')}
          button={t('welcome.importWallet')}
          onClick={() => handleChangeBranch('import')}
          buttonProps={{ 'data-testid': 'import-wallet-button' }}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <ActionCard
          icon={CreateImg}
          title={t('welcome.createWallet')}
          subtitle={t('welcome.createText')}
          button={t('welcome.createWallet')}
          onClick={() => handleChangeBranch('create')}
          buttonProps={{ 'data-testid': 'create-wallet-button' }}
        />
      </Grid>
    </>
  );
};

export default ActionsStep;

ActionsStep.propTypes = {
  handleChangeBranch: PropTypes.func.isRequired,
};
