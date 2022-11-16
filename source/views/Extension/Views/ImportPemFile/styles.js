import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  dragDropContainer: {
    border: '2px dashed #D1D5DB',
    boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
    height: '142px',
    width: '370px',
    borderRadius: 6,
    marginBottom: 20,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  dragDropContainerError: {
    border: '2px dashed #E53C3C',
    boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
    height: '142px',
    width: '370px',
    borderRadius: 6,
    marginBottom: 40,
  },
  insideDragDrop: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    height: '100%',
  },
  inputFile: {
    display: 'none',
  },
  chooseEmojiContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    width: '100%',
    gap: 14,
    marginTop: 10,
    marginBottom: 30,
  },
  label: {
    width: 'auto',
  },
  formItem: {
    marginBottom: 35,
  },
  principalDetails: {
    marginBottom: 30,
  },
  inputFileLabel: {
    textDecorationLine: 'underline',
    textDecorationColor: '#3574F4',
    color: '#3574F4',
    '&:hover': {  
      cursor: 'pointer',
    }
  },
  nameXIcon: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    gap: 4,
    zIndex: 100,
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
  dropItLabel: {
    fontSize: 22,
    fontStyle: "bold",
  },
  dragFileElement: {
    position: 'absolute',
    width: '100vw',
    height: '100vh',
  },
  error: {
    color: '#E53C3C',
    fontSize: 14,
    display: 'flex',
    gap: 11,
    marginTop: 15,
  }
}));
