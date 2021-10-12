import React from 'react';
import PropTypes from 'prop-types';
import { FormItem } from '@ui';
import extension from 'extensionizer';
import useStyles from '../../styles';
import SIZES from '../../constants';

const Data = ({ data }) => {
  const classes = useStyles();

  extension.windows.update(
    extension.windows.WINDOW_ID_CURRENT,
    {
      height: SIZES.dataHeight,
    },
  );

  return (
    <div className={classes.innerContainer}>
      {
        data.map((item, index) => (
          <FormItem
            key={index.toString()}
            label={item.label}
            component={item.component}
            style={{ marginBottom: 24 }}
            smallLabel
          />
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
