import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import useStyles from './styles';

const FormItem = ({
  label, component, subtitle, smallLabel, endIcon, ...other
}) => {
  const classes = useStyles();

  return (
    <div className={classes.root} {...other}>

      <div className={classes.titleContainer}>
        <Typography
          variant="h5"
          className={clsx(classes.label, smallLabel && classes.smallLabel)}
        >
          {label}
        </Typography>
        <div className={classes.endIcon}>
          {
              endIcon
            }
        </div>
      </div>

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
  endIcon: null,
};

FormItem.propTypes = {
  label: PropTypes.string.isRequired,
  component: PropTypes.node.isRequired,
  subtitle: PropTypes.node,
  smallLabel: PropTypes.bool,
  endIcon: PropTypes.node,
};
