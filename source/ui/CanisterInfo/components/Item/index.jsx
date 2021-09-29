import React, { forwardRef, useCallback } from 'react';
import {
  IconButton, Typography, Box,
} from '@material-ui/core';

import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';

import ArrowUpRight from '@assets/icons/arrow-up-right.png';
import extension from 'extensionizer';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { getICRocksPrincipalUrl } from '@shared/constants/urls';
import { withStyles } from '@material-ui/core/styles';
import { ExpandMore } from '@material-ui/icons';
import useStyles from './styles';

const Accordion = withStyles({
  root: {
    border: 'none',
    boxShadow: 'none',
    '&:before': {
      display: 'none',
    },
    '&$expanded': {
      margin: 'auto',
    },
  },
  expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles((theme) => ({
  root: {
    backgroundColor: 'transparent',
    borderBottom: '1px solid rgba(0, 0, 0, .125)',
    marginBottom: -1,
    alignItems: 'center',
    padding: `${theme.spacing(1)}px 0 ${theme.spacing(1)}px 0`,

  },
  content: {
    margin: 0,
    '&$expanded': {
      margin: 0,
    },
  },
  expanded: {},
}))(MuiAccordionSummary);

const AccordionDetails = withStyles((theme) => ({
  root: {
    padding: `${theme.spacing(1)}px 0 ${theme.spacing(1)}px 0`,
  },
}))(MuiAccordionDetails);

const CanisterInfoItem = forwardRef(({ canister, className, ...props }, ref) => {
  const classes = useStyles();

  // TODO: Remove placeholders
  const {
    id, name = 'ICP', description = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate, temporibus blanditiis assumenda architecto in vel magnam consectetur quae atque voluptatum dolorem mollitia, commodi nemo quaerat adipisci quam impedit. Facilis, consectetur?', imageSrc = 'https://images.unsplash.com/photo-1622020457014-aed1cc44f25e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1772&q=80', imageAlt,
  } = canister || {};

  const createICRocksPrincipalTab = useCallback(() => {
    extension.tabs.create({ url: getICRocksPrincipalUrl(id) });
  }, [id]);

  return (
    <div ref={ref} {...props} className={clsx(classes.canisterInfoItem, className)}>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <img src={imageSrc} alt={imageAlt ?? name} className={classes.image} />

          <Box className={classes.infoBox}>
            <Typography component="h4" variant="h5">{name}</Typography>
            <Typography component="p" variant="subtitle1" noWrap>{id}</Typography>
          </Box>

          <IconButton onClick={createICRocksPrincipalTab}>
            <img src={ArrowUpRight} alt="Arrow" />
          </IconButton>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            {description}
          </Typography>
        </AccordionDetails>
      </Accordion>

    </div>
  );
});

export default CanisterInfoItem;

CanisterInfoItem.displayName = 'CanisterInfoItem';

CanisterInfoItem.defaultProps = {
  className: undefined,
};

CanisterInfoItem.propTypes = {
  canister: PropTypes.objectOf(PropTypes.string).isRequired,
  className: PropTypes.string,
};
