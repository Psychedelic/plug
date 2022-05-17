import React, { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import Picker from 'emoji-picker-react';
import { useSelector, useDispatch } from 'react-redux';
import InputBase from '@material-ui/core/InputBase';
import { ChevronDown } from 'react-feather';
import { toast } from 'react-toastify';

import { HANDLER_TYPES, sendMessage } from '@background/Keyring';
import { updateWalletDetails } from '@redux/wallet';
import BlueCheck from '@assets/icons/blue-check.svg';
import Pencil from '@assets/icons/pencil.svg';
import { useRouter } from '@components/Router';
import {
  Layout,
  UserIcon,
} from '@components';
import {
  Header,
  LinkButton,
} from '@ui';
import { setUseICNS } from '@modules/storageManager';
import { setICNSData, setUseICNS as setReduxUseICNS } from '@redux/icns';

import useStyles from './styles';
import DetailItem from './components/DetailItem';
import ICNSToggle from './components/ICNSToggle';

const WalletDetails = () => {
  const classes = useStyles();
  const {
    name, emoji, accountId, principalId, walletNumber,
  } = useSelector((state) => state.wallet);
  const { resolved, useICNS } = useSelector((state) => state.icns);
  const { navigator } = useRouter();
  const { t } = useTranslation();
  const [openEmojis, setOpenEmojis] = useState(false);
  const [walletName, setWalletName] = useState(name);
  const [currentEmoji, setCurrentEmoji] = useState(emoji);
  const [edit, setEdit] = useState(false);
  const [expand, setExpand] = useState(false);

  const [openAccount, setOpenAccount] = useState(false);
  const [openPrincipal, setOpenPrincipal] = useState(false);

  const textInput = useRef(null);

  const dispatch = useDispatch();

  const handleChange = (e) => setWalletName(e.target.value);

  const onEmojiClick = (_event, emojiObject) => {
    setCurrentEmoji(emojiObject.emoji);
    setOpenEmojis(false);
  };

  const toggleExpand = () => setExpand(!expand);

  const openEditWalletName = () => {
    setEdit(true);
    textInput.current.focus();
  };

  const handleEditWalletName = () => {
    if (walletName.length > 20) {
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

  const handleToggleICNS = (event) => {
    const { checked } = event.target;
    dispatch(setReduxUseICNS(checked));
    setUseICNS(checked, walletNumber);
    if (!checked) {
      sendMessage({
        type: HANDLER_TYPES.SET_REVERSE_RESOLVED_NAME,
        params: '',
      }, (response) => {
        if (response.error) {
          // eslint-disable-next-line
          console.log('Error when resetting your reverse resolved name', response.error); // TODO HANDLE ERROR (shouldnt happen tho)
        } else {
          sendMessage({
            type: HANDLER_TYPES.GET_ICNS_DATA,
            params: { refresh: true },
          }, (icnsData) => {
            dispatch(setICNSData(icnsData));
          });
        }
      });
    }
  };

  useEffect(() => {
    sendMessage({
      type: HANDLER_TYPES.GET_ICNS_DATA,
      params: { refresh: true },
    }, (icnsData) => {
      dispatch(setICNSData(icnsData));
    });
  }, []);

  const hasActiveResolvedICNS = resolved && useICNS;
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
      <div className={classes.walletDetailsContainer}>
        <div className={clsx(classes.avatarContainer, edit && classes.avatarEdit)}>
          <UserIcon
            style={{ margin: '0 12px' }}
            size="big"
            icon={currentEmoji}
            onClick={() => (edit ? setOpenEmojis(!openEmojis) : null)}
            edit={edit}
          />
          <InputBase
            classes={{ root: clsx(classes.name, edit && classes.nameEdit) }}
            value={hasActiveResolvedICNS ? resolved : walletName}
            type="text"
            onChange={handleChange}
            readOnly={!edit || hasActiveResolvedICNS}
            inputRef={textInput}
          />
          {edit
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
                onClick={openEditWalletName}
              />
            )}
        </div>
        {openEmojis && edit && (
          <Picker
            pickerStyle={{
              height: 190,
              width: 'auto',
              position: 'absolute',
              top: 150,
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
        )}
        <ICNSToggle active={useICNS} handleToggle={handleToggleICNS} />
        <div
          className={classes.viewMore}
          onClick={toggleExpand}
          variant="subtitle1"
        >
          <span>{t('walletDetails.viewMore')}</span>
          <ChevronDown
            className={clsx(classes.chevron, expand && classes.rotate)}
            size={20}
          />
        </div>
        {expand && (
          <div className={classes.detailsContainer}>
            <DetailItem
              name="principalId"
              value={principalId}
              setInfoOpen={setOpenPrincipal}
              isOpen={openPrincipal}
            />
            <DetailItem
              name="accountId"
              value={accountId}
              setInfoOpen={setOpenAccount}
              isOpen={openAccount}
            />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default WalletDetails;
