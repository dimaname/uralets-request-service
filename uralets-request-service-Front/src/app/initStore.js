import {applyMiddleware, compose, createStore} from 'redux';
import {initialState, reducers} from './combineReducers';
import {api} from './combineApi';
import thunk from 'redux-thunk';

const composeEnhancers = (window).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const initStore = () => createStore(
  reducers,
  initialState,
  composeEnhancers(
    applyMiddleware(thunk.withExtraArgument(api)),
  )
);
