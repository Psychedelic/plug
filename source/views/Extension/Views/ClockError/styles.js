import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(() => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '76px 59px',
  },
  clockImg: {
    width: 43,
    marginBottom: 17,
  },
  title: {
    fontWeight: 500,
    fontSize: 16,
    lineHeight: '20px',
    marginBottom: 11,
    color: '#111827',
  },
  description: {
    textAlign: 'center',
    fontSize: 14,
    lineHeight: '20px',
    marginTop: 0,
    color: '#374151',
    marginBottom: 17,
  },
  descriptionLink: {
    color: '#3574F4',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
}));
