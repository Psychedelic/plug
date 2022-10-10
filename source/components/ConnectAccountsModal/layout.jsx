import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { Typography } from '@material-ui/core';

import { getTabURL } from '@shared/utils/chrome-tabs';
import { useScroll } from '@hooks';
import Checkbox from '../Checkbox';

import ConnectAccountItem from './components/ConnectAccountItem';
import useStyles from './styles';

const ConnectAccountsModalLayout = ({
  tab,
  app,
  wallets,
  selectAllWallets,
  handleSelectAll,
  onCheckWallet,
  connectedWallets,
  walletsToUpdate,
  icnsNames,
}) => {
  const { t } = useTranslation();
  const { onScroll, fullScroll } = useScroll();
  const classes = useStyles();
  const headerReady = tab && app;
  const scrollShadow = wallets?.length > 3 && !fullScroll;
  return (
    <div>
      {headerReady && (
      <div className={classes.infoContainer}>
        <img src={app?.icon} className={classes.appImage} />
        <Typography variant="h2" className={classes.title}>{getTabURL(tab)}</Typography>
        <Typography variant="subtitle1">{t('profile.wantToConnect')}</Typography>
      </div>
      )}
      <Checkbox
        checked={selectAllWallets}
        handleChange={handleSelectAll}
        label="Select all"
      />
      <div
        className={clsx(classes.walletsContainer, scrollShadow && classes.scrollShadow)}
        onScroll={onScroll}
      >
        {wallets.map((wallet) => {
          const alreadyConnected = connectedWallets.includes(wallet.walletId);
          return (
            <ConnectAccountItem
              name={icnsNames[wallet?.principal] || wallet?.name}
              wallet={wallet}
              connected={alreadyConnected}
              checked={
                  !!walletsToUpdate[wallet.walletId]
                  || alreadyConnected
                }
              onCheck={onCheckWallet}
            />
          );
        })}
      </div>

    </div>
  );
};

ConnectAccountsModalLayout.propTypes = {
  wallets: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)).isRequired,
  connectedWallets: PropTypes.arrayOf(PropTypes.number),
  onCheckWallet: PropTypes.func.isRequired,
  handleSelectAll: PropTypes.func.isRequired,
  walletsToUpdate: PropTypes.arrayOf(PropTypes.number).isRequired,
  app: PropTypes.objectOf(PropTypes.string).isRequired,
  tab: PropTypes.objectOf(PropTypes.string).isRequired,
  selectAllWallets: PropTypes.bool.isRequired,
  icnsNames: PropTypes.objectOf(PropTypes.string),
};

ConnectAccountsModalLayout.defaultProps = {
  connectedWallets: [],
  icnsNames: {},
};

export default ConnectAccountsModalLayout;
