import React, { useEffect, useRef, MouseEvent } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import ReactPlayer from 'react-player';
import screenfull from 'screenfull';
import useStyles from './MediaStyles';
import Card from '@material-ui/core/Card';
import Chip from '@material-ui/core/Chip';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Replay10Icon from '@material-ui/icons/Replay10';
//import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import Forward10Icon from '@material-ui/icons/Forward10';
import { PlayArrow } from '@material-ui/icons';
import {
  mediaReducer,
  MediaState,
  getMedia,
  getProgress,
  createProgress,
  updateProgress,
} from './MediaUtilities';

import Controls from './Controls';

type Props = RouteComponentProps<{
  title: string;
  mediatype: string;
  current: string;
}>;

const initialMovieListState: MediaState = {
  currentVideo: [],
  progress: { id: 0, progress: 0.0, mediaType: '', profileID: 0, activeID: 0 },
  loading: false,
  currentID: -1,
  playing: false,
  muted: false,
  duration: 0,
  seeking: false,
  overlay: false,
  counter: 0,
};

const Media: React.FC<Props> = (props: Props) => {
  const classes = useStyles();
  const reactplayer = useRef<ReactPlayer>(null);

  const [
    {
      loading,
      progress,
      currentID,
      playing,
      currentVideo,
      duration,
      muted,
      seeking,
      overlay,
      counter,
    },
    dispatch,
  ] = React.useReducer(mediaReducer, initialMovieListState);

  useEffect(() => {
    getMedia(
      props.match.params.title,
      props.match.params.mediatype,
      dispatch,
      props.match.params.current
    );
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeypress);

    return () => {
      document.removeEventListener('keydown', handleKeypress);
    };
  }, []);

  useEffect(() => {
    if (currentVideo[currentID] !== undefined) {
      getProgress(
        props.match.params.mediatype,
        currentVideo[currentID].id,
        loading,
        dispatch
      );
    }
  }, [currentID]);

  useEffect(() => {
    if (currentVideo[currentID] !== undefined) {
      createProgress(
        props.match.params.mediatype,
        currentVideo,
        currentID,
        loading,
        dispatch
      );
      console.log(currentVideo);
    }
  }, [loading]);

  const handleProgress = (played: any): void => {
    if (!seeking && playing) {
      dispatch({ type: 'set_progress', payload: played.playedSeconds });
      if (counter < 5) {
        dispatch({ type: 'update_counter', payload: counter + 1 });
      } else {
        dispatch({ type: 'update_counter', payload: 0 });
        updateProgress(
          props.match.params.mediatype,
          currentVideo,
          currentID,
          progress
        );
      }
    }
  };

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    dispatch({ type: 'update_id', payload: event.target.value as number });
  };

  const handleKeypress = (event: KeyboardEvent): void => {
    if (event.keyCode === 32) {
      if (reactplayer.current !== null) {
        if (reactplayer.current.props.playing) {
          dispatch({ type: 'update_playing', payload: false });
        } else {
          dispatch({ type: 'update_playing', payload: true });
        }
      }
    }
  };

  const togglePlay = () => {
    if (reactplayer.current !== null) {
      if (!playing) {
        reactplayer.current.seekTo(progress.progress);
        dispatch({ type: 'update_playing', payload: true });
      } else {
        dispatch({ type: 'update_playing', payload: false });
        updateProgress(
          props.match.params.mediatype,
          currentVideo,
          currentID,
          progress
        );
      }
    }
  };

  const toggleMute = async () => {
    if (reactplayer.current !== null) {
      dispatch({ type: 'toggle_mute' });
    }
  };

  const handleSeekMouseDown = () => {
    dispatch({ type: 'seeking_down' });
  };

  const handleSeekChange = (event: any, newValue: number | number[]) => {
    if (typeof newValue == 'number') {
      dispatch({ type: 'set_progress', payload: newValue });
    }
  };

  const handleSeekMouseUp = (e: MouseEvent) => {
    dispatch({ type: 'seeking_up' });
    if (reactplayer.current !== null) {
      dispatch({ type: 'update_playing', payload: true });
      reactplayer.current.seekTo(progress.progress);
      updateProgress(
        props.match.params.mediatype,
        currentVideo,
        currentID,
        progress
      );
    }
  };

  const handleSkipForward = (e: MouseEvent) => {
    if (reactplayer.current !== null) {
      dispatch({ type: 'update_playing', payload: true });
      reactplayer.current.seekTo(progress.progress + 10);
      dispatch({ type: 'set_progress', payload: progress.progress + 10 });
      updateProgress(
        props.match.params.mediatype,
        currentVideo,
        currentID,
        progress
      );
    }
  };

  const handleSkipReverse = (e: MouseEvent) => {
    if (reactplayer.current !== null) {
      dispatch({ type: 'update_playing', payload: true });
      reactplayer.current.seekTo(progress.progress - 10);
      dispatch({ type: 'set_progress', payload: progress.progress - 10 });
      updateProgress(
        props.match.params.mediatype,
        currentVideo,
        currentID,
        progress
      );
    }
  };

  const handleFullscreen = async () => {
    if (screenfull.isEnabled) {
      if (reactplayer.current !== null) {
        screenfull.request();
      }
    }
  };

  const handleEnded = () => {
    if (currentID < currentVideo.length - 1) {
      dispatch({ type: 'update_id', payload: currentID + 1 });
    }
  };

  const handleMovement = () => {
    if (!overlay) {
      dispatch({ type: 'toggle_overlay', payload: true });
      const timer = setTimeout(() => {
        clearTimeout(timer);
        dispatch({ type: 'toggle_overlay', payload: false });
      }, 3000);
    }
  };

  const handleDuration = (duration: number) => {
    dispatch({ type: 'set_duration', payload: duration });
  };

  return (
    <div style={{ backgroundColor: '#000' }}>
      {currentVideo[currentID] ? (
        <div className={classes.playerwrapper}>
          {console.log(
            currentID,
            currentVideo[currentID].series,
            currentVideo[currentID].fileName
          )}
          <ReactPlayer
            ref={reactplayer}
            url={
              currentVideo[currentID].series
                ? `${props.match.params.current ? '../' : ''}${
                    currentVideo[currentID].series
                  }/${currentVideo[currentID].fileName}`
                : currentVideo[currentID].fileName
            }
            controls={false}
            playing={playing}
            width={window.innerWidth}
            height={window.innerHeight - 4}
            onProgress={handleProgress}
            onDuration={handleDuration}
            onEnded={handleEnded}
            muted={muted}
          />
          <div
            className={overlay ? classes.overlayOn : classes.overlay}
            onMouseMove={handleMovement}
          >
            <Controls
              className={classes.playercontrols}
              elapsed={progress}
              duration={duration}
              isPlaying={playing}
              isMute={muted}
              playpause={togglePlay}
              mute={toggleMute}
              fullscreen={handleFullscreen}
              seeking={seeking}
              mouseDown={handleSeekMouseDown}
              mouseUp={handleSeekMouseUp}
              seekChange={handleSeekChange}
            />
            <div className={classes.icons}>
              <div className={classes.shade} onClick={togglePlay}></div>
              <Replay10Icon
                style={{
                  width: 100,
                  height: 100,
                  color: 'rgba(255,255,255,.4)',
                  position: 'relative',
                  zIndex: 32,
                }}
                onClick={handleSkipReverse}
              />
              <PlayArrow
                style={{
                  width: 200,
                  height: 200,
                  color: 'rgba(255,255,255,.4)',
                  position: 'relative',
                  zIndex: 33,
                }}
                onClick={togglePlay}
              />
              <Forward10Icon
                style={{
                  width: 100,
                  height: 100,
                  color: 'rgba(255,255,255,.4)',
                  position: 'relative',
                  zIndex: 34,
                }}
                onClick={handleSkipForward}
              />
            </div>
            <Card className={classes.card}>
              <CardContent>
                <FormControl className={classes.formControl}>
                  <InputLabel id='demo-simple-select-label'>
                    File Name
                  </InputLabel>
                  <Select
                    labelId='demo-simple-select-label'
                    id='demo-simple-select'
                    value={currentID}
                    onChange={handleChange}
                  >
                    {currentVideo.map((media: any, index: number) => (
                      <MenuItem key={index} value={index}>
                        {media.title}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Typography
                  className={classes.title}
                  color='textSecondary'
                  gutterBottom
                >
                  {currentVideo[currentID].genre}
                </Typography>
                <Typography variant='h5' component='h2'>
                  <Chip color='primary' label={currentVideo[currentID].rated} />
                  <Chip label={currentVideo[currentID].year} />
                  <Chip label={currentVideo[currentID].runtime} />
                </Typography>
                <Typography className={classes.pos} color='textSecondary'>
                  {currentVideo[currentID].actors}
                </Typography>
                <Typography variant='body2' component='p'>
                  {currentVideo[currentID].plot}
                  {currentVideo[currentID].series
                    ? currentVideo[currentID].series +
                      '/' +
                      currentVideo[currentID].fileName
                    : currentVideo[currentID].fileName}
                </Typography>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default Media;
