import { Container, Button } from '@components'
import Grid from '@material-ui/core/Grid';
import React, { useState } from 'react'
import DragDropBox from '../components/DragDropBox';

const Step1 = ({handleChangeStep}) => {
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const ACCEPTED_FILE_EXT = 'pem';

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <DragDropBox
            acceptedExtension={ACCEPTED_FILE_EXT}
            setLoading={setLoading}
            setDisabled={setDisabled}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="rainbow"
            value="Continue"
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
