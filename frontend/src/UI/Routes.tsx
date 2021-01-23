import * as React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import App from '../App';
import Media from '../Media/Media';
import NotFoundPage from './NotFoundPage';

const Routes: React.FC<{}> = (props) => {
  return (
    <BrowserRouter>
      <div className='MainWrapper'>
        <TransitionGroup>
          <CSSTransition timeout={500} classNames='animate'>
            <Switch>
              <Route exact path='/:mediatype?' component={App} />
              <Route
                exact
                path='/media/:mediatype/:title/:current?'
                component={Media}
              />
              <Route component={NotFoundPage} />
            </Switch>
          </CSSTransition>
        </TransitionGroup>
      </div>
    </BrowserRouter>
  );
};

export default Routes;
