import React, { useState, useRef } from 'react';
import clsx from 'clsx';
import extension from 'extensionizer';
import { useRouter } from '@components/Router';
import {
  Layout,
  UserIcon,
  CopyButton,
} from '@components';
import {
  Header,
  LinkButton,
  Container,
  FormItem,
  Dialog,
  Button,
} from '@ui';
import { useTranslation } from 'react-i18next';
import { HANDLER_TYPES, sendMessage } from '@background/Keyring';
import Picker from 'emoji-picker-react';
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import InputBase from '@material-ui/core/InputBase';
import Pencil from '@assets/icons/pencil.svg';
import BlueCheck from '@assets/icons/blue-check.svg';
import { Info /* , Globe,  ChevronDown */ } from 'react-feather';
// import MuiSwitch from '@material-ui/core/Switch';
// import { withStyles } from '@material-ui/core/styles';
import { icIdsUrl } from '@shared/constants/urls';
import { toast } from 'react-toastify';
import useStyles from './styles';
import { updateWalletDetails } from '../../../redux/wallet';

/*
const Switch = withStyles((theme) => ({
  root: {
    width: 44,
    height: 24,
    padding: 0,
    marginLeft: 'auto',
    marginRight: 15,
  },
  switchBase: {
    top: 1,
    left: 1,
    padding: 1,
    '&$checked': {
      transform: 'translateX(19px)',
      color: theme.palette.common.white,
      '& + $track': {
        backgroundColor: '#3574F4',
        opacity: 1,
        border: 'none',
      },
    },
    '&$focusVisible $thumb': {
      color: '#3574F4',
      border: '6px solid #fff',
    },
  },
  thumb: {
    width: 20,
    height: 20,
  },
  track: {
    borderRadius: 24 / 2,
    border: '1px solid #9CA3AF',
    backgroundColor: '#9CA3AF',
    opacity: 1,
    transition: theme.transitions.create(['background-color', 'border']),
  },
  checked: {},
  focusVisible: {},
}))(({ classes, ...props }) => (
  <MuiSwitch
    focusVisibleClassName={classes.focusVisible}
    disableRipple
    classes={{
      root: classes.root,
      switchBase: classes.switchBase,
      thumb: classes.thumb,
      track: classes.track,
      checked: classes.checked,
    }}
    {...props}
  />
));
*/

// const EXPANDED_HEIGHT = 667;
// const SHRINKED_HEIGHT = 460;

