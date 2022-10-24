import React, { useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import Picker from "emoji-picker-react";
import { useTranslation } from "react-i18next";
import { HANDLER_TYPES, sendMessage, asyncSendMessage } from "@background/Keyring";
import {
  Container,
  Button,
  TextInput,
  FormItem,
  UserIcon,
  WalletDetailItem,
} from "@components";
import { useRouter } from "@components/Router";

import useStyles from "../styles";

const Step2 = ({ userPemFile }) => {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [openEmojis, setOpenEmojis] = useState(false);
  const [walletName, setWalletName] = useState(""); // add deafault wallet name, for example the next wallet not used number
  const [currentEmoji, setCurrentEmoji] = useState("😎"); // add default emoji, not used in other wallets
  const [openEmojiSelector, setOpenEmojiSelector] = useState(false);
  const [importedPrincipal, setImportedPrincipal] = useState();
  const [detailsModalOpen, setDetailsModal] = useState(false);

  const { navigator } = useRouter();

  const classes = useStyles();

  useEffect(() => {
    let fileReader = new FileReader();
    fileReader.readAsText(userPemFile);
    fileReader.onloadend = () => {
      const content = fileReader.result;

      asyncSendMessage({
        type: HANDLER_TYPES.GET_PRINCIPAL_FROM_PEM,
        params: { pem: content },
      }).then(setImportedPrincipal);
    };
  }, [userPemFile]);

  useEffect(() => {
    if (walletName && walletName !== "") {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [currentEmoji, walletName]);

  const onEmojiClick = (_event, emojiObject) => {
    setCurrentEmoji(emojiObject.emoji);
    setOpenEmojis(false);
    setOpenEmojiSelector(false);
  };

  const createImportedAccount = (pemContent) => {
    setLoading(true);
    sendMessage(
      {
        type: HANDLER_TYPES.IMPORT_PEM_ACCOUNT,
        params: { icon: currentEmoji, name: walletName, pem: pemContent },
      },
      () => {},
    );
    setLoading(false);
    navigator.navigate("home");
  };

  const readPemCreateAccount = () => {
    setLoading(true);
    let fileReader = new FileReader();
    fileReader.readAsText(userPemFile);
    fileReader.onloadend = () => {
      const content = fileReader.result; // we should check what happens if the user pass an empty pem file
      createImportedAccount(content);
    };
  };

  const openDetailsModal = () => {
    setDetailsModal(!detailsModalOpen);
  };

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <div className={classes.chooseEmojiContainer}>
            <UserIcon icon={currentEmoji} size="big" />
            <Button
              variant="primary"
              value={t("importPem.editWalletPic")}
              onClick={() => setOpenEmojiSelector(!openEmojiSelector)}
              style={{
                minWidth: 115,
                height: 24,
                borderRadius: 6,
              }}
            />
            {openEmojiSelector && (
              <Picker
                pickerStyle={{
                  height: 190,
                  width: "auto",
                  position: "absolute",
                  top: 180,
                  left: 40,
                  right: 40,
                  zIndex: 500,
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
          </div>
          <FormItem
            smallLabel
            label={t("common.name")}
            className={classes.formItem}
            component={
              <TextInput
                fullWidth
                onChange={(e) => setWalletName(e.target.value)}
                type="text"
                // error={}
              />
            }
          />
          <WalletDetailItem
            name="principalId"
            value={importedPrincipal}
            className={classes.principalDetails}
            setInfoOpen={setDetailsModal}
            isOpen={detailsModalOpen}
            copyButtonTestId="copy-principalId-button"
            infoIconButtonTestId="info-principalId-icon-button"
          />
          <Button
            variant="rainbow"
            value={t("common.save")}
            onClick={readPemCreateAccount}
            loading={loading}
            disabled={!disabled}
            fullWidth
            data-testid="add-button"
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Step2;
