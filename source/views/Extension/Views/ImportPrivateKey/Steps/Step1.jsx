import React, { useState, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import useStyles from "../styles";
import { CloudUpload } from "@material-ui/icons";
import GradientFile from "@assets/icons/gradient-file.svg";
import { Typography, Grid } from "@material-ui/core";
import { Container, Button, TextInput, FormItem, UserIcon } from "@components";

const Step1 = ({ handleChangeStep, setUserPemFile, userPemFile }) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const [privateKey, setPrivateKey] = useState(null);

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormItem
            label={"Private Key"}
            smallLabel
            component={
              <TextInput
                fullWidth
                value={privateKey}
                onChange={(e) => console.log(e.target)}
                type="text"
                data-testid="create-account-name-input"
              />
            }
          />
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
