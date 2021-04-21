import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Layout } from '@components';
import {
  Header, LinkButton, FormInput, Button, Container,
} from '@ui';
import { useTranslation } from 'react-i18next';
import { useRouter } from '@components/Router';
import BackIcon from '@assets/icons/back.svg';

const WalletName = ({ currentWalletName, handleSaveWalletName }) => {
  const { navigator } = useRouter();
  const { t } = useTranslation();
  const [walletName, setWalletName] = useState(currentWalletName);

  const handleChange = (e) => setWalletName(e.target.value);

  return (
    <Layout>
      <Header
        left={(
          <LinkButton
            value={t('common.back')}
            onClick={() => navigator.navigate('settings')}
            startIcon={BackIcon}
          />
        )}
        value={t('walletName.title')}
        right={(
          <LinkButton
            value={t('common.close')}
            onClick={() => navigator.navigate('home')}
          />
        )}
      />
      <Container>
        <FormInput id="name" label={t('walletName.label')} type="text" value={walletName} onChange={handleChange} />
        <Button value={t('common.save')} variant="rainbow" fullWidth onClick={() => handleSaveWalletName()} />
      </Container>
    </Layout>
  );
};

export default WalletName;

WalletName.defaultProps = {
  currentWalletName: 'Main IC Wallet', // I'll leave it like this until we have redux
  handleSaveWalletName: () => null,
};

WalletName.propTypes = {
  currentWalletName: PropTypes.string,
  handleSaveWalletName: PropTypes.func,
};
