import { makeStyles } from '@material-ui/core';

const flex = {
  display: 'flex',
  alignItems: 'center',
};

export default makeStyles(() => ({
  '@keyframes spin': {
    '0%': {
      transform: 'rotate(0deg)',
    },
    '100%': {
      transform: 'rotate(360deg)',
    },
  },
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
  },
  controls: {
    ...flex,
    justifyContent: 'space-between',
  },
  reloadIcon: {
    width: 14,
    height: 20,
  },
  reloadIconLoading: {
    animation: '$spin 1s linear infinite',
  },
  network: {
    maxWidth: 70,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    cursor: 'pointer',
  },
  reloadIconContainer: {
    all: 'unset',
    ...flex,
    borderRadius: '50%',
    justifyContent: 'center',
    width: 30,
    height: 30,
    background: 'white',
    cursor: 'pointer',
    '&:disabled': {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    marginRight: 5,
    background: '#08DE92',
  },
  disabled: {
    opacity: 0.5,
    pointer: 'arrow',
  },

  loading: {
    animation: '$rotate 1s infinite linear',
  },
}));
