import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/core/styles';
import * as serviceWorker from './serviceWorker';
import Routes from './UI/Routes';

declare module '@material-ui/core/styles/createMuiTheme' {
  interface Theme {
    constants: {
      drawerWidth: number;
    };
  }
  // allow configuration using `createMuiTheme`
  interface ThemeOptions {
    constants?: {
      drawerWidth?: number;
    };
  }
}

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#191919',
    },
    secondary: {
      main: '#f0c700',
    },
  },
  constants: {
    drawerWidth: 65,
  },
});

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <Routes />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
