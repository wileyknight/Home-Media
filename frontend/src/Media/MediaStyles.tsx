import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 500,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
    root: {
      minWidth: 275,
      margin: 10,
    },
    title: {
      fontSize: 14,
    },
    pos: {
      marginBottom: 12,
    },
    playerwrapper: {
      position: 'absolute',
      width: '100%',
      height: 'auto',
      backgroundColor: 'black',
    },
    overlay: {
      opacity: 0,
      transition: theme.transitions.create('opacity', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.standard,
      }),
    },
    overlayOn: {
      opacity: 1,
      backgroundColor: 'rgba(0,0,0,.3)',
      height: '100%',
      width: '100%',
      position: 'absolute',
      top: 0,
    },
    shade: {
      position: 'absolute',
      top: 0,
      width: '100%',
      height: '100%',
    },
    playercontrols: {
      position: 'absolute',
      width: '100%',
      height: 'auto',
      bottom: 5,
      zIndex: 50,
    },
    card: {
      position: 'absolute',
      top: 0,
      width: '100%',
      zIndex: 30,
      backgroundColor: 'transparent',
      boxShadow: 'none',
      textShadow: '5px 5px 5px 5px',
    },
    icons: {
      position: 'absolute',
      top: 0,
      height: '100%',
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 25,
    },
  })
);

export default useStyles;
