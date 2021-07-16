import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { useRouter } from '@components/Router';
import {
  Layout,
  UserIcon,
  CopyButton,
} from '@components';
import {
  Header,
  LinkButton,
  FormInput,
  Button,
  Container,
  FormItem,
} from '@ui';
import { useTranslation } from 'react-i18next';
import BackIcon from '@assets/icons/back.svg';
import { HANDLER_TYPES, sendMessage } from '@background/Keyring';
import Picker from 'emoji-picker-react';
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';
import shortAddress from '@shared/utils/short-address';
import { useSelector, useDispatch } from 'react-redux';
import { updateWalletDetails } from '../../../redux/wallet';
import useStyles from './styles';

const WalletDetails = () => {
  const classes = useStyles();
  const { name, emoji, accountId } = useSelector((state) => state.wallet);
  const { navigator } = useRouter();
  const { t } = useTranslation();
  const [openEmojis, setOpenEmojis] = useState(false);
  const [walletName, setWalletName] = useState(name);
  const [currentEmoji, setCurrentEmoji] = useState(emoji);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    setCurrentEmoji(emoji);
    setWalletName(name);
  }, [name, emoji]);

  const dispatch = useDispatch();

  const handleChange = (e) => setWalletName(e.target.value);

  const onEmojiClick = (_event, emojiObject) => {
    setCurrentEmoji(emojiObject.emoji);
    setOpenEmojis(false);
  };

  const onSave = () => {
    setDisabled(true);
    sendMessage(
      {
        type: HANDLER_TYPES.EDIT_PRINCIPAL,
        params: {
          walletNumber: 0,
          name: walletName,
          emoji: currentEmoji,
        },
      },
      () => {
        dispatch(updateWalletDetails({
          name: walletName,
          emoji: currentEmoji,
        }));
        setWalletName(walletName);
        setCurrentEmoji(currentEmoji);
        setDisabled(false);
      },
    );
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
                <div className={classes.addressContainer}>
                  <Typography variant="h4" style={{ marginRight: 'auto' }}>{shortAddress(accountId)}</Typography>
                  <div className={clsx(classes.badge, classes.accountBadge)}>
                    {t('common.accountId')}
                  </div>
                  <CopyButton text={accountId} placement="top" />
                </div>
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              value={t('common.save')}
              variant="rainbow"
              fullWidth
              onClick={onSave}
              disabled={disabled}
            />
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};

export default WalletDetails;
