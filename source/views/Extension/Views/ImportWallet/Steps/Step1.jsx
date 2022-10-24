import React, { useState, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDropzone } from "react-dropzone";
import { CloudUpload } from "@material-ui/icons";
import CloseIcon from "@material-ui/icons/Close";
import { Typography, Grid } from "@material-ui/core";

import { Container, Button, Plug } from "@components";
import GradientFile from "@assets/icons/gradient-file.svg";

import useStyles from "../styles";

const Step1 = ({
  handleChangeStep,
  setUserPemFile,
  userPemFile,
  loadingValidate,
  isPemValid,
  importDisabled,
}) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const handleRemoveFile = () => {
    setUserPemFile(null);
  };

  const onDrop = useCallback((acceptedFile) => {
    setUserPemFile(acceptedFile[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: {
      "application/x-pem-file": [".pem"],
    },
  });

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <div className={classes.dragDropContainer} {...getRootProps()}>
            {userPemFile ? (
              <>
                <img src={GradientFile} alt="gradientFile" />
                <div className={classes.nameXIcon}>
                  <Typography variant="h5">{userPemFile.name || ""}</Typography>
                  <CloseIcon
                    className={classes.icon}
                    onClick={() => handleRemoveFile()}
                  />
                </div>
              </>
            ) : (
              <>
                {isDragActive ? (
                  <div className={classes.dropItContainer}>
                    <Plug size="small" />
                    <span className={classes.dropItLabel}>
                      {t("importPem.dropIt")}
                    </span>
                  </div>
                ) : (
                  <>
                    <input {...getInputProps()} />
                    <CloudUpload
                      style={{ color: "#BBBEC2" }}
                      fontSize="large"
                    />
                    <Typography className={classes.dragDropText} variant="h6">
                      {t("importPem.dragAndDrop")}
                      <br />
                      {t("importPem.or")}{" "}
                      <label
                        className={classes.inputFileLabel}
                        id="label-file-upload"
                        htmlFor="input-file-upload"
                      >
                        {t("importPem.browse")}
                      </label>
                    </Typography>
                  </>
                )}
              </>
            )}
          </div>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="rainbow"
            value={t("common.continue")}
            onClick={() => handleChangeStep(1)}
            loading={loadingValidate}
            disabled={importDisabled}
            fullWidth
            data-testid="add-button"
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Step1;