const WalletDetails = () => {
  const classes = useStyles();
  const {
    name, emoji, accountId, principalId, walletNumber,
  } = useSelector((state) => state.wallet);
  const { navigator } = useRouter();
  const { t } = useTranslation();
  const [openEmojis, setOpenEmojis] = useState(false);
  const [walletName, setWalletName] = useState(name);
  const [currentEmoji, setCurrentEmoji] = useState(emoji);
  const [edit, setEdit] = useState(false);
  // const [publicAccount, setPublicAccount] = useState(true);
  // const [expand, setExpand] = useState(false);

  // const handleChangePublicAccount = (event) => setPublicAccount(event.target.checked);

  const [openAccount, setOpenAccount] = useState(false);
  const [openPrincipal, setOpenPrincipal] = useState(false);

  const textInput = useRef(null);

  const dispatch = useDispatch();

  const handleChange = (e) => setWalletName(e.target.value);

  /* const handleChangeExpand = () => {
    const height = expand ? SHRINKED_HEIGHT : EXPANDED_HEIGHT;
    extension.windows.update(
      extension.windows.WINDOW_ID_CURRENT,
      {
        height,
      },
    );
    setExpand(!expand);
  }; */
  const onEmojiClick = (_event, emojiObject) => {
    setCurrentEmoji(emojiObject.emoji);
    setOpenEmojis(false);
  };

  const handleEditWalletName = () => {
    if (walletName.length > 20) {
      console.log('err??');
      toast('Wallet name should not be longer than 20 characters.', { type: 'error' });
    } else {
      setEdit(false);
      setOpenEmojis(false);

      sendMessage(
        {
          type: HANDLER_TYPES.EDIT_PRINCIPAL,
          params: {
            walletNumber,
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
        },
      );
    }
  };

  return (
    <Layout>
      <Header
        center={t('walletDetails.title')}
        right={(
          <LinkButton
            value={t('common.done')}
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

            <div className={
              clsx(
                classes.detailsContainer,
                edit ? classes.dcEdit : classes.dcNormal,
              )
            }
            >
              <UserIcon
                style={{ margin: '0 12px' }}
                size="big"
                icon={currentEmoji}
                onClick={() => (edit ? setOpenEmojis(!openEmojis) : null)}
                edit={edit}
              />
              <InputBase
                classes={{
                  root: clsx(classes.name, edit && classes.nameEdit),
                }}
                value={walletName}
                type="text"
                onChange={handleChange}
                readOnly={!edit}
                inputRef={textInput}
              />
              {
                edit
                  ? (
                    <img
                      className={classes.icon}
                      src={BlueCheck}
                      onClick={handleEditWalletName}
                    />
                  )
                  : (
                    <img
                      className={classes.icon}
                      src={Pencil}
                      onClick={() => { setEdit(true); textInput.current.focus(); }}
                    />
                  )
              }
            </div>
          </Grid>
          {
            openEmojis && edit
            && (
              <Picker
                pickerStyle={{
                  height: 157,
                  width: 'auto',
                  position: 'absolute',
                  top: 145,
                  left: 40,
                  right: 40,
                  zIndex: 1,
                }}
                onEmojiClick={onEmojiClick}
                native
                disableSearchBar
                groupVisibility={{
                  recently_used: false,
                  flags: false,
                }}
              />
            )
          }
          {
            /*
            <Grid item xs={12}>
            <div className={clsx(
              classes.accountContainer,
              publicAccount ? classes.publicAccount : classes.privateAccount,
            )}
            >
              <Globe
                className={classes.globe}
                size={20}
              />
              <span>{t('walletDetails.publicAccount')}</span>
              <Info
                className={classes.info}
                size={20}
              />
              <Switch
                checked={publicAccount}
                onChange={handleChangePublicAccount}
              />
            </div>
          </Grid>

          <Grid item xs={12}>
            <div
              className={classes.viewMore}
              onClick={handleChangeExpand}
              variant="subtitle1"
            >
              <span>{t('walletDetails.viewMore')}</span>
              <ChevronDown
                className={clsx(classes.chevron, expand && classes.rotate)}
                size={20}
              />
            </div>
          </Grid>
          */
          }
          <Grid item xs={12}>
            <FormItem
              label={t('common.principalId')}
              smallLabel
              endIcon={<CopyButton color="black" label="Copy" text={principalId} placement="left" />}
              component={(
                <div className={classes.ids}>
                  <Typography variant="subtitle2" className={classes.id}>{principalId}</Typography>
                  <Info
                    className={classes.idInfoIcon}
                    size={20}
                    onClick={() => setOpenPrincipal(true)}
                  />
                </div>
              )}
            />
            <Dialog
              title={t('walletDetails.whatIsPrincipal')}
              onClose={() => setOpenPrincipal(false)}
              open={openPrincipal}
              component={(
                <div className={classes.modal}>
                  <Typography>{t('walletDetails.principalDescription')}</Typography>
                  <Button
                    variant="rainbow"
                    value={t('send.icpModalButton1')}
                    onClick={() => setOpenPrincipal(false)}
                    fullWidth
                  />
                  <LinkButton
                    value={t('walletDetails.learnMorePrincipal')}
                    onClick={() => extension.tabs.create({ url: icIdsUrl })}
                  />
                </div>
              )}
            />
          </Grid>
          <Grid item xs={12} style={{ marginTop: -10 }}>
            <FormItem
              label={t('walletDetails.accountId')}
              smallLabel
              endIcon={<CopyButton color="black" label="Copy" text={accountId} placement="left" />}
              component={(
                <div className={classes.ids}>
                  <Typography variant="subtitle2" className={classes.id}>{accountId}</Typography>
                  <Info
                    className={classes.idInfoIcon}
                    size={20}
                    onClick={() => setOpenAccount(true)}
                  />
                </div>
              )}
            />
            <Dialog
              title={t('walletDetails.whatIsAccount')}
              onClose={() => setOpenAccount(false)}
              open={openAccount}
              component={(
                <div className={classes.modal}>
                  <Typography>{t('walletDetails.accountDescription')}</Typography>
                  <Button
                    variant="rainbow"
                    value={t('send.icpModalButton1')}
                    onClick={() => setOpenAccount(false)}
                    fullWidth
                  />
                  <LinkButton
                    value={t('walletDetails.learnMoreAccount')}
                    onClick={() => extension.tabs.create({ url: icIdsUrl })}
                  />
                </div>
              )}
            />
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};

export default WalletDetails;
