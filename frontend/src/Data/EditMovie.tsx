import React, { useState, FormEvent, ChangeEvent } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

interface IProps {
  update: () => void;
  close: () => void;
  data: IData;
  path: string;
}

interface IData {
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
  year: string | null;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '& > *': {
        margin: theme.spacing(1),
        width: '50ch',
      },
      flexGrow: 1,
    },
    button: {
      position: 'absolute',
      right: 90,
      bottom: 8,
    },
  })
);

const EditMovie: React.FC<IProps> = (props: IProps) => {
  const classes = useStyles();

  const [movieTitle, setMovieTitle] = useState<string>(props.data.title);
  const [posterArtwork, setPosterArtwork] = useState<string>(
    props.data.posterArt
  );
  const [rating, setRating] = useState<string>(props.data.rated);
  const [releaseYear, setReleaseYear] = useState<string | null>(
    props.data.year
  );
  const [moviePlot, setMoviePlot] = useState<string>(props.data.plot);
  const [movieActors, setMovieActors] = useState<string>(props.data.actors);
  const [movieDirector, setMovieDirector] = useState<string>(
    props.data.director
  );
  const [movieRuntime, setMovieRuntime] = useState<string>(props.data.runtime);
  const [movieGenre, setMovieGenre] = useState<string>(props.data.genre);

  const saveMovie = async (e: FormEvent) => {
    e.preventDefault();
    console.log(props.data.id);
    const baseURL = `/api/${props.path}/${props.data.id}`;

    const data = JSON.stringify({
      ID: props.data.id,
      Title: movieTitle,
      PosterArt: posterArtwork,
      Rated: rating,
      Year: releaseYear,
      Plot: moviePlot,
      Actors: movieActors,
      Director: movieDirector,
      Runtime: movieRuntime,
      Genre: movieGenre,

      FileName: props.data.name,
      imdbId: props.data.imdbId,
      imdbRating: props.data.imdbRating,
      Released: props.data.released,
    });

    await fetch(baseURL, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: data,
    })
      .then((res) => {
        console.log(res);
        props.update();
        setMovieTitle('');
        setPosterArtwork('');
        setRating('');
        setReleaseYear(null);
        props.close();
      })
      .catch((err) => {
        console.log('error', err);
      });
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    switch (e.target.name) {
      case 'Title':
        setMovieTitle(e.target.value);
        break;
      case 'PosterArt':
        setPosterArtwork(e.target.value);
        break;
      case 'Rated':
        setRating(e.target.value);
        break;
      case 'Year':
        setReleaseYear(e.target.value);
        break;
      case 'Plot':
        setMoviePlot(e.target.value);
        break;
      case 'Actors':
        setMovieActors(e.target.value);
        break;
      case 'Director':
        setMovieDirector(e.target.value);
        break;
      case 'Runtime':
        setMovieRuntime(e.target.value);
        break;
      case 'Genre':
        setMovieGenre(e.target.value);
        break;
      default:
        // never reach here
        console.error(e.target.name);
    }
  };

  console.log(props.data);

  return (
    <div className={classes.root}>
      <form autoComplete='off'>
        <Grid container spacing={3}>
          <Grid item sm={6}>
            <TextField
              id='outlined-basic'
              name='Title'
              label='Title'
              variant='outlined'
              onChange={handleChange}
              value={movieTitle}
              fullWidth
              style={{ marginBottom: 20 }}
            />
            <TextField
              id='outlined-basic'
              name='PosterArt'
              label='PosterArt'
              variant='outlined'
              onChange={handleChange}
              value={posterArtwork}
              fullWidth
              style={{ marginBottom: 20 }}
            />
            <TextField
              id='outlined-basic'
              name='Rated'
              label='Rated'
              variant='outlined'
              onChange={handleChange}
              value={rating}
              fullWidth
              style={{ marginBottom: 20 }}
            />
            <TextField
              id='outlined-basic'
              name='Year'
              label='Year'
              variant='outlined'
              onChange={handleChange}
              fullWidth
              value={releaseYear}
            />
          </Grid>
          <Grid item sm={6}>
            <TextField
              id='outlined-basic'
              name='Actors'
              label='Actors'
              variant='outlined'
              onChange={handleChange}
              fullWidth
              value={movieActors}
              style={{ marginBottom: 20 }}
            />
            <TextField
              id='outlined-basic'
              name='Director'
              label='Director'
              variant='outlined'
              onChange={handleChange}
              fullWidth
              value={movieDirector}
              style={{ marginBottom: 20 }}
            />
            <TextField
              id='outlined-basic'
              name='Runtime'
              label='Runtime'
              variant='outlined'
              onChange={handleChange}
              fullWidth
              value={movieRuntime}
              style={{ marginBottom: 20 }}
            />
            <TextField
              id='outlined-basic'
              name='Genre'
              label='Genre'
              variant='outlined'
              onChange={handleChange}
              fullWidth
              value={movieGenre}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id='outlined-full-width'
              name='Plot'
              label='Plot'
              multiline
              rows={4}
              defaultValue=''
              variant='outlined'
              fullWidth
              onChange={handleChange}
              value={moviePlot}
            />
          </Grid>
        </Grid>
        <div className={classes.button}>
          <Button onClick={saveMovie} variant='contained' color='primary'>
            Save
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditMovie;
