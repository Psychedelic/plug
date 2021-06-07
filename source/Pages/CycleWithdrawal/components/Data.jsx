import React from 'react';
import PropTypes from 'prop-types';
import { FormItem } from '@ui';
import useStyles from '../styles';
import SIZES from '../constants';

const Data = ({ data, requestCount }) => {
  const classes = useStyles();

  window.resizeTo(SIZES.width, requestCount > 1
    ? SIZES.dataHeightBig
    : SIZES.dataHeightSmall);

  return (
    <div className={classes.innerContainer}>
      {
        data.map((item) => (
          <FormItem label={item.label} component={item.component} style={{ marginBottom: 24 }} />
        ))
      }
    </div>
  );
};

export default Data;

Data.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      component: PropTypes.node.isRequired,
    }),
  ).isRequired,
  requestCount: PropTypes.number.isRequired,
};
