import React, { useState } from 'react';
import PropTypes from 'prop-types';
import extension from 'extensionizer';
import clsx from 'clsx';

import { FormItem } from '@components';

import useStyles from '../../styles';
import SIZES from '../../constants';
import { formatMethodName } from '../Details/utils';

const Data = ({ transactionsData, withArguments }) => {
  const classes = useStyles();
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleClickMethod = (index) => () => setCurrentIndex(index);
  const multipleTransactions = transactionsData?.length > 1;
  const height = withArguments ? SIZES.dataWithArgumentsHeight : SIZES.dataHeight;
  extension.windows.update(
    extension.windows.WINDOW_ID_CURRENT,
    {
      height: height + Number(multipleTransactions) * SIZES.dataTabs,
    },
  );

  return (
    <div className={classes.innerContainer}>
      {multipleTransactions && (
        <div className={classes.dataTabs}>
          {transactionsData.map((tx, index) => (
            <button
              type="button"
              key={`${tx.transaction?.methodName}_${index}`} // eslint-disable-line
              className={clsx(classes.dataTab, index === currentIndex && classes.selectedTab)}
              onClick={handleClickMethod(index)}
            >
              {formatMethodName(tx?.transaction?.methodName, tx?.transaction?.canisterName)}
            </button>
          ))}
        </div>
      )}
      {
        transactionsData?.[currentIndex]?.formItems?.map((item, index) => (
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
  transactionsData: PropTypes.arrayOf(
    PropTypes.shape({
      transaction: PropTypes.any, // eslint-disable-line
      formItems: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string.isRequired,
          component: PropTypes.node.isRequired,
        }),
      ),
    }),
  ).isRequired,
  withArguments: PropTypes.bool.isRequired,
};
