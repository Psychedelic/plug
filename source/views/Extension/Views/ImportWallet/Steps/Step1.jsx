import { Container, Button } from '@components'
import { Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import React, { useRef, useState } from 'react'
import useStyles from '../styles';
import { CloudUpload } from '@material-ui/icons';
import Plug from "../../../../../components/Plug";

const Step1 = () => {
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [isPEMFile, setIsPEMFile] = useState(false);

  const ACCEPTED_FILE_EXT = 'pem';

  const classes = useStyles();

  const inputRef = useRef(null);

  const checkPemFile = (fileObject) => {
    const fileExt = fileObject[0]?.name.split('.').pop();
    if (fileExt === ACCEPTED_FILE_EXT) {
      console.log('extension correcta', fileExt);
    } else {
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

  const handleChange = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.target.files && e.target.files[0]) {
      checkPemFile(e.target.files);
    }
  }
 
  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <form
            onDragEnter={handleDrag} 
            onDragLeave={handleDrag} 
            onDragOver={handleDrag} 
            onDrop={handleDrop} 
            onSubmit={(e) => e.preventDefault()} 
            className={classes.dragDropContainer}
          >
            <input type="file" ref={inputRef} id="input-file-upload" className={classes.inputDropContainer} multiple={false} onChange={(e) => handleChange(e)} />
            <label className={classes.labelInputDropContainer} htmlFor="input-file-upload">
              {
                dragActive ? (
                  <div className={classes.dropItContainer}>
                    <Plug size="small" />
                    <Typography variant='h3'>
                    Drop it !
                    </Typography>
                  </div>
                ) : (
                  <>
                    <CloudUpload fontSize='large' styles={{ backgroundColor: '#BBBEC2' }} /><Typography className={classes.dragDropText} variant='h6'>
                      Drag and Drop <br />
                      or <a className={classes.dragDropBrowse} href="">browse</a>
                    </Typography>
                  </>
                )
              }
            </label>
          </form>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="rainbow"
            value="Continue"
            onClick={() => console.log('Hola como estas')}
            loading={loading}
            disabled={loading}
            fullWidth
            data-testid="add-button"
          />
        </Grid>
      </Grid>
    </Container>
  )
}

export default Step1
