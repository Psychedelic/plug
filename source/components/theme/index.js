import { createTheme } from '@material-ui/core/styles';

const primaryFontColor = '#111827';
const secondaryFontColor = '#374151';
const tertiaryFontColor = '#3574F4';

const theme = createTheme({
  overrides: {
    MuiCssBaseline: {
      '@global': {
        body: {
          fontFamily: 'Inter',
        },
        '.emoji-picker-react .emoji-categories': {
          display: 'none',
        },
      },
    },
  },
  palette: {
    common: {
      primaryBlack: primaryFontColor,
      secondaryBlack: secondaryFontColor,
      blue: tertiaryFontColor,
      gray: '#6B7280',
      lightGray: '#E5E7EB',
    },
    primary: {
      main: tertiaryFontColor,
      lightGradient:
        'linear-gradient(94.95deg, rgba(255, 231, 1, 0.5) -1.41%, rgba(250, 81, 211, 0.5) 34.12%, rgba(16, 217, 237, 0.5) 70.19%, rgba(82, 255, 83, 0.5) 101.95%)',
      mainGradient:
        'linear-gradient(94.95deg, #FFE701 -1.41%, #FA51D3 34.12%, #10D9ED 70.19%, #52FF53 101.95%)',
      darkGradient:
        'linear-gradient(94.95deg, rgba(255, 231, 1, .2) -1.41%, rgba(250, 81, 211, 0.2) 34.12%, rgba(16, 217, 237, .2) 70.19%, rgba(82, 255, 83, .2) 101.95%)',
    },
    danger: {
      light: 'rgba(220, 38, 38, 0.5)',
      main: 'rgb(220, 38, 38)',
    },
    success: {
      main: '#04CD95',
    },
  },
  spacing: 12,
  typography: {
    fontFamily: 'Inter',
    h1: {
      fontWeight: 700,
      fontSize: 26,
      lineHeight: '31.2px',
      color: primaryFontColor,
    },
    h2: {
      fontWeight: 600,
      fontSize: 22,
      lineHeight: '26.4px',
      color: primaryFontColor,
    },
    h3: {
      fontWeight: 600,
      fontSize: 20,
      lineHeight: '24px',
      color: primaryFontColor,
    },
    h4: {
      fontWeight: 500,
      fontSize: 18,
      lineHeight: '21.6px',
      color: primaryFontColor,
    },
    h5: {
      fontWeight: 500,
      fontSize: 15,
      lineHeight: '19.2px',
      color: primaryFontColor,
    },
    h6: {
      fontWeight: 500,
      fontSize: 14,
      lineHeight: '16.8px',
      color: secondaryFontColor,
    },
    subtitle1: {
      fontWeight: 400,
      fontSize: 16,
      lineHeight: '19.2px',
      color: secondaryFontColor,
    },
    subtitle2: {
      fontWeight: 400,
      fontSize: 14,
      lineHeight: '16.8px',
      color: secondaryFontColor,
    },
    caption: {
      fontWeight: 400,
      fontSize: 12,
      lineHeight: '14.4px',
      color: primaryFontColor,
    },
  },
});

export default theme;
