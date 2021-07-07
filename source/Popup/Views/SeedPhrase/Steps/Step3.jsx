import React, { useEffect, useState } from 'react';
import { SeedPhrase } from '@components';
import { Container } from '@ui';
import { HANDLER_TYPES, sendMessage } from '@background/Keyring';

const Step3 = () => {
  const [words, setWords] = useState([]);

  useEffect(async () => {
    sendMessage({ type: HANDLER_TYPES.GET_STATE, params: {} }, (state) => {
      setWords(state?.mnemonic?.split(' '));
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
