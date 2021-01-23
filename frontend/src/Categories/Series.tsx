import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import EditMovie from '../Data/EditMovie';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Chip from '@material-ui/core/Chip';

const useStyles = makeStyles({
  root: {
    minWidth: 275,
    margin: 10,
  },
  title: {
    fontSize: 32,
  },
  letter: {
    fontSize: 32,
    position: 'absolute',
  },

  pos: {
    marginBottom: 12,
  },
  button: {
    display: 'block',
    position: 'absolute',
    bottom: 5,
    left: 24,
    opacity: 0.9,
  },
  edit: {
    display: 'block',
    position: 'absolute',
    top: 5,
    right: 5,
    opacity: 0.9,
  },
  link: {
    color: '#fff',
    textDecoration: 'none',
  },
  chips: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  chip: {
    marginLeft: 5,
  },
  li: {
    display: 'inline-block',
    width: (props: IProps) => props.sizeX,
    height: (props: IProps) => props.sizeY,
    position: 'relative',
    verticalAlign: 'top',
    margin: 10,
    opacity: 0.7,
    zIndex: 0,
    backgroundImage: 'url("/images/missing_image.png")',
    backgroundSize: 'cover',
      textDecoration: 'none',
      overflow: 'hidden',
    '&:hover': {
      margin: 0,
      width: (props: IProps) => props.sizeX + 20,
      height: (props: IProps) => props.sizeY + 20,
      opacity: 1,
      boxShadow: '0 0 50px black',
      zIndex: 10,
    },
    },
    list: {
        textDecoration: 'none',
        marginBottom: 10,
    },
  image: {
    display: 'inline-block',
    width: (props: IProps) => props.sizeX,
    height: (props: IProps) => props.sizeY,
    boxShadow: '0 0 30px black',
  },
  img: {
    marginBottom: -7,
  },
  card: {
    position: 'relative',
    verticalAlign: 'top',
  },
  cardcontent: {
    display: 'inline-block',
    width: '70%',
    verticalAlign: 'top',
  },
});

interface IProps {
  data: ISeries | IData;
  getData: (data: string) => void;
  path: string;
  editing: boolean;
    sort: string;
    view: boolean;
  sizeX: number;
  sizeY: number;
}

interface ISeries {
  id: number;
  name: string;
  isDirectory: boolean;
}

interface IMovie {
  letter: string;
  group: object[];
  actors: string;
  director: string;
  duplicates: number;
  exists: boolean;
  fileName: string;
  genre: string;
  id: number;
  imdbId: string;
  imdbRating: number;
  isDirectory: boolean;
  lastModified: string;
  length: number;
  matched: boolean;
  name: string;
  physicalPath: string;
  plot: string;
  posterArt: string;
  rated: string;
  released: string;
  runtime: string;
  title: string;
  year: string;
}

interface IData {
  data: IMovie;
}

const Series: React.FC<IProps> = (props: IProps) => {
  const classes = useStyles(props);

  const [open, setOpen] = React.useState(false);
  const [dataset, setDataset] = React.useState<IMovie>();

  const handleClickOpen = (vid: any) => {
    setDataset(vid);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleExplore = (vid: any) => {
    props.getData(`${props.path}/${vid.title}`);
  };

  const artwork = (video: any) => {
    let name: string = video.title;
    let episode: string = '';
    let path: string = props.path;
    let category: string = '';
    if (props.path.includes('/')) {
      const newpath = props.path.split('/');
      path = newpath[0];
      category = newpath[1];
    }

    if (name.includes('.')) {
      const splitname = name.split(' - ');
      name = splitname[0];
      episode = splitname[1];
    }
    if (video.posterArt !== null && video.posterArt !== 'N/A') {
      return (
        <>
          {props.editing && (
            <Button
              className={classes.edit}
              variant='contained'
              color='primary'
              onClick={() => handleClickOpen(video)}
            >
              Edit
            </Button>
          )}

          <Link
            to={
              episode === ''
                ? `/media/${path}/${name}`
                : video.isDirectory
                ? `/media/${path}/${category}/${name}`
                : `/media/${path}/${name}`
            }
          >
            <img
              style={{ width: '100%' }}
              src={video.posterArt}
              alt=''
              className={!props.view ? classes.img : undefined}
            />
          </Link>
          {path === 'series' ? (
            <Button
              className={classes.button}
              variant='contained'
              color='primary'
              onClick={() => handleExplore(video)}
            >
              Explore
            </Button>
          ) : null}
        </>
      );
    } else {
      return (
        <>
          <Link
            className={classes.link}
            to={
              category === ''
                ? `/media/${path}/${name}`
                : `/media/${path}/${category}/${name}`
            }
          >
            {episode === '' ? name : episode}
          </Link>
          {props.editing && (
            <Button
              className={classes.edit}
              variant='contained'
              color='primary'
              onClick={() => handleClickOpen(video)}
            >
              Edit
            </Button>
          )}
          {props.path === 'series' ? (
            <Button
              className={classes.button}
              variant='contained'
              color='primary'
              onClick={() => handleExplore(video)}
            >
              Explore
            </Button>
          ) : null}
        </>
      );
    }
  };

  const alpha = (dataset: any) => {
    return (
      <>
        <Typography
          className={classes.letter}
          color='textSecondary'
          gutterBottom
        >
          {dataset.letter}
        </Typography>
        <ul>
          {dataset.group.map((vid: object, index: number) => (
            <li key={index} className={props.view ? classes.li : classes.list}>
                  {props.view ? artwork(vid) : details(vid)}
            </li>
          ))}
          ;
        </ul>
      </>
    );
  };

  const details = (dataset: any) => {
    return (
      <Card className={classes.card}>
        <div className={classes.image}>{artwork(dataset)}</div>
        <div className={classes.chips}>
          <Chip
            color='primary'
            label={dataset.rated}
            className={classes.chip}
          />
          <Chip label={dataset.year} className={classes.chip} />
          <Chip label={dataset.runtime} className={classes.chip} />
        </div>
        <CardContent className={classes.cardcontent}>
          <Typography
            className={classes.title}
            color='textSecondary'
            gutterBottom
          >
            {dataset.title}
          </Typography>

          {dataset.plot}
          <Typography
            style={{ marginTop: 15 }}
            variant='body2'
            color='textSecondary'
            component='p'
          >
            {dataset.actors}
          </Typography>
        </CardContent>
      </Card>
    );
  };

  let path: string = props.path;
  if (props.path.includes('/')) {
    const newpath = props.path.split('/');
    path = newpath[0];
  }

  return (
    <>
      {dataset ? (
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby='form-dialog-title'
        >
          <DialogTitle id='form-dialog-title'>{dataset.name}</DialogTitle>
          <DialogContent>
            <EditMovie
              update={() => /*props.getData(`${path}/${name}`)*/ null}
              close={() => handleClose()}
              data={dataset}
              path={path}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color='secondary'>
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      ) : null}
          {props.sort === 'alpha' ? alpha(props.data) : props.view ? artwork(props.data) : details(props.data)}
      {/*props.sort === 'details' && */}
    </>
  );
};

export default Series;
