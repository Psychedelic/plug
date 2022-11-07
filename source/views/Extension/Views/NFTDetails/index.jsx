import React, { useEffect, useMemo, useState } from 'react';
import {
  Layout,
  Header, Button, Badge, LinkButton, NFTDisplayer, ICNSDisplay,
} from '@components';
import { HttpAgent } from '@dfinity/agent';
import { getNFTActor } from '@psychedelic/dab-js';
import { useTranslation } from 'react-i18next';
import BackIcon from '@assets/icons/back.svg';
import ExpandIcon from '@assets/icons/expand.svg';
import { useDispatch, useSelector } from 'react-redux';
import { TABS, useRouter } from '@components/Router';
import CollectionImg from '@assets/icons/nfts/collection.png';
import DescriptionImg from '@assets/icons/nfts/description.png';
import AttributesImg from '@assets/icons/nfts/attributes.png';
import AboutImg from '@assets/icons/nfts/about.png';
import { Typography } from '@material-ui/core';
import { setSelectedNft } from '@redux/nfts';
import { ArrowUpRight } from 'react-feather';
import extension from 'extensionizer';
import { NFT_COLLECTION_DEFAULT_TYPES } from '@shared/constants/nft';

import Section from './components/section';
import useStyles from './styles';

const getTokenDetails = async ({ index, canister, standard }) => {
  const agent = new HttpAgent({ host: 'https://ic0.app/' });
  const NFTActor = getNFTActor({ canisterId: canister, standard, agent });
  const details = await NFTActor.details(index);
  return details;
}

const NFTDetails = () => {
  const { t } = useTranslation();
  const { selectedNft: nft, collections } = useSelector((state) => state.nfts);
  const { navigator: routerNavigator } = useRouter();
  const [populatedNFT, setPopulatedNFT] = useState(nft);
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

  const collection = useMemo(() => collections?.find((col) => col.canisterId === nft?.canister),
    [collections, nft]);

  const name = `${nft?.name ?? `#${nft?.index}`}`;
  const isICNS = collection?.name === 'ICNS';

  const openNFT = (url) => {
    const parsedUrl = isICNS
      ? `https://icns.id/domains/${nft?.name.replace('.icp', '')}/detail`
      : url;

    extension.tabs.create({
      url: parsedUrl?.replace('type=thumbnail', ''),
    });
  };

  const copyNFT = (url) => navigator.clipboard.writeText(url);

  // eslint-disable-next-line no-confusing-arrow
  const handleButtonClick = (url) => isICNS ? openNFT(url) : copyNFT(url);

  const nftDefaultTag = NFT_COLLECTION_DEFAULT_TYPES[populatedNFT.canister];

  useEffect(() => {
    window.scrollTo(0, 0);
    getTokenDetails(nft).then((details) => setPopulatedNFT({ ...nft, ...details }));
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
            onClick={() => openNFT(nft?.url)}
            data-testid="expand-nft"
          />
        )}
      />
      <div className={classes.container}>
        {isICNS ? (
          <ICNSDisplay icns={populatedNFT} className={classes.image} large />
        ) : (
          <NFTDisplayer url={populatedNFT?.url} className={classes.image} defaultTag={nftDefaultTag} interactive />
        )}
        <div className={classes.buttonContainer}>
          <Button
            variant="default"
            value={t(`nfts.${isICNS ? 'manage' : 'copyLink'}`)}
            style={{ width: '96%' }}
            fullWidth
            onClick={() => handleButtonClick(populatedNFT?.url?.replace('type=thumbnail', ''))}
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
          <Badge value={collection?.name} icon={collection?.icon} iconClassName={classes.icnsIcon} />
          <Badge value={name} />
        </Section>
        {!!populatedNFT?.desc && (
          <Section icon={DescriptionImg} title={t('nfts.description')}>
            <Typography variant="subtitle1">{populatedNFT?.desc}</Typography>
          </Section>
        )}
        {!isICNS && populatedNFT?.metadata?.properties?.filter((prop) => typeof prop?.value !== 'object')?.length >= 1 && (
          <Section icon={AttributesImg} title={t('nfts.attributes')}>
            {
              populatedNFT?.metadata?.properties?.map((prop) => ((
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
