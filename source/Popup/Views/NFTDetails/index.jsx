import React from 'react';
import { Layout } from '@components';
import {
  Header, Button, Badge, LinkButton,
} from '@ui';
import { useTranslation } from 'react-i18next';
import BackIcon from '@assets/icons/back.svg';
import { useDispatch, useSelector } from 'react-redux';
import { TABS, useRouter } from '@components/Router';
import ICPunksLogo from '@assets/icons/nfts/icpunks.png';
import CollectionImg from '@assets/icons/nfts/collection.png';
import DescriptionImg from '@assets/icons/nfts/description.png';
import AttributesImg from '@assets/icons/nfts/attributes.png';
import AboutImg from '@assets/icons/nfts/about.png';
import { Typography } from '@material-ui/core';
import { setSelectedNft } from '@redux/nfts';
import Section from './components/section';
import useStyles from './styles';

const NFTDetails = () => {
  const { t } = useTranslation();
  const { selectedNft: nft } = useSelector((state) => state.nfts);
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

  const fallbackNftUrl = (url) => (url?.includes?.('https') ? url : `https://qcg3w-tyaaa-aaaah-qakea-cai.raw.ic0.app${url}`);

  return (
    <Layout>
      <Header
        left={<LinkButton value={t('common.back')} onClick={handleBack} startIcon={BackIcon} />}
        center={nft?.name}
        right={null}
      />
      <div className={classes.container}>

        <img src={fallbackNftUrl(nft?.url)} className={classes.image} />

        <div className={classes.buttonContainer}>
          <Button
            variant="default"
            value={t('nfts.goToMarketplace')}
            style={{ width: '96%' }}
            fullWidth
            disabled
          />
          <Button
            variant="rainbow"
            value={t('common.send')}
            style={{ width: '96%' }}
            wrapperStyle={{ textAlign: 'right' }}
            fullWidth
            onClick={() => navigator.navigate('send-nft')}
          />
        </div>

        <Section icon={CollectionImg} title={t('nfts.collection')}>
          <Badge value="ICPunk" icon={ICPunksLogo} />
          <Badge value={`#${nft?.id}`} />
        </Section>
        {!!nft?.desc && (
          <Section icon={DescriptionImg} title={t('nfts.description')}>
            <Typography variant="subtitle1">{nft?.desc}</Typography>
          </Section>
        )}
        <Section icon={AttributesImg} title={t('nfts.attributes')}>
          {
            nft?.properties.map((prop) => (
              <Badge
                name={prop.name}
                value={prop.value}
              />
            ))
          }
        </Section>

        <Section icon={AboutImg} title="About ICPunks" style={{ paddingBottom: 24 }}>
          <Typography variant="subtitle1">
            10,000 randomly generated, unique collectible clowns
            with proof of ownership stored on the Internet Computer blockchain.
            Created as a reference to a meme comparing the Internet Computer token (ICP) with the
            Insane Clown Posse - an American hip hop duo founded in 1989.
          </Typography>
        </Section>

      </div>
    </Layout>
  );
};

export default NFTDetails;
