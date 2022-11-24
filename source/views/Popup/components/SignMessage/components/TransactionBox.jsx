import React from 'react';
import useStyles from './styles';

import swapHorizontalSrc from '@assets/icons/swap-horizontal.svg';
import questionHatSrc from '@assets/icons/question-hat.svg';

const TransactionBox = ({ transactionMessage, dappImage, dappName }) => {
  const classes = useStyles();

  return (
    <div className={classes.transactionBoxContainer}>
      <div className={classes.transactionUpperBox}>
        <div className={classes.transactionUpperLeft}>
          <img alt="transaction-icon" src={swapHorizontalSrc} />
          <div>
            <h3>Transaction</h3>
            <p>Request</p>
          </div>
        </div>
        <div className={classes.transactionUpperRight}>
          <img alt="transaction-icon" src={questionHatSrc} />
          <span>Unknown</span>
        </div>
      </div>
      <div className={classes.transactionLowerBox}>
        <h3>Message:</h3>
        <p>{transactionMessage}</p>
      </div>
    </div>
  );
};

export default TransactionBox;
