import React, { useState, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import useStyles from "../styles";
import { Typography, Grid } from "@material-ui/core";
import { Container, Button, TextInput, FormItem, UserIcon } from "@components";
import { HANDLER_TYPES, sendMessage } from "@background/Keyring";

const Step1 = ({ handleChangeStep, setPrivateKey, privateKey }) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [invalidPem, setInvalidPem] = useState(null);

  const handlePrivateKey = (e) => {
    setLoading(true);
    setPrivateKey(e.target.value);
    sendMessage(
      {
        type: HANDLER_TYPES.VALIDATE_PEM,
        params: {
          pem: e.target.value
        },
      },
      (a) => {
        if (a) {
          setDisabled(true);
          setInvalidPem(false);
          setLoading(false);
        } else {
          setInvalidPem(true);
          setLoading(false);
          setDisabled(false);
        }
      },
    );
  } 

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormItem
            label={`${t("importPrivateKey.privateKey")}`}
            smallLabel
            component={
              <TextInput
                fullWidth
                value={privateKey}
                onChange={(e) => handlePrivateKey(e)}
                type="text"
                data-testid="import-private-key-fill"
                error={invalidPem}
              />
            }
          />
          {invalidPem && <Typography variant="body2" color="error">{`${t("importPrivateKey.invalidString")}`}</Typography>}
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="rainbow"
            value={t("common.continue")}
            onClick={() => handleChangeStep(1)}
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

export default Step1;
