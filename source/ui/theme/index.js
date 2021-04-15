import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  overrides: {
    MuiCssBaseline: {
      '@global': {
        body: {
          fontFamily: 'Inter',
        },
      },
    },
  },
  typography: {
    fontFamily: 'Inter',
  },
});

export default theme;
