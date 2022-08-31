import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import CustomNFT from '../components/CustomNFT';

const Step1 = ({ handleChangeSelectedNFT }) => {
  const { t } = useTranslation();
  return (
    <CustomNFT
      handleChangeSelectedNFT={handleChangeSelectedNFT}
      />  
  );
};

export default Step1;

Step1.propTypes = {
  handleChangeSelectedToken: PropTypes.func.isRequired,
};
