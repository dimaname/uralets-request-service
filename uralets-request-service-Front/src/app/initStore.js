import {applyMiddleware, compose, createStore} from 'redux';
import {reducers} from './combineReducers';
import {api} from './combineApi';
import thunk from 'redux-thunk';
import LogRocket from 'logrocket';
const composeEnhancers = (window).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const initStore = () => createStore(
  reducers,
  {},
  composeEnhancers(
    applyMiddleware(thunk.withExtraArgument(api)),
    applyMiddleware(LogRocket.reduxMiddleware())
  )
);
