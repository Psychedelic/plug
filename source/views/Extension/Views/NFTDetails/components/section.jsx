import React from 'react';
import {
  Title,
} from '@components';
import PropTypes from 'prop-types';
import useStyles from '../styles';

const Section = ({
  icon, title, children, ...other
}) => {
  const classes = useStyles();
  return (
    <div className={classes.section} {...other}>
      <Title icon={icon} value={title} />
      <div className={classes.content}>
        {children}
      </div>
    </div>
  );
};

export default Section;

Section.propTypes = {
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};
