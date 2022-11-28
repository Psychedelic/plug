import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Typography, Grid } from "@material-ui/core";
import { Container, Button, TextInput, FormItem } from "@components";
import { HANDLER_TYPES, sendMessage } from "@background/Keyring";

const Step1 = ({ handleChangeStep, setPrivateKey, privateKey }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
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
      (response) => {
        const { isValid, errorType } = response || {};
        setInvalidPem(!isValid ? errorType : null);
        setLoading(false);
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
                onChange={handlePrivateKey}
                data-testid="import-private-key-fill"
                error={invalidPem}
                type="password"
              />
            }
          />
          {invalidPem && <Typography variant="body2" color="error">{t(`importPrivateKey.${invalidPem}`)}</Typography>}
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="rainbow"
            value={t("common.continue")}
            onClick={() => handleChangeStep(1)}
            loading={loading}
            disabled={!privateKey?.length || loading || invalidPem}
            fullWidth
            data-testid="add-button"
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Step1;
