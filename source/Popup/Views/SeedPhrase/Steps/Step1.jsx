import React from 'react';
import PropTypes from 'prop-types';
import { RevealSeedPhrase } from '@components';
import { Container } from '@ui';

const Step1 = ({ handleChangeStep }) => (
  <Container big>
    <RevealSeedPhrase onClick={handleChangeStep} />
  </Container>
);

export default Step1;

Step1.propTypes = {
  handleChangeStep: PropTypes.func.isRequired,
};
