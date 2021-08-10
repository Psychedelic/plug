import React, { useState, useEffect, useRef } from 'react';
import clsx from 'clsx';
import { useRouter } from '@components/Router';
import {
  Layout,
  UserIcon,
} from '@components';
import {
  Header,
  LinkButton,
  Container,
  FormItem,
} from '@ui';
import { useTranslation } from 'react-i18next';
import BackIcon from '@assets/icons/back.svg';
import { HANDLER_TYPES, sendMessage } from '@background/Keyring';
import Picker from 'emoji-picker-react';
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { updateWalletDetails } from '../../../redux/wallet';
import useStyles from './styles';
import InputBase from '@material-ui/core/InputBase';
import Pencil from '@assets/icons/pencil.svg';
import BlueCheck from '@assets/icons/blue-check.svg';
import { Info, Globe, ChevronDown } from 'react-feather';
import MuiSwitch from '@material-ui/core/Switch';
import { withStyles } from '@material-ui/core/styles';
import extension from 'extensionizer';

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
    border: `1px solid #9CA3AF`,
    backgroundColor: '#9CA3AF',
    opacity: 1,
    transition: theme.transitions.create(['background-color', 'border']),
  },
  checked: {},
  focusVisible: {},
}))(({ classes, ...props }) => {
  return (
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
  );
});

const WalletDetails = () => {
  const classes = useStyles();
  const { name, emoji, accountId, principalId } = useSelector((state) => state.wallet);
  const { navigator } = useRouter();
  const { t } = useTranslation();
  const [openEmojis, setOpenEmojis] = useState(false);
  const [walletName, setWalletName] = useState(name);
  const [currentEmoji, setCurrentEmoji] = useState(emoji);
  const [edit, setEdit] = useState(false);
  const [publicAccount, setPublicAccount] = useState(true);
  const [expand, setExpand] = useState(false);

  const handleChangePublicAccount = (event) => setPublicAccount(event.target.checked);

  let textInput = useRef(null);

  useEffect(() => {
    setCurrentEmoji(emoji);
    setWalletName(name);
  }, [name, emoji]);

  const dispatch = useDispatch();

  const handleChange = (e) => setWalletName(e.target.value);

  const handleChangeExpand = () => {
    const height = expand ? 460 : 667;
    extension.windows.update(
      extension.windows.WINDOW_ID_CURRENT,
      {
        height
      },
    );
    setExpand(!expand);
  };
  const onEmojiClick = (_event, emojiObject) => {
    setCurrentEmoji(emojiObject.emoji);
    setOpenEmojis(false);
  };

  const onSave = () => {
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

            <div className={
              clsx(
                classes.detailsContainer,
                edit ? classes.dcEdit : classes.dcNormal
              )}
            >
              <UserIcon
                style={{ margin: '0 12px' }}
                big icon={currentEmoji}
                onClick={() => { edit && setOpenEmojis(!openEmojis) }}
                edit={edit}
              />
              <InputBase
                classes={{
                  root: clsx(classes.name, edit && classes.nameEdit),
                }}
                value={walletName}
                type='text'
                onChange={handleChange}
                readOnly={!edit}
                inputRef={textInput}
              >
                <img />
              </InputBase>
              {
                edit
                  ? <img className={classes.icon} src={BlueCheck} onClick={() => { setEdit(false); onSave() }} />
                  : <img className={classes.icon} src={Pencil} onClick={() => { setEdit(true); textInput.current.focus(); }} />
              }
            </div>
          </Grid>
          {
            openEmojis
            && (
              <Picker
                pickerStyle={{ width: '100%', height: 266, position: 'absolute', top: 50 }}
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
          <Grid item xs={12}>
            <div className={clsx(classes.accountContainer, publicAccount ? classes.publicAccount : classes.privateAccount)}>
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
              variant="subtitle1">
              <span>{t('walletDetails.viewMore')}</span>
              <ChevronDown
                className={clsx(classes.chevron, expand && classes.rotate)}
                size={20}
              />
            </div>
          </Grid>

          {
            expand
            && <>
              <Grid item xs={12}>
                <FormItem
                  label={t('common.principalId')}
                  smallLabel
                  component={(
                    <div className={classes.ids}>
                      <Typography variant="subtitle2" className={classes.id}>{principalId}</Typography>
                      <Info
                        className={classes.idInfoIcon}
                        size={20}
                      />
                    </div>
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <FormItem
                  label={t('walletDetails.accountId')}
                  smallLabel
                  component={(
                    <div className={classes.ids}>
                      <Typography variant="subtitle2" className={classes.id}>{accountId}</Typography>
                      <Info
                        className={classes.idInfoIcon}
                        size={20}
                      />
                    </div>
                  )}
                />
              </Grid>
            </>
          }



        </Grid>
      </Container>
    </Layout >
  );
};

export default WalletDetails;
