import React from 'react';
import { useRouter } from '@components/Router';

const Home = () => {
  const { navigator } = useRouter();

  const goToDetails = () => navigator.navigate('details');

  return (
    <div>
      <div>home</div>
      <button type="button" onClick={goToDetails}>
        go to Details
      </button>
    </div>
  );
};

export default Home;
