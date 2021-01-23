import React, { MouseEvent } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
//import VolumeOffIcon from '@material-ui/icons/VolumeOff';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import PauseIcon from '@material-ui/icons/Pause';
import ClosedCaptionIcon from '@material-ui/icons/ClosedCaption';
import Slider from '@material-ui/core/Slider';
import { VolumeOff } from '@material-ui/icons';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    margin: {
      height: theme.spacing(0.5),
    },
    text: {
        color: '#fff',
        paddingLeft: 15
    },
  })
);

interface IProps {
  elapsed: { progress: number };
  duration: number;
  isPlaying: boolean;
  isMute: boolean;
  playpause: () => void;
  mute: () => {};
  fullscreen: () => void;
  seeking: boolean;
  mouseDown: () => void;
  mouseUp: (event: MouseEvent) => void;
  seekChange: (event: any, newValue: number | number[]) => void;
  className: string;
}

const Controls: React.FC<IProps> = (props: IProps) => {
  const classes = useStyles();

  return (
    <Grid className={props.className} container>
      <Grid item xs={1}>
        <Button onClick={props.playpause}>
          {!props.isPlaying ? <PlayArrowIcon /> : <PauseIcon />}
        </Button>
      </Grid>
      <Grid item xs={6}>
        <div className={classes.root}>
          <div className={classes.margin} />
          <Slider
            ValueLabelComponent={ValueLabelComponent}
            aria-label='custom thumb label'
            value={props.elapsed.progress}
            color='secondary'
            onMouseDown={props.mouseDown}
            onChange={props.seekChange}
            onMouseUp={props.mouseUp}
            min={0}
            step={1}
            max={props.duration}
          />
        </div>
      </Grid>
      <Grid item xs={2}>
        <div className={classes.margin} />
        <Typography className={classes.text}>
          {toHHMMSS(props.elapsed.progress)} / {toHHMMSS(props.duration)}
        </Typography>
      </Grid>
      <Grid item xs={1}>
        <Button onClick={props.mute}>
          {!props.isMute ? <VolumeUpIcon /> : <VolumeOff />}
        </Button>
      </Grid>
      <Grid item xs={1}>
        <Button onClick={props.mute}>
          <ClosedCaptionIcon />
        </Button>
      </Grid>
      <Grid item xs={1}>
        <Button onClick={props.fullscreen}>
          <FullscreenIcon />
        </Button>
      </Grid>
    </Grid>
  );
};

export default Controls;

interface Props {
  children: React.ReactElement;
  open: boolean;
  value: number;
}

function ValueLabelComponent(props: Props) {
  const { children, open, value } = props;

  return (
    <Tooltip open={open} enterTouchDelay={0} placement='top' title={value}>
      {children}
    </Tooltip>
  );
}

type timeStruct = number | string;

const toHHMMSS = (sec: number) => {
  let hours: timeStruct = Math.floor(sec / 3600);
  let minutes: timeStruct = Math.floor((sec - hours * 3600) / 60);
  let seconds: timeStruct = Math.floor(sec - hours * 3600 - minutes * 60);

  if (hours < 10) {
    hours = '0' + hours.toString();
  }
  if (minutes < 10) {
    minutes = '0' + minutes.toString();
  }
  if (seconds < 10) {
    seconds = '0' + seconds.toString();
  }
  return hours + ':' + minutes + ':' + seconds;
};
