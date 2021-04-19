import React from 'react';
import { useRouter } from '@components/Router';

const Details = () => {
  const { navigator } = useRouter();

  const goToHome = () => navigator.navigate('home');

  return (
    <div>
      <div>details</div>
      <button type="button" onClick={goToHome}>
        go to Home
      </button>
    </div>
  );
};

export default Details;
