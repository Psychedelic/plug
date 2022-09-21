import { Container, Button, Alert } from '@components'
import { Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import React, { useRef, useState } from 'react'
import useStyles from '../styles';
import { CloudUpload } from '@material-ui/icons';
import CloseIcon from '@material-ui/icons/Close';
import { useEffect } from 'react';
import GradientFile from '@assets/icons/gradient-file.svg';

const Step1 = () => {
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [fileNotSupported, setFileNotSupported] = useState(false);
  const [pemFile, setPemFile] = useState(null);

  const ACCEPTED_FILE_EXT = 'pem';

  const classes = useStyles();

  const inputRef = useRef(null);

  const checkPemFile = (fileObject) => {
    const fileExt = fileObject[0]?.name.split('.').pop();
    if (fileExt === ACCEPTED_FILE_EXT) {
      console.log('extension correcta', fileExt);
      console.log('file extension', fileObject[0]);
      setPemFile(fileObject[0]);
    } else {
      setFileNotSupported(true);
      console.log('extension incorrecta', fileExt);
    }
  }

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      checkPemFile(e.dataTransfer.files);
    }
  };

  const handleRemoveFile = () => {
    setPemFile(null);
  }

  const handleChange = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.target.files && e.target.files[0]) {
      checkPemFile(e.target.files);
    }
  }

  useEffect(() => {
    if (fileNotSupported) {
      setTimeout(() => {
        console.log('arranca setTimeOut');
        setFileNotSupported(false);
      }, 2000)
    }
  }, [fileNotSupported]);

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <div className={fileNotSupported ? classes.dragDropContainerError : classes.dragDropContainer}>
            <form
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onSubmit={(e) => e.preventDefault()}
              className={classes.insideDragDrop}
            >
              {
                pemFile ? (
                  <>
                    <img src={GradientFile} alt="gradientFile" />
                    <div className={classes.nameXIcon}>
                      <Typography variant='h5'>
                        {pemFile.name || ''}
                      </Typography>
                      <CloseIcon className={classes.icon} onClick={() => handleRemoveFile()} />
                    </div>
                  </>
                ) : (
                  <>
                    <CloudUpload fontSize='large' />
                    <Typography className={classes.dragDropText} variant='h6'>
                      Drag and Drop <br />
                      or <a className={classes.dragDropBrowse} href="">browse</a>
                    </Typography>
                  </>
                )
              }
            </form>
          </div>
          {
            fileNotSupported && (
              <span className={classes.error}>
                File not supported. Try a different file.
              </span>
            )
          }
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="rainbow"
            value="Continue"
            onClick={() => console.log('Hola como estas')}
            loading={loading}
            disabled={!loading}
            fullWidth
            data-testid="add-button"
          />
        </Grid>
      </Grid>
    </Container>
  )
}

export default Step1
