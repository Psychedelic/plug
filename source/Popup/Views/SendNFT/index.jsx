import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import BackIcon from '@assets/icons/back.svg';
import { Layout } from '@components';
import { TABS, useRouter } from '@components/Router';
import { Header, LinkButton } from '@ui';
import InputStep from './components/InputStep';

const SendNFT = () => {
  const { t } = useTranslation();
  const { navigator } = useRouter();
  const { selectedNft: nft } = useSelector((state) => state.nfts);

  useEffect(() => {
    if (!nft) {
      navigator.navigate('home', TABS.NFTS);
    }
  }, [nft]);

  // const { title, component, currentStep } = useSteps();

  return (
    <Layout>
      <Header
        left={<LinkButton value={t('common.back')} onClick={() => navigator.navigate('nft-details')} startIcon={BackIcon} />}
        center={t('nfts.send')}
        right={<LinkButton value={t('common.close')} onClick={() => navigator.navigate('home')} />}
      />
      <InputStep />
    </Layout>
  );
};

export default SendNFT;
