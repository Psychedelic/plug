import React from 'react';
import { Layout } from '@components';
import {
  Header, Button, Badge, Title,
} from '@ui';
import { useTranslation } from 'react-i18next';
import BackIcon from '@assets/icons/back.svg';

const NFTDetails = ({ nft }) => {
  const { t } = useTranslation();

  return (
    <Layout>
      <Header
        left={<LinkButton value={t('common.back')} onClick={() => null} startIcon={BackIcon} />}
        center={nft.name}
        right={null}
      />

      <img src={nft.img} />

      <div>
        <Button variant="default" value={t('nfts.goToMarketplace')} />
        <Button variant="rainbow" value={t('common.send')} />
      </div>

      <div>
        <Title icon={null} value={t('nfts.collection')} />
        <Badge value="ICPunk" />
        <Badge value={nft.id} />
      </div>

    </Layout>
  );
};

export default NFTDetails;
