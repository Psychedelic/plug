import React from 'react';
import PropTypes from 'prop-types';
import { FormItem } from '@components';
import extension from 'extensionizer';
import useStyles from '../styles';
import SIZES from '../constants';

const Data = ({ data, principalId }) => {
  const classes = useStyles();

  extension.windows.update(
    extension.windows.WINDOW_ID_CURRENT,
    {
      height: principalId
        ? SIZES.dataHeightBig
        : SIZES.dataHeightSmall,
    },
  );

  return (
    <div className={classes.innerContainer}>
      {
        data.map((item, index) => (
          <FormItem
            key={`${index.toString()}-${item.label}`}
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
  principalId: PropTypes.objectOf(PropTypes.string).isRequired,
};
