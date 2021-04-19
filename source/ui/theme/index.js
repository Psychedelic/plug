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
  spacing: 12,
  typography: {
    fontFamily: 'Inter',
    h1: {
      fontWeight: 700,
      fontSize: 26,
      lineHeight: '31.2px',
      color: '#111827',
    },
    h2: {
      fontWeight: 600,
      fontSize: 22,
      lineHeight: '26.4px',
      color: '#111827',
    },
    h3: {
      fontWeight: 600,
      fontSize: 20,
      lineHeight: '24px',
      color: '#111827',
    },
    h4: {
      fontWeight: 500,
      fontSize: 18,
      lineHeight: '21.6px',
      color: '#111827',
    },
    h5: {
      fontWeight: 500,
      fontSize: 16,
      lineHeight: '19.2px',
      color: '#111827',
    },
    subtitle1: {
      fontWeight: 400,
      fontSize: 16,
      lineHeight: '19.2px',
      color: '#6B7280',
    },
    subtitle2: {
      fontWeight: 400,
      fontSize: 14,
      lineHeight: '16.8px',
      color: '#6B7280',
    },
    caption: {
      fontWeight: 400,
      fontSize: 12,
      lineHeight: '14.4px',
      color: '#111827',
    },
  },
});

export default theme;
