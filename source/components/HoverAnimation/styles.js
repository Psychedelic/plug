import { makeStyles } from '@material-ui/core/styles';

export default makeStyles({
  '@keyframes hoverEffect': {
    '0%': {
      transform: 'translateX(0)',
    },
    '50%': {
      transform: 'translateY(-3px)',
    },
    '100%': {
      transform: 'translateY(-6px)',
    },
  },
  hoverAnimation: {
    '&:hover': {
      animation: '$hoverEffect',
      animationDuration: '1.5s',
      animationFillMode: 'forwards',
      animationIterationCount: 'infinite',
      animationDirection: 'alternate',
      animationTimingFunction: 'linear',
      transform: 'translateY(-6px)',
      willChange: 'transform',
    },
  },
});
