import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    borderBottom: `1px solid ${theme.palette.common.lightGray}`,
  },
  indicator: {
    backgroundColor: theme.palette.primary.main,
  },
  tabPanel: {
    // padding: `${theme.spacing(2)}px 0`,
    // height: 320,
  },
}));
