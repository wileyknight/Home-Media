import React, { MouseEvent } from 'react';
import Button from '@material-ui/core/Button';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { rename } from './Rename';

interface IProps {
  searchMedia: object[];
  refresh: (val: string) => void;
  active: number;
  path: string;
}

interface IData {
  name: string;
  Title: string;
  FileName: string;
  Actors: string;
  Director: string;
  Genre: string;
  Plot: string;
  Poster: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Year: string;
  imdbID: string;
  imdbRating: string;
  isDirectory: boolean;
}

interface IJson {
  alerts: object[];
  matched: object[];
}

const GetData: React.FC<IProps> = (props: IProps) => {
  //console.log(props);
  const getOmdbData = async (event: MouseEvent) => {
    event.preventDefault();

    const promises: any = [];

    const results: any = [];

    const databasepromises: any = [];

    const medialocation: string[] = ['movies', 'series', 'live', 'filipino'];

    const getData = async (ext: string) => {
      const baseURL = `/api/all/${ext}/`;
      //console.log(baseURL);
      await fetch(baseURL, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
        .then(async (res) => {
          const js: IJson = await res.json();
          console.log(js);
          if (js.alerts.length > 0) {
            js.alerts.map((media: any) => {
              const seperations = media.name.split('.');
              const ext = seperations[seperations.length - 1];
              if (ext !== 'srt') {
                promises.push(timeOut(media));
              }
              return null;
            });

            Promise.all(promises).then((response) => {
              console.log('promise', response);
              results.map((js: any) => {
                databasepromises.push(
                  updateDb(js, medialocation[props.active])
                );
                return null;
              });

              Promise.all(databasepromises).then((response) => {
                console.log('database', response);
                toast.success(
                  `Sucessfully updated database:${(<br />)}${titles.join()}`,
                  {
                    position: 'top-center',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                  }
                );
                props.refresh(props.path);
              });
            });
          }
        })
        .catch((err) => {
          console.log('error', err);
        });
    };

    getData(props.path);

    const timeOut = (t: IData) => {
      return new Promise((resolve, reject) => {
        const regExp = /\(([^)]+)\)/;
        const matches = regExp.exec(t.name);
        let renamed = t.name;
        let year = '';
        if (matches) {
          renamed = renamed.replace(` ${matches[0]}`, '');
          year = matches[1];
        }

        renamed = rename(renamed, t.isDirectory);
        console.log(renamed, year);
        const baseURL = `http://www.omdbapi.com/?apikey=728617f1&t=${renamed}&y=${year}`;

        fetch(baseURL, {
          method: 'GET',
        })
          .then(async (res) => {
            const js = await res.json();
            js.FileName = t.name;
            js.isDirectory = t.isDirectory;
            results.push(js);
            resolve(`Completed fetch for: ${js.Title}`);
          })
          .catch((err) => {
            console.log('error', err);
            reject(err);
          });
      });
    };
  };

  const titles: string[] = [];

  const updateDb = async (js: IData, medialocation: string) => {
    return new Promise((resolve, reject) => {
      const baseURL = `/api/${medialocation}`;

      if (js.Title == null || js.Title == '') {
        js.Title = rename(js.FileName, js.isDirectory, true);
      }
      let data: string = '';

      if (props.active == 1 && js.isDirectory == false) {
        console.log(js, props.active, js.isDirectory);
        const seperations: string[] = js.Title.split(' - ');
        console.log(seperations);
        const sequence: string[] = seperations[1]
          .toLocaleUpperCase()
          .split('E');
        const series: string = seperations[0];
        const season: string = sequence[0].substr(1);
        const episode: string = sequence[1];

        console.log(seperations);

        data = JSON.stringify({
          Title: js.Title,
          FileName: js.FileName,
          Actors: js.Actors,
          Director: js.Director,
          Genre: js.Genre,
          Plot: js.Plot,
          PosterArt: js.Poster,
          Rated: js.Rated,
          Released: js.Released,
          Runtime: js.Runtime,
          Year: js.Year,
          imdbId: js.imdbID,
          imdbRating: js.imdbRating,
          Series: series,
          Season: parseInt(season, 10),
          Episode: parseInt(episode, 10),
        });
      } else {
        data = JSON.stringify({
          Title: js.Title,
          FileName: js.FileName,
          Actors: js.Actors,
          Director: js.Director,
          Genre: js.Genre,
          Plot: js.Plot,
          PosterArt: js.Poster,
          Rated: js.Rated,
          Released: js.Released,
          Runtime: js.Runtime,
          Year: js.Year,
          imdbId: js.imdbID,
          imdbRating: js.imdbRating,
        });
      }

      fetch(baseURL, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: data,
      })
        .then(async (res) => {
          console.log('success', js.Title);
          titles.push(js.Title);
          resolve(`Completed database update for: ${js.Title}`);
        })
        .catch((err) => {
          console.log('error', err);
          reject(err);
        });
    });
  };

  return (
    <>
      <Button onClick={(event: MouseEvent) => getOmdbData(event)}>
        Get Data
      </Button>
      <ToastContainer position='top-center' />
    </>
  );
};

export default GetData;
