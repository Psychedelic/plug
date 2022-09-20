import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  dragDropContainer: {
    border: '2px dashed #D1D5DB',
    boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
    height: '142px',
    width: '370px',
    borderRadius: 6,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  dragDropIcon: {
    color: '#BBBEC2',
  },
  dragDropText: {
    color: '#D1D5DB',
    textAlign: 'center'
  },
  dragDropBrowse: {
    color: '#111827',
  }
}));
