import React, { useEffect, useMemo } from 'react';
import {
  Layout,
  Header, Button, Badge, LinkButton, NFTDisplayer, ICNSDisplay,
} from '@components';
import { useTranslation } from 'react-i18next';
import BackIcon from '@assets/icons/back.svg';
import ExpandIcon from '@assets/icons/expand.svg';
import { useDispatch, useSelector } from 'react-redux';
import CollectionImg from '@assets/icons/nfts/collection.png';
import DescriptionImg from '@assets/icons/nfts/description.png';
import AttributesImg from '@assets/icons/nfts/attributes.png';
import AboutImg from '@assets/icons/nfts/about.png';
import { Typography } from '@material-ui/core';
import { setSelectedNft } from '@redux/nfts';
import { ArrowUpRight } from 'react-feather';
import extension from 'extensionizer';
import { NFT_COLLECTION_DEFAULT_TYPES } from '@shared/constants/nft';
import { TABS, useRouter } from '@components/Router';

import Section from './components/section';
import useStyles from './styles';

const NFTDetails = () => {
  const { t } = useTranslation();
  const { selectedNft: nft } = useSelector((state) => state.nfts);
  const { collections } = useSelector((state) => state.wallet);
  const { navigator: routerNavigator } = useRouter();
  const classes = useStyles();
  const dispatch = useDispatch();
  if (!nft) {
    routerNavigator.navigate('home');
    return null;
  }

  const handleBack = () => {
    dispatch(setSelectedNft(null));
    routerNavigator.navigate('home', TABS.NFTS);
  };

  const collection = useMemo(() => collections?.find((col) => col.name === nft?.collection),
    [collections, nft]);

  const name = `${nft?.name ?? `#${nft?.index}`}`;
  const isICNS = nft?.collection === 'ICNS';

  const openNFT = (url) => {
    const parsedUrl = isICNS
      ? `https://icns.id/domains/${nft?.name.replace('.icp', '')}/detail`
      : url;

    extension.tabs.create({
      url: parsedUrl,
    });
  };

  const copyNFT = (url) => navigator.clipboard.writeText(url);

  // eslint-disable-next-line no-confusing-arrow
  const handleButtonClick = (url) => isICNS ? openNFT(url) : copyNFT(url);

  const nftDefaultTag = NFT_COLLECTION_DEFAULT_TYPES[nft.canisterId];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Layout>
      <Header
        left={<LinkButton value={t('common.back')} onClick={handleBack} startIcon={BackIcon} />}
        center={name}
        right={!isICNS && (
          <img
            className={classes.expandIcon}
            src={ExpandIcon}
            data-testid="expand-nft"
            onClick={() => openNFT(nft?.url?.replace('type=thumbnail', ''))}
            data-testid="expand-nft"
          />
        )}
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
            value={t(`nfts.${isICNS ? 'manage' : 'copyLink'}`)}
            style={{ width: '96%' }}
            fullWidth
            onClick={() => handleButtonClick(nft?.url?.replace('type=thumbnail', ''))}
            buttonTestId="copy-link-button"
            endIcon={isICNS && (
              <ArrowUpRight
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
            onClick={() => routerNavigator.navigate('send-nft')}
            disabled={isICNS}
            data-testid="send-nft-button"
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
