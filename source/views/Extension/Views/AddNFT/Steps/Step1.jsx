import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import CustomToken from '../components/CustomToken';

const Step1 = ({ handleChangeSelectedNFT }) => {
  const { t } = useTranslation();
  return (
    <CustomToken
      handleChangeSelectedNFT={handleChangeSelectedNFT}
      />  
  );
};

export default Step1;

Step1.propTypes = {
  handleChangeSelectedToken: PropTypes.func.isRequired,
};
