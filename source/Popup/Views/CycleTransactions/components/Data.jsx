import React from 'react';
import PropTypes from 'prop-types';
import { FormItem } from '@ui';
import useStyles from '../styles';

const Data = ({ data }) => {
  const classes = useStyles();

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
};
