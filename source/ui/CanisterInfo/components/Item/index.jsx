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

  const {
    id, name, description, icon, iconAlt,
  } = canister || {};

  const createICRocksPrincipalTab = useCallback(() => {
    extension.tabs.create({ url: getICRocksPrincipalUrl(id) });
  }, [id]);

  return (
    <div ref={ref} {...props} className={clsx(classes.canisterInfoItem, className)}>
      {name ? (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <img src={icon} alt={iconAlt ?? name} className={classes.image} />

            <Box className={classes.infoBox}>
              <Typography component="h4" variant="h5">{name}</Typography>
              <Typography component="p" variant="subtitle1" noWrap>{id}</Typography>
            </Box>

            <IconButton onClick={createICRocksPrincipalTab} className={classes.iconButton}>
              <img src={ArrowUpRight} alt="Arrow" />
            </IconButton>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              {description}
            </Typography>
          </AccordionDetails>
        </Accordion>
      ) : (
        <Box className={classes.canisterInfoIdItem}>
          <Typography component="p" variant="subtitle1" noWrap>{id}</Typography>
          <IconButton onClick={createICRocksPrincipalTab} className={classes.iconButton}>
            <img src={ArrowUpRight} alt="Arrow" />
          </IconButton>
        </Box>
      )}

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
