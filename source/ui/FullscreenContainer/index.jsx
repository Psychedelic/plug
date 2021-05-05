import React from 'react';
import PropTypes from 'prop-types';
import Container from '@material-ui/core/Container';
import { MadeBy } from '@components';
import useStyles from './styles';

const FullscreenContainer = ({ children }) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <div className={classes.madeByContainer}>
        <MadeBy />
      </div>
      <Container>
        {children}
      </Container>
    </div>
  );
};

export default FullscreenContainer;

FullscreenContainer.propTypes = {
  children: PropTypes.node.isRequired,
};
