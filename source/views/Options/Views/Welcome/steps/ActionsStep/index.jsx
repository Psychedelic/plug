import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import ImportImg from '@assets/icons/options/importwallet.svg';
import CreateImg from '@assets/icons/options/createwallet.svg';

import ActionCard from '../../components/ActionCard';
import useStyles from './styles';

const ActionsStep = ({ handleChangeBranch }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  return (
    <div className={classes.actionsStepContainer}>
      <ActionCard
        icon={ImportImg}
        title={t('welcome.importWallet')}
        subtitle={t('welcome.importText')}
        button={t('welcome.importWallet')}
        onClick={() => handleChangeBranch('import')}
        buttonProps={{ 'data-testid': 'import-wallet-button' }}
      />
      <ActionCard
        icon={CreateImg}
        title={t('welcome.createWallet')}
        subtitle={t('welcome.createText')}
        button={t('welcome.createWallet')}
        onClick={() => handleChangeBranch('create')}
        buttonProps={{ 'data-testid': 'create-wallet-button' }}
      />
    </div>
  );
};

export default ActionsStep;

ActionsStep.propTypes = {
  handleChangeBranch: PropTypes.func.isRequired,
};
