import React, { useState } from 'react';
import { Layout, UserIcon } from '@components';
import {
  Header, LinkButton, FormInput, Button, Container, FormItem, Alert,
} from '@ui';
import { useTranslation } from 'react-i18next';
import { useRouter } from '@components/Router';
import BackIcon from '@assets/icons/back.svg';
import Picker from 'emoji-picker-react';
import Grid from '@material-ui/core/Grid';
import { useSelector, useDispatch } from 'react-redux';
import { updateWalletDetails } from '../../../redux/wallet';

const WalletDetails = () => {
  const { name, emoji } = useSelector((state) => state.wallet);

  const { navigator } = useRouter();
  const { t } = useTranslation();
  const [openEmojis, setOpenEmojis] = useState(false);
  const [walletName, setWalletName] = useState(name);
  const [currentEmoji, setCurrentEmoji] = useState(emoji);

  const dispatch = useDispatch();

  const handleChange = (e) => setWalletName(e.target.value);

  const onEmojiClick = (_event, emojiObject) => {
    setCurrentEmoji(emojiObject.emoji);
    setOpenEmojis(false);
  };

  const onSave = () => {
    dispatch(updateWalletDetails({
      name: walletName,
      emoji: currentEmoji,
    }));
  };

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
        center={t('walletDetails.title')}
        right={(
          <LinkButton
            value={t('common.close')}
            onClick={() => navigator.navigate('home')}
          />
        )}
      />
      <Container>
        <Grid container spacing={2}>
          <Grid
            item
            xs={12}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            <UserIcon big icon={currentEmoji} />
            <Button
              variant="primaryOutlined"
              value={t('walletDetails.editWalletPic')}
              onClick={() => setOpenEmojis(!openEmojis)}
              style={{ marginTop: 12 }}
            />
          </Grid>
          {
            openEmojis
            && (
              <Grid item xs={12}>
                <Picker
                  pickerStyle={{ width: '100%', height: 266 }}
                  onEmojiClick={onEmojiClick}
                  native
                  disableSearchBar
                  groupVisibility={{
                    recently_used: false,
                  }}
                />
              </Grid>
            )
          }
          <Grid item xs={12}>
            <FormInput id="name" label={t('walletDetails.name')} type="text" value={walletName} onChange={handleChange} />
          </Grid>
          <Grid item xs={12}>
            <FormItem
              label={t('common.accountId')}
              smallLabel
              component={(
                <Alert
                  title="rwlgt-iiaaa-aaaaa-aaaaa-cai"
                  type="info"
                  endIcon
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Button value={t('common.save')} variant="rainbow" fullWidth onClick={() => onSave()} />
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};

export default WalletDetails;
