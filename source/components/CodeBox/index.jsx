import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Copy } from 'react-feather';
import useStyles from './styles';

const CodeBox = ({ prefix, code }) => {
  const classes = useStyles();
  const [copied, setCopied] = useState(false);

  const onCopy = () => {
    setCopied(true);
    navigator.clipboard.writeText(code);
  };

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <div className={classes.circleDecorations}>
          <div className={classes.redDecoration} />
          <div className={classes.yellowDecoration} />
          <div className={classes.greenDecoration} />
        </div>
        <div
          className={clsx(classes.copyContainer, copied && classes.copiedAnimation)}
          onClick={onCopy}
          onAnimationEnd={() => { setCopied(false); }}
        >
          <Copy size="14" className={classes.copyIcon} />
          <span className={classes.copyText}>
            Copy
          </span>
        </div>
      </div>
      <div className={classes.codeContainer}>
        {prefix} {code}
      </div>
    </div>
  );
};

CodeBox.defaultProps = {
  prefix: '$',
};

CodeBox.propTypes = {
  code: PropTypes.string.isRequired,
  prefix: PropTypes.string,
};

export default CodeBox;
