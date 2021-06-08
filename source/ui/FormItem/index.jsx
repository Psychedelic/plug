import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import useStyles from './styles';

const FormItem = ({
  label, component, subtitle, smallLabel, ...other
}) => {
  const classes = useStyles();

  return (
    <div className={classes.root} {...other}>
      <Typography
        variant="h5"
        className={clsx(classes.label, smallLabel && classes.smallLabel)}
      >
        {label}
      </Typography>
      <div className={classes.componentContainer}>
        {component}
      </div>
      {
        subtitle
        && (
          <div className={classes.subtitleContainer}>
            {subtitle}
          </div>
        )
      }
    </div>
  );
};

export default FormItem;

FormItem.defaultProps = {
  subtitle: null,
  smallLabel: false,
};

FormItem.propTypes = {
  label: PropTypes.string.isRequired,
  component: PropTypes.node.isRequired,
  subtitle: PropTypes.node,
  smallLabel: PropTypes.bool,
};
