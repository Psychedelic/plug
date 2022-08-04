import { makeStyles } from '@material-ui/core';

const flex = {
  display: 'flex',
  alignItems: 'center',
};

export default makeStyles(() => ({
  root: {
    height: 40,
    width: '100%',
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 25px',
    fontWeight: 500,
  },
  flex,
  networkSelector: {
    ...flex,
    maxWidth: 100,
    height: 30,
    borderRadius: 1000,
    background: 'white',
    color: '#6B7280',
    justifyContent: 'space-between',
    marginRight: 5,
    padding: '0 10px',
  },
  controlsInfo: {
    ...flex,
    opacity: 0.5,
  },
  connectedControls: {
    opacity: 1,
  },
  controls: {
    ...flex,
    justifyContent: 'space-between',
  },
  reloadIcon: {
    width: 14,
    height: 20,
  },
  network: {
    maxWidth: 70,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    cursor: 'pointer',
  },
  reloadIconContainer: {
    ...flex,
    borderRadius: '50%',
    justifyContent: 'center',
    width: 30,
    height: 30,
    background: 'white',
    cursor: 'pointer',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    marginRight: 5,
    background: '#6B7280',
  },
  connectedDot: {
    background: '#08DE92',
  },
  disabled: {
    opacity: 0.5,
    pointer: 'arrow',
  },
}));
