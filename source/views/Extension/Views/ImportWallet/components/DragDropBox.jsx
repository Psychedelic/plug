import React, { useState } from 'react'
import { useTranslation } from 'react-i18next';
import useStyles from '../styles';
import { CloudUpload } from '@material-ui/icons';
import CloseIcon from '@material-ui/icons/Close';
import { useEffect } from 'react';
import GradientFile from '@assets/icons/gradient-file.svg';
import { Typography } from '@material-ui/core';
import RedWarningIcon from '@assets/icons/red-warning-icon.svg';
import { Plug } from "@components";

const DragDropBox = ({ acceptedExtension, setLoading, setDisabled }) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const [dragActive, setDragActive] = useState(false);
  const [fileNotSupported, setFileNotSupported] = useState(false);
  const [file, setFile] = useState(null);

  const handleRemoveFile = () => {
    setFile(null);
    setDisabled(false);
  }

  useEffect(() => {
    if (fileNotSupported) {
      setTimeout(() => {
        console.log('arranca setTimeOut');
        setFileNotSupported(false);
      }, 2000)
    }
  }, [fileNotSupported]);

  // could be a good feature for the future accept more than one extension
  const checkDesiredFile = (fileObject) => {
    setLoading(true);
    setLoading(false);
    const fileExt = fileObject[0]?.name.split('.').pop();
    if (fileExt === acceptedExtension) {
      console.log('extension correcta', fileExt);
      console.log('file extension', fileObject[0]);
      setFile(fileObject[0]);
      setLoading(false);
      setDisabled(true);
    } else {
      setFileNotSupported(true);
      console.log('extension incorrecta', fileExt);
    }
  }

  const handleDrag = (e) => {
    console.log('entra en el handle Drag');
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }

  const handleDrop = (e) => {
    console.log('entra en el handle Drop');
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      checkDesiredFile(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    console.log('entra en el handleChange');
    e.preventDefault();
    e.stopPropagation();
    if (e.target.files && e.target.files[0]) {
      checkDesiredFile(e.target.files);
    }
  }


  return (
    <>
      <div className={fileNotSupported ? classes.dragDropContainerError : classes.dragDropContainer}>
        <form
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onSubmit={(e) => e.preventDefault()}
          className={classes.insideDragDrop}
        >
          <input type="file" id='input-file-upload' className={classes.inputFile} multiple={true} onChange={handleChange} />
          {
            file ? (
              <>
                <img src={GradientFile} alt="gradientFile" />
                <div className={classes.nameXIcon}>
                  <Typography variant='h5'>
                    {file.name || ''}
                  </Typography>
                  <CloseIcon className={classes.icon} onClick={() => handleRemoveFile()} />
                </div>
              </>
            ) : (
              <>
                {
                  dragActive ? (
                    <div className={classes.dropItContainer}>
                      <Plug size="small" /> 
                      <span className={classes.dropItLabel}>
                        {t('importPem.dropIt')}
                      </span>
                    </div>
                  ) : (
                    <>
                      <CloudUpload style={{ color: '#BBBEC2' }} fontSize='large' />
                      <Typography className={classes.dragDropText} variant='h6'>
                        {t('importPem.dragAndDrop')}<br />
                        {t('importPem.or')} <label className={classes.inputFileLabel} id="label-file-upload" htmlFor="input-file-upload">{t('importPem.browse')}</label>
                      </Typography>
                    </>
                  )
                }
              </>
            )
          }
        </form>
        {
          fileNotSupported && (
            <span className={classes.error}>
              <img src={RedWarningIcon} alt="" /> {t('importPem.fileNotSupported')}
            </span>
          )
        }
      </div>
    </>
  )
}

export default DragDropBox