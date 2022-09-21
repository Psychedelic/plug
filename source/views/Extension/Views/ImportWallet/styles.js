import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  dragDropContainer: {
    border: '2px dashed #D1D5DB',
    boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
    height: '142px',
    width: '370px',
    borderRadius: 6,
    marginBottom: 10,
  },
  dragDropContainerError: {
    border: '2px dashed #E53C3C',
    boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
    height: '142px',
    width: '370px',
    borderRadius: 6,
    marginBottom: 10,
  },
  insideDragDrop: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    height: '100%',
  },
  nameXIcon: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    gap: 4,
  },
  dragDropIcon: {
    color: '#BBBEC2',
  },
  dragDropText: {
    color: '#D1D5DB',
    textAlign: 'center'
  },
  icon: {
    cursor: 'pointer',
    color: '#11182766',
    fontSize: 20,
  },
  dragDropBrowse: {
    color: '#111827',
  },
  inputDropContainer: {
    display: 'none',
  },
  labelInputDropContainer: {
    height: '100%',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  dropItContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  dragFileElement: {
    position: 'absolute',
    width: '100vw',
    height: '100vh',
  }
}));
