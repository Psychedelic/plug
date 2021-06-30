import React, { useEffect, useState } from 'react';
import extension from 'extensionizer';
import { SeedPhrase } from '@components';
import { Container } from '@ui';

const Step3 = () => {
  const [words, setWords] = useState([]);

  useEffect(async () => {
    extension.runtime.sendMessage({ type: 'get-keyring-state', params: {} }, (state) => {
      setWords(state.mnemonic.split(' '));
    });
  }, []);

  return (
    !!words.length
    && (
    <Container>
      <div style={{ height: 176 }}>
        <SeedPhrase words={words} />
      </div>
    </Container>
    )
  );
};

export default Step3;
