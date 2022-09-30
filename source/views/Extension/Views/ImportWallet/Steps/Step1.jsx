import { Container, Button } from '@components'
import React, { useState, useCallback } from 'react'
import DragDropBox from '../components/DragDropBox';
import { useTranslation } from 'react-i18next';
import { useDropzone } from 'react-dropzone';
import useStyles from '../styles';
import { CloudUpload } from '@material-ui/icons';
import { Typography, Grid } from '@material-ui/core';
import { Plug } from "@components";

const Step1 = ({handleChangeStep}) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const onDrop = useCallback(acceptedFile => {
    let fileReader = new FileReader();
    fileReader.readAsText(acceptedFile[0]);
    fileReader.onloadend = () => {
      const content = fileReader.result;
      console.log(content);
    };
  }, []);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
  } = useDropzone({ onDrop,
    maxFiles: 1,
    accept: {
    'application/x-pem-file': ['.pem'],
  } });

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <div className={classes.dragDropContainer} {...getRootProps()}>
            {
              isDragActive ? (
                <div className={classes.dropItContainer}>
                  <Plug size="small" /> 
                  <span className={classes.dropItLabel}>
                    {t('importPem.dropIt')}
                  </span>
                </div>
              ) : (
                <>
                <input {...getInputProps()} /><CloudUpload style={{ color: '#BBBEC2' }} fontSize='large' /><Typography className={classes.dragDropText} variant='h6'>
                    {t('importPem.dragAndDrop')}<br />
                    {t('importPem.or')} <label className={classes.inputFileLabel} id="label-file-upload" htmlFor="input-file-upload">{t('importPem.browse')}</label>
                  </Typography>
                </>
              )
            }
          </div>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="rainbow"
            value={t('common.continue')}
            onClick={() => handleChangeStep(1)}
            loading={loading}
            disabled={!disabled}
            fullWidth
            data-testid="add-button"
          />
        </Grid>
      </Grid>
    </Container>
  )
}

export default Step1
