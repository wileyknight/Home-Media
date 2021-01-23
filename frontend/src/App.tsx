import React, { useEffect } from 'react';
import clsx from 'clsx';
import NavBar from './UI/NavBar';
import { useTheme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Series from './Categories/Series';
import { useLocation, useHistory } from 'react-router-dom';
import { useStyles } from './UI/AppStyles';
import {
  mediaReducer,
  initialMovieListState,
  IData,
  IMovie,
} from './UI/AppState';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Fab from '@material-ui/core/Fab';
import { ArrowDownward } from '@material-ui/icons';
import { ArrowUpward } from '@material-ui/icons';
import Slider from '@material-ui/core/Slider';
import ViewComfyIcon from '@material-ui/icons/ViewComfy';
import ViewListIcon from '@material-ui/icons/ViewList';


interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

function imageX(slider: number | number[], hover: number = 0): number {
  const size = 150 + hover;
  if (typeof slider === 'number') {
    return size + slider;
  }
  return size;
}

function imageY(slider: number | number[], hover: number = 0): number {
  const size = 150 + hover;
  const aspect = 0.6938;
  if (typeof slider === 'number') {
    return (size + slider) / aspect;
  }
  return size;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function a11yProps(index: any) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const marks = [
  {
    value: 0,
    label: 'small',
  },
  {
    value: 20,
    label: 'medium',
  },
  {
    value: 40,
    label: 'large',
  },
  {
    value: 100,
    label: 'extra',
  },
];

function valuetext(value: number) {
  return `${value}`;
}

interface SearchTerms {
  name: string;
}

type MoveList =
  | 'update_movies'
  | 'update_series'
  | 'update_live'
  | 'update_filipino';

const App: React.FC = () => {
  const medialocation = ['movies', 'series', 'live', 'filipino'] as const;

  const [
    {
      moviesData,
      seriesData,
      liveData,
      filipinoData,
      searchMedia,
      data,
      count,
      value,
      open,
      path,
      editing,
      sort,
      direction,
          size,
      view,
    },
    dispatch,
  ] = React.useReducer(mediaReducer, initialMovieListState);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    dispatch({ type: 'update_path', payload: medialocation[newValue] });
    dispatch({ type: 'set_value', payload: newValue });
  };

  const classes = useStyles({ size });
  const theme = useTheme();

  const handleSelect = (event: React.ChangeEvent<{ value: unknown }>) => {
    dispatch({
      type: 'set_sort',
      payload: event.target.value as string,
      area: `${medialocation[value]}Data`,
    });
  };
  const handleDirection = (): void => {
    dispatch({ type: 'set_sortDirection' });
  };

    const handleView = (): void => {
        dispatch({ type: 'update_view' });
    };

  const handleSliderChange = (event: any, newValue: number | number[]) => {
    dispatch({ type: 'update_size', payload: newValue });
  };

  const handleDrawerOpen = (): void => {
    dispatch({ type: 'set_open', payload: true });
  };

  const handleDrawerClose = (): void => {
    dispatch({ type: 'set_open', payload: false });
  };

  const handleediting = (): void => {
    dispatch({ type: 'update_editing' });
  };

  const getData = async (ext: string) => {
    const baseURL = `/api/${ext}/`;
    await fetch(baseURL, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(async (res) => {
        const js: IData = await res.json();
        const location = `update_${medialocation[value]}` as MoveList;
        dispatch({ type: location, payload: js });
      })
      .catch((err) => {
        console.log('error', err);
      });
  };

  useEffect(() => {
    let m: string | null = query.get('mediatype');
    let v: number = 0;

    if (!m || m === 'movies') {
      m = 'movies';
    } else if (m === 'series') {
      v = 1;
    } else if (m === 'live') {
      v = 2;
    } else if (m === 'filipino') {
      v = 3;
    }

    dispatch({ type: 'update_path', payload: m });
    dispatch({ type: 'set_value', payload: v });
  }, []);

  useEffect(() => {
    getData(path);
  }, [path]);

  const history = useHistory();

  useEffect(() => {
    const params = new URLSearchParams();
    if (path) {
      const series: string[] = path.split('/');
      if (series.length > 0) {
        params.append('mediatype', series[0]);
        params.append('title', series[1]);
      } else {
        params.append('mediatype', path);
        params.delete('title');
      }
    } else {
      params.delete('mediatype');
      params.delete('title');
    }
    history.push({ search: params.toString() });
  }, [path, history]);

  const searching = (searchTerm: string): void => {
    const dataset = eval(`${medialocation[value]}Data`) as IData;
    console.log(dataset);
    if (searchTerm.length > 0) {
      const findTerms = dataset.matched.filter((fitem: any) =>
        fitem.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      console.log(dataset, medialocation[value], findTerms);
      dispatch({ type: 'update_search', payload: findTerms });
    } else {
      dispatch({ type: 'update_search', payload: moviesData.matched });
    }
  };

  const sortBy = (media: object[]): object[] => {
    let result: object[] = [];

    if (sort === 'alpha') {
      const alpha = media.reduce((r: any, e: any) => {
        let letter: any = e.name[0].toUpperCase();
        const parsed = parseInt(letter);

        if (!isNaN(parsed)) {
          letter = '#';
        }

        if (!r[letter]) {
          r[letter] = { letter, group: [e] };
        } else {
          r[letter].group.push(e);
        }
        return r;
      }, {});

      result = Object.values(alpha);
    } else {
      const yr = media.slice().sort((a: any, b: any) => b.year - a.year);
      result = Object.values(yr);
    }

    if (!direction) {
      result.reverse();
    }

    return result;
  };

  let query = useQuery();

  const setPath = (loc: string): void => {
    dispatch({
      type: 'update_path',
      payload: loc,
    });
  };

  useEffect(() => {
    if (moviesData.loaded) {
      const newdata: IData = {
        ...moviesData,
        matched: sortBy(moviesData.matched),
      };
      dispatch({ type: 'update_data', payload: newdata });
    }
  }, [moviesData, searchMedia]);

  let refs: any;

  if (sort === 'alpha') {
    refs = data?.matched.reduce((acc: any, value: any) => {
      acc[value.letter] = React.createRef();
      return acc;
    }, {});
  }

  const handleClick = (id: string): void => {
    if (refs[id].current) {
      window.scroll({
        top: refs[id].current.offsetTop - 250,
        left: 0,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div>
      <NavBar
        search={searching}
        alerts={count}
        handleOpen={handleDrawerOpen}
        isOpen={open}
        refresh={setPath}
        active={value}
        path={path}
        toggleediting={handleediting}
        editing={editing}
      />

      <Drawer
        className={classes.drawer}
        variant='persistent'
        anchor='left'
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </div>
        <div className={classes.wrapper}>
          
        </div>
      </Drawer>

      <div
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <Paper className={classes.tabs}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label='Choose your media'
          >
            <Tab label='Movies' {...a11yProps(0)} />
            <Tab label='Series' {...a11yProps(1)} />
            <Tab label='Live' {...a11yProps(2)} />
            <Tab label='Filipino' {...a11yProps(3)} />
          </Tabs>
        </Paper>
        <div className={classes.scale}>
          <Slider
            className={classes.size}
            defaultValue={20}
            getAriaValueText={valuetext}
            aria-labelledby='discrete-slider-custom'
            step={10}
            valueLabelDisplay='auto'
            marks={marks}
            color='secondary'
            onChange={handleSliderChange}
          />
              </div>
              <ul className={clsx(classes.alphabet, {
                      [classes.contentShift]: open,
                  })}>
                  {sort === 'alpha' &&
                      data.matched.map((m: any) => (
                          <li className={classes.list} key={`list${m.letter}`}>
                              <Typography
                                  className={classes.title}
                                  color='textSecondary'
                                  gutterBottom
                              >
                                  <Button
                                      onClick={() => handleClick(m.letter)}
                                      className={classes.root}
                                  >
                                      {m.letter}
                                  </Button>
                              </Typography>
                          </li>
                      ))}
              </ul>
              <div className={classes.sorting}>
                  <Fab
                      color='primary'
                      aria-label='down'
                      size='small'
                      style={{ marginTop: 15, marginRight: 10 }}
                      onClick={handleView}
                  >
                      {view ? <ViewListIcon /> : <ViewComfyIcon />}    
                      
                  </Fab>
          <Fab
            color='primary'
            aria-label='down'
            size='small'
            style={{ marginTop: 15, marginRight: 10 }}
            onClick={handleDirection}
          >
            {direction ? <ArrowDownward /> : <ArrowUpward />}
          </Fab>
          <FormControl
            variant='outlined'
            color='primary'
            className={classes.formControl}
          >
            <InputLabel id='demo-simple-select-outlined-label'>Sort</InputLabel>
            <Select
              labelId='demo-simple-select-outlined-label'
              id='demo-simple-select-outlined'
              value={sort}
              onChange={handleSelect}
              label='Sort'
              style={{ backgroundColor: '#191919' }}
            >
              <MenuItem value={'alpha'}>Abc</MenuItem>
              <MenuItem value={'year'}>Year</MenuItem>
            </Select>
          </FormControl>
        </div>
        <TabPanel value={value} index={0}>
          <div style={{ paddingTop: 180}}>
            <ul>
              {moviesData.loaded ? (
                sortBy(searchMedia).map((media: any, index: number) => (
                  <li
                    className={
                      sort === 'alpha' || !view
                        ? classes.liAlpha
                        : classes.li
                    }
                    key={index}
                    ref={sort === 'alpha' ? refs[media.letter] : null}
                  >
                    <Series
                            data={media}
                            getData={setPath}
                            path={path}
                            editing={editing}
                            sort={sort}
                            sizeX={imageX(size)}
                            sizeY={imageY(size)}
                            view={ view}
                    />
                  </li>
                ))
              ) : (
                <>Loading...</>
              )}
            </ul>
          </div>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <div style={{ paddingTop: 180 }}>
            <ul>
              {seriesData.loaded ? (
                sortBy(searchMedia).map((media: any, index: number) => (
                  <li
                    className={
                      sort === 'alpha'
                        ? classes.liAlpha
                        : classes.li
                    }
                    key={index}
                    ref={sort === 'alpha' ? refs[media.letter] : null}
                  >
                    <Series
                            data={media}
                            getData={setPath}
                            path={path}
                            editing={editing}
                            sort={sort}
                            sizeX={imageX(size)}
                            sizeY={imageY(size)}
                            view={ view}
                    />
                  </li>
                ))
              ) : (
                <>Loading...</>
              )}
            </ul>
          </div>
        </TabPanel>
        <TabPanel value={value} index={2}>
          <div style={{ paddingTop: 180 }}>
            <ul>
              {liveData.loaded ? (
                sortBy(searchMedia).map((media: any, index: number) => (
                  <li
                    className={
                      sort === 'alpha'
                        ? classes.liAlpha
                        : classes.li
                    }
                    key={index}
                    ref={sort === 'alpha' ? refs[media.letter] : null}
                  >
                    <Series
                      data={media}
                      getData={setPath}
                      path={path}
                      editing={editing}
                      sort={sort}
                      sizeX={imageX(size)}
                            sizeY={imageY(size)}
                            view={view}
                    />
                  </li>
                ))
              ) : (
                <>Loading...</>
              )}
            </ul>
          </div>
        </TabPanel>
        <TabPanel value={value} index={3}>
          <div style={{ paddingTop: 180 }}>
            <ul>
              {filipinoData.loaded ? (
                sortBy(searchMedia).map((media: any, index: number) => (
                  <li
                    className={
                      sort === 'alpha'
                        ? classes.liAlpha
                        : classes.li
                    }
                    key={index}
                    ref={sort === 'alpha' ? refs[media.letter] : null}
                  >
                    <Series
                      data={media}
                      getData={setPath}
                      path={path}
                      editing={editing}
                      sort={sort}
                      sizeX={imageX(size)}
                            sizeY={imageY(size)}
                            view={view}
                    />
                  </li>
                ))
              ) : (
                <>Loading...</>
              )}
            </ul>
          </div>
        </TabPanel>
      </div>
    </div>
  );
};

export default App;
