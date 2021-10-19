import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Button } from '@ui';

import useStyles from './styles';

const WarningModal = ({ toggleModal }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <div className={classes.modalContainer}>
      <div className={classes.modal}>
        <h1 className={classes.modalTitle}>
          {t('sign.warning.modalTitle')}
        </h1>
        <p className={classes.modalText}>
          {t('sign.warning.modalText')}
        </p>
        <Button
          variant="rainbow"
          value="Ok, I understand"
          onClick={toggleModal}
          fullWidth
          style={{ width: '87%' }}
          wrapperStyle={{ textAlign: 'center' }}
        />
        <p className={classes.modalLink}>
          {t('sign.warning.modalLearnMore')}
        </p>
      </div>
    </div>
  );
};

WarningModal.propTypes = {
  toggleModal: PropTypes.func.isRequired,
};

export default WarningModal;
