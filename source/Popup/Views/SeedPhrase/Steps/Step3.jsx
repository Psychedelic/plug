import React from 'react';
import { SeedPhrase } from '@components';
import { Container } from '@ui';

const WORDS = [ // get from somewhere
  'spread',
  'spoon',
  'foam',
  'door',
  'young',
  'uniform',
  'lab',
  'add',
  'jungle',
  'display',
  'clean',
  'parrot',
];

const Step3 = () => (
  <Container>
    <div style={{ height: 178 }}>
      <SeedPhrase words={WORDS} />
    </div>
  </Container>
);

export default Step3;
