import React, { useEffect, useState } from 'react';
import { SeedPhrase } from '@components';
import { Container } from '@ui';
import { KeyRing } from '@background';

const Step3 = () => {
  const [words, setWords] = useState([]);

  useEffect(async () => {
    const { mnemonic } = await KeyRing.getState();
    setWords(mnemonic.split(' '));
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
