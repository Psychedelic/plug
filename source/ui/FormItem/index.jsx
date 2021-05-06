import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import useStyles from './styles';

const FormItem = ({
  label, component, subtitle, ...other
}) => {
  const classes = useStyles();

  return (
    <div className={classes.root} {...other}>
      <Typography variant="h5" className={classes.label}>{label}</Typography>
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
};

FormItem.propTypes = {
  label: PropTypes.string.isRequired,
  component: PropTypes.node.isRequired,
  subtitle: PropTypes.node,
};
