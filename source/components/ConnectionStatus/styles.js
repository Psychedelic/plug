import { makeStyles } from '@material-ui/core/styles';

const fullWidth = {
  width: '100%',
};

export default makeStyles((theme) => ({
  root: {
    ...fullWidth,
    height: 40,
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 25px',
    fontWeight: 500,
    textAlign: 'center',
  },
  fullWidth,
  bannerText: {
    fontWeight: '600',
  },
  active: {
    background: theme.palette.success.main,
  },
  inactive: {
    background: '#D1D5DB',
  },
  web: {
    fontWeight: 700,
    textOverflow: 'ellipsis',
    maxWidth: 200,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  },
  rainbow: {
    background:
      'linear-gradient(94.95deg, #FFE701 -1.41%, #FA51D3 34.12%, #10D9ED 70.19%, #52FF53 101.95%)',
  },
}));
