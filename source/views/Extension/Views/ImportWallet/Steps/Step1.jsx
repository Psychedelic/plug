import { Container, Button } from '@components'
import { Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import React, { useState } from 'react'
import useStyles from '../styles';
import { CloudUpload } from '@material-ui/icons';

const Step1 = () => {

  const [loading, setLoading] = useState(false);

  const classes = useStyles();

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <div className={classes.dragDropContainer}>
            <CloudUpload fontSize='large' styles={{backgroundColor: '#BBBEC2'}} />
            <Typography className={classes.dragDropText} variant='h6'>
              Drag and Drop <br />
              or <a className={classes.dragDropBrowse} href="">browse</a>
            </Typography>
          </div>
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