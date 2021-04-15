import React from 'react';
import MuiTab from '@material-ui/core/Tab';
import PropTypes from 'prop-types';
import useStyles from './styles';

const Tab = ({ label, ...props }) => {
  const classes = useStyles();

  return (
    <MuiTab
      classes={{
        root: classes.root,
        selected: classes.selected,
      }}
      label={label}
      disableRipple
      {...props}
    />
  );
};

export default Tab;

Tab.propTypes = {
  label: PropTypes.string.isRequired,
};
