export interface IData {
  loaded: boolean;
  matched: object[];
  alerts: object[];
}

export interface IMovie {
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

interface MediaState {
  moviesData: IData;
  seriesData: IData;
  liveData: IData;
  filipinoData: IData;
  searchMedia: object[];
  data: IData;
  count: object[];
  value: number;
  open: boolean;
  path: string;
  editing: boolean;
  sort: string;
  direction: boolean;
    size: number | number[];
    view: boolean;
}

export const initialMovieListState: MediaState = {
  moviesData: { loaded: false, matched: [], alerts: [] },
  seriesData: { loaded: false, matched: [], alerts: [] },
  liveData: { loaded: false, matched: [], alerts: [] },
  filipinoData: { loaded: false, matched: [], alerts: [] },
  searchMedia: [],
  data: { loaded: false, matched: [], alerts: [] },
  count: [],
  value: 0,
  open: false,
  path: '',
  editing: false,
  sort: 'alpha',
  direction: true,
    size: 3,
  view: true,
};

type MoveListAction =
  | { type: 'update_movies'; payload: IData }
  | { type: 'update_series'; payload: IData }
  | { type: 'update_live'; payload: IData }
  | { type: 'update_filipino'; payload: IData }
  | { type: 'update_search'; payload: object[] }
  | { type: 'update_data'; payload: IData }
  | { type: 'set_value'; payload: number }
  | { type: 'set_open'; payload: boolean }
  | { type: 'update_path'; payload: string }
  | { type: 'update_size'; payload: number | number[] }
  | { type: 'set_sort'; payload: string; area: string }
  | { type: 'set_sortDirection' }
    | { type: 'update_editing' }
    | { type: 'update_view' };

export const mediaReducer = (state: MediaState, action: MoveListAction) => {
  switch (action.type) {
    case 'update_movies': {
      return {
        ...state,
        moviesData: action.payload,
        searchMedia: action.payload.matched,
        count: action.payload.alerts,
      };
    }
    case 'update_series': {
      return {
        ...state,
        seriesData: action.payload,
        searchMedia: action.payload.matched,
        count: action.payload.alerts,
      };
    }
    case 'update_live': {
      return {
        ...state,
        liveData: action.payload,
        searchMedia: action.payload.matched,
        count: action.payload.alerts,
      };
    }
    case 'update_filipino': {
      return {
        ...state,
        filipinoData: action.payload,
        searchMedia: action.payload.matched,
        count: action.payload.alerts,
      };
    }
    case 'update_search': {
      return { ...state, searchMedia: action.payload };
    }
    case 'update_data': {
      return { ...state, data: action.payload, count: action.payload.alerts };
    }
    case 'set_value': {
      return { ...state, value: action.payload };
    }
    case 'set_open': {
      return { ...state, open: action.payload };
    }
    case 'set_sort': {
      const dataset = eval(`state.${action.area}`);
      console.log(dataset);
      return { ...state, sort: action.payload, searchMedia: dataset.matched };
    }
    case 'update_path': {
      return { ...state, path: action.payload };
    }
    case 'update_size': {
      return { ...state, size: action.payload };
    }
    case 'set_sortDirection': {
      return { ...state, direction: !state.direction };
    }
    case 'update_editing': {
      return { ...state, editing: !state.editing };
      }
      case 'update_view': {
          return { ...state, view: !state.view };
      }
    default: {
      return state;
    }
  }
};
