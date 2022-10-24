import React, { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import Picker from 'emoji-picker-react';
import { useSelector, useDispatch } from 'react-redux';
import InputBase from '@material-ui/core/InputBase';
import { ChevronDown } from 'react-feather';
import { toast } from 'react-toastify';
import extensionizer from 'extensionizer';

import { getWalletsConnectedToUrl, getApp, getUseICNS } from '@modules/storageManager';
import { getTabURL } from '@shared/utils/chrome-tabs';
import { ACCOUNT_ICON } from '@shared/constants/account';
import { HANDLER_TYPES, sendMessage } from '@background/Keyring';
import {
  setAccountInfo,
  setAssets,
  setAssetsLoading,
  setCollections,
  setTransactions,
  updateWalletDetails,
} from '@redux/wallet';
import { useICPPrice } from '@redux/icp';
import { getContacts } from '@redux/contacts';
import { setICNSData, setUseICNS as setReduxUseICNS } from '@redux/icns';

import BlueCheck from '@assets/icons/blue-check.svg';
import Pencil from '@assets/icons/pencil.svg';
import SwitchAccount from '@assets/icons/switch-account.svg';
import { TABS, useRouter } from '@components/Router';

import {
  Layout,
  UserIcon,
  ConnectAccountsModal,
  Header,
  LinkButton,
  WalletDetailItem,
} from '@components';
import { setUseICNS as setStorageUseICNS} from '@modules/storageManager';

import useStyles from './styles';
import ICNSToggle from './components/ICNSToggle';

const WalletDetails = () => {
  const classes = useStyles();
  const { navigator } = useRouter();
  const { t } = useTranslation();
  const {
    resolved: reduxResolved,
    useICNS: reduxUseICNS,
    names: reduxNames,
  } = useSelector((state) => state.icns);
  const dispatch = useDispatch();
  const icpPrice = useICPPrice();

  const { editAccount } = useSelector((state) => state.profile);
  const { walletId: activeWalletId } = useSelector((state => state.wallet));

  const textInput = useRef(null);
  const { name, icon: emoji, accountId, principal: principalId, walletId } = editAccount;

  const [openConnectAccount, setOpenConnectAccount] = useState(false);
  const [connectedWallets, setConnectedWallets] = useState([]);
  const [tab, setTab] = useState(null);
  const [app, setApp] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [openEmojis, setOpenEmojis] = useState(false);
  const [walletName, setWalletName] = useState(name);
  const [currentEmoji, setCurrentEmoji] = useState(emoji);
  const [edit, setEdit] = useState(false);
  const [expand, setExpand] = useState(false);
  const [openAccount, setOpenAccount] = useState(false);
  const [openPrincipal, setOpenPrincipal] = useState(false);

  // Local ICNS
  const [useICNS, setUseICNS] = useState(false);
  const [resolved, setResolved] = useState(null);
  const [icnsNames, setICNSNames] = useState([]);
  const [icnsLoading, setICNSLoading] = useState(true);

  const hasActiveResolvedICNS = resolved !== null && useICNS && !icnsLoading;

  useEffect(() => {
    setICNSLoading(true);
    // Use standard ICNS data
    if (walletId === activeWalletId) {
      setICNSLoading(false);
      setUseICNS(reduxUseICNS);
      setResolved(reduxResolved);
      setICNSNames(reduxNames);
    } else {
      getUseICNS(walletId, (storageUseICNS) => {
        setUseICNS(storageUseICNS);
      });

      sendMessage({
        type: HANDLER_TYPES.GET_ICNS_DATA,
        params: { refresh: true, walletId },
      }, (icnsData) => {
        const { names, reverseResolvedName } = icnsData;
        setICNSNames(names || []);
        setResolved(reverseResolvedName || null);
        setICNSLoading(false);
      });
    }
  }, [walletId]);

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
            walletId,
            name: walletName,
            emoji: currentEmoji,
          },
        },
        () => {
          if (activeWalletId === walletId) {
            dispatch(updateWalletDetails({
              name: walletName,
              emoji: currentEmoji,
            }));
          }
          setWalletName(walletName);
          setCurrentEmoji(currentEmoji);
        },
      );
    }
  };

  const handleToggleICNS = (event) => {
    const { checked } = event.target;

    setUseICNS(checked);
    setStorageUseICNS(checked, walletId);
    if (walletId === activeWalletId) {
      dispatch(setReduxUseICNS(checked));
    }

    if (!checked) {
      sendMessage({
        type: HANDLER_TYPES.SET_REVERSE_RESOLVED_NAME,
        params: { name: '', walletId: walletId },
      }, (response) => {
        if (response.error) {
          // eslint-disable-next-line
          console.log('Error when resetting your reverse resolved name', response.error); // TODO HANDLE ERROR (shouldnt happen tho)
        } else {
          sendMessage({
            type: HANDLER_TYPES.GET_ICNS_DATA,
            params: { refresh: true, walletId },
          }, (icnsData) => {
            if (walletId === activeWalletId) {
              dispatch(setICNSData(icnsData));
            }

            const { names, reverseResolvedName } = icnsData;
            setICNSNames(names || []);
            setResolved(reverseResolvedName || null);
            setICNSLoading(false);
          });
        }
      });
    }
  };

  const handleSetReverseResolution = (name, resetModal) => {
    sendMessage({
      type: HANDLER_TYPES.SET_REVERSE_RESOLVED_NAME,
      params: { name, walletId },
    }, (response) => {
      if (response.error) {
        // eslint-disable-next-line
        console.log('Error when setting your reverse resolved name', response.error); // TODO HANDLE ERROR (shouldnt happen tho)
      } else {
        sendMessage({
          type: HANDLER_TYPES.GET_ICNS_DATA,
          params: { refresh: true, walletId },
        }, (icnsData) => {
          if (walletId === activeWalletId) {
            dispatch(setICNSData(icnsData));
          }

          const { names, reverseResolvedName } = icnsData;
          setICNSNames(names || []);
          setResolved(reverseResolvedName || null);
          setICNSLoading(false);
          resetModal();
        });
      }
    });
  }

  const handleChangeAccount = () => {
    extensionizer.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
      const url = getTabURL(tabs?.[0]);
      const ids = accounts.map((account) => account.walletId);
      setTab(tabs?.[0]);
      if (!ids.length) {
        executeAccountSwitch(walletId);
        return;
      }

      getWalletsConnectedToUrl(url, ids, async (wallets = []) => {
        const currentConnected = wallets.includes(activeWalletId);
        const newConnected = wallets.includes(walletId);

        setConnectedWallets(wallets);

        getApp(activeWalletId.toString(), url, (currentApp) => {
          setApp(currentApp);
          // If current was connected but new one isnt, prompt modal
          if (currentConnected && !newConnected) {
            setOpenConnectAccount(true);
          } else {
            executeAccountSwitch(walletId);
          }
        });
      });
    });
  };

  const executeAccountSwitch = (wallet) => {
    sendMessage({ type: HANDLER_TYPES.SET_CURRENT_PRINCIPAL, params: wallet },
      (state) => {
        if (Object.values(state?.wallets).length) {
          const newWallet = state.wallets[state.currentWalletId];
          dispatch(setAccountInfo(newWallet));
          dispatch(getContacts());
          dispatch(setICNSData(newWallet.icnsData));
          dispatch(setAssetsLoading(true));
          dispatch(setTransactions([]));
          sendMessage({
            type: HANDLER_TYPES.GET_ASSETS,
            params: { refresh: true },
          }, (keyringAssets) => {
            dispatch(setAssets({ keyringAssets, icpPrice }));
            dispatch(setAssetsLoading(false));
          });
          navigator.navigate('home', TABS.TOKENS);
        }
      });
  };

  const handleDeclineConnect = () => {
    executeAccountSwitch(activeWalletId);
    setOpenConnectAccount(false);
  };

  useEffect(() => {
    sendMessage({ type: HANDLER_TYPES.GET_STATE, params: {} }, (state) => {
      if (Object.keys(state?.wallets)?.length) {
        setAccounts(Object.values(state.wallets));
      }
    });
  }, []);

  useEffect(() => {
    setWalletName(editAccount.name);
    setCurrentEmoji(editAccount.icon || ACCOUNT_ICON);
  }, [editAccount]);

  useEffect(() => {
    if (useICNS) {
      handleEditWalletName();
    }
  }, [useICNS]);

  return (
    <Layout>
      <Header
        center={t('walletDetails.title')}
        right={(
          <LinkButton
            value={t('common.done')}
            onClick={() => navigator.navigate('home')}
            data-testid="done-button"
          />
        )}
      />
      <ConnectAccountsModal
        open={openConnectAccount}
        onClose={handleDeclineConnect}
        onConfirm={() => executeAccountSwitch(walletId)}
        wallets={accounts}
        connectedWallets={connectedWallets}
        app={app}
        tab={tab}
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
            classes={{
              root:
              clsx(classes.name, edit && !hasActiveResolvedICNS && classes.nameEdit, edit && hasActiveResolvedICNS && classes.resolvedNameEdit),
            }}
            value={hasActiveResolvedICNS ? resolved : walletName}
            type="text"
            onChange={handleChange}
            readOnly={!edit || hasActiveResolvedICNS}
            inputRef={textInput}
            data-testid="account-name-input"
          />
          {edit
            ? (
              <button
                type="button"
                style={{ all: 'unset', marginTop: '4px' }}
                data-testid="save-changes-icon-button"
                onClick={handleEditWalletName}
              >
                <img
                  className={classes.icon}
                  src={BlueCheck}
                />
              </button>
            )
            : (
              <div className={classes.buttonsContainer}>
                { walletId !== activeWalletId && (
                  <button
                    type="button"
                    onClick={handleChangeAccount}
                  >
                    <img
                      src={SwitchAccount}
                    />
                  </button>
                )}
                {
                  <button
                    data-testid="edit-icon-button"
                    type="button"
                    onClick={openEditWalletName}
                  >
                    <img
                      src={Pencil}
                    />
                  </button>
                }
              </div>
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
        <ICNSToggle
          active={useICNS}
          names={icnsNames}
          resolved={resolved}
          handleToggle={handleToggleICNS}
          loading={icnsLoading}
          handleSetReverseResolution={handleSetReverseResolution}
        />
        <div
          className={classes.viewMore}
          onClick={toggleExpand}
          variant="subtitle1"
          data-testid="view-more-button"
        >
          <span>{t('walletDetails.viewMore')}</span>
          <ChevronDown
            className={clsx(classes.chevron, expand && classes.rotate)}
            size={20}
          />
        </div>
        {expand && (
          <div className={classes.detailsContainer}>
            <WalletDetailItem
              name="principalId"
              value={principalId}
              setInfoOpen={setOpenPrincipal}
              isOpen={openPrincipal}
              copyButtonTestId="copy-principalId-button"
              infoIconButtonTestId="info-principalId-icon-button"
            />
            <WalletDetailItem
              name="accountId"
              value={accountId}
              setInfoOpen={setOpenAccount}
              isOpen={openAccount}
              copyButtonTestId="copy-accountId-button"
              infoIconButtonTestId="info-accountId-icon-button"
            />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default WalletDetails;
