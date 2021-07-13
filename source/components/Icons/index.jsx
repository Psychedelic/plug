import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';

// eslint-disable-next-line import/prefer-default-export
export const IconQrCode = ({ classes, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    className={clsx(classes.icon, classes.iconQrCode)}
    data-icon="qrcode"
    data-prefix="far"
    viewBox="0 0 448 512"
    {...props}
  >
    <path
      fill="currentColor"
      d="M0 224h192V32H0v192zM40 72h112v112H40V72zm216-40v192h192V32H256zm152 152H296V72h112v112zM0 480h192V288H0v192zm40-152h112v112H40V328zm32 32h48v48H72v-48zm0-256h48v48H72v-48zm304 48h-48v-48h48v48zm40 136h32v128H320v-32h-32v96h-32V288h96v32h64v-32zm0 160h32v32h-32v-32zm-64 0h32v32h-32v-32z"
    />
  </svg>
);

IconQrCode.propTypes = {
  classes: PropTypes.shape({
    // eslint-disable-next-line react/forbid-prop-types
    icon: PropTypes.string,
    // eslint-disable-next-line react/forbid-prop-types
    iconQrCode: PropTypes.string,
  }).isRequired,
};
