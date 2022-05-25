import React, { useEffect, useMemo } from 'react';
import { Layout } from '@components';
import {
  Header, Button, Badge, LinkButton, NFTDisplayer, ICNSDisplay,
} from '@ui';
import { useTranslation } from 'react-i18next';
import BackIcon from '@assets/icons/back.svg';
import { useDispatch, useSelector } from 'react-redux';
import { TABS, useRouter } from '@components/Router';
import CollectionImg from '@assets/icons/nfts/collection.png';
import DescriptionImg from '@assets/icons/nfts/description.png';
import AttributesImg from '@assets/icons/nfts/attributes.png';
import AboutImg from '@assets/icons/nfts/about.png';
import { Typography } from '@material-ui/core';
import { setSelectedNft } from '@redux/nfts';
import { Maximize2 } from 'react-feather';
import extension from 'extensionizer';

import Section from './components/section';
import useStyles from './styles';

const NFTDetails = () => {
  const { t } = useTranslation();
  const { selectedNft: nft } = useSelector((state) => state.nfts);
  const { collections } = useSelector((state) => state.wallet);
  const { navigator } = useRouter();
  const classes = useStyles();
  const dispatch = useDispatch();
  if (!nft) {
    navigator.navigate('home');
    return null;
  }

  const handleBack = () => {
    dispatch(setSelectedNft(null));
    navigator.navigate('home', TABS.NFTS);
  };

  const collection = useMemo(() => collections?.find((col) => col.name === nft?.collection),
    [collections, nft]);

  const name = `${nft?.name ?? `#${nft?.index}`}`;
  const isICNS = nft?.collection === 'ICNS';

  const openNFT = (url) => () => extension.tabs.create({
    url: isICNS
      ? `https://icns.id/domains/${nft?.name.replace('.icp', '')}/detail`
      : url,
  });

  const nftDefaultTag = nft.canisterId === 'pk6rk-6aaaa-aaaae-qaazq-cai' ? 'iframe' : undefined;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Layout>
      <Header
        left={<LinkButton value={t('common.back')} onClick={handleBack} startIcon={BackIcon} />}
        center={name}
        right={null}
      />
      <div className={classes.container}>
        {isICNS ? (
          <ICNSDisplay icns={nft} className={classes.image} large />
        ) : (
          <NFTDisplayer url={nft?.url} className={classes.image} defaultTag={nftDefaultTag} interactive />
        )}
        <div className={classes.buttonContainer}>
          <Button
            variant="default"
            value={t('nfts.expandNFT')}
            style={{ width: '96%' }}
            fullWidth
            onClick={openNFT(nft?.url?.replace('type=thumbnail', ''))}
            startIcon={(
              <Maximize2
                size="20"
              />
            )}
          />
          <Button
            variant="rainbow"
            value={t('common.send')}
            style={{ width: '96%' }}
            wrapperStyle={{ textAlign: 'right' }}
            fullWidth
            onClick={() => navigator.navigate('send-nft')}
            disabled={isICNS}
          />
        </div>
        <Section icon={CollectionImg} title={t('nfts.collection')}>
          <Badge value={nft?.collection} icon={collection?.icon} iconClassName={classes.icnsIcon} />
          <Badge value={name} />
        </Section>
        {!!nft?.desc && (
          <Section icon={DescriptionImg} title={t('nfts.description')}>
            <Typography variant="subtitle1">{nft?.desc}</Typography>
          </Section>
        )}
        {nft?.metadata?.properties?.filter((prop) => typeof prop?.value !== 'object')?.length >= 1 && (
          <Section icon={AttributesImg} title={t('nfts.attributes')}>
            {
              nft?.metadata?.properties?.map((prop) => ((
                <Badge
                  name={prop.name}
                  value={prop?.value}
                />
              )))
            }
          </Section>
        )}
        {collection?.description && (
          <Section icon={AboutImg} title="About" style={{ paddingBottom: 24 }}>
            <Typography variant="subtitle1" className={classes.description}>
              {collection?.description}
            </Typography>
          </Section>
        )}
      </div>
    </Layout>
  );
};

export default NFTDetails;
