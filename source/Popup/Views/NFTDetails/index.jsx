import React from 'react';
import { Layout } from '@components';
import {
  Header, Button, Badge, Title, LinkButton,
} from '@ui';
import { useTranslation } from 'react-i18next';
import BackIcon from '@assets/icons/back.svg';
import { useSelector } from 'react-redux';
import { useRouter } from '@components/Router';
import ICPunksLogo from '@assets/icons/nfts/icpunks.png';
import CollectionImg from '@assets/icons/nfts/collection.png';
import DescriptionImg from '@assets/icons/nfts/description.png';
import AttributesImg from '@assets/icons/nfts/attributes.png';
import { Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import useStyles from './styles';

const Section = ({ icon, title, children }) => {
  const classes = useStyles();
  return (
    <div className={classes.section}>
      <Title icon={icon} value={title} />
      <div className={classes.content}>
        {children}
      </div>
    </div>
  );
};

Section.propTypes = {
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

const NFTDetails = () => {
  const { t } = useTranslation();
  const { selectedNft: nft } = useSelector((state) => state.nfts);
  const { navigator } = useRouter();
  const classes = useStyles();

  if (!nft) {
    navigator.navigate('home');
    return null;
  }

  return (
    <Layout>
      <Header
        left={<LinkButton value={t('common.back')} onClick={() => navigator.navigate('home', 1)} startIcon={BackIcon} />}
        center={nft?.name}
        right={null}
      />
      <div className={classes.container}>

        <img src={nft?.img} className={classes.image} />

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
          />
        </div>

        <Section icon={CollectionImg} title={t('nfts.collection')}>
          <Badge value="ICPunk" icon={ICPunksLogo} />
          <Badge value={`#${nft?.id}`} />
        </Section>

        <Section icon={DescriptionImg} title={t('nfts.description')}>
          <Typography variant="subtitle1">{nft?.desc}</Typography>
        </Section>

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

      </div>
    </Layout>
  );
};

export default NFTDetails;
