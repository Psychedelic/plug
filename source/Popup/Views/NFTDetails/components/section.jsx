import React from 'react';
import {
  Title,
} from '@ui';
import PropTypes from 'prop-types';
import useStyles from '../styles';

const Section = ({ icon, title, children }) => {
  const classes = useStyles();
  return (
    <div className={classes.section}>
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
