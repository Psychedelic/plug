import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    background: theme.palette.common.white,
    boxShadow:
      '0px 0px 0px rgba(6, 44, 82, 0.1), 0px 1px 3px rgba(64, 66, 69, 0.12), 0px 2px 16px rgba(33, 43, 54, 0.08)',
    borderRadius: 20,
    padding: theme.spacing(1),
    width: 'fit-content',
    display: 'flex',
    height: 'fit-content',
    margin: 'auto',
  },
}));
