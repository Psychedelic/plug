import React from 'react';
import MuiTab from '@material-ui/core/Tab';
import PropTypes from 'prop-types';
import useStyles from './styles';

const Tab = ({
  loading, label, disabled, ...props
}) => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <MuiTab
        classes={{
          root: classes.root,
          selected: classes.selected,
        }}
        label={label}
        disabled={disabled}
        disableRipple
        {...props}
      />
      { loading && (<div className={classes.loader} />) }
    </div>
  );
};

export default Tab;

Tab.defaultProps = {
  loading: false,
  disabled: false,
};

Tab.propTypes = {
  label: PropTypes.string.isRequired,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
};
