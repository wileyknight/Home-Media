interface IState {
  id: number;
  fileName?: string;
  genre?: string;
  actors?: string;
  rated?: string;
  year?: string;
  runtime?: string;
  plot?: string;
}

interface IProgress {
  id: number;
  mediaType: string;
  progress: number;
  profileID: number;
  activeID: number;
}

export interface MediaState {
  currentVideo: IState[];
  progress: IProgress;
  loading: boolean;
  currentID: number;
  playing: boolean;
  muted: boolean;
  duration: number;
  seeking: boolean;
  overlay: boolean;
  counter: number;
}

interface IData {
  loaded: boolean;
  matched: object[];
  alerts: object[];
}

type MoveListAction =
  | { type: 'update_loading' }
  | { type: 'load_video'; payload: IState[] | IData; current: number }
  | { type: 'create_progress'; payload: IProgress }
  | { type: 'update_progress'; payload: number }
  | { type: 'set_progress'; payload: number }
  | { type: 'update_id'; payload: number }
  | { type: 'update_playing'; payload: boolean }
  | { type: 'set_duration'; payload: number }
  | { type: 'update_counter'; payload: number }
  | { type: 'seeking_down' }
  | { type: 'seeking_up' }
  | { type: 'toggle_playing' }
  | { type: 'toggle_overlay'; payload: boolean }
  | { type: 'toggle_mute' };

export const mediaReducer = (state: MediaState, action: MoveListAction) => {
  switch (action.type) {
    case 'update_loading': {
      return { ...state, loading: !state.loading };
    }
    case 'load_video': {
      let payload: any = action.payload;
      if ('matched' in action.payload) {
        payload = action.payload.matched;
      }
      //console.log(payload, action.current);
      return { ...state, currentVideo: payload, currentID: action.current };
    }
    case 'create_progress': {
      //console.log(state.currentID, action.payload.activeID);
      return { ...state, progress: action.payload };
    }
    case 'update_progress': {
      return {
        ...state,
        progress: { ...state.progress, progress: action.payload },
      };
    }
    case 'set_progress': {
      return {
        ...state,
        progress: { ...state.progress, progress: action.payload },
      };
    }
    case 'update_id': {
      return { ...state, currentID: action.payload };
    }
    case 'update_counter': {
      return { ...state, counter: action.payload };
    }
    case 'update_playing': {
      return { ...state, playing: action.payload };
    }
    case 'toggle_playing': {
      return { ...state, playing: !state.playing };
    }
    case 'toggle_overlay': {
      return { ...state, overlay: action.payload };
    }
    case 'toggle_mute': {
      return { ...state, muted: !state.muted };
    }
    case 'set_duration': {
      return { ...state, duration: action.payload };
    }
    case 'seeking_down': {
      return { ...state, seeking: false };
    }
    case 'seeking_up': {
      return { ...state, seeking: false };
    }
    default: {
      return state;
    }
  }
};

export const getMedia = (
  title: string,
  mediatype: string,
  dispatch: Function,
  current: string
) => {
  const baseURL = `/api/${mediatype}/${title}`;
  console.log(baseURL);
  fetch(baseURL, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
    .then(async (res) => {
      const js = await res.json();
      let queryVid = '';
      let matchVideo: number = 0;
      if (current) {
        queryVid = current;
        matchVideo = js.matched.findIndex(
          (fitem: any) => fitem.title === queryVid
        );
      }
      console.log(js.matched, matchVideo);
      dispatch({ type: 'load_video', payload: js, current: matchVideo });
    })
    .catch((err) => {
      console.log('error', err);
    });
};

export const getProgress = (
  mediatype: string,
  id: number,
  loading: boolean,
  dispatch: Function
) => {
  const progressbaseURL = `/api/viewing/${mediatype}/${id}`;

  fetch(progressbaseURL, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
    .then(async (res) => {
      const js = await res.json();
      if (res.status === 404) {
        if (!loading) {
          dispatch({ type: 'update_loading' });
        }
      } else {
        dispatch({ type: 'create_progress', payload: js[0] });
      }
    })
    .catch((err) => {
      console.log('error', err);
    });
};

export const createProgress = (
  mediatype: string,
  currentVideo: IState[],
  currentID: number,
  loading: boolean,
  dispatch: Function
) => {
  const progressbaseURL = `/api/viewing/`;

  const data = JSON.stringify({
    MediaType: mediatype,
    MediaID: currentVideo[currentID].id,
    Progress: 0.0,
    ProfileID: 0,
    ActiveID: currentID,
  });

  if (loading && currentVideo[currentID]) {
    fetch(progressbaseURL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: data,
    })
      .then(async (res) => {
        const js = await res.json();
        dispatch({ type: 'create_progress', payload: js });
        dispatch({ type: 'update_loading' });
      })
      .catch((err) => {
        console.log('error', err);
      });
  }
};

export const updateProgress = (
  mediatype: string,
  currentVideo: IState[],
  currentID: number,
  progress: IProgress
) => {
  const baseURL = `/api/viewing/${progress.id}`;

  const data = JSON.stringify({
    ID: progress.id,
    MediaType: mediatype,
    MediaID: currentVideo[currentID].id,
    Progress: progress.progress,
    ProfileID: 0,
    ActiveID: currentID,
  });

  fetch(baseURL, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: data,
  })
    .then(async (res) => {
      const js = await res.json();
    })
    .catch((err) => {
      console.log('error', err);
    });
};
