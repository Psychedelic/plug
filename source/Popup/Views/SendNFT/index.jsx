import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import BackIcon from '@assets/icons/back.svg';
import { Layout, IDInput } from '@components';
import { useRouter } from '@components/Router';
import {
  Header, LinkButton, Container, FormItem, Select, Button,
} from '@ui';
import { Grid } from '@material-ui/core';
import { validatePrincipalId } from '@shared/utils/ids';
import { useContacts } from '@hooks'; 

const SendNFT = () => {
  const { t } = useTranslation();
  const [address, setAddress] = useState('');
  const [selectedContact, setSelectedContact] = useState();
  const { contacts } = useContacts();
  const { navigator } = useRouter();
  const transferNFT = () => {};

  const handleAddressChange = (val) => setAddress(val);
  const handleSelectContact = (val) => setSelectedContact(val);
  return (
    <Layout>
      <Header
        left={<LinkButton value={t('common.back')} onClick={() => navigator.navigate('nft-details')} startIcon={BackIcon} />}
        center={t('nfts.send')}
        right={<LinkButton value={t('common.close')} onClick={() => navigator.navigate('home')} />}
      />
      <Container>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormItem
              label={t('nfts.nft')}
              component={(
                <Select
                  image="https://icpunks.com/img/Clown1.png"
                  name="Punk #10"
                  text="#10"
                  shadow
                />
            )}
            />
          </Grid>
          <Grid item xs={12}>
            <FormItem
              label={t('nfts.sendTo')}
              component={(
                <IDInput
                  value={address}
                  onChange={handleAddressChange}
                  addressInfo={{ isValid: validatePrincipalId(address) }}
                  contacts={contacts}
                  selectedContact={selectedContact}
                  handleSelectedContact={handleSelectContact}
                  placeholder={t('nfts.inputPrincipalId')}
                />
            )}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="rainbow"
              value={t('common.continue')}
              fullWidth
              disabled={
                !validatePrincipalId(address)
                || address === null
                || address === ''
              }
              onClick={transferNFT}
            />
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};

export default SendNFT;
