import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { SeedPhrase } from '@components';
import { Container } from '@ui';
import { HANDLER_TYPES, sendMessage } from '@background/Keyring';

const Step2 = ({ password }) => {
  const [words, setWords] = useState([]);

  useEffect(async () => {
    sendMessage({ type: HANDLER_TYPES.GET_MNEMONIC, params: { password } }, (mnemonic) => {
      setWords(mnemonic?.split(' '));
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

Step2.propTypes = {
  password: PropTypes.string.isRequired,
};

export default Step2;
