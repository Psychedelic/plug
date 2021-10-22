import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormItem } from '@ui';
import extension from 'extensionizer';
import useStyles from '../../styles';
import SIZES from '../../constants';

const Data = ({ transactionsData, withArguments }) => {
  const classes = useStyles();
  const [currentIndex, setCurrentIndex] = useState(0);
  const handleClickMethod = (index) => () => setCurrentIndex(index);
  extension.windows.update(
    extension.windows.WINDOW_ID_CURRENT,
    {
      height: withArguments ? SIZES.dataWithArgumentsHeight : SIZES.dataHeight,
    },
  );

  return (
    <div className={classes.innerContainer}>
      {
        transactionsData?.[currentIndex]?.map((item, index) => (
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
  transactionsData: PropTypes.arrayOf(
    PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        component: PropTypes.node.isRequired,
      }),
    ),
  ).isRequired,
  withArguments: PropTypes.bool.isRequired,
};
